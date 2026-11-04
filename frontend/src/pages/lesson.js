// ================================================
// LESSON PAGE LOGIC
// ================================================
let allLessons = [];
let _lessonHeaders = null;
let lessonCurrentPage = 1;

export async function initLessonPage() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    _lessonHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // 1. Load danh sách lớp học vào select "Chọn lớp học" và modal Tạo mới
    try {
        const resClass = await fetch('/api/classes', { headers: _lessonHeaders });
        if (resClass.ok) {
            const data = await resClass.json();
            const classes = Array.isArray(data) ? data : (data.result ? data.result : []);

            const filterClassEl = document.getElementById('lesson-filter-class');
            const newClassEl = document.getElementById('newLessonClassId');
            const editClassEl = document.getElementById('editLessonClassId');

            [filterClassEl, newClassEl, editClassEl].forEach(sel => {
                if (!sel) return;
                const defaultOpt = sel.querySelector('option[value=""]');
                sel.innerHTML = '';
                if (defaultOpt) sel.appendChild(defaultOpt.cloneNode(true));
                classes.forEach(cls => {
                    const opt = document.createElement('option');
                    opt.value = cls.id;
                    opt.textContent = cls.name;
                    sel.appendChild(opt);
                });
            });
        }
    } catch (err) {
        console.error("Lỗi load classes cho lesson page:", err);
    }

    // 2. Load danh sách giáo viên vào modal
    try {
        const resTeacher = await fetch('/api/teachers', { headers: _lessonHeaders });
        if (resTeacher.ok) {
            const data = await resTeacher.json();
            const teachers = Array.isArray(data) ? data : (data.result ? data.result : []);

            [document.getElementById('newLessonTeacherId'), document.getElementById('editLessonTeacherId')].forEach(sel => {
                if (!sel) return;
                sel.innerHTML = '<option value="" disabled selected>Chọn giáo viên</option>';
                teachers.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t.id;
                    opt.textContent = t.name || t.fullName || `GV-${t.id}`;
                    sel.appendChild(opt);
                });
            });
        }
    } catch (err) {
        console.error("Lỗi load teachers cho lesson page:", err);
    }

    // 3. Mở modal Tạo mới
    const btnOpenCreate = document.querySelector('.btn-create-lesson');
    if (btnOpenCreate) {
        btnOpenCreate.addEventListener('click', () => {
            if (window.bootstrap) {
                const modalEl = document.getElementById('createLessonModal');
                const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modal.show();
            }
        });
    }

    // 4. Submit tạo mới buổi học
    const btnSubmitCreate = document.getElementById('btnSubmitCreateLesson');
    if (btnSubmitCreate) {
        const freshBtn = btnSubmitCreate.cloneNode(true);
        btnSubmitCreate.parentNode.replaceChild(freshBtn, btnSubmitCreate);
        freshBtn.addEventListener('click', async () => {
            const classId = document.getElementById('newLessonClassId').value;
            const teacherId = document.getElementById('newLessonTeacherId').value;
            const lessonDate = document.getElementById('newLessonDate').value;
            const lessonNumber = document.getElementById('newLessonNumber').value;
            const content = document.getElementById('newLessonContent').value.trim();
            const generalComment = document.getElementById('newLessonGeneralComment').value.trim();

            if (!classId || !teacherId || !lessonDate) {
                alert("Vui lòng chọn lớp học, giáo viên và ngày học!");
                return;
            }

            const payload = {
                classId: parseInt(classId),
                teacherId: parseInt(teacherId),
                lessonDate,
                lessonNumber: lessonNumber ? parseInt(lessonNumber) : null,
                content,
                generalComment,
                vocabulary: collectLessonListItems('new-vocabulary-list', 'word', 'translation'),
                homework: collectLessonListItems('new-homework-list', 'page', 'description'),
                grammar: collectLessonListItems('new-grammar-list', 'topic', 'description')
            };

            try {
                freshBtn.textContent = 'Đang xử lý...';
                freshBtn.disabled = true;
                const res = await fetch('/api/lessons', {
                    method: 'POST',
                    headers: _lessonHeaders,
                    body: JSON.stringify(payload)
                });
                if (res.ok || res.status === 201) {
                    alert("Tạo buổi học mới thành công!");
                    const modalEl = document.getElementById('createLessonModal');
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                    document.getElementById('createLessonForm').reset();
                    await fetchAndRenderLessons();
                } else {
                    alert("Có lỗi xảy ra, không thể tạo buổi học!");
                }
            } catch (err) {
                console.error("Lỗi tạo buổi học:", err);
                alert("Lỗi kết nối tới Server!");
            } finally {
                freshBtn.textContent = 'Tạo mới';
                freshBtn.disabled = false;
            }
        });
    }

    // 5. Gắn events bộ lọc
    if (!document.getElementById('lesson-filter-search')?._lessonFilterBound) {
        const filterIds = ['lesson-filter-class', 'lesson-filter-search', 'lesson-filter-sort', 'lesson-filter-page-size'];
        filterIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el._lessonFilterBound = true;
                el.addEventListener('input', () => { lessonCurrentPage = 1; applyLessonFilters(); });
                el.addEventListener('change', () => { lessonCurrentPage = 1; applyLessonFilters(); });
            }
        });

        const btnReset = document.getElementById('lesson-btn-reset-filter');
        if (btnReset) {
            btnReset._lessonFilterBound = true;
            btnReset.addEventListener('click', () => {
                document.getElementById('lesson-filter-class').value = '';
                document.getElementById('lesson-filter-search').value = '';
                document.getElementById('lesson-filter-sort').value = 'newest';
                document.getElementById('lesson-filter-page-size').value = '12';
                lessonCurrentPage = 1;
                applyLessonFilters();
            });
        }
    }

    // 6. Fetch và render buổi học
    await fetchAndRenderLessons();
}

async function fetchAndRenderLessons() {
    const container = document.getElementById('lesson-list-container');
    if (!container) return;
    container.innerHTML = `<div class="col-12 text-center py-4 text-muted">Đang tải dữ liệu...</div>`;

    try {
        // Check role and use appropriate API endpoint
        const role = (localStorage.getItem('userRole') || '').toUpperCase();
        const apiUrl = role === 'STUDENT'
            ? '/api/student/my-lessons'
            : (role === '4' || role === 'PARENT')
                ? '/api/parent/my-lessons'
                : '/api/lessons';
        
        const res = await fetch(apiUrl, { headers: _lessonHeaders });
        if (!res.ok) throw new Error('Không thể lấy danh sách buổi học');
        const data = await res.json();
        allLessons = Array.isArray(data) ? data : (data.result ? data.result : []);
        lessonCurrentPage = 1;
        applyLessonFilters();
    } catch (err) {
        console.error("Lỗi fetch lessons:", err);
        container.innerHTML = `<div class="col-12 text-center py-4 text-danger">Không thể tải danh sách buổi học.</div>`;
    }
}

function applyLessonFilters() {
    const classId = document.getElementById('lesson-filter-class')?.value || '';
    const search = (document.getElementById('lesson-filter-search')?.value || '').toLowerCase().trim();
    const sort = document.getElementById('lesson-filter-sort')?.value || 'newest';
    const pageSize = parseInt(document.getElementById('lesson-filter-page-size')?.value || '12');

    // 1. Lọc
    let filtered = allLessons.filter(ls => {
        const matchClass = !classId || String(ls.classId) === String(classId);
        const matchSearch = !search ||
            (ls.className || '').toLowerCase().includes(search) ||
            (ls.teacherName || '').toLowerCase().includes(search) ||
            String(ls.lessonNumber || '').includes(search);
        return matchClass && matchSearch;
    });

    // 2. Sắp xếp
    filtered.sort((a, b) => {
        if (sort === 'newest') return new Date(b.lessonDate) - new Date(a.lessonDate);
        if (sort === 'oldest') return new Date(a.lessonDate) - new Date(b.lessonDate);
        const nameA = (a.className || '').toLowerCase();
        const nameB = (b.className || '').toLowerCase();
        return sort === 'az' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    // 3. Phân trang
    const totalItems = filtered.length;
    const totalPages = pageSize >= 9999 ? 1 : Math.ceil(totalItems / pageSize);
    if (lessonCurrentPage > totalPages) lessonCurrentPage = Math.max(1, totalPages);
    const startIndex = (lessonCurrentPage - 1) * pageSize;
    const pageItems = pageSize >= 9999 ? filtered : filtered.slice(startIndex, startIndex + pageSize);

    // 4. Cập nhật text đếm
    const countText = document.getElementById('lesson-count-text');
    if (countText) countText.textContent = `Hiển thị ${pageItems.length} / ${totalItems} buổi học`;

    // 5. Render cards
    const container = document.getElementById('lesson-list-container');
    if (!container) return;

    if (pageItems.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-4 text-muted">Không tìm thấy buổi học nào phù hợp.</div>`;
    } else {
        container.innerHTML = pageItems.map(ls => {
            const dateStr = ls.lessonDate
                ? new Date(ls.lessonDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : 'N/A';
            return `
            <div class="col-xl-4 col-md-6 mb-4">
                <div class="card lesson-card-modern edu-entity-card lesson-entity-card h-100 d-flex flex-column">
                    <div class="lesson-card-header">
                        <div class="lesson-icon-modern">
                            <i class="fa-solid fa-layer-group"></i>
                        </div>
                        <div class="lesson-header-text">
                            <h5 class="fw-bold mb-1 class-card-title text-truncate" title="${ls.className || 'Không tên'}">${ls.className || 'Không tên'}</h5>
                            <span class="badge lesson-badge-modern">Buổi ${ls.lessonNumber ?? '—'}</span>
                        </div>
                    </div>
                    <div class="lesson-card-body flex-grow-1">
                        <div class="lesson-info-row">
                            <div class="icon-bg-light icon-blue">
                                <i class="fa-regular fa-calendar"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Ngày học</span>
                                <span class="info-value fw-semibold text-dark">${dateStr}</span>
                            </div>
                        </div>
                        <div class="lesson-info-row mt-3">
                            <div class="icon-bg-light icon-orange">
                                <i class="fa-solid fa-chalkboard-user"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Giáo viên</span>
                                <span class="info-value fw-semibold text-dark text-truncate" title="${ls.teacherName || 'N/A'}">${ls.teacherName || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="lesson-card-footer d-flex justify-content-between gap-2">
                        <button class="btn flex-grow-1 btn-edit-modern btn-edit-lesson" data-id="${ls.id}">
                            <i class="fa-regular fa-pen-to-square me-1"></i> Sửa
                        </button>
                        <button class="btn flex-grow-1 btn-delete-modern btn-delete-lesson" data-id="${ls.id}" data-name="${ls.className} - Buổi ${ls.lessonNumber ?? ''}">
                            <i class="fa-regular fa-trash-can me-1"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

        // Gắn sự kiện nút Xóa
        container.querySelectorAll('.btn-delete-lesson').forEach(btn => {
            btn.addEventListener('click', () => {
                const lessonId = btn.getAttribute('data-id');
                const lessonName = btn.getAttribute('data-name');
                const msgEl = document.getElementById('deleteLessonMessage');
                if (msgEl) {
                    msgEl.innerHTML = `Bạn có chắc chắn muốn xóa <strong>"${lessonName}"</strong>?<br>Hành động này không thể hoàn tác.`;
                }
                const deleteModalEl = document.getElementById('deleteLessonModal');
                const deleteModal = bootstrap.Modal.getInstance(deleteModalEl) || new bootstrap.Modal(deleteModalEl);
                deleteModal.show();

                const btnConfirm = document.getElementById('btnConfirmDeleteLesson');
                const newBtnConfirm = btnConfirm.cloneNode(true);
                btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);

                newBtnConfirm.addEventListener('click', async () => {
                    try {
                        newBtnConfirm.textContent = 'Đang xóa...';
                        newBtnConfirm.disabled = true;
                        const delRes = await fetch(`/api/lessons/${lessonId}`, { method: 'DELETE', headers: _lessonHeaders });
                        if (delRes.ok || delRes.status === 204) {
                            deleteModal.hide();
                            await fetchAndRenderLessons();
                        } else {
                            alert("Không thể xóa buổi học. Vui lòng thử lại!");
                        }
                    } catch (err) {
                        console.error("Lỗi xóa buổi học:", err);
                        alert("Lỗi kết nối tới Server!");
                    } finally {
                        newBtnConfirm.textContent = 'Xóa';
                        newBtnConfirm.disabled = false;
                    }
                });
            });
        });

        // Gắn sự kiện nút Sửa
        container.querySelectorAll('.btn-edit-lesson').forEach(btn => {
            btn.addEventListener('click', () => {
                const ls = allLessons.find(l => String(l.id) === btn.getAttribute('data-id'));
                if (ls) openEditLessonModal(ls);
            });
        });
        container.querySelectorAll('.lesson-card-modern').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (e.target.closest('.lesson-card-footer')) return; // Nếu bấm vào nút thì không làm gì cả
                const lessonId = card.querySelector('.btn-edit-lesson').getAttribute('data-id');
                viewLessonDetail(lessonId);
            })
        })
    }

    // 6. Render pagination
    renderLessonPagination(totalPages);
}
async function viewLessonDetail(lessonId) {
    const lesson = allLessons.find(l => String(l.id) === lessonId);
    if (!lesson) {
        alert("Không tìm thấy thông tin buổi học!");
        return;
    }
    // Store lesson data and load lesson-detail page in dashboard
    sessionStorage.setItem('lessonDetailData', JSON.stringify(lesson));
    window.loadDashboardContent('lesson-detail', window.initLessonDetailPage);
}

async function renderLessonDetailView(lesson) {
    const contentArea = document.querySelector('.dashboard-wrap .main-content');
    if (!contentArea) return;

    const token = localStorage.getItem('accessToken');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const dateStr = lesson.lessonDate
        ? new Date(lesson.lessonDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : 'N/A';

    contentArea.innerHTML = `
    <div class="content" id="lesson-detail-page">
        <!-- Toolbar -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <button class="btn px-3 py-2 fw-medium" id="btn-back-to-lessons"
                style="border:1.5px solid var(--primary-color);color:var(--primary-color);border-radius:10px;background:#fff;font-size:14px;">
                <i class="fa-solid fa-arrow-left me-2"></i>Quay lại
            </button>
            <div class="d-flex gap-2 flex-wrap">
                <button class="btn px-3 py-2 fw-medium" id="btn-export-lesson-csv"
                    style="border:1.5px solid #16a34a;color:#16a34a;border-radius:10px;background:#fff;font-size:14px;">
                    <i class="fa-solid fa-file-excel me-2"></i>Xuất Excel
                </button>
                <button class="btn px-3 py-2 fw-medium btn-edit-lesson-detail" data-id="${lesson.id}"
                    style="border:1.5px solid #f59e0b;color:#f59e0b;border-radius:10px;background:#fff;font-size:14px;">
                    <i class="fa-regular fa-pen-to-square me-2"></i>Sửa
                </button>
                <button class="btn px-3 py-2 fw-medium btn-delete-lesson-detail" data-id="${lesson.id}"
                    style="border:1.5px solid #e53e3e;color:#e53e3e;border-radius:10px;background:#fff;font-size:14px;">
                    <i class="fa-regular fa-trash-can me-2"></i>Xóa
                </button>
            </div>
        </div>

        <!-- Lesson Info Card -->
        <div class="card stat-card-box p-4 mb-4" style="border-radius:16px;">
            <div class="d-flex align-items-center gap-4">
                <div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i class="fa-solid fa-book-open text-white fs-4"></i>
                </div>
                <div>
                    <h3 class="fw-bold mb-1" style="color:#1e293b;font-size:22px;">
                        ${lesson.className || 'Không tên'} – Số buổi ${lesson.lessonNumber ?? '—'}
                    </h3>
                    <div class="d-flex flex-wrap gap-4 mt-2">
                        <div>
                            <span class="text-muted" style="font-size:12px;font-weight:600;letter-spacing:0.4px;display:block;">
                                <i class="fa-regular fa-calendar me-1"></i>Ngày học
                            </span>
                            <span class="fw-semibold" style="color:#1e293b;font-size:15px;">${dateStr}</span>
                        </div>
                        <div>
                            <span class="text-muted" style="font-size:12px;font-weight:600;letter-spacing:0.4px;display:block;">
                                <i class="fa-solid fa-chalkboard-user me-1"></i>Giáo viên
                            </span>
                            <span class="fw-semibold" style="color:#1e293b;font-size:15px;">${lesson.teacherName || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Nội dung buổi học -->
        <div class="card stat-card-box p-4 mb-4" style="border-radius:16px;">
            <h5 class="fw-bold mb-2" style="color:#1e293b;">Nội dung buổi học</h5>
            <p class="mb-0" style="color:#475569;font-size:15px;white-space:pre-wrap;">${lesson.content || '<span class="text-muted fst-italic">Không có nội dung</span>'}</p>
        </div>

        <!-- Nhận xét chung -->
        <div class="card stat-card-box p-4 mb-4" style="border-radius:16px;">
            <h5 class="fw-bold mb-2" style="color:#1e293b;">Nhận xét chung</h5>
            <p class="mb-0" style="color:#475569;font-size:15px;white-space:pre-wrap;">${lesson.generalComment || '<span class="text-muted fst-italic">Không có nhận xét</span>'}</p>
        </div>

        <!-- Bảng nhận xét học sinh -->
        <div class="mb-2">
            <h5 class="fw-bold mb-1" style="color:#1e293b;">Nhận xét học sinh</h5>
            <p class="text-muted mb-3" style="font-size:14px;">Danh sách điểm danh và nhận xét từng học sinh</p>
        </div>
        <div class="card stat-card-box p-0 mb-4" style="border-radius:16px;overflow:hidden;">
            <div style="overflow-x:auto;">
                <table class="table table-hover mb-0" id="lesson-review-table">
                    <thead style="background:#f5f3ff;">
                        <tr>
                            <th class="px-4 py-3 fw-semibold text-muted" style="font-size:13px;width:50px;">#</th>
                            <th class="px-3 py-3 fw-semibold text-muted" style="font-size:13px;">
                                Tên học sinh<br>
                                <span style="font-size:11px;font-weight:400;color:#a78bfa;">(Xem nhận xét buổi trước)</span>
                            </th>
                            <th class="px-3 py-3 fw-semibold text-muted text-center" style="font-size:13px;">Điểm danh</th>
                            <th class="px-3 py-3 fw-semibold text-muted text-center" style="font-size:13px;">Vocab</th>
                            <th class="px-3 py-3 fw-semibold text-muted text-center" style="font-size:13px;">Điểm thi</th>
                            <th class="px-3 py-3 fw-semibold text-muted text-center" style="font-size:13px;">BTVN</th>
                            <th class="px-3 py-3 fw-semibold text-muted" style="font-size:13px;">Nhận xét</th>
                            <th class="px-3 py-3 fw-semibold text-muted text-center" style="font-size:13px;">Lưu</th>
                        </tr>
                    </thead>
                    <tbody id="lesson-review-tbody">
                        <tr><td colspan="8" class="text-center py-4 text-muted">Đang tải dữ liệu...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;

    // Nút Quay lại
    document.getElementById('btn-back-to-lessons')?.addEventListener('click', () => {
        window.loadDashboardContent('lesson', initLessonPage);
    });

    // Nút Sửa
    document.querySelector('.btn-edit-lesson-detail')?.addEventListener('click', () => {
        window.loadDashboardContent('lesson', () => {
            setTimeout(() => openEditLessonModal(lesson), 300);
        });
    });

    // Nút Xóa
    document.querySelector('.btn-delete-lesson-detail')?.addEventListener('click', async () => {
        if (!confirm(`Bạn có chắc chắn muốn xóa "${lesson.className} - Buổi ${lesson.lessonNumber ?? ''}"?`)) return;
        try {
            const res = await fetch(`/api/lessons/${lesson.id}`, { method: 'DELETE', headers });
            if (res.ok || res.status === 204) {
                window.loadDashboardContent('lesson', initLessonPage);
            } else {
                alert('Không thể xóa buổi học. Vui lòng thử lại!');
            }
        } catch (err) {
            console.error('Lỗi xóa buổi học:', err);
            alert('Lỗi kết nối tới Server!');
        }
    });

    // Fetch học sinh và nhận xét
    let students = [];
    let existingComments = {};
    try {
        const [resStudents, resComments] = await Promise.all([
            fetch(`/api/students/class/${lesson.classId}`, { headers }),
            fetch(`/api/Comments/lesson/${lesson.id}`, { headers })
        ]);
        if (resStudents.ok) {
            const data = await resStudents.json();
            students = Array.isArray(data) ? data : (data.result || data.data || []);
        }
        if (resComments.ok) {
            const cmts = await resComments.json();
            const arr = Array.isArray(cmts) ? cmts : (cmts.result || cmts.data || []);
            arr.forEach(c => { existingComments[c.studentId] = c; });
        }
    } catch (err) {
        console.error('Lỗi tải dữ liệu chi tiết lesson:', err);
    }

    const tbody = document.getElementById('lesson-review-tbody');
    if (!tbody) return;

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">Không có học sinh trong lớp này.</td></tr>';
    } else {
        tbody.innerHTML = students.map((st, idx) => {
            const cmt = existingComments[st.id] || {};
            const cmtId = cmt.id || '';
            const attVal = ['C','V','M'].includes(cmt.schoolExamScore) ? cmt.schoolExamScore : 'C';
            const classScore = (cmt.schoolExamScore && !['C','V','M'].includes(cmt.schoolExamScore)) ? cmt.schoolExamScore : '';
            const colors = { C: '#16a34a', V: '#e53e3e', M: '#f59e0b' };
            const icons = { C: 'fa-solid fa-check', V: 'fa-solid fa-xmark', M: 'fa-regular fa-clock' };
            const attLabels = {
                C: '<span style="color:#16a34a;font-size:11px;font-weight:600;">Có mặt</span>',
                V: '<span style="color:#e53e3e;font-size:11px;font-weight:600;">Vắng</span>',
                M: '<span style="color:#f59e0b;font-size:11px;font-weight:600;">Muộn</span>'
            };
            const makeBtn = val => `<button type="button" class="btn-att-detail" data-val="${val}" title="${val==='C'?'Có mặt':val==='V'?'Vắng':'Muộn'}"
                style="width:30px;height:30px;border-radius:50%;border:1.5px solid ${colors[val]};
                background:${attVal===val?colors[val]:'#fff'};color:${attVal===val?'#fff':colors[val]};
                cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
                <i class="${icons[val]}" style="font-size:11px;pointer-events:none;"></i>
            </button>`;

            return `
            <tr data-student-id="${st.id}" data-comment-id="${cmtId}" data-att-val="${attVal}">
                <td class="px-4 py-3 text-muted fw-medium">${idx + 1}</td>
                <td class="px-3 py-3 fw-semibold" style="color:#1e293b;">${st.fullName || st.name || 'N/A'}</td>
                <td class="px-3 py-3 text-center">
                    <div class="d-flex flex-column align-items-center gap-1">
                        <div class="d-flex gap-1">${makeBtn('C')}${makeBtn('V')}${makeBtn('M')}</div>
                        <span class="att-label-text">${attLabels[attVal]}</span>
                    </div>
                </td>
                <td class="px-3 py-3 text-center">
                    <input type="text" class="form-control form-control-sm text-center rv-vocab"
                        value="${cmt.vocabularyScore || ''}" placeholder="/10"
                        style="width:65px;margin:auto;border-radius:8px;border-color:rgba(99,102,241,0.3);">
                </td>
                <td class="px-3 py-3 text-center">
                    <input type="text" class="form-control form-control-sm text-center rv-school"
                        value="${classScore}" placeholder="..."
                        style="width:65px;margin:auto;border-radius:8px;border-color:rgba(99,102,241,0.3);">
                </td>
                <td class="px-3 py-3 text-center">
                    <select class="form-select form-select-sm rv-btvn"
                        style="width:110px;margin:auto;border-radius:8px;border-color:rgba(99,102,241,0.3);font-size:13px;">
                        <option value="">--</option>
                        <option value="Đủ BT" ${['Đủ BT','Đủ'].includes(cmt.homeworkStatus)?'selected':''}>Đủ BT</option>
                        <option value="Thiếu BT" ${['Thiếu BT','Thiếu'].includes(cmt.homeworkStatus)?'selected':''}>Thiếu BT</option>
                        <option value="Không BT" ${['Không BT','Không'].includes(cmt.homeworkStatus)?'selected':''}>Không BT</option>
                    </select>
                </td>
                <td class="px-3 py-3">
                    <textarea class="form-control form-control-sm rv-comment" rows="2"
                        placeholder="Nhập nhận xét..."
                        style="border-radius:8px;border-color:rgba(99,102,241,0.3);min-width:160px;font-size:13px;resize:vertical;">${cmt.comment || ''}</textarea>
                </td>
                <td class="px-3 py-3 text-center">
                    <button class="btn btn-sm fw-semibold btn-save-lesson-review"
                        style="background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border:none;border-radius:8px;padding:6px 14px;white-space:nowrap;font-size:13px;">
                        ${cmtId ? '<i class="fa-solid fa-pen me-1"></i>Cập nhật' : '<i class="fa-solid fa-floppy-disk me-1"></i>Lưu'}
                    </button>
                </td>
            </tr>`;
        }).join('');

        // Sự kiện toggle điểm danh
        const attColors = { C: '#16a34a', V: '#e53e3e', M: '#f59e0b' };
        const attLabelHTML = {
            C: '<span style="color:#16a34a;font-size:11px;font-weight:600;">Có mặt</span>',
            V: '<span style="color:#e53e3e;font-size:11px;font-weight:600;">Vắng</span>',
            M: '<span style="color:#f59e0b;font-size:11px;font-weight:600;">Muộn</span>'
        };
        tbody.querySelectorAll('tr[data-student-id]').forEach(row => {
            row.querySelectorAll('.btn-att-detail').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.getAttribute('data-val');
                    row.dataset.attVal = val;
                    row.querySelectorAll('.btn-att-detail').forEach(b => {
                        const c = attColors[b.getAttribute('data-val')];
                        b.style.background = '#fff';
                        b.style.color = c;
                    });
                    btn.style.background = attColors[val];
                    btn.style.color = '#fff';
                    row.querySelector('.att-label-text').innerHTML = attLabelHTML[val];
                });
            });
        });

        // Sự kiện nút Lưu/Cập nhật
        tbody.querySelectorAll('.btn-save-lesson-review').forEach(btn => {
            btn.addEventListener('click', async () => {
                const row = btn.closest('tr');
                const studentId = row.dataset.studentId;
                const commentId = row.dataset.commentId;
                const attVal = row.dataset.attVal || 'C';
                const schoolVal = row.querySelector('.rv-school').value.trim();
                const finalSchoolExamScore = schoolVal ? schoolVal : attVal;

                const payload = {
                    lessonId: parseInt(lesson.id),
                    lessonDate: lesson.lessonDate || new Date().toISOString().split('T')[0],
                    className: lesson.className || '',
                    studentId: parseInt(studentId),
                    studentName: row.querySelector('td:nth-child(2)').textContent.trim(),
                    vocabularyScore: row.querySelector('.rv-vocab').value.trim(),
                    schoolExamScore: finalSchoolExamScore,
                    homeworkStatus: row.querySelector('.rv-btvn').value,
                    comment: row.querySelector('.rv-comment').value.trim()
                };

                const isUpdate = !!commentId;
                const url = isUpdate ? `/api/Comments/${commentId}` : `/api/Comments`;
                const method = isUpdate ? 'PUT' : 'POST';

                try {
                    btn.disabled = true;
                    btn.innerHTML = '...';
                    const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
                    if (res.ok || res.status === 201) {
                        const savedData = await res.json();
                        if (!isUpdate && savedData?.id) row.dataset.commentId = savedData.id;
                        btn.innerHTML = '<i class="fa-solid fa-check me-1"></i>Đã lưu';
                        btn.style.background = 'linear-gradient(135deg,#16a34a,#22c55e)';
                        setTimeout(() => {
                            btn.innerHTML = '<i class="fa-solid fa-pen me-1"></i>Cập nhật';
                            btn.style.background = 'linear-gradient(135deg,#6366f1,#818cf8)';
                            btn.disabled = false;
                        }, 2000);
                    } else {
                        alert('Lỗi lưu nhận xét! Vui lòng thử lại.');
                        btn.innerHTML = isUpdate ? '<i class="fa-solid fa-pen me-1"></i>Cập nhật' : '<i class="fa-solid fa-floppy-disk me-1"></i>Lưu';
                        btn.disabled = false;
                    }
                } catch (err) {
                    console.error('Lỗi lưu nhận xét:', err);
                    alert('Lỗi kết nối tới Server!');
                    btn.innerHTML = isUpdate ? '<i class="fa-solid fa-pen me-1"></i>Cập nhật' : '<i class="fa-solid fa-floppy-disk me-1"></i>Lưu';
                    btn.disabled = false;
                }
            });
        });
    }

    // Xuất CSV
    document.getElementById('btn-export-lesson-csv')?.addEventListener('click', () => {
        const rows = [['#', 'Học sinh', 'Điểm danh', 'Vocab', 'Điểm thi', 'BTVN', 'Nhận xét']];
        const attMap = { C: 'Có mặt', V: 'Vắng', M: 'Muộn' };
        tbody.querySelectorAll('tr[data-student-id]').forEach((tr, idx) => {
            rows.push([
                idx + 1,
                tr.querySelector('td:nth-child(2)')?.textContent?.trim() || '',
                attMap[tr.dataset.attVal] || 'Có mặt',
                tr.querySelector('.rv-vocab')?.value || '',
                tr.querySelector('.rv-school')?.value || '',
                tr.querySelector('.rv-btvn')?.value || '',
                tr.querySelector('.rv-comment')?.value || ''
            ]);
        });
        const csvContent = '\uFEFF' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NhanXet_${lesson.className}_Buoi${lesson.lessonNumber || ''}_${lesson.lessonDate || ''}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });
}
function renderLessonPagination(totalPages) {
    const paginationEl = document.getElementById('lesson-pagination-controls');
    if (!paginationEl) return;
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

    const btnStyle = (isActive) =>
        `style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid ${isActive ? 'var(--primary-color)' : '#E0E5F2'};background:${isActive ? 'var(--primary-color)' : 'white'};color:${isActive ? 'white' : '#4a5568'};font-weight:500;font-size:14px;cursor:pointer;transition:all 0.2s ease;"`;

    let html = `<button onclick="changeLessonPage(${lessonCurrentPage - 1})" ${lessonCurrentPage === 1 ? 'disabled' : ''}
        style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid #E0E5F2;background:white;color:#4a5568;font-weight:500;font-size:14px;cursor:pointer;">‹</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="changeLessonPage(${i})" ${btnStyle(i === lessonCurrentPage)}>${i}</button>`;
    }
    html += `<button onclick="changeLessonPage(${lessonCurrentPage + 1})" ${lessonCurrentPage === totalPages ? 'disabled' : ''}
        style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid #E0E5F2;background:white;color:#4a5568;font-weight:500;font-size:14px;cursor:pointer;">›</button>`;
    paginationEl.innerHTML = html;
}

function changeLessonPage(page) {
    const pageSize = parseInt(document.getElementById('lesson-filter-page-size')?.value || '12');
    const totalPages = Math.ceil(allLessons.length / pageSize);
    if (page < 1 || page > totalPages) return;
    lessonCurrentPage = page;
    applyLessonFilters();
}
window.changeLessonPage = changeLessonPage;

async function openEditLessonModal(ls) {
    // 1. Điền các trường cơ bản
    document.getElementById('editLessonId').value = ls.id;
    document.getElementById('editLessonDate').value = ls.lessonDate || '';
    document.getElementById('editLessonNumber').value = ls.lessonNumber ?? '';
    document.getElementById('editLessonContent').value = ls.content || '';
    document.getElementById('editLessonGeneralComment').value = ls.generalComment || '';

    // 2. Chọn sẵn lớp học
    const classSelect = document.getElementById('editLessonClassId');
    if (classSelect) {
        [...classSelect.options].forEach(opt => {
            opt.selected = String(opt.value) === String(ls.classId);
        });
    }

    // 3. Chọn sẵn giáo viên
    const teacherSelect = document.getElementById('editLessonTeacherId');
    if (teacherSelect) {
        [...teacherSelect.options].forEach(opt => {
            opt.selected = String(opt.value) === String(ls.teacherId);
        });
    }

    // 4. Render sẵn danh sách Từ vựng
    const vocabList = document.getElementById('edit-vocabulary-list');
    if (vocabList) {
        vocabList.innerHTML = '';
        const items = Array.isArray(ls.vocabulary) ? ls.vocabulary : [];
        if (items.length === 0) {
            vocabList.innerHTML = `<p class="text-muted text-center mb-0" style="font-size:13px;">Không có dữ liệu</p>`;
        } else {
            items.forEach(item => addLessonListItem('edit-vocabulary-list', 'word', 'translation', item.word, item.translation));
        }
    }

    // 5. Render sẵn danh sách Bài tập về nhà
    const hwList = document.getElementById('edit-homework-list');
    if (hwList) {
        hwList.innerHTML = '';
        const items = Array.isArray(ls.homework) ? ls.homework : [];
        if (items.length === 0) {
            hwList.innerHTML = `<p class="text-muted text-center mb-0" style="font-size:13px;">Không có dữ liệu</p>`;
        } else {
            items.forEach(item => addLessonListItem('edit-homework-list', 'page', 'description', item.page, item.description));
        }
    }

    // 6. Render sẵn danh sách Ngữ pháp
    const grList = document.getElementById('edit-grammar-list');
    if (grList) {
        grList.innerHTML = '';
        const items = Array.isArray(ls.grammar) ? ls.grammar : [];
        if (items.length === 0) {
            grList.innerHTML = `<p class="text-muted text-center mb-0" style="font-size:13px;">Không có dữ liệu</p>`;
        } else {
            items.forEach(item => addLessonListItem('edit-grammar-list', 'topic', 'description', item.topic, item.description));
        }
    }

    // 7. Mở modal
    const editModalEl = document.getElementById('editLessonModal');
    const editModal = bootstrap.Modal.getInstance(editModalEl) || new bootstrap.Modal(editModalEl);
    editModal.show();

    // 8. Nút Lưu thay đổi
    const btnSubmit = document.getElementById('btnSubmitEditLesson');
    const newBtn = btnSubmit.cloneNode(true);
    btnSubmit.parentNode.replaceChild(newBtn, btnSubmit);

    newBtn.addEventListener('click', async () => {
        const classId = document.getElementById('editLessonClassId').value;
        const teacherId = document.getElementById('editLessonTeacherId').value;
        const lessonDate = document.getElementById('editLessonDate').value;
        const lessonNumber = document.getElementById('editLessonNumber').value;
        const content = document.getElementById('editLessonContent').value.trim();
        const generalComment = document.getElementById('editLessonGeneralComment').value.trim();
        const lessonId = document.getElementById('editLessonId').value;

        if (!classId || !teacherId || !lessonDate) {
            alert("Vui lòng chọn lớp học, giáo viên và ngày học!");
            return;
        }

        const payload = {
            classId: parseInt(classId),
            teacherId: parseInt(teacherId),
            lessonDate,
            lessonNumber: lessonNumber ? parseInt(lessonNumber) : null,
            content,
            generalComment,
            vocabulary: collectLessonListItems('edit-vocabulary-list', 'word', 'translation'),
            homework: collectLessonListItems('edit-homework-list', 'page', 'description'),
            grammar: collectLessonListItems('edit-grammar-list', 'topic', 'description')
        };

        try {
            newBtn.textContent = 'Đang lưu...';
            newBtn.disabled = true;
            const res = await fetch(`/api/lessons/${lessonId}`, {
                method: 'PUT',
                headers: _lessonHeaders,
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                editModal.hide();
                await fetchAndRenderLessons();
            } else {
                alert("Có lỗi xảy ra, không thể cập nhật buổi học!");
            }
        } catch (err) {
            console.error("Lỗi sửa buổi học:", err);
            alert("Lỗi kết nối tới Server!");
        } finally {
            newBtn.textContent = 'Lưu thay đổi';
            newBtn.disabled = false;
        }
    });
}

/**
 * Thêm 1 hàng nhập liệu vào danh sách động (từ vựng / bài tập / ngữ pháp)
 * @param {string} containerId - ID của div chứa
 * @param {string} field1 - tên field cột 1 (word / description / rule)
 * @param {string} field2 - tên field cột 2 (meaning / deadline / example)
 * @param {string} val1 - giá trị mặc định cột 1
 * @param {string} val2 - giá trị mặc định cột 2
 */
function addLessonListItem(containerId, field1, field2, val1 = '', val2 = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Xóa dòng "Không có dữ liệu" nếu còn
    const empty = container.querySelector('p.text-muted');
    if (empty) empty.remove();

    const placeholder1 = { word: 'Từ vựng', page: 'Trang', topic: 'Chủ đề ngữ pháp' }[field1] || field1;
    const placeholder2 = { translation: 'Nghĩa', description: 'Mô tả', example: 'Ví dụ' }[field2] || field2;

    const row = document.createElement('div');
    row.className = 'd-flex gap-2 align-items-center';
    row.innerHTML = `
        <input type="text" class="form-control form-control-sm lesson-list-field1"
            data-field="${field1}" placeholder="${placeholder1}" value="${val1}"
            style="border-radius:6px; border-color:#E0E5F2; font-size:13px;">
        <input type="text" class="form-control form-control-sm lesson-list-field2"
            data-field="${field2}" placeholder="${placeholder2}" value="${val2}"
            style="border-radius:6px; border-color:#E0E5F2; font-size:13px;">
        <button type="button" class="btn btn-sm btn-delete-class px-2 py-1 flex-shrink-0"
            style="font-size:13px; border-radius:6px;" onclick="this.closest('.d-flex').remove()">✕</button>
    `;
    container.appendChild(row);
}
// Expose addLessonListItem to window so inline onclick handlers in HTML can call it
window.addLessonListItem = addLessonListItem;

/**
 * Thu thập dữ liệu từ các hàng trong danh sách động
 */
function collectLessonListItems(containerId, field1, field2) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    const rows = container.querySelectorAll('.d-flex.align-items-center');
    return [...rows].map(row => {
        const inputs = row.querySelectorAll('input');
        const obj = {};
        obj[field1] = inputs[0]?.value?.trim() || '';
        obj[field2] = inputs[1]?.value?.trim() || '';
        return obj;
    }).filter(item => item[field1]);
}

// ==========================================
// LOGIC MODULE NHẬN XÉT (REVIEW PAGE)
// ==========================================

let reviewAllStudents = [];