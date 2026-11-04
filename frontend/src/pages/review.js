// ================================================
// REVIEW PAGE LOGIC
// ================================================
let reviewAllStudents = [];
let reviewAllComments = [];
let reviewCurrentPage = 1;

export async function initReviewPage() {
    bindReviewFilters();
    await fetchAndRenderReviewClasses();

    const classSelect = document.getElementById('review-select-class');
    const lessonSelect = document.getElementById('review-select-lesson');

    if (classSelect) {
        classSelect.addEventListener('change', async (e) => {
            const classId = e.target.value;
            if (classId) {
                await fetchAndRenderReviewLessons(classId);
            }
        });
    }

    if (lessonSelect) {
        lessonSelect.addEventListener('change', async (e) => {
            const lessonId = e.target.value;
            const classId = document.getElementById('review-select-class')?.value;
            if (lessonId && classId) {
                // Populate Info Card
                const lsOpt = lessonSelect.options[lessonSelect.selectedIndex];
                document.getElementById('review-info-class-name').textContent = classSelect.options[classSelect.selectedIndex].text;
                document.getElementById('review-info-level').textContent = 'Học sinh'; // Placeholder level
                const [datePart, ...rest] = (lsOpt.text || '').split(' - ');
                document.getElementById('review-info-date').textContent = datePart || '-';
                document.getElementById('review-info-number').textContent = rest.join(' ') || '-';
                // Note: teacher is not directly on lesson list text, could fetch from lsOpt dataset if injected
                if (lsOpt.dataset.teacher) document.getElementById('review-info-teacher').textContent = lsOpt.dataset.teacher;

                document.getElementById('review-lesson-info-card').style.display = 'block';

                await fetchReviewRoster(classId, lessonId);
            }
        });
    }
}

async function fetchAndRenderReviewClasses() {
    try {
        // Check role and use appropriate API endpoint
        const role = (localStorage.getItem('userRole') || '').toUpperCase();
        const apiUrl = role === 'STUDENT'
            ? '/api/student/my-classes'
            : (role === '4' || role === 'PARENT')
                ? '/api/parent/my-classes'
                : '/api/classes';
        
        const res = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });
        if (!res.ok) return;
        const classes = await res.json();
        const select = document.getElementById('review-select-class');
        if (!select) return;
        select.innerHTML = '<option value="" disabled selected>-- Chọn lớp học --</option>';
        classes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error("Lỗi fetch classes review:", err);
    }
}

async function fetchAndRenderReviewLessons(classId) {
    try {
        // Check role and use appropriate API endpoint
        const role = (localStorage.getItem('userRole') || '').toUpperCase();
        const apiUrl = role === 'STUDENT'
            ? '/api/student/my-lessons'
            : (role === '4' || role === 'PARENT')
                ? '/api/parent/my-lessons'
                : '/api/lessons';
        
        const res = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });
        if (!res.ok) return;
        let lessons = await res.json();
        // Lọc theo classId
        lessons = lessons.filter(l => String(l.classId) === String(classId));
        // Sắp xếp giảm dần theo ngày
        lessons.sort((a, b) => new Date(b.lessonDate) - new Date(a.lessonDate));

        const select = document.getElementById('review-select-lesson');
        if (!select) return;
        select.innerHTML = '<option value="" disabled selected>-- Chọn buổi học --</option>';
        lessons.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.id;
            opt.dataset.teacher = l.teacherName || '';
            opt.dataset.lessonDate = l.lessonDate;
            const dateStr = l.lessonDate ? l.lessonDate.split('-').reverse().join('/') : 'N/A';
            opt.textContent = `${dateStr} - Số buổi ${l.lessonNumber || '?'}`;
            select.appendChild(opt);
        });

        // Disable table mapping until lesson is chosen
        document.getElementById('review-table-body').innerHTML = `<tr><td colspan="8" class="text-center py-5"><div class="d-flex flex-column align-items-center text-muted"><i class="fa-solid fa-inbox fs-2 mb-3 text-light"></i><p class="mb-0 fs-5">Vui lòng chọn buổi học để xem danh sách.</p></div></td></tr>`;
        document.getElementById('review-lesson-info-card').style.display = 'none';

    } catch (err) {
        console.error("Lỗi fetch lessons review:", err);
    }
}

async function fetchReviewRoster(classId, lessonId) {
    try {
        const tbody = document.getElementById('review-table-body');
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5 text-muted">Đang tải dữ liệu...</td></tr>`;

        const authHeaders = { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` };

        // 1. Get all students in this class
        const stuRes = await fetch(`/api/students/class/${classId}`, { headers: authHeaders });
        reviewAllStudents = stuRes.ok ? await stuRes.json() : [];

        // 2. Get all comments for this lesson
        const cmtRes = await fetch(`/api/Comments/lesson/${lessonId}`, { headers: authHeaders });
        reviewAllComments = cmtRes.ok ? await cmtRes.json() : [];

        // 3. Render joined table
        populateReviewFilterOptions();
        reviewCurrentPage = 1;
        renderReviewTable();

    } catch (err) {
        console.error("Lỗi tải lớp học/nhận xét:", err);
        document.getElementById('review-table-body').innerHTML = `<tr><td colspan="8" class="text-center py-5"><div class="d-flex flex-column align-items-center text-danger"><i class="fa-solid fa-circle-exclamation fs-2 mb-3 text-danger opacity-75"></i><p class="mb-0 fs-5">Có lỗi xảy ra khi tải dữ liệu!</p></div></td></tr>`;
    }
}

function renderReviewTable() {
    const tbody = document.getElementById('review-table-body');
    if (!tbody) return;

    if (reviewAllStudents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5"><div class="d-flex flex-column align-items-center text-muted"><i class="fa-solid fa-user-xmark fs-2 mb-3 text-light"></i><p class="mb-0 fs-5">Lớp học này chưa có học sinh nào.</p></div></td></tr>`;
        updateReviewCount(0, 0);
        return;
    }

    const filteredStudents = getFilteredReviewStudents();
    const pageSize = parseInt(document.getElementById('review-filter-page-size')?.value || '20', 10);
    const totalPages = pageSize >= 9999 ? 1 : Math.max(1, Math.ceil(filteredStudents.length / pageSize));
    reviewCurrentPage = Math.min(reviewCurrentPage, totalPages);
    const start = pageSize >= 9999 ? 0 : (reviewCurrentPage - 1) * pageSize;
    const pagedStudents = pageSize >= 9999 ? filteredStudents : filteredStudents.slice(start, start + pageSize);

    if (filteredStudents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5"><div class="review-empty-state"><i class="fa-solid fa-magnifying-glass"></i><p>Không tìm thấy học sinh phù hợp bộ lọc.</p></div></td></tr>`;
        updateReviewCount(0, reviewAllStudents.length);
        renderReviewPagination(0, pageSize);
        return;
    }

    let html = '';
    pagedStudents.forEach((st, idx) => {
        // Tìm xem học sinh này đã có nhận xét trong lesson này chưa
        const cmt = reviewAllComments.find(c => String(c.studentId) === String(st.id)) || {};
        const cmtId = cmt.id || ''; // Nếu có id thì là PUT, nếu rỗng là POST

        html += `
            <tr class="review-data-row ${cmtId ? 'has-review' : 'needs-review'}" data-student-id="${st.id}" data-comment-id="${cmtId}">
                <td class="text-center"><input class="form-check-input" type="checkbox"></td>
                <td><span class="review-index">${start + idx + 1}</span></td>
                <td>
                    <div class="review-student-cell">
                        <span>${(st.fullName || st.name || 'N/A').charAt(0).toUpperCase()}</span>
                        <div>
                            <strong>${st.fullName || st.name || 'N/A'}</strong>
                            <small>${cmtId ? 'Đã có nhận xét' : 'Chưa nhận xét'}</small>
                        </div>
                    </div>
                </td>
                <td class="text-center">
                    <input type="text" class="form-control form-control-sm rv-vocab review-score-input" value="${cmt.vocabularyScore || ''}" placeholder="/10">
                </td>
                <td class="text-center">
                    <input type="text" class="form-control form-control-sm rv-school review-score-input" value="${cmt.schoolExamScore && cmt.schoolExamScore !== 'C' && cmt.schoolExamScore !== 'V' ? cmt.schoolExamScore : ''}" placeholder="...">
                </td>
                <td class="text-center">
                    <select class="form-select form-select-sm rv-btvn review-status-select">
                        <option value="">--</option>
                        <option value="Đủ" ${cmt.homeworkStatus === 'Đủ' ? 'selected' : ''}>Đủ</option>
                        <option value="Thiếu" ${cmt.homeworkStatus === 'Thiếu' ? 'selected' : ''}>Thiếu</option>
                        <option value="Không" ${cmt.homeworkStatus === 'Không' ? 'selected' : ''}>Không</option>
                    </select>
                </td>
                <td>
                    <textarea class="form-control form-control-sm rv-comment review-comment-box" rows="1" placeholder="Nhập nhận xét...">${cmt.comment || ''}</textarea>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-save-rv review-save-btn" onclick="saveReviewRow(this)">
                        ${cmtId ? '<i class="fa-solid fa-pen me-1"></i>Cập nhật' : '<i class="fa-solid fa-floppy-disk me-1"></i>Lưu'}
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
    updateReviewCount(filteredStudents.length, reviewAllStudents.length);
    renderReviewPagination(filteredStudents.length, pageSize);
}

function bindReviewFilters() {
    const filterIds = [
        'review-filter-search',
        'review-filter-student',
        'review-filter-teacher',
        'review-filter-from-date',
        'review-filter-to-date',
        'review-filter-sort',
        'review-filter-page-size'
    ];

    filterIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el || el.dataset.reviewBound) return;
        const eventName = el.tagName === 'INPUT' && el.type === 'text' ? 'input' : 'change';
        el.addEventListener(eventName, () => {
            reviewCurrentPage = 1;
            renderReviewTable();
        });
        el.dataset.reviewBound = '1';
    });

    const resetBtn = document.getElementById('review-btn-reset-filter');
    if (resetBtn && !resetBtn.dataset.reviewBound) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('review-filter-search').value = '';
            document.getElementById('review-filter-student').value = '';
            document.getElementById('review-filter-teacher').value = '';
            document.getElementById('review-filter-from-date').value = '';
            document.getElementById('review-filter-to-date').value = '';
            document.getElementById('review-filter-sort').value = 'az';
            document.getElementById('review-filter-page-size').value = '20';
            reviewCurrentPage = 1;
            renderReviewTable();
        });
        resetBtn.dataset.reviewBound = '1';
    }
}

function populateReviewFilterOptions() {
    const studentSelect = document.getElementById('review-filter-student');
    if (studentSelect) {
        studentSelect.innerHTML = '<option value="">Tất cả học sinh</option>';
        [...reviewAllStudents]
            .sort((a, b) => getReviewStudentName(a).localeCompare(getReviewStudentName(b), 'vi'))
            .forEach(st => {
                const opt = document.createElement('option');
                opt.value = String(st.id);
                opt.textContent = getReviewStudentName(st);
                studentSelect.appendChild(opt);
            });
    }

    const teacherSelect = document.getElementById('review-filter-teacher');
    const selectedLesson = document.getElementById('review-select-lesson')?.selectedOptions?.[0];
    if (teacherSelect && selectedLesson?.dataset.teacher) {
        teacherSelect.innerHTML = '<option value="">Tất cả giáo viên</option>';
        const opt = document.createElement('option');
        opt.value = selectedLesson.dataset.teacher;
        opt.textContent = selectedLesson.dataset.teacher;
        teacherSelect.appendChild(opt);
    }
}

function getFilteredReviewStudents() {
    const keyword = (document.getElementById('review-filter-search')?.value || '').trim().toLowerCase();
    const studentId = document.getElementById('review-filter-student')?.value || '';
    const teacher = document.getElementById('review-filter-teacher')?.value || '';
    const fromDate = document.getElementById('review-filter-from-date')?.value || '';
    const toDate = document.getElementById('review-filter-to-date')?.value || '';
    const sort = document.getElementById('review-filter-sort')?.value || 'az';
    const selectedLesson = document.getElementById('review-select-lesson')?.selectedOptions?.[0];
    const lessonDate = selectedLesson?.dataset.lessonDate || '';
    const lessonTeacher = selectedLesson?.dataset.teacher || '';

    return reviewAllStudents
        .filter(st => {
            const name = getReviewStudentName(st).toLowerCase();
            const cmt = reviewAllComments.find(c => String(c.studentId) === String(st.id)) || {};
            const commentText = (cmt.comment || '').toLowerCase();
            const matchesKeyword = !keyword || name.includes(keyword) || commentText.includes(keyword);
            const matchesStudent = !studentId || String(st.id) === String(studentId);
            const matchesTeacher = !teacher || lessonTeacher === teacher;
            const matchesFrom = !fromDate || !lessonDate || lessonDate >= fromDate;
            const matchesTo = !toDate || !lessonDate || lessonDate <= toDate;
            return matchesKeyword && matchesStudent && matchesTeacher && matchesFrom && matchesTo;
        })
        .sort((a, b) => {
            const result = getReviewStudentName(a).localeCompare(getReviewStudentName(b), 'vi');
            return sort === 'za' ? -result : result;
        });
}

function renderReviewPagination(totalItems, pageSize) {
    const wrap = document.getElementById('review-pagination-controls');
    if (!wrap) return;
    if (pageSize >= 9999 || totalItems <= pageSize) {
        wrap.innerHTML = '';
        return;
    }

    const totalPages = Math.ceil(totalItems / pageSize);
    wrap.innerHTML = `
        <button class="btn btn-sm review-page-btn" ${reviewCurrentPage <= 1 ? 'disabled' : ''} data-page="${reviewCurrentPage - 1}">Trước</button>
        <span class="review-page-current">${reviewCurrentPage}/${totalPages}</span>
        <button class="btn btn-sm review-page-btn" ${reviewCurrentPage >= totalPages ? 'disabled' : ''} data-page="${reviewCurrentPage + 1}">Sau</button>
    `;

    wrap.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            reviewCurrentPage = parseInt(btn.dataset.page, 10);
            renderReviewTable();
        });
    });
}

function updateReviewCount(visible, total) {
    const countText = document.getElementById('review-count-text');
    if (countText) countText.textContent = `Hiển thị ${visible}/${total} mục`;
    const heroCount = document.getElementById('review-count-hero');
    if (heroCount) heroCount.textContent = visible;
}

function getReviewStudentName(student) {
    return student.fullName || student.name || 'N/A';
}

async function saveReviewRow(btnElement) {
    const row = btnElement.closest('tr');
    const studentId = row.dataset.studentId;
    const commentId = row.dataset.commentId;
    const lessonId = document.getElementById('review-select-lesson').value;
    const classId = document.getElementById('review-select-class').value;
    const lsOpt = document.getElementById('review-select-lesson').selectedOptions[0];

    const schoolVal = row.querySelector('.rv-school').value;

    const payload = {
        lessonId: parseInt(lessonId),
        lessonDate: lsOpt.dataset.lessonDate || new Date().toISOString().split('T')[0],
        className: document.getElementById('review-select-class').selectedOptions[0].text,
        studentId: parseInt(studentId),
        studentName: row.querySelector('td:nth-child(3)').textContent.trim(),
        vocabularyScore: row.querySelector('.rv-vocab').value.trim(),
        schoolExamScore: schoolVal,
        homeworkStatus: row.querySelector('.rv-btvn').value,
        comment: row.querySelector('.rv-comment').value.trim()
    };

    const isUpdate = !!commentId;
    const url = isUpdate ? `/api/Comments/${commentId}` : `/api/Comments`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
        btnElement.disabled = true;
        btnElement.textContent = '...';

        const res = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const savedData = await res.json();
            row.dataset.commentId = savedData.id || row.dataset.commentId; // Gắn lại ID mới nếu vừa POST thành công
            btnElement.innerHTML = '<i class="fa-solid fa-check me-1"></i>Đã lưu';
            btnElement.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
            setTimeout(() => {
                btnElement.innerHTML = '<i class="fa-solid fa-pen me-1"></i>Cập nhật';
                btnElement.style.background = 'linear-gradient(135deg, #7b4bef, #9d7cf3)';
            }, 2000);
        } else {
            alert('Lỗi lưu đánh giá!');
            btnElement.innerHTML = isUpdate ? '<i class="fa-solid fa-pen me-1"></i>Cập nhật' : '<i class="fa-solid fa-floppy-disk me-1"></i>Lưu';
        }
    } catch (err) {
        console.error("Lỗi lưu:", err);
        alert('Lỗi kết nối Server!');
        btnElement.innerHTML = isUpdate ? '<i class="fa-solid fa-pen me-1"></i>Cập nhật' : '<i class="fa-solid fa-floppy-disk me-1"></i>Lưu';
    } finally {
        btnElement.disabled = false;
    }
}
window.saveReviewRow = saveReviewRow;