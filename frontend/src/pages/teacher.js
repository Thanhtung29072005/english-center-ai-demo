// ================================================
// TEACHER PAGE LOGIC
// ================================================
let allTeachers = [];
let _teacherHeaders = null;
let teacherCurrentPage = 1;
let _teacherBranches = [];

export async function initTeacherPage() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    _teacherHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // 1. Load chi nhánh vào filter + modal
    try {
        const res = await fetch('/api/branches', { headers: _teacherHeaders });
        if (res.ok) {
            const data = await res.json();
            _teacherBranches = Array.isArray(data) ? data : (data.result || []);

            // Filter dropdown
            const filterBranch = document.getElementById('teacher-filter-branch');
            if (filterBranch) {
                filterBranch.innerHTML = '<option value="">Xem tất cả</option>';
                _teacherBranches.forEach(b => {
                    const opt = document.createElement('option');
                    opt.value = b.id;
                    opt.textContent = b.name;
                    filterBranch.appendChild(opt);
                });
            }

            // Modal Tạo mới + Sửa
            ['newTeacherBranchId', 'editTeacherBranchId'].forEach(elId => {
                const el = document.getElementById(elId);
                if (!el) return;
                el.innerHTML = '<option value="" disabled selected>Chọn chi nhánh</option>';
                _teacherBranches.forEach(b => {
                    const opt = document.createElement('option');
                    opt.value = b.id;
                    opt.textContent = b.name;
                    el.appendChild(opt);
                });
            });
        }
    } catch (err) { console.error('Lỗi load branches (teacher):', err); }

    // 2. Mở modal Tạo mới
    const btnOpen = document.getElementById('btn-open-create-teacher');
    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            document.getElementById('createTeacherForm').reset();
            const modalEl = document.getElementById('createTeacherModal');
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.show();
        });
    }

    // 3. Submit Tạo mới
    const btnCreate = document.getElementById('btnSubmitCreateTeacher');
    if (btnCreate) {
        const freshBtn = btnCreate.cloneNode(true);
        btnCreate.parentNode.replaceChild(freshBtn, btnCreate);
        freshBtn.addEventListener('click', async () => {
            const name = document.getElementById('newTeacherName').value.trim();
            const email = document.getElementById('newTeacherEmail').value.trim();
            const phone = document.getElementById('newTeacherPhone').value.trim();
            const branchId = document.getElementById('newTeacherBranchId').value;

            if (!name || !branchId) {
                alert('Vui lòng nhập tên giáo viên và chọn chi nhánh!');
                return;
            }

            const payload = { name, email: email || null, phone: phone || null, branchId: parseInt(branchId) };

            try {
                freshBtn.textContent = 'Đang xử lý...';
                freshBtn.disabled = true;
                const res = await fetch('/api/teachers', {
                    method: 'POST',
                    headers: _teacherHeaders,
                    body: JSON.stringify(payload)
                });
                if (res.ok || res.status === 201) {
                    alert('Thêm giáo viên thành công!');
                    const modal = bootstrap.Modal.getInstance(document.getElementById('createTeacherModal'));
                    if (modal) modal.hide();
                    document.getElementById('createTeacherForm').reset();
                    await fetchAndRenderTeachers();
                } else {
                    const errText = await res.text();
                    console.error('API error:', errText);
                    alert('Có lỗi xảy ra, không thể thêm giáo viên!');
                }
            } catch (err) {
                console.error('Lỗi tạo GV:', err);
                alert('Lỗi kết nối tới Server!');
            } finally {
                freshBtn.innerHTML = '<i class="fa-solid fa-plus me-1"></i>Tạo mới';
                freshBtn.disabled = false;
            }
        });
    }

    // 4. Events bộ lọc
    if (!document.getElementById('teacher-filter-search')?._teacherFilterBound) {
        ['teacher-filter-search', 'teacher-filter-branch', 'teacher-filter-sort', 'teacher-filter-page-size'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el._teacherFilterBound = true;
                el.addEventListener('input', () => { teacherCurrentPage = 1; applyTeacherFilters(); });
                el.addEventListener('change', () => { teacherCurrentPage = 1; applyTeacherFilters(); });
            }
        });

        const btnReset = document.getElementById('teacher-btn-reset-filter');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                document.getElementById('teacher-filter-search').value = '';
                document.getElementById('teacher-filter-branch').value = '';
                document.getElementById('teacher-filter-sort').value = 'az';
                document.getElementById('teacher-filter-page-size').value = '12';
                teacherCurrentPage = 1;
                applyTeacherFilters();
            });
        }
    }

    // 5. Fetch và render
    await fetchAndRenderTeachers();
}

async function fetchAndRenderTeachers() {
    const container = document.getElementById('teacher-list-container');
    if (!container) return;
    container.innerHTML = `<div class="col-12 text-center py-5 text-muted">Đang tải dữ liệu...</div>`;

    try {
        const res = await fetch('/api/teachers', { headers: _teacherHeaders });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        allTeachers = Array.isArray(data) ? data : (data.result || []);
        teacherCurrentPage = 1;
        applyTeacherFilters();
    } catch (err) {
        console.error('Lỗi fetch teachers:', err);
        if (container) container.innerHTML = `<div class="col-12 text-center py-5 text-danger">Không thể tải danh sách giáo viên.</div>`;
    }
}

function applyTeacherFilters() {
    const search = (document.getElementById('teacher-filter-search')?.value || '').toLowerCase().trim();
    const branchId = document.getElementById('teacher-filter-branch')?.value || '';
    const sort = document.getElementById('teacher-filter-sort')?.value || 'az';
    const pageSize = parseInt(document.getElementById('teacher-filter-page-size')?.value || '12');

    // Lọc
    let filtered = allTeachers.filter(t => {
        const matchSearch = !search ||
            (t.name || '').toLowerCase().includes(search) ||
            (t.email || '').toLowerCase().includes(search) ||
            (t.phone || '').toLowerCase().includes(search) ||
            (t.branchName || '').toLowerCase().includes(search);
        const matchBranch = !branchId || String(t.branchId) === String(branchId);
        return matchSearch && matchBranch;
    });

    // Sắp xếp
    filtered.sort((a, b) => {
        if (sort === 'az') return (a.name || '').localeCompare(b.name || '');
        if (sort === 'za') return (b.name || '').localeCompare(a.name || '');
        return 0;
    });

    // Phân trang
    const totalItems = filtered.length;
    const totalPages = pageSize >= 9999 ? 1 : Math.ceil(totalItems / pageSize);
    if (teacherCurrentPage > totalPages) teacherCurrentPage = Math.max(1, totalPages);
    const startIndex = (teacherCurrentPage - 1) * pageSize;
    const pageItems = pageSize >= 9999 ? filtered : filtered.slice(startIndex, startIndex + pageSize);

    // Count
    const countText = document.getElementById('teacher-count-text');
    if (countText) countText.textContent = `Hiển thị ${pageItems.length} / ${totalItems} giáo viên`;

    // Render
    const container = document.getElementById('teacher-list-container');
    if (!container) return;

    if (pageItems.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-5 text-muted">
            <i class="fa-solid fa-chalkboard-user mb-2" style="font-size:36px; opacity:0.25; display:block;"></i>
            Không tìm thấy giáo viên nào phù hợp.
        </div>`;
    } else {
        container.innerHTML = pageItems.map(t => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card lesson-card-modern h-100 d-flex flex-column">
                    <div class="lesson-card-header">
                        <div class="lesson-icon-modern" style="background: linear-gradient(135deg, #f59e0b, #fbbf24);">
                            <i class="fa-solid fa-chalkboard-user"></i>
                        </div>
                        <div class="lesson-header-text">
                            <h5 class="fw-bold mb-1 class-card-title text-truncate" title="${t.name || '-'}">${t.name || '-'}</h5>
                            ${t.branchName ? `<span class="badge lesson-badge-modern" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">${t.branchName}</span>` : '<span class="badge lesson-badge-modern" style="background: #f1f5f9; color: #64748b;">Chưa phân bổ</span>'}
                        </div>
                    </div>
                    <div class="lesson-card-body flex-grow-1">
                        ${t.email ? `
                        <div class="lesson-info-row">
                            <div class="icon-bg-light icon-blue">
                                <i class="fa-regular fa-envelope"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Email</span>
                                <span class="info-value fw-semibold text-dark text-truncate" title="${t.email}">${t.email}</span>
                            </div>
                        </div>` : ''}
                        ${t.phone ? `
                        <div class="lesson-info-row mt-3">
                            <div class="icon-bg-light" style="background: #f1f5f9; color: #64748b;">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Số điện thoại</span>
                                <span class="info-value fw-semibold text-dark">${t.phone}</span>
                            </div>
                        </div>` : ''}
                    </div>
                    <div class="lesson-card-footer d-flex justify-content-between gap-2">
                        <button class="btn flex-grow-1 btn-edit-modern btn-edit-teacher-card" data-id="${t.id}">
                            <i class="fa-regular fa-pen-to-square me-1"></i> Sửa
                        </button>
                        <button class="btn flex-grow-1 btn-delete-modern btn-delete-teacher-card" data-id="${t.id}" data-name="${t.name}">
                            <i class="fa-regular fa-trash-can me-1"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>`).join('');

        // Sửa
        container.querySelectorAll('.btn-edit-teacher-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const t = allTeachers.find(x => String(x.id) === btn.getAttribute('data-id'));
                if (t) openEditTeacherModal(t);
            });
        });

        // Xóa
        container.querySelectorAll('.btn-delete-teacher-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const teacherId = btn.getAttribute('data-id');
                const teacherName = btn.getAttribute('data-name');
                const msgEl = document.getElementById('deleteTeacherMessage');
                if (msgEl) msgEl.innerHTML = `Bạn có chắc chắn muốn xóa giáo viên <strong>"${teacherName}"</strong>?<br>Hành động này không thể hoàn tác.`;

                const deleteModalEl = document.getElementById('deleteTeacherModal');
                const deleteModal = bootstrap.Modal.getInstance(deleteModalEl) || new bootstrap.Modal(deleteModalEl);
                deleteModal.show();

                const btnConfirm = document.getElementById('btnConfirmDeleteTeacher');
                const newConfirm = btnConfirm.cloneNode(true);
                btnConfirm.parentNode.replaceChild(newConfirm, btnConfirm);
                newConfirm.addEventListener('click', async () => {
                    try {
                        newConfirm.textContent = 'Đang xóa...';
                        newConfirm.disabled = true;
                        const res = await fetch(`/api/teachers/${teacherId}`, { method: 'DELETE', headers: _teacherHeaders });
                        if (res.ok || res.status === 204) {
                            deleteModal.hide();
                            await fetchAndRenderTeachers();
                        } else {
                            alert('Không thể xóa giáo viên! Có thể đang được liên kết với lớp học.');
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

    renderTeacherPagination(totalPages);
}

function openEditTeacherModal(t) {
    document.getElementById('editTeacherId').value = t.id;
    document.getElementById('editTeacherName').value = t.name || '';
    document.getElementById('editTeacherEmail').value = t.email || '';
    document.getElementById('editTeacherPhone').value = t.phone || '';

    const branchSel = document.getElementById('editTeacherBranchId');
    if (branchSel) {
        [...branchSel.options].forEach(opt => { opt.selected = String(opt.value) === String(t.branchId || ''); });
    }

    const editModalEl = document.getElementById('editTeacherModal');
    const editModal = bootstrap.Modal.getInstance(editModalEl) || new bootstrap.Modal(editModalEl);
    editModal.show();

    const btnSubmit = document.getElementById('btnSubmitEditTeacher');
    const newBtn = btnSubmit.cloneNode(true);
    btnSubmit.parentNode.replaceChild(newBtn, btnSubmit);

    newBtn.addEventListener('click', async () => {
        const teacherId = document.getElementById('editTeacherId').value;
        const name = document.getElementById('editTeacherName').value.trim();
        const email = document.getElementById('editTeacherEmail').value.trim();
        const phone = document.getElementById('editTeacherPhone').value.trim();
        const branchId = document.getElementById('editTeacherBranchId').value;

        if (!name || !branchId) {
            alert('Vui lòng nhập tên giáo viên và chọn chi nhánh!');
            return;
        }

        const payload = { name, email: email || null, phone: phone || null, branchId: parseInt(branchId) };

        try {
            newBtn.textContent = 'Đang lưu...';
            newBtn.disabled = true;
            const res = await fetch(`/api/teachers/${teacherId}`, {
                method: 'PUT',
                headers: _teacherHeaders,
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                editModal.hide();
                await fetchAndRenderTeachers();
            } else {
                const errText = await res.text();
                console.error('API error:', errText);
                alert('Có lỗi xảy ra, không thể cập nhật giáo viên!');
            }
        } catch (err) {
            console.error('Lỗi sửa GV:', err);
            alert('Lỗi kết nối tới Server!');
        } finally {
            newBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i>Lưu thay đổi';
            newBtn.disabled = false;
        }
    });
}

function renderTeacherPagination(totalPages) {
    const paginationEl = document.getElementById('teacher-pagination-controls');
    if (!paginationEl) return;
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

    const btnStyle = (isActive) =>
        `style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid ${isActive ? 'var(--primary-color)' : '#E0E5F2'};background:${isActive ? 'var(--primary-color)' : 'white'};color:${isActive ? 'white' : '#4a5568'};font-weight:500;font-size:14px;cursor:pointer;transition:all 0.2s ease;"`;

    let html = `<button onclick="changeTeacherPage(${teacherCurrentPage - 1})" ${teacherCurrentPage === 1 ? 'disabled' : ''}
        style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid #E0E5F2;background:white;color:#4a5568;font-weight:500;font-size:14px;cursor:pointer;">‹</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="changeTeacherPage(${i})" ${btnStyle(i === teacherCurrentPage)}>${i}</button>`;
    }
    html += `<button onclick="changeTeacherPage(${teacherCurrentPage + 1})" ${teacherCurrentPage === totalPages ? 'disabled' : ''}
        style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid #E0E5F2;background:white;color:#4a5568;font-weight:500;font-size:14px;cursor:pointer;">›</button>`;
    paginationEl.innerHTML = html;
}

function changeTeacherPage(page) {
    const pageSize = parseInt(document.getElementById('teacher-filter-page-size')?.value || '12');
    const totalPages = Math.ceil(allTeachers.length / pageSize);
    if (page < 1 || page > totalPages) return;
    teacherCurrentPage = page;
    applyTeacherFilters();
}

// ================================================
// PROFILE PAGE LOGIC
// ================================================
let currentProfileData = null;

async function initProfilePage() {
    const token = localStorage.getItem('accessToken');
    const savedUsername = localStorage.getItem('username') || '';
    const savedRole = localStorage.getItem('userRole') || '';

    if (!token || !savedUsername) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/index.html';
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // 1. Gắn thông tin cơ bản lên UI (Tên, Role)
    document.getElementById('profile-display-name').textContent = savedUsername || '—';
    const roleMap = {
        'OWNER': 'Chủ trung tâm',
        'BRANCH_MANAGER': 'Quản lý chi nhánh',
        'TEACHER': 'Giáo viên',
        'PARENT': 'Phụ huynh',
        'ADMIN': 'Quản trị viên'
    };
    document.getElementById('profile-display-role').textContent = roleMap[savedRole.toUpperCase()] || savedRole || '—';
    document.getElementById('profile-username').value = savedUsername;

    // 2. Fetch dữ liệu user từ backend bằng cách lấy danh sách và tìm theo username
    let currentUserId = null;
    try {
        const res = await fetch('/api/Users', { headers });
        if (res.ok) {
            const users = await res.json();
            currentProfileData = users.find(u => u.username === savedUsername);
            if (currentProfileData) {
                currentUserId = currentProfileData.id;
                document.getElementById('profile-fullname').value = currentProfileData.fullName || '';
                document.getElementById('profile-email').value = currentProfileData.email || '';
                document.getElementById('profile-phone').value = currentProfileData.phone || '';
                if (currentProfileData.fullName) {
                    document.getElementById('profile-display-name').textContent = currentProfileData.fullName;
                }
            } else {
                console.error('Không tìm thấy user hiện tại trong danh sách.');
            }
        }
    } catch (error) {
        console.error('Lỗi khi tải thông tin user:', error);
    }

    // 3. Xử lý nút Quay lại
    const btnBack = document.getElementById('profile-btn-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            document.querySelector('.dashboard-wrap .sidebar .nav-item[data-page="dashboard-home"]')?.click();
        });
    }

    // 4. Xử lý Lưu thay đổi
    const btnSave = document.getElementById('profile-btn-save');
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            if (!currentProfileData || !currentUserId) return;

            const fullName = document.getElementById('profile-fullname').value.trim();
            const email = document.getElementById('profile-email').value.trim();
            const phone = document.getElementById('profile-phone').value.trim();

            const payload = {
                username: currentProfileData.username,
                fullName: fullName,
                email: email,
                phone: phone,
                role: currentProfileData.role,
                isActive: currentProfileData.isActive,
                branchId: currentProfileData.branchId,
                teacherId: currentProfileData.teacherId,
                classIds: currentProfileData.classes ? currentProfileData.classes.map(c => c.id) : []
            };

            try {
                btnSave.textContent = 'Đang lưu...';
                btnSave.disabled = true;
                const res = await fetch(`/api/Users/${currentUserId}`, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    alert('Cập nhật thông tin thành công!');
                    const updatedUser = await res.json();
                    currentProfileData = updatedUser;
                    if (updatedUser.fullName) {
                        document.getElementById('profile-display-name').textContent = updatedUser.fullName;
                    }
                } else {
                    alert('Lỗi cập nhật thông tin!');
                }
            } catch (err) {
                console.error('Lỗi lưu profile:', err);
                alert('Lỗi kết nối tới Server!');
            } finally {
                btnSave.textContent = 'Lưu thay đổi';
                btnSave.disabled = false;
            }
        });
    }

    // 5. Xử lý Đổi mật khẩu
    const btnChangePwdForm = document.getElementById('profile-btn-change-pwd');
    if (btnChangePwdForm) {
        btnChangePwdForm.addEventListener('click', () => {
            window.loadDashboardContent('change-password', initChangePasswordPage);
        });
    }
}

async function initChangePasswordPage() {
    const token = localStorage.getItem('accessToken');
    const savedUsername = localStorage.getItem('username') || '';

    if (!token || !savedUsername) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/index.html';
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const goBackToProfile = () => window.loadDashboardContent('profile', initProfilePage);

    document.getElementById('change-password-btn-back')?.addEventListener('click', goBackToProfile);
    document.getElementById('change-password-btn-cancel')?.addEventListener('click', goBackToProfile);

    const btnSubmit = document.getElementById('change-password-btn-submit');
    if (!btnSubmit) return;

    btnSubmit.addEventListener('click', async () => {
        const currentPassword = document.getElementById('change-current-password').value.trim();
        const newPassword = document.getElementById('change-new-password').value;
        const confirmPassword = document.getElementById('change-confirm-password').value;

        if (!currentPassword) {
            alert('Vui lòng nhập mật khẩu hiện tại!');
            return;
        }
        if (newPassword.length < 6) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            btnSubmit.textContent = 'Đang xử lý...';
            btnSubmit.disabled = true;

            let currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                const usersRes = await fetch('/api/Users', { headers });
                if (usersRes.ok) {
                    const users = await usersRes.json();
                    const currentUser = users.find(u => u.username === savedUsername);
                    currentUserId = currentUser?.id;
                }
            }

            if (!currentUserId) {
                alert('Không tìm thấy tài khoản hiện tại!');
                return;
            }

            const res = await fetch(`/api/Users/${currentUserId}/reset-password`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ newPassword: newPassword })
            });

            if (res.ok) {
                alert('Đổi mật khẩu thành công!');
                goBackToProfile();
            } else {
                alert('Đổi mật khẩu thất bại!');
            }
        } catch (err) {
            console.error('Lỗi đổi mật khẩu:', err);
            alert('Lỗi kết nối tới Server!');
        } finally {
            btnSubmit.textContent = 'Đổi mật khẩu';
            btnSubmit.disabled = false;
        }
    });
}