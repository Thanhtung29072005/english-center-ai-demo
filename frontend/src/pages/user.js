// ================================================
// USER PAGE LOGIC
// ================================================
let allUsers = [];
let _userHeaders = null;
let userCurrentPage = 1;

const ROLE_LABELS = {
    'OWNER': 'Chủ trung tâm',
    'BRANCH_MANAGER': 'Quản lý chi nhánh',
    'TEACHER': 'Giáo viên',
    'PARENT': 'Phụ huynh'
};
const ROLE_CSS = {
    'OWNER': 'role-admin',
    'BRANCH_MANAGER': 'role-manager',
    'TEACHER': 'role-teacher',
    'PARENT': 'role-parent'
};

export async function initUserPage() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    _userHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Load dữ liệu bổ sung cho form
    try {
        const [resBranch, resTeacher, resClass] = await Promise.all([
            fetch('/api/branches', { headers: _userHeaders }),
            fetch('/api/teachers', { headers: _userHeaders }),
            fetch('/api/classes', { headers: _userHeaders })
        ]);

        if (resBranch.ok) {
            const data = await resBranch.json();
            const branches = Array.isArray(data) ? data : (data.result || []);
            ['newUserBranchId', 'editUserBranchId'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.innerHTML = '<option value="" disabled selected>Chọn chi nhánh</option>';
                    branches.forEach(b => {
                        const opt = document.createElement('option');
                        opt.value = b.id;
                        opt.textContent = b.name;
                        el.appendChild(opt);
                    });
                }
            });
        }

        if (resTeacher.ok) {
            const data = await resTeacher.json();
            const teachers = Array.isArray(data) ? data : (data.result || []);
            const el = document.getElementById('newUserTeacherId');
            if (el) {
                el.innerHTML = '<option value="">Tạo giáo viên mới</option>';
                teachers.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t.id;
                    opt.textContent = t.name || t.fullName || `GV-${t.id}`;
                    el.appendChild(opt);
                });
            }
        }

        if (resClass.ok) {
            const data = await resClass.json();
            const classes = Array.isArray(data) ? data : (data.result || []);
            const el = document.getElementById('newUserClassList');
            if (el) {
                el.innerHTML = '';
                classes.forEach(c => {
                    const idHtml = `user_class_${c.id}`;
                    el.innerHTML += `
                        <div class="form-check mb-2">
                            <input class="form-check-input user-class-checkbox" type="checkbox" value="${c.id}" id="${idHtml}">
                            <label class="form-check-label" for="${idHtml}" style="font-size: 14px; color: #4a5568;">
                                ${c.name}
                            </label>
                        </div>
                    `;
                });
                if (classes.length === 0) el.innerHTML = '<p class="text-muted mb-0" style="font-size: 13px;">Không có lớp học nào.</p>';
            }
        }
    } catch (err) {
        console.error('Lỗi load data cho user form:', err);
    }

    // 1. Nút mở modal Tạo mới
    const btnOpen = document.getElementById('btn-open-create-user');
    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            const modalEl = document.getElementById('createUserModal');
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.show();
        });
    }

    // 2. Submit tạo mới
    const btnCreate = document.getElementById('btnSubmitCreateUser');
    if (btnCreate) {
        const freshBtn = btnCreate.cloneNode(true);
        btnCreate.parentNode.replaceChild(freshBtn, btnCreate);
        freshBtn.addEventListener('click', async () => {
            const username = document.getElementById('newUserUsername').value.trim();
            const password = document.getElementById('newUserPassword').value.trim();
            const fullName = document.getElementById('newUserFullName').value.trim();
            const email = document.getElementById('newUserEmail').value.trim();
            const phone = document.getElementById('newUserPhone').value.trim();
            const role = document.getElementById('newUserRole').value;
            const branchId = document.getElementById('newUserBranchId').value;
            const teacherId = document.getElementById('newUserTeacherId').value;
            const isActive = document.getElementById('newUserIsActive').value === 'true';

            // Thu thập danh sách lớp học được check
            const classIds = [];
            document.querySelectorAll('.user-class-checkbox:checked').forEach(cb => {
                classIds.push(parseInt(cb.value));
            });

            if (!username || !password || !role || !branchId) {
                alert('Vui lòng nhập tên đăng nhập, mật khẩu, chọn vai trò và chi nhánh!');
                return;
            }

            const payload = {
                username, password, fullName, email, phone, role, isActive,
                branchId: parseInt(branchId),
                teacherId: teacherId ? parseInt(teacherId) : null,
                classIds: classIds.length > 0 ? classIds : null
            };
            try {
                freshBtn.textContent = 'Đang xử lý...';
                freshBtn.disabled = true;
                const res = await fetch('/api/Users', {
                    method: 'POST',
                    headers: _userHeaders,
                    body: JSON.stringify(payload)
                });
                if (res.ok || res.status === 201) {
                    alert('Tạo người dùng thành công!');
                    const modalEl = document.getElementById('createUserModal');
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                    document.getElementById('createUserForm').reset();
                    await fetchAndRenderUsers();
                } else {
                    const errText = await res.text();
                    console.error('API error:', errText);
                    alert('Có lỗi xảy ra, không thể tạo người dùng!');
                }
            } catch (err) {
                console.error('Lỗi tạo người dùng:', err);
                alert('Lỗi kết nối tới Server!');
            } finally {
                freshBtn.textContent = 'Tạo mới';
                freshBtn.disabled = false;
            }
        });
    }

    // 3. Gắn events bộ lọc
    if (!document.getElementById('user-filter-search')?._userFilterBound) {
        ['user-filter-search', 'user-filter-role', 'user-filter-status',
            'user-filter-sort', 'user-filter-page-size'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el._userFilterBound = true;
                    el.addEventListener('input', () => { userCurrentPage = 1; applyUserFilters(); });
                    el.addEventListener('change', () => { userCurrentPage = 1; applyUserFilters(); });
                }
            });

        const btnReset = document.getElementById('user-btn-reset-filter');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                document.getElementById('user-filter-search').value = '';
                document.getElementById('user-filter-role').value = '';
                document.getElementById('user-filter-status').value = '';
                document.getElementById('user-filter-sort').value = 'newest';
                document.getElementById('user-filter-page-size').value = '12';
                userCurrentPage = 1;
                applyUserFilters();
            });
        }
    }

    // 4. Đóng dropdown khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-action-menu')) {
            document.querySelectorAll('.user-action-dropdown.show').forEach(d => d.classList.remove('show'));
        }
    });

    // 5. Fetch và render
    await fetchAndRenderUsers();
}

async function fetchAndRenderUsers() {
    const tbody = document.getElementById('user-table-body');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5 text-muted">Đang tải dữ liệu...</td></tr>`;

    try {
        const res = await fetch('/api/Users', { headers: _userHeaders });
        if (!res.ok) throw new Error('Không thể lấy danh sách người dùng');
        const data = await res.json();
        allUsers = Array.isArray(data) ? data : (data.result ? data.result : []);
        userCurrentPage = 1;
        applyUserFilters();
    } catch (err) {
        console.error('Lỗi fetch users:', err);
        if (tbody) tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5 text-danger">Không thể tải danh sách người dùng.</td></tr>`;
    }
}

function applyUserFilters() {
    const search = (document.getElementById('user-filter-search')?.value || '').toLowerCase().trim();
    const role = document.getElementById('user-filter-role')?.value || '';
    const status = document.getElementById('user-filter-status')?.value;
    const sort = document.getElementById('user-filter-sort')?.value || 'newest';
    const pageSize = parseInt(document.getElementById('user-filter-page-size')?.value || '12');

    // 1. Lọc
    let filtered = allUsers.filter(u => {
        const matchSearch = !search ||
            (u.username || '').toLowerCase().includes(search) ||
            (u.email || '').toLowerCase().includes(search) ||
            (u.fullName || '').toLowerCase().includes(search);
        const matchRole = !role || (u.role || '') === role;
        const matchStatus = status === '' || status === undefined || status === null
            ? true
            : String(u.isActive) === status;
        return matchSearch && matchRole && matchStatus;
    });

    // 2. Sắp xếp
    filtered.sort((a, b) => {
        if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        const nameA = (a.username || '').toLowerCase();
        const nameB = (b.username || '').toLowerCase();
        return sort === 'az' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    // 3. Phân trang
    const totalItems = filtered.length;
    const totalPages = pageSize >= 9999 ? 1 : Math.ceil(totalItems / pageSize);
    if (userCurrentPage > totalPages) userCurrentPage = Math.max(1, totalPages);
    const startIndex = (userCurrentPage - 1) * pageSize;
    const pageItems = pageSize >= 9999 ? filtered : filtered.slice(startIndex, startIndex + pageSize);

    // 4. Cập nhật count
    const countText = document.getElementById('user-count-text');
    if (countText) countText.textContent = `Hiển thị ${pageItems.length} / ${totalItems} người dùng`;

    // 5. Render bảng
    const tbody = document.getElementById('user-table-body');
    if (!tbody) return;

    if (pageItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5 text-muted">Không tìm thấy người dùng nào phù hợp.</td></tr>`;
    } else {
        tbody.innerHTML = pageItems.map(u => {
            const dateStr = u.createdAt
                ? new Date(u.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : 'N/A';
            const roleLabel = ROLE_LABELS[u.role] || u.role || 'N/A';
            const roleCss = ROLE_CSS[u.role] || 'role-teacher';
            const statusLabel = u.isActive ? 'Hoạt động' : 'Vô hiệu hóa';
            const statusCss = u.isActive ? 'status-active' : 'status-inactive';
            const toggleAction = u.isActive ? 'deactivate' : 'activate';
            const toggleLabel = u.isActive ? 'Vô hiệu hóa' : 'Kích hoạt';

            return `
            <tr>
                <td class="px-4 fw-medium" style="color: #2c3140;">${u.username || '—'}</td>
                <td class="px-3" style="color: ${u.fullName ? '#2c3140' : '#a0aec0'};">${u.fullName || '—'}</td>
                <td class="px-3" style="color: var(--primary-color);">${u.email || '—'}</td>
                <td class="px-3 text-muted">${u.phone || '—'}</td>
                <td class="px-3"><span class="user-role-badge ${roleCss}">${roleLabel}</span></td>
                <td class="px-3"><span class="user-status-badge ${statusCss}">${statusLabel}</span></td>
                <td class="px-3 text-muted" style="font-size: 13px;">${dateStr}</td>
                <td class="px-3">
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-edit-user btn-edit-user-row" data-id="${u.id}">
                            <i class="fa-solid fa-pen-to-square me-1"></i>Sửa
                        </button>
                        <div class="user-action-menu">
                            <button class="btn btn-sm btn-user-more" data-id="${u.id}"
                                style="border: none; background: none; color: #8492a6; font-size: 18px; padding: 2px 6px; line-height:1;">⋮</button>
                            <div class="user-action-dropdown" id="user-dropdown-${u.id}">
                                <button class="user-action-dropdown-item btn-toggle-user" data-id="${u.id}" data-action="${toggleAction}">${toggleLabel}</button>
                                <button class="user-action-dropdown-item btn-reset-pwd" data-id="${u.id}" data-username="${u.username}">
                                    <i class="fa-solid fa-key me-2"></i>Đặt lại mật khẩu
                                </button>
                                <hr style="margin: 4px 0; border-color: #f0f0f5;">
                                <button class="user-action-dropdown-item danger btn-delete-user-row" data-id="${u.id}" data-name="${u.username}">
                                    <i class="fa-solid fa-trash me-2"></i>Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;
        }).join('');

        // Gắn nút ⋮ dropdown toggle
        tbody.querySelectorAll('.btn-user-more').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const dropdown = document.getElementById(`user-dropdown-${id}`);
                document.querySelectorAll('.user-action-dropdown.show').forEach(d => {
                    if (d !== dropdown) d.classList.remove('show');
                });
                dropdown.classList.toggle('show');
            });
        });

        // Nút Sửa
        tbody.querySelectorAll('.btn-edit-user-row').forEach(btn => {
            btn.addEventListener('click', () => {
                const u = allUsers.find(x => String(x.id) === btn.getAttribute('data-id'));
                if (u) openEditUserModal(u);
            });
        });

        // Nút Kích hoạt / Vô hiệu hóa
        tbody.querySelectorAll('.btn-toggle-user').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const action = btn.getAttribute('data-action');
                try {
                    const res = await fetch(`/api/Users/${id}/${action}`, { method: 'POST', headers: _userHeaders });
                    if (res.ok) await fetchAndRenderUsers();
                    else alert('Không thể thực hiện thao tác này!');
                } catch (err) {
                    alert('Lỗi kết nối tới Server!');
                }
            });
        });

        // Nút Đặt lại mật khẩu
        tbody.querySelectorAll('.btn-reset-pwd').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('resetPasswordUserId').value = btn.getAttribute('data-id');
                document.getElementById('resetPasswordUsername').textContent = btn.getAttribute('data-username');
                document.getElementById('newPasswordInput').value = '';
                const modalEl = document.getElementById('resetPasswordModal');
                const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modal.show();

                const btnSubmit = document.getElementById('btnSubmitResetPassword');
                const newBtn = btnSubmit.cloneNode(true);
                btnSubmit.parentNode.replaceChild(newBtn, btnSubmit);
                newBtn.addEventListener('click', async () => {
                    const userId = document.getElementById('resetPasswordUserId').value;
                    const newPwd = document.getElementById('newPasswordInput').value.trim();
                    if (!newPwd) { alert('Vui lòng nhập mật khẩu mới!'); return; }
                    try {
                        newBtn.textContent = 'Đang xử lý...';
                        newBtn.disabled = true;
                        const res = await fetch(`/api/Users/${userId}/reset-password`, {
                            method: 'POST',
                            headers: _userHeaders,
                            body: JSON.stringify({ newPassword: newPwd })
                        });
                        if (res.ok) {
                            alert('Đặt lại mật khẩu thành công!');
                            modal.hide();
                        } else {
                            alert('Có lỗi xảy ra!');
                        }
                    } catch (err) {
                        alert('Lỗi kết nối tới Server!');
                    } finally {
                        newBtn.textContent = 'Xác nhận';
                        newBtn.disabled = false;
                    }
                });
            });
        });

        // Nút Xóa
        tbody.querySelectorAll('.btn-delete-user-row').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = btn.getAttribute('data-id');
                const username = btn.getAttribute('data-name');
                const msgEl = document.getElementById('deleteUserMessage');
                if (msgEl) msgEl.innerHTML = `Bạn có chắc chắn muốn xóa người dùng <strong>"${username}"</strong>?<br>Hành động này không thể hoàn tác.`;
                const deleteModalEl = document.getElementById('deleteUserModal');
                const deleteModal = bootstrap.Modal.getInstance(deleteModalEl) || new bootstrap.Modal(deleteModalEl);
                deleteModal.show();

                const btnConfirm = document.getElementById('btnConfirmDeleteUser');
                const newConfirm = btnConfirm.cloneNode(true);
                btnConfirm.parentNode.replaceChild(newConfirm, btnConfirm);
                newConfirm.addEventListener('click', async () => {
                    try {
                        newConfirm.textContent = 'Đang xóa...';
                        newConfirm.disabled = true;
                        const res = await fetch(`/api/Users/${userId}`, { method: 'DELETE', headers: _userHeaders });
                        if (res.ok || res.status === 204) {
                            deleteModal.hide();
                            await fetchAndRenderUsers();
                        } else {
                            alert('Không thể xóa người dùng!');
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
    renderUserPagination(totalPages);
}

function renderUserPagination(totalPages) {
    const paginationEl = document.getElementById('user-pagination-controls');
    if (!paginationEl) return;
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

    const btnStyle = (isActive) =>
        `style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid ${isActive ? 'var(--primary-color)' : '#E0E5F2'};background:${isActive ? 'var(--primary-color)' : 'white'};color:${isActive ? 'white' : '#4a5568'};font-weight:500;font-size:14px;cursor:pointer;transition:all 0.2s ease;"`;

    let html = `<button onclick="changeUserPage(${userCurrentPage - 1})" ${userCurrentPage === 1 ? 'disabled' : ''}
        style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid #E0E5F2;background:white;color:#4a5568;font-weight:500;font-size:14px;cursor:pointer;">‹</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="changeUserPage(${i})" ${btnStyle(i === userCurrentPage)}>${i}</button>`;
    }
    html += `<button onclick="changeUserPage(${userCurrentPage + 1})" ${userCurrentPage === totalPages ? 'disabled' : ''}
        style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid #E0E5F2;background:white;color:#4a5568;font-weight:500;font-size:14px;cursor:pointer;">›</button>`;
    paginationEl.innerHTML = html;
}

function changeUserPage(page) {
    const pageSize = parseInt(document.getElementById('user-filter-page-size')?.value || '12');
    const totalPages = Math.ceil(allUsers.length / pageSize);
    if (page < 1 || page > totalPages) return;
    userCurrentPage = page;
    applyUserFilters();
}

function openEditUserModal(u) {
    document.getElementById('editUserId').value = u.id;
    document.getElementById('editUserUsername').value = u.username || '';
    document.getElementById('editUserFullName').value = u.fullName || '';
    document.getElementById('editUserEmail').value = u.email || '';
    document.getElementById('editUserPhone').value = u.phone || '';

    const roleSelect = document.getElementById('editUserRole');
    if (roleSelect) [...roleSelect.options].forEach(opt => { opt.selected = opt.value === (u.role || ''); });

    const branchSelect = document.getElementById('editUserBranchId');
    if (branchSelect) [...branchSelect.options].forEach(opt => { opt.selected = String(opt.value) === String(u.branchId || ''); });

    const activeSelect = document.getElementById('editUserIsActive');
    if (activeSelect) activeSelect.value = String(u.isActive === true);

    const editModalEl = document.getElementById('editUserModal');
    const editModal = bootstrap.Modal.getInstance(editModalEl) || new bootstrap.Modal(editModalEl);
    editModal.show();

    const btnSubmit = document.getElementById('btnSubmitEditUser');
    const newBtn = btnSubmit.cloneNode(true);
    btnSubmit.parentNode.replaceChild(newBtn, btnSubmit);

    newBtn.addEventListener('click', async () => {
        const userId = document.getElementById('editUserId').value;
        const username = document.getElementById('editUserUsername').value.trim();
        const fullName = document.getElementById('editUserFullName').value.trim();
        const email = document.getElementById('editUserEmail').value.trim();
        const phone = document.getElementById('editUserPhone').value.trim();
        const role = document.getElementById('editUserRole').value;
        const branchId = document.getElementById('editUserBranchId').value;
        const isActive = document.getElementById('editUserIsActive').value === 'true';

        if (!username || !role) {
            alert('Vui lòng nhập tên đăng nhập và chọn vai trò!');
            return;
        }

        const payload = {
            username, fullName, email, phone, role, isActive,
            branchId: branchId ? parseInt(branchId) : null
        };
        try {
            newBtn.textContent = 'Đang lưu...';
            newBtn.disabled = true;
            const res = await fetch(`/api/Users/${userId}`, {
                method: 'PUT',
                headers: _userHeaders,
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                editModal.hide();
                await fetchAndRenderUsers();
            } else {
                const errText = await res.text();
                console.error('API error:', errText);
                alert('Có lỗi xảy ra, không thể cập nhật người dùng!');
            }
        } catch (err) {
            console.error('Lỗi sửa người dùng:', err);
            alert('Lỗi kết nối tới Server!');
        } finally {
            newBtn.textContent = 'Lưu thay đổi';
            newBtn.disabled = false;
        }
    });
}