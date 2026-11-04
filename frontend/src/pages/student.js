// ================================================
// STUDENT PAGE LOGIC
// ================================================
let allStudents = [];
let _studentHeaders = null;
let studentCurrentPage = 1;
let _studentAllClasses = [];

export async function initStudentPage() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    _studentHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // 1. Load danh sách lớp học vào filter + modal
    try {
        const res = await fetch('/api/classes', { headers: _studentHeaders });
        if (res.ok) {
            const data = await res.json();
            _studentAllClasses = Array.isArray(data) ? data : (data.result || []);

            // Filter dropdown Chọn lớp
            const filterClassEl = document.getElementById('student-filter-class');
            if (filterClassEl) {
                filterClassEl.innerHTML = '<option value="">-- Tất cả lớp --</option>';
                _studentAllClasses.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.name;
                    filterClassEl.appendChild(opt);
                });
            }

            // Modal Tạo mới + Sửa
            ['newStudentClassId', 'editStudentClassId'].forEach(elId => {
                const el = document.getElementById(elId);
                if (!el) return;
                const defaultTxt = elId.startsWith('new') ? 'Chọn lớp học' : 'Chọn lớp học';
                el.innerHTML = `<option value="" disabled selected>${defaultTxt}</option>`;
                _studentAllClasses.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.name;
                    el.appendChild(opt);
                });
            });

            // Filter Chi nhánh (lấy unique từ danh sách lớp)
            const branchSel = document.getElementById('student-filter-branch');
            if (branchSel) {
                const uniqueBranches = [...new Map(
                    _studentAllClasses
                        .filter(c => c.branchName || c.branch?.name)
                        .map(c => {
                            const id = c.branchId || c.branch?.id || '';
                            const name = c.branchName || c.branch?.name || '';
                            return [id, { id, name }];
                        })
                ).values()];
                branchSel.innerHTML = '<option value="">Tất cả lớp</option>';
                uniqueBranches.forEach(b => {
                    const opt = document.createElement('option');
                    opt.value = b.id;
                    opt.textContent = b.name;
                    branchSel.appendChild(opt);
                });
            }
        }
    } catch (err) { console.error('Lỗi load classes (student page):', err); }

    // 2. Mở modal Tạo mới
    const btnOpen = document.getElementById('btn-open-create-student');
    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            const modalEl = document.getElementById('createStudentModal');
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.show();
        });
    }

    // 3. Submit Tạo mới
    const btnCreate = document.getElementById('btnSubmitCreateStudent');
    if (btnCreate) {
        const freshBtn = btnCreate.cloneNode(true);
        btnCreate.parentNode.replaceChild(freshBtn, btnCreate);
        freshBtn.addEventListener('click', async () => {
            const name = document.getElementById('newStudentName').value.trim();
            const dob = document.getElementById('newStudentDob').value;
            const classId = document.getElementById('newStudentClassId').value;
            const parentName = document.getElementById('newStudentParentName').value.trim();
            const parentPhone = document.getElementById('newStudentParentPhone').value.trim();
            const parentEmail = document.getElementById('newStudentParentEmail').value.trim();

            if (!name || !classId) {
                alert('Vui lòng nhập tên học sinh và chọn lớp học!');
                return;
            }

            const payload = {
                name,
                dateOfBirth: dob || null,
                classId: parseInt(classId),
                parentName: parentName || null,
                parentPhone: parentPhone || null,
                parentEmail: parentEmail || null
            };

            try {
                freshBtn.textContent = 'Đang xử lý...';
                freshBtn.disabled = true;
                const res = await fetch('/api/students', {
                    method: 'POST',
                    headers: _studentHeaders,
                    body: JSON.stringify(payload)
                });
                if (res.ok || res.status === 201) {
                    alert('Thêm học sinh thành công!');
                    const modalEl = document.getElementById('createStudentModal');
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                    document.getElementById('createStudentForm').reset();
                    await fetchAndRenderStudents();
                } else {
                    const errText = await res.text();
                    console.error('API error:', errText);
                    alert('Có lỗi xảy ra, không thể thêm học sinh!');
                }
            } catch (err) {
                console.error('Lỗi tạo HS:', err);
                alert('Lỗi kết nối tới Server!');
            } finally {
                freshBtn.innerHTML = '<i class="fa-solid fa-plus me-1"></i>Tạo mới';
                freshBtn.disabled = false;
            }
        });
    }

    // 4. Gắn events bộ lọc
    if (!document.getElementById('student-filter-search')?._studentFilterBound) {
        ['student-filter-search', 'student-filter-class', 'student-filter-branch',
            'student-filter-sort', 'student-filter-page-size'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el._studentFilterBound = true;
                    el.addEventListener('input', () => { studentCurrentPage = 1; applyStudentFilters(); });
                    el.addEventListener('change', () => { studentCurrentPage = 1; applyStudentFilters(); });
                }
            });

        const btnReset = document.getElementById('student-btn-reset-filter');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                document.getElementById('student-filter-search').value = '';
                document.getElementById('student-filter-class').value = '';
                document.getElementById('student-filter-branch').value = '';
                document.getElementById('student-filter-sort').value = 'az';
                document.getElementById('student-filter-page-size').value = '12';
                studentCurrentPage = 1;
                applyStudentFilters();
            });
        }
    }

    // 5. Fetch và render
    await fetchAndRenderStudents();
}

async function fetchAndRenderStudents() {
    const container = document.getElementById('student-list-container');
    if (!container) return;
    container.innerHTML = `<div class="col-12 text-center py-5 text-muted">Đang tải dữ liệu...</div>`;

    try {
        const res = await fetch('/api/students', { headers: _studentHeaders });
        if (!res.ok) throw new Error('Không thể lấy danh sách học sinh');
        const data = await res.json();
        allStudents = Array.isArray(data) ? data : (data.result || []);
        studentCurrentPage = 1;
        applyStudentFilters();
    } catch (err) {
        console.error('Lỗi fetch students:', err);
        if (container) container.innerHTML = `<div class="col-12 text-center py-5 text-danger">Không thể tải danh sách học sinh.</div>`;
    }
}

function applyStudentFilters() {
    const search = (document.getElementById('student-filter-search')?.value || '').toLowerCase().trim();
    const classId = document.getElementById('student-filter-class')?.value || '';
    const branchId = document.getElementById('student-filter-branch')?.value || '';
    const sort = document.getElementById('student-filter-sort')?.value || 'az';
    const pageSize = parseInt(document.getElementById('student-filter-page-size')?.value || '12');

    // 1. Lọc
    let filtered = allStudents.filter(s => {
        const matchSearch = !search ||
            (s.name || '').toLowerCase().includes(search) ||
            (s.className || '').toLowerCase().includes(search) ||
            (s.parentName || '').toLowerCase().includes(search) ||
            (s.parentPhone || '').toLowerCase().includes(search);

        const matchClass = !classId || String(s.classId) === String(classId);

        // Lọc chi nhánh: tìm lớp của học sinh rồi check branchId
        let matchBranch = true;
        if (branchId) {
            const cls = _studentAllClasses.find(c => String(c.id) === String(s.classId));
            const cBranchId = cls ? String(cls.branchId || cls.branch?.id || '') : '';
            matchBranch = cBranchId === String(branchId);
        }

        return matchSearch && matchClass && matchBranch;
    });

    // 2. Sắp xếp
    filtered.sort((a, b) => {
        if (sort === 'az') return (a.name || '').localeCompare(b.name || '');
        if (sort === 'za') return (b.name || '').localeCompare(a.name || '');
        if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        return 0;
    });

    // 3. Phân trang
    const totalItems = filtered.length;
    const totalPages = pageSize >= 9999 ? 1 : Math.ceil(totalItems / pageSize);
    if (studentCurrentPage > totalPages) studentCurrentPage = Math.max(1, totalPages);
    const startIndex = (studentCurrentPage - 1) * pageSize;
    const pageItems = pageSize >= 9999 ? filtered : filtered.slice(startIndex, startIndex + pageSize);

    // 4. Count text
    const countText = document.getElementById('student-count-text');
    if (countText) countText.textContent = `Hiển thị ${pageItems.length} / ${totalItems} học sinh`;

    // 5. Render cards
    const container = document.getElementById('student-list-container');
    if (!container) return;

    if (pageItems.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-5 text-muted">
            <i class="fa-solid fa-user-slash mb-2" style="font-size:32px; opacity:0.3; display:block;"></i>
            Không tìm thấy học sinh nào phù hợp.
        </div>`;
    } else {
        container.innerHTML = pageItems.map(s => {
            const dob = s.dateOfBirth;
            const dobStr = dob ? new Date(dob + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null;
            return `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card lesson-card-modern h-100 d-flex flex-column">
                    <div class="lesson-card-header">
                        <div class="lesson-icon-modern" style="background: linear-gradient(135deg, #0ea5e9, #38bdf8);">
                            <i class="fa-solid fa-user-graduate"></i>
                        </div>
                        <div class="lesson-header-text">
                            <h5 class="fw-bold mb-1 class-card-title text-truncate" title="${s.name || '-'}">${s.name || '-'}</h5>
                            <span class="badge lesson-badge-modern" style="background: rgba(14, 165, 233, 0.1); color: #0ea5e9;">Lớp ${s.className || '-'}</span>
                        </div>
                    </div>
                    <div class="lesson-card-body flex-grow-1">
                        ${dobStr ? `
                        <div class="lesson-info-row">
                            <div class="icon-bg-light icon-blue">
                                <i class="fa-regular fa-calendar"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Ngày sinh</span>
                                <span class="info-value fw-semibold text-dark">${dobStr}</span>
                            </div>
                        </div>` : ''}
                        ${s.parentName ? `
                        <div class="lesson-info-row mt-3">
                            <div class="icon-bg-light icon-orange">
                                <i class="fa-solid fa-user-tie"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Phụ huynh</span>
                                <span class="info-value fw-semibold text-dark text-truncate" title="${s.parentName}">${s.parentName}</span>
                            </div>
                        </div>` : ''}
                        ${s.parentPhone ? `
                        <div class="lesson-info-row mt-3">
                            <div class="icon-bg-light" style="background: #f1f5f9; color: #64748b;">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">SĐT Phụ huynh</span>
                                <span class="info-value fw-semibold text-dark">${s.parentPhone}</span>
                            </div>
                        </div>` : ''}
                    </div>
                    <div class="lesson-card-footer d-flex justify-content-between gap-2">
                        <button class="btn flex-grow-1 btn-edit-modern btn-edit-student-card" data-id="${s.id}">
                            <i class="fa-regular fa-pen-to-square me-1"></i> Sửa
                        </button>
                        <button class="btn flex-grow-1 btn-delete-modern btn-delete-student-card" data-id="${s.id}" data-name="${s.name}">
                            <i class="fa-regular fa-trash-can me-1"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

        // Gắn sự kiện nút Sửa
        container.querySelectorAll('.btn-edit-student-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const s = allStudents.find(x => String(x.id) === btn.getAttribute('data-id'));
                if (s) openEditStudentModal(s);
            });
        });

        // Gắn sự kiện nút Xóa
        container.querySelectorAll('.btn-delete-student-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const studentId = btn.getAttribute('data-id');
                const studentName = btn.getAttribute('data-name');
                const msgEl = document.getElementById('deleteStudentMessage');
                if (msgEl) msgEl.innerHTML = `Bạn có chắc chắn muốn xóa học sinh <strong>"${studentName}"</strong>?<br>Hành động này không thể hoàn tác.`;

                const deleteModalEl = document.getElementById('deleteStudentModal');
                const deleteModal = bootstrap.Modal.getInstance(deleteModalEl) || new bootstrap.Modal(deleteModalEl);
                deleteModal.show();

                const btnConfirm = document.getElementById('btnConfirmDeleteStudent');
                const newConfirm = btnConfirm.cloneNode(true);
                btnConfirm.parentNode.replaceChild(newConfirm, btnConfirm);
                newConfirm.addEventListener('click', async () => {
                    try {
                        newConfirm.textContent = 'Đang xóa...';
                        newConfirm.disabled = true;
                        const res = await fetch(`/api/students/${studentId}`, { method: 'DELETE', headers: _studentHeaders });
                        if (res.ok || res.status === 204) {
                            deleteModal.hide();
                            await fetchAndRenderStudents();
                        } else {
                            alert('Không thể xóa học sinh!');
                        }
                    } catch (err) {
                        alert('Lỗi kết nối tới Server!');
                    } finally {
                        newConfirm.textContent = 'Xóa';
                        newConfirm.disabled = false;
                    }
                });
            });
        });
    }

    // 6. Pagination
    renderStudentPagination(totalPages);
}

function openEditStudentModal(s) {
    document.getElementById('editStudentId').value = s.id;
    document.getElementById('editStudentName').value = s.name || '';
    document.getElementById('editStudentDob').value = s.dateOfBirth || '';
    document.getElementById('editStudentParentName').value = s.parentName || '';
    document.getElementById('editStudentParentPhone').value = s.parentPhone || '';
    document.getElementById('editStudentParentEmail').value = s.parentEmail || '';

    const classSelect = document.getElementById('editStudentClassId');
    if (classSelect) {
        [...classSelect.options].forEach(opt => { opt.selected = String(opt.value) === String(s.classId || ''); });
    }

    const editModalEl = document.getElementById('editStudentModal');
    const editModal = bootstrap.Modal.getInstance(editModalEl) || new bootstrap.Modal(editModalEl);
    editModal.show();

    const btnSubmit = document.getElementById('btnSubmitEditStudent');
    const newBtn = btnSubmit.cloneNode(true);
    btnSubmit.parentNode.replaceChild(newBtn, btnSubmit);

    newBtn.addEventListener('click', async () => {
        const studentId = document.getElementById('editStudentId').value;
        const name = document.getElementById('editStudentName').value.trim();
        const dob = document.getElementById('editStudentDob').value;
        const classId = document.getElementById('editStudentClassId').value;
        const parentName = document.getElementById('editStudentParentName').value.trim();
        const parentPhone = document.getElementById('editStudentParentPhone').value.trim();
        const parentEmail = document.getElementById('editStudentParentEmail').value.trim();

        if (!name || !classId) {
            alert('Vui lòng nhập tên học sinh và chọn lớp học!');
            return;
        }

        const payload = {
            name,
            dateOfBirth: dob || null,
            classId: parseInt(classId),
            parentName: parentName || null,
            parentPhone: parentPhone || null,
            parentEmail: parentEmail || null
        };

        try {
            newBtn.textContent = 'Đang lưu...';
            newBtn.disabled = true;
            const res = await fetch(`/api/students/${studentId}`, {
                method: 'PUT',
                headers: _studentHeaders,
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                editModal.hide();
                await fetchAndRenderStudents();
            } else {
                const errText = await res.text();
                console.error('API error:', errText);
                alert('Có lỗi xảy ra, không thể cập nhật học sinh!');
            }
        } catch (err) {
            console.error('Lỗi sửa HS:', err);
            alert('Lỗi kết nối tới Server!');
        } finally {
            newBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i>Lưu thay đổi';
            newBtn.disabled = false;
        }
    });
}

function renderStudentPagination(totalPages) {
    const paginationEl = document.getElementById('student-pagination-controls');
    if (!paginationEl) return;
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

    const btnStyle = (isActive) =>
        `style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid ${isActive ? 'var(--primary-color)' : '#E0E5F2'};background:${isActive ? 'var(--primary-color)' : 'white'};color:${isActive ? 'white' : '#4a5568'};font-weight:500;font-size:14px;cursor:pointer;transition:all 0.2s ease;"`;

    let html = `<button onclick="changeStudentPage(${studentCurrentPage - 1})" ${studentCurrentPage === 1 ? 'disabled' : ''}
        style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid #E0E5F2;background:white;color:#4a5568;font-weight:500;font-size:14px;cursor:pointer;">‹</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="changeStudentPage(${i})" ${btnStyle(i === studentCurrentPage)}>${i}</button>`;
    }
    html += `<button onclick="changeStudentPage(${studentCurrentPage + 1})" ${studentCurrentPage === totalPages ? 'disabled' : ''}
        style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid #E0E5F2;background:white;color:#4a5568;font-weight:500;font-size:14px;cursor:pointer;">›</button>`;
    paginationEl.innerHTML = html;
}

function changeStudentPage(page) {
    const pageSize = parseInt(document.getElementById('student-filter-page-size')?.value || '12');
    const totalPages = Math.ceil(allStudents.length / pageSize);
    if (page < 1 || page > totalPages) return;
    studentCurrentPage = page;
    applyStudentFilters();
}
window.changeStudentPage = changeStudentPage;