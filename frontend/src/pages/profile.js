// ================================================
// PROFILE PAGE LOGIC
// ================================================
let currentProfileData = null;

export async function initProfilePage() {
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
        'ADMIN': 'Quản trị viên',
        'STUDENT': 'Học sinh'
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
            // Import loadDashboardContent from parent
            if (window.loadDashboardContent) {
                window.loadDashboardContent('change-password', initChangePasswordPage);
            }
        });
    }
}

export async function initChangePasswordPage() {
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

    const goBackToProfile = () => {
        if (window.loadDashboardContent) {
            window.loadDashboardContent('profile', initProfilePage);
        }
    };

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
