// Import profile page functions
import * as ProfileModule from './pages/profile.js';
import * as ClassDetailModule from './pages/class-detail.js';
import * as LessonModule from './pages/lesson.js';
import * as ClassModule from './pages/class.js';
import * as ReviewModule from './pages/review.js';
import * as ExamModule from './pages/exam.js';
import * as UserModule from './pages/user.js';
import * as ParentModule from './pages/parent.js';
import * as StudentModule from './pages/student.js';
import * as BranchModule from './pages/branch.js';
import * as TeacherModule from './pages/teacher.js';
import * as EnrollmentRequestModule from './pages/enrollment-request.js';
import * as ParentEnrollmentModule from './pages/parent-enrollment.js';
import * as RevenueModule from './pages/revenue.js';
import * as PaymentModule from './pages/payment.js';
import * as LessonDetailModule from './pages/lesson-detail.js';

// Hàm tải trang bên cạnh loadPage cho phép chạy js khi load xong html
async function loadDashboardContent(pageName, initCallback) {
    const contentArea = document.getElementById('content-area') ||
        document.querySelector('.dashboard-wrap .main-content');

    if (!contentArea) return;

    try {
        contentArea.innerHTML = "<p style='padding: 20px;'>Đang tải dữ liệu...</p>";
        const response = await fetch(`/pages/${pageName}.html`);
        const html = await response.text();
        contentArea.innerHTML = html;
        if (typeof initCallback === 'function') initCallback();
    } catch (err) {
        console.error(`Lỗi tải trang ${pageName}:`, err);
        contentArea.innerHTML = "<p style='color: red;'>Không thể tải nội dung.</p>";
    }
}
window.loadDashboardContent = loadDashboardContent;
window.initClassPage = ClassModule.initClassPage;
window.initClassDetailPage = ClassDetailModule.initClassDetailPage;
window.initLessonPage = LessonModule.initLessonPage;
window.initReviewPage = ReviewModule.initReviewPage;
window.initExamPage = ExamModule.initExamPage;
window.initUserPage = UserModule.initUserPage;
window.initParentPage = ParentModule.initParentPage;
window.initStudentPage = StudentModule.initStudentPage;
window.initBranchPage = BranchModule.initBranchPage;
window.initTeacherPage = TeacherModule.initTeacherPage;
window.initEnrollmentRequestPage = EnrollmentRequestModule.initEnrollmentRequestPage;
window.initParentEnrollmentPage = ParentEnrollmentModule.initParentEnrollmentPage;
window.initRevenuePage = RevenueModule.initRevenuePage;
window.initPaymentPage = PaymentModule.initPaymentPage;
window.initLessonDetailPage = LessonDetailModule.initLessonDetailPage;

// Hiển thị màn hình từ chối truy cập
function showAccessDenied(container) {
    if (!container) return;
    container.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 400px;
            gap: 16px;
            padding: 40px;
            text-align: center;
        ">
            <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #f3e8ff, #ede9fe);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 8px;
            ">
                <i class="fa-solid fa-lock" style="font-size: 32px; color: #7c3aed;"></i>
            </div>
            <h2 style="
                font-size: 22px;
                font-weight: 700;
                color: #1e293b;
                margin: 0;
            ">Không có quyền truy cập</h2>
            <p style="
                font-size: 14px;
                color: #64748b;
                margin: 0;
                max-width: 320px;
            ">Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.</p>
            <button onclick="history.back()" style="
                margin-top: 8px;
                padding: 10px 28px;
                background: #7c3aed;
                color: #fff;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            " onmouseover="this.style.background='#6d28d9'" onmouseout="this.style.background='#7c3aed'">
                Quay lại
            </button>
        </div>
    `;
}

// ngay khi load xong giao diện dashboard
document.addEventListener('DOMContentLoaded', () => {
    // --- Hiển thị thông tin user ---
    const savedUsername = localStorage.getItem('username');
    const savedRole = localStorage.getItem('userRole');
    if (savedUsername) {
        const usernameEl = document.getElementById('header-username');
        if (usernameEl) usernameEl.textContent = savedUsername;
    }
    if (savedRole) {
        const roleEl = document.getElementById('header-role');
        if (roleEl) {
            const roleMap = {
                'OWNER': 'Chủ trung tâm',
                'BRANCH_MANAGER': 'Quản lý chi nhánh',
                'TEACHER': 'Giáo viên',
                'PARENT': 'Phụ huynh',
                'STUDENT': 'Học sinh',
                'ADMIN': 'Quản trị viên'
            };
            roleEl.textContent = roleMap[savedRole.toUpperCase()] || savedRole;
        }
    }

    // --- Lớp 1: Ẩn nav item bị cấm theo role ---
    const currentRole = (localStorage.getItem('userRole') || '').toUpperCase();
    if (currentRole === 'TEACHER') {
        // TEACHER không được truy cập: Người dùng, Chi nhánh, Giáo viên, Duyệt học viên, Lợi nhuận
        ['user', 'branch', 'teacher', 'enrollment-request', 'revenue'].forEach(page => {
            const navItem = document.querySelector(`.sidebar .nav-item[data-page="${page}"]`);
            if (navItem) navItem.style.display = 'none';
        });
    }

    if (currentRole === 'PARENT' || currentRole === 'STUDENT') {
        // PARENT và STUDENT không thấy toàn bộ mục "Quản lý" (dropdown + các sub-item)
        const manageBtn = document.querySelector('.sidebar .nav-item.has-dropdown');
        if (manageBtn) manageBtn.style.display = 'none';
        const manageDropdown = document.getElementById('manage-dropdown-content');
        if (manageDropdown) manageDropdown.style.display = 'none';

        const parentEnrollBtn = document.getElementById('nav-parent-enrollment');
        const paymentBtn = document.getElementById('nav-payment');
        if (currentRole === 'PARENT') {
            if (parentEnrollBtn) parentEnrollBtn.style.display = 'flex';
            if (paymentBtn) paymentBtn.style.display = 'flex';
        } else {
            if (parentEnrollBtn) parentEnrollBtn.style.display = 'none';
            if (paymentBtn) paymentBtn.style.display = 'none';
        }

        // Đánh dấu body để CSS ẩn tất cả nút thêm/sửa/xóa
        document.body.classList.add('parent-readonly');
    }

    // Chỉ OWNER và BRANCH_MANAGER mới thấy mục Lợi Nhuận
    const navRevenue = document.getElementById('nav-revenue');
    if (navRevenue) {
        const canSeeRevenue = ['OWNER', 'BRANCH_MANAGER', 'ADMIN'].includes(currentRole);
        if (!canSeeRevenue) navRevenue.style.display = 'none';
    }

    // --- Dropdown toggle ---
    const userBtn = document.getElementById('user-header-btn');
    const dropdown = document.getElementById('user-header-dropdown');
    const caret = document.getElementById('user-caret');

    if (userBtn && dropdown) {
        userBtn.addEventListener('click', (e) => {
            // Ngăn click vào item bên trong bubble lên đây
            if (e.target.closest('#user-header-dropdown')) return;
            const isOpen = dropdown.classList.toggle('show');
            if (caret) caret.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        // Đóng khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!userBtn.contains(e.target)) {
                dropdown.classList.remove('show');
                if (caret) caret.style.transform = 'rotate(0deg)';
            }
        });
    }

    // --- Đăng xuất ---
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            localStorage.removeItem('studentId');
            localStorage.removeItem('classId');
            window.location.href = '/index.html';
        });
    }

    // --- Thông tin cá nhân ---
    const btnProfile = document.getElementById('btn-profile');
    if (btnProfile) {
        btnProfile.addEventListener('click', () => {
            dropdown.classList.remove('show');
            if (caret) caret.style.transform = 'rotate(0deg)';
            // Điều hướng tới trang profile
            loadDashboardContent('profile', ProfileModule.initProfilePage);
            // Bỏ active tất cả nav items
            document.querySelectorAll('.dashboard-wrap .sidebar .nav-item').forEach(i => i.classList.remove('active'));
        });
    }

    // --- Đổi mật khẩu ---
    const btnChangePwd = document.getElementById('btn-change-password');
    if (btnChangePwd) {
        btnChangePwd.addEventListener('click', () => {
            dropdown.classList.remove('show');
            if (caret) caret.style.transform = 'rotate(0deg)';
            document.querySelectorAll('.dashboard-wrap .sidebar .nav-item').forEach(i => i.classList.remove('active'));
            loadDashboardContent('change-password', ProfileModule.initChangePasswordPage);
        });
    }

    // --- Cài đặt ---
    const btnSettings = document.getElementById('btn-settings');
    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            dropdown.classList.remove('show');
            if (caret) caret.style.transform = 'rotate(0deg)';
            alert('Tính năng cài đặt đang được phát triển.');
        });
    }
})
document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".dashboard-wrap .sidebar .nav-item");
    const contentArea = document.querySelector(".dashboard-wrap .main-content");
    // Định nghĩa quyền truy cập: page nào chỉ cho phép role nào
    const PAGE_PERMISSIONS = {
        'user': ['ADMIN', 'OWNER', 'BRANCH_MANAGER'],
        'branch': ['ADMIN', 'OWNER', 'BRANCH_MANAGER'],
        'teacher': ['ADMIN', 'OWNER', 'BRANCH_MANAGER'],
        'enrollment-request': ['ADMIN', 'OWNER', 'BRANCH_MANAGER'],
        'parent-enrollment': ['PARENT'],
        'payment': ['PARENT'],
        'revenue': ['ADMIN', 'OWNER', 'BRANCH_MANAGER']
        // Các page khác không giới hạn role
    };

    async function loadPage(pageName) {
        // --- Lớp 2: Guard kiểm tra quyền trước khi load trang ---
        const role = (localStorage.getItem('userRole') || '').toUpperCase();
        const allowedRoles = PAGE_PERMISSIONS[pageName];
        if (allowedRoles && !allowedRoles.includes(role)) {
            showAccessDenied(contentArea);
            return;
        }

        try {
            // Tạm thời hiển thị chữ Đang tải
            contentArea.innerHTML = "<p style='padding: 20px;'>Đang tải dữ liệu...</p>";

            // Gọi tới thư mục pages để lấy file html tương ứng
            const response = await fetch(`/pages/${pageName}.html`);

            // Nếu lấy thành công, bóc tách ra thành chữ viết (HTML)
            const html = await response.text();

            // Nhồi đống HTML đó vào trong khu vực trống
            contentArea.innerHTML = html;

            if (pageName === 'dashboard-home') {
                fetchDashboardStats();
            } else if (pageName === 'class') {
                ClassModule.initClassPage();
            } else if (pageName === 'class-detail') {
                ClassDetailModule.initClassDetailPage();
            } else if (pageName === 'lesson') {
                LessonModule.initLessonPage();
            } else if (pageName === 'lesson-detail') {
                LessonDetailModule.initLessonDetailPage();
            } else if (pageName === 'review') {
                ReviewModule.initReviewPage();
            } else if (pageName === 'exam') {
                ExamModule.initExamPage();
            } else if (pageName === 'user') {
                UserModule.initUserPage();
            } else if (pageName === 'parent') {
                ParentModule.initParentPage();
            } else if (pageName === 'student') {
                StudentModule.initStudentPage();
            } else if (pageName === 'branch') {
                BranchModule.initBranchPage();
            } else if (pageName === 'teacher') {
                TeacherModule.initTeacherPage();
            } else if (pageName === 'profile') {
                ProfileModule.initProfilePage();
            } else if (pageName === 'change-password') {
                ProfileModule.initChangePasswordPage();
            } else if (pageName === 'enrollment-request') {
                EnrollmentRequestModule.initEnrollmentRequestPage();
            } else if (pageName === 'parent-enrollment') {
                ParentEnrollmentModule.initParentEnrollmentPage();
            } else if (pageName === 'payment') {
                PaymentModule.initPaymentPage();
            } else if (pageName === 'revenue') {
                RevenueModule.initRevenuePage();
            }
        } catch (error) {
            console.error("Lỗi khi nạp trang:", error);
            contentArea.innerHTML = "<p style='color: red;'>Không thể tải nội dung.</p>";
        }
    }
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const isDropdownTrigger = this.classList.contains('has-dropdown');
            const isSubItem = this.closest('.dropdown-container') !== null;

            if (isDropdownTrigger) {
                // Trường hợp 1: Click vào "Quản lý" (Nút có thả xuống)
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active'); // Giữ active ở nút Quản lý

                this.classList.toggle('dropdown-open');
                const dropdownContent = this.nextElementSibling;
                if (dropdownContent && dropdownContent.classList.contains('dropdown-container')) {
                    dropdownContent.classList.toggle('show');
                }

                // Nếu bạn có set data-page cho nút Quản lý thì nó vẫn chạy
                const targetPage = this.getAttribute('data-page');
                if (targetPage) loadPage(targetPage);

            } else if (isSubItem) {
                // Trường hợp 2: Click vào 1 nút bên trong menu thả xuống (Người dùng, Học sinh, ...)
                const targetPage = this.getAttribute('data-page');
                if (targetPage) loadPage(targetPage);

                // Thu dropdown vào
                const dropdownContent = this.closest('.dropdown-container');
                if (dropdownContent) {
                    dropdownContent.classList.remove('show');
                    const trigger = dropdownContent.previousElementSibling;
                    if (trigger && trigger.classList.contains('has-dropdown')) {
                        trigger.classList.remove('dropdown-open');
                        // Đảm bảo active vẫn ở nút Quản lý
                        navItems.forEach(nav => nav.classList.remove('active'));
                        trigger.classList.add('active');
                    }
                }

                // (Tuỳ chọn) Nếu bạn muốn nút con cũng đổi màu một chút thì add class:
                // this.classList.add('active-sub'); // (Bạn có thể bỏ qua dòng này)

            } else {
                // Trường hợp 3: Click vào các trang bình thường (Dashboard, Lớp học, ...)
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

                // Tự động đóng dropdown nếu nó đang mở
                const openDropdowns = document.querySelectorAll('.dropdown-container.show');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                    const trigger = dropdown.previousElementSibling;
                    if (trigger && trigger.classList.contains('has-dropdown')) {
                        trigger.classList.remove('dropdown-open');
                    }
                });

                const targetPage = this.getAttribute('data-page');
                if (targetPage) loadPage(targetPage);
            }
        });
    });
    // Gọi hàm nạp trang ở lần tải giao diện đầu tiên
    loadPage('dashboard-home');

})

// Dashboard Home
let dashboardStudentChart = null;
let dashboardClassBranchChart = null;
let learningScoreChart = null;

async function renderLearningDashboard(role) {
    const root = document.getElementById('role-dashboard-root');
    const adminDashboard = document.getElementById('admin-dashboard-content');
    if (!root) return;

    if (adminDashboard) adminDashboard.style.display = 'none';

    const username = localStorage.getItem('username') || (role === 'PARENT' ? 'Phụ huynh' : 'Học sinh');
    const isParent = role === 'PARENT';
    const token = localStorage.getItem('accessToken');
    const apiBase = isParent ? '/api/parent' : '/api/student';
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    root.innerHTML = '<div class="learning-panel p-4 text-muted">Đang tải dữ liệu dashboard...</div>';

    const [classes, lessons, reviews, exams, results] = await Promise.all([
        fetchLearningList(`${apiBase}/my-classes`, headers),
        fetchLearningList(`${apiBase}/my-lessons`, headers),
        fetchLearningList(`${apiBase}/my-reviews`, headers),
        fetchLearningList(`${apiBase}/my-exams`, headers),
        fetchLearningList(`${apiBase}/my-exam-results`, headers)
    ]);

    const students = groupResultsByStudent(results);
    const scoredResults = results.map(result => ({ ...result, averageScore: getExamAverage(result) })).filter(result => result.averageScore !== null);
    const avgScore = scoredResults.length ? average(scoredResults.map(result => result.averageScore)).toFixed(1) : 'Chưa có';
    const sortedResults = [...scoredResults].sort((a, b) => getResultTime(a) - getResultTime(b));
    const latestResult = sortedResults[sortedResults.length - 1] || null;
    const completedLessons = lessons.filter(lesson => parseDate(lesson.lessonDate) < startOfToday()).length;
    const upcomingLessons = lessons.filter(lesson => parseDate(lesson.lessonDate) >= startOfToday()).sort((a, b) => parseDate(a.lessonDate) - parseDate(b.lessonDate));
    const lowScoreCount = scoredResults.filter(result => result.averageScore < 5).length;
    const examDoneIds = new Set(results.map(result => result.examId).filter(Boolean));
    const pendingExamCount = exams.filter(exam => !examDoneIds.has(exam.id)).length;
    const latestReview = [...reviews].sort((a, b) => parseDateTime(b.createdAt || b.lessonDate) - parseDateTime(a.createdAt || a.lessonDate))[0] || null;
    const profileTitle = isParent ? `${classes.length} lớp đang theo dõi` : `${classes.length} lớp đang học`;
    const heroText = isParent
        ? 'Theo dõi điểm, lớp, lịch học và nhận xét của học sinh.'
        : 'Theo dõi điểm số, lớp học, lịch học và nhận xét của bạn.';
    const displayName = username;

    root.innerHTML = `
        <section class="learning-dashboard ${isParent ? 'parent-dashboard' : 'student-dashboard'}">
            <div class="learning-hero">
                <div>
                    <span class="learning-badge">${isParent ? 'Phụ huynh' : 'Học sinh'}</span>
                    <h2>Xin chào, ${username}</h2>
                    <p>${heroText}</p>
                    <div class="learning-actions">
                        <button class="learning-primary-action" data-href="${isParent ? '/index.html' : ''}" data-page="${isParent ? '' : 'lesson'}">
                            <i class="fa-solid ${isParent ? 'fa-magnifying-glass' : 'fa-book-open'}"></i>
                            ${isParent ? 'Xem khóa học' : 'Xem bài học'}
                        </button>
                        <button class="learning-secondary-action" data-page="exam">
                            <i class="fa-solid fa-file-lines"></i>
                            Xem bài kiểm tra
                        </button>
                    </div>
                </div>
                <div class="learning-hero-card">
                    <div class="hero-avatar"><i class="fa-solid ${isParent ? 'fa-people-roof' : 'fa-graduation-cap'}"></i></div>
                    <p>${profileTitle}</p>
                    <strong>${displayName}</strong>
                    <span>${profileTitle}</span>
                </div>
            </div>

            ${isParent ? renderStudentSummary(students, results) : ''}

            <div class="learning-stat-grid">
                ${renderLearningStat('Điểm trung bình', avgScore, 'fa-chart-line', `${results.length} kết quả`, 'blue')}
                ${renderLearningStat('Buổi đã học', String(completedLessons), 'fa-calendar-check', `${lessons.length} buổi tổng`, 'green')}
                ${renderLearningStat('Bài kiểm tra gần nhất', latestResult ? latestResult.averageScore.toFixed(1) : 'Chưa có', 'fa-file-circle-check', latestResult?.examTitle || 'Chưa có kết quả', 'purple')}
                ${renderLearningStat(isParent ? 'Cần chú ý' : 'Bài chưa có điểm', String(isParent ? lowScoreCount : pendingExamCount), 'fa-bell', isParent ? 'Kết quả dưới 5' : 'Bài kiểm tra chưa hoàn tất', 'orange')}
            </div>

            <div class="learning-main-grid">
                <div class="learning-panel learning-chart-panel">
                    <div class="learning-panel-head">
                        <div>
                            <h5>Xu hướng điểm số</h5>
                            <p>${scoredResults.length ? `${Math.min(scoredResults.length, 6)} kết quả gần nhất` : 'Chưa có dữ liệu điểm'}</p>
                        </div>
                        <span class="trend-up"><i class="fa-solid fa-rotate"></i> Dữ liệu cập nhật</span>
                    </div>
                    <div class="learning-chart-wrap"><canvas id="learningScoreChart"></canvas></div>
                </div>

                <div class="learning-panel">
                    <div class="learning-panel-head">
                        <div>
                            <h5>${isParent ? 'Cảnh báo học tập' : 'Việc cần làm'}</h5>
                            <p>${isParent ? 'Ưu tiên theo dõi trong tuần' : 'Ưu tiên hoàn thành hôm nay'}</p>
                        </div>
                    </div>
                    <div class="learning-list">
                        ${renderLearningItem('fa-clock', 'Buổi học sắp tới', upcomingLessons[0] ? formatDate(upcomingLessons[0].lessonDate) : 'Chưa có lịch', 'info')}
                        ${renderLearningItem('fa-clipboard-check', 'Nhận xét mới nhất', latestReview?.comment || 'Chưa có nhận xét', 'success')}
                        ${renderLearningItem('fa-triangle-exclamation', isParent ? 'Kết quả dưới 5' : 'Bài chưa có điểm', isParent ? `${lowScoreCount} kết quả` : `${pendingExamCount} bài`, (lowScoreCount || pendingExamCount) ? 'warning' : 'success')}
                    </div>
                </div>
            </div>

            <div class="learning-panel learning-quick-panel">
                <div class="learning-panel-head">
                    <div>
                        <h5>Truy cập nhanh</h5>
                        <p>${isParent ? 'Các mục phụ huynh hay dùng' : 'Các mục học sinh hay dùng'}</p>
                    </div>
                </div>
                <div class="learning-shortcuts">
                    ${renderShortcut('exam', 'fa-clipboard-list', 'Điểm & bài kiểm tra')}
                    ${renderShortcut('lesson', 'fa-calendar-days', 'Lịch học')}
                    ${isParent ? renderShortcut('payment', 'fa-credit-card', 'Học phí') : renderShortcut('class', 'fa-users', 'Lớp học')}
                    ${renderShortcut('profile', 'fa-user-gear', 'Thông tin cá nhân')}
                </div>
            </div>
        </section>
    `;

    root.querySelectorAll('[data-page]').forEach(button => {
        button.addEventListener('click', () => {
            const href = button.dataset.href;
            if (href) {
                window.location.href = href;
                return;
            }

            const page = button.dataset.page;
            if (page === 'profile') {
                loadDashboardContent('profile', ProfileModule.initProfilePage);
                document.querySelectorAll('.dashboard-wrap .sidebar .nav-item').forEach(item => item.classList.remove('active'));
                return;
            }

            const navItem = document.querySelector(`.dashboard-wrap .sidebar .nav-item[data-page="${page}"]`);
            if (navItem) navItem.click();
        });
    });

    renderLearningScoreChart(scoredResults.slice(-6));
}

async function fetchLearningList(url, headers) {
    const response = await fetch(url, { headers });
    if (!response.ok) return [];
    const data = await response.json();
    return normalizeApiList(data);
}

function groupResultsByStudent(results) {
    const map = new Map();
    results.forEach(result => {
        if (!result.studentId) return;
        if (!map.has(result.studentId)) {
            map.set(result.studentId, { id: result.studentId, name: result.studentName || `Học sinh #${result.studentId}` });
        }
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

function renderStudentSummary(students, results) {
    if (!students.length) return '';
    return `
        <div class="learning-panel student-summary-panel">
            <div class="learning-panel-head">
                <div>
                    <h5>Tổng quan từng con</h5>
                    <p>Được tách riêng theo học sinh</p>
                </div>
            </div>
            <div class="student-summary-grid">
                ${students.map(student => {
        const studentResults = results.filter(result => result.studentId === student.id);
        const scores = studentResults.map(getExamAverage).filter(score => score !== null);
        const avg = scores.length ? average(scores).toFixed(1) : 'Chưa có';
        return `<div class="student-summary-card"><strong>${student.name}</strong><span>${studentResults.length} kết quả</span><b>${avg}</b></div>`;
    }).join('')}
            </div>
        </div>
    `;
}

function renderLearningStat(label, value, icon, note, color) {
    return `
        <div class="learning-stat-card ${color}">
            <div>
                <p>${label}</p>
                <h3>${value}</h3>
                <span>${note}</span>
            </div>
            <i class="fa-solid ${icon}"></i>
        </div>
    `;
}

function renderLearningItem(icon, title, desc, type) {
    return `
        <div class="learning-list-item ${type}">
            <div><i class="fa-solid ${icon}"></i></div>
            <section>
                <strong>${title}</strong>
                <span>${desc}</span>
            </section>
        </div>
    `;
}

function renderShortcut(page, icon, label) {
    return `
        <button class="learning-shortcut" data-page="${page}">
            <i class="fa-solid ${icon}"></i>
            <span>${label}</span>
        </button>
    `;
}

function renderLearningScoreChart(items = []) {
    const canvas = document.getElementById('learningScoreChart');
    if (!canvas) return;

    if (!items.length) {
        canvas.parentElement.innerHTML = '<div class="text-muted h-100 d-flex align-items-center justify-content-center">Chưa có kết quả kiểm tra</div>';
        return;
    }

    if (typeof Chart === 'undefined') {
        canvas.parentElement.innerHTML = '<div class="text-muted h-100 d-flex align-items-center justify-content-center">Không tải được Chart.js</div>';
        return;
    }

    if (learningScoreChart) learningScoreChart.destroy();

    learningScoreChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: items.map(item => item.examTitle || formatDate(item.examDate) || 'Bài kiểm tra'),
            datasets: [{
                label: 'Điểm trung bình',
                data: items.map(item => item.averageScore),
                borderColor: '#7b4bef',
                backgroundColor: 'rgba(123,75,239,0.12)',
                fill: true,
                tension: 0.42,
                pointRadius: 4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#7b4bef',
                pointBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 10, grid: { color: 'rgba(148,163,184,0.18)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function getExamAverage(result) {
    const scores = [result.speakingScore, result.listeningScore, result.readingWritingScore]
        .map(parseScore)
        .filter(score => score !== null);
    return scores.length ? average(scores) : null;
}

function parseScore(value) {
    if (value === null || value === undefined || value === '') return null;
    const number = Number(String(value).replace(',', '.'));
    return Number.isFinite(number) ? number : null;
}

function average(values) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function parseDate(value) {
    if (!value) return new Date(0);
    return new Date(value);
}

function parseDateTime(value) {
    if (!value) return new Date(0);
    return new Date(value);
}

function startOfToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

function getResultTime(result) {
    return parseDateTime(result.examDate || result.createdAt).getTime();
}

function formatDate(value) {
    if (!value) return 'Chưa có';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Chưa có';
    return date.toLocaleDateString('vi-VN');
}

async function fetchDashboardStats() {
    const role = (localStorage.getItem('userRole') || '').toUpperCase();
    if (role === 'PARENT' || role === 'STUDENT') {
        renderLearningDashboard(role);
        return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const dateEl = document.getElementById('admin-dashboard-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    try {
        // 1. Lấy độ dài mảng các lớp học
        const resClass = await fetch('/api/classes', { headers });
        if (resClass.ok) {
            const data = await resClass.json();
            const classes = normalizeApiList(data);
            document.getElementById('stat-class').textContent = classes.length;
            renderClassByBranchChart(classes);
        }

        // 2. Chi nhánh
        const resBranch = await fetch('/api/branches', { headers });
        if (resBranch.ok) {
            const data = await resBranch.json();
            const branchCount = Array.isArray(data) ? data.length : (data.result ? data.result.length : 0);
            document.getElementById('stat-branch').textContent = branchCount;
        }

        // 3. Học sinh
        const resStudent = await fetch('/api/students', { headers });
        if (resStudent.ok) {
            const data = await resStudent.json();
            const students = normalizeApiList(data);
            document.getElementById('stat-student').textContent = students.length;
            renderStudentMonthlyChart(students);
        }

        // 4. Giáo viên
        const resTeacher = await fetch('/api/teachers', { headers });
        if (resTeacher.ok) {
            const data = await resTeacher.json();
            const teacherCount = Array.isArray(data) ? data.length : (data.result ? data.result.length : 0);
            document.getElementById('stat-teacher').textContent = teacherCount;
        }

        // 5. Buổi học
        const resLesson = await fetch('/api/lessons', { headers });
        if (resLesson.ok) {
            const data = await resLesson.json();
            const lessons = Array.isArray(data) ? data : (data.result ? data.result : []);
            // Tổng buổi học
            document.getElementById('stat-lesson').textContent = lessons.length;
            // Buổi học tháng này
            const now = new Date();
            const lessonThisMonth = lessons.filter(l => {
                if (!l.lessonDate) return false;
                const d = new Date(l.lessonDate);
                return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
            }).length;
            document.getElementById('stat-lesson-month').textContent = lessonThisMonth;
        }

        // 6. Tổng bài kiểm tra
        const resExam = await fetch('/api/exams', { headers });
        if (resExam.ok) {
            const data = await resExam.json();
            const examCount = Array.isArray(data) ? data.length : (data.result ? data.result.length : 0);
            document.getElementById('stat-exam-total').textContent = examCount;
        }


        // --- Nút "Lớp học" ở dashboard-home: chuyển sang trang class và mở modal tạo lớp ---
        const btnQuickCreateClass = document.getElementById('btn-quick-create-class');
        if (btnQuickCreateClass) {
            btnQuickCreateClass.addEventListener('click', () => {
                // 1. Kích hoạt nav item "Lớp học" trên sidebar
                const navItems = document.querySelectorAll('.dashboard-wrap .sidebar .nav-item');
                navItems.forEach(nav => nav.classList.remove('active'));
                const classNavItem = [...navItems].find(nav => nav.getAttribute('data-page') === 'class');
                if (classNavItem) classNavItem.classList.add('active');

                // 2. Tải trang class, sau đó mở modal tạo lớp
                const contentArea = document.querySelector('.dashboard-wrap .main-content');
                contentArea.innerHTML = "<p style='padding: 20px;'>Đang tải dữ liệu...</p>";
                fetch('/pages/class.html')
                    .then(res => res.text())
                    .then(html => {
                        contentArea.innerHTML = html;
                        initClassPage();
                        // 3. Mở modal tạo lớp học sau khi trang đã render
                        const modalEl = document.getElementById('createClassModal');
                        if (modalEl) {
                            const modal = new bootstrap.Modal(modalEl);
                            modal.show();
                        }
                    })
                    .catch(err => console.error('Lỗi tải trang class:', err));
            });
        }

        // --- Nút "Học sinh": chuyển sang trang student và mở modal tạo mới ---
        const btnQuickCreateStudent = document.getElementById('btn-quick-create-student');
        if (btnQuickCreateStudent) {
            btnQuickCreateStudent.addEventListener('click', () => {
                // Kích hoạt nút cha "Quản lý" trên sidebar (student nằm trong dropdown)
                const navItems = document.querySelectorAll('.dashboard-wrap .sidebar .nav-item');
                navItems.forEach(nav => nav.classList.remove('active'));
                const manageBtn = document.querySelector('.dashboard-wrap .sidebar .nav-item.has-dropdown');
                if (manageBtn) manageBtn.classList.add('active');

                const contentArea = document.querySelector('.dashboard-wrap .main-content');
                contentArea.innerHTML = "<p style='padding: 20px;'>Đang tải dữ liệu...</p>";
                fetch('/pages/student.html')
                    .then(res => res.text())
                    .then(html => {
                        contentArea.innerHTML = html;
                        initStudentPage();
                        const modalEl = document.getElementById('createStudentModal');
                        if (modalEl) new bootstrap.Modal(modalEl).show();
                    })
                    .catch(err => console.error('Lỗi tải trang student:', err));
            });
        }

        // --- Nút "Buổi học": chuyển sang trang lesson và mở modal tạo mới ---
        const btnQuickCreateLesson = document.getElementById('btn-quick-create-lesson');
        if (btnQuickCreateLesson) {
            btnQuickCreateLesson.addEventListener('click', () => {
                const navItems = document.querySelectorAll('.dashboard-wrap .sidebar .nav-item');
                navItems.forEach(nav => nav.classList.remove('active'));
                const lessonNavItem = [...navItems].find(nav => nav.getAttribute('data-page') === 'lesson');
                if (lessonNavItem) lessonNavItem.classList.add('active');

                const contentArea = document.querySelector('.dashboard-wrap .main-content');
                contentArea.innerHTML = "<p style='padding: 20px;'>Đang tải dữ liệu...</p>";
                fetch('/pages/lesson.html')
                    .then(res => res.text())
                    .then(html => {
                        contentArea.innerHTML = html;
                        initLessonPage();
                        const modalEl = document.getElementById('createLessonModal');
                        if (modalEl) new bootstrap.Modal(modalEl).show();
                    })
                    .catch(err => console.error('Lỗi tải trang lesson:', err));
            });
        }

        // --- Nút "Bài kiểm tra": chuyển sang trang exam và mở modal tạo mới ---
        const btnQuickCreateExam = document.getElementById('btn-quick-create-exam');
        if (btnQuickCreateExam) {
            btnQuickCreateExam.addEventListener('click', () => {
                const navItems = document.querySelectorAll('.dashboard-wrap .sidebar .nav-item');
                navItems.forEach(nav => nav.classList.remove('active'));
                const examNavItem = [...navItems].find(nav => nav.getAttribute('data-page') === 'exam');
                if (examNavItem) examNavItem.classList.add('active');

                const contentArea = document.querySelector('.dashboard-wrap .main-content');
                contentArea.innerHTML = "<p style='padding: 20px;'>Đang tải dữ liệu...</p>";
                fetch('/pages/exam.html')
                    .then(res => res.text())
                    .then(html => {
                        contentArea.innerHTML = html;
                        initExamPage();
                        const modalEl = document.getElementById('createExamModal');
                        if (modalEl) new bootstrap.Modal(modalEl).show();
                    })
                    .catch(err => console.error('Lỗi tải trang exam:', err));
            });
        }
    } catch (err) {
        console.error("Lỗi fetch dashboard:", err);
    }
}
// End Dashboard Home

function normalizeApiList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    if (Array.isArray(data?.data)) return data.data;
    return [];
}

function getLastTwelveMonths() {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            label: `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
        });
    }
    return months;
}

function renderStudentMonthlyChart(students) {
    const canvas = document.getElementById('studentMonthlyChart');
    if (!canvas) return;

    if (typeof Chart === 'undefined') {
        canvas.parentElement.innerHTML = '<div class="text-muted h-100 d-flex align-items-center justify-content-center">Không tải được Chart.js</div>';
        return;
    }

    const months = getLastTwelveMonths();
    const studentCreatedDates = students.map(student => {
        const rawDate = student.createdAt || student.createdDate || student.createAt;
        if (!rawDate) return null;

        const createdDate = new Date(rawDate);
        if (Number.isNaN(createdDate.getTime())) return null;
        return createdDate;
    }).filter(Boolean);

    if (dashboardStudentChart) {
        dashboardStudentChart.destroy();
    }

    const chartValues = months.map(month => {
        const [year, monthNumber] = month.key.split('-').map(Number);
        const endOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999);
        return studentCreatedDates.filter(createdDate => createdDate <= endOfMonth).length;
    });
    const maxValue = Math.max(...chartValues);
    const yMax = maxValue <= 1 ? 1 : Math.ceil(maxValue * 1.15);

    dashboardStudentChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: months.map(month => month.label),
            datasets: [{
                label: 'Số học sinh',
                data: chartValues,
                backgroundColor: '#6fbb19',
                borderColor: '#3b82f6',
                borderWidth: 0,
                borderRadius: 0,
                categoryPercentage: 0.8,
                barPercentage: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#3b82f6',
                        boxWidth: 16,
                        boxHeight: 12,
                        padding: 14,
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: context => `${context.parsed.y} học sinh`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { color: '#94a3b8' },
                    ticks: { color: '#64748b', font: { size: 14 } }
                },
                y: {
                    beginAtZero: true,
                    max: yMax,
                    ticks: {
                        color: '#64748b',
                        font: { size: 13 },
                        callback: value => Number(value).toString()
                    },
                    border: { color: '#94a3b8' },
                    grid: {
                        color: '#e2e8f0',
                        borderDash: [4, 4]
                    }
                }
            }
        }
    });
}

function renderClassByBranchChart(classes) {
    const canvas = document.getElementById('classByBranchChart');
    if (!canvas) return;

    if (typeof Chart === 'undefined') {
        canvas.parentElement.innerHTML = '<div class="text-muted h-100 d-flex align-items-center justify-content-center">Không tải được Chart.js</div>';
        return;
    }

    const countsByBranch = {};
    classes.forEach(classItem => {
        const branchName = classItem.branchName || (classItem.branchId ? `Chi nhánh ${classItem.branchId}` : 'Chưa có chi nhánh');
        countsByBranch[branchName] = (countsByBranch[branchName] || 0) + 1;
    });

    const sortedEntries = Object.entries(countsByBranch).sort((a, b) => b[1] - a[1]);
    const labels = sortedEntries.map(([branchName]) => branchName);
    const values = sortedEntries.map(([, count]) => count);
    const maxValue = Math.max(...values, 0);
    const yMax = maxValue <= 1 ? 1 : Math.ceil(maxValue * 1.15);

    if (dashboardClassBranchChart) {
        dashboardClassBranchChart.destroy();
    }

    dashboardClassBranchChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Số lớp học',
                data: values,
                backgroundColor: '#6fbb19',
                borderColor: '#3b82f6',
                borderWidth: 0,
                borderRadius: 0,
                categoryPercentage: 0.75,
                barPercentage: 0.9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#3b82f6',
                        boxWidth: 16,
                        boxHeight: 12,
                        padding: 14,
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: context => `${context.parsed.y} lớp học`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { color: '#94a3b8' },
                    ticks: {
                        color: '#64748b',
                        font: { size: 12 },
                        maxRotation: 0,
                        callback: function (value) {
                            const label = this.getLabelForValue(value);
                            return label.length > 12 ? `${label.slice(0, 12)}...` : label;
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: yMax,
                    ticks: {
                        precision: 0,
                        color: '#64748b',
                        font: { size: 13 },
                        callback: value => Number(value).toString()
                    },
                    border: { color: '#94a3b8' },
                    grid: {
                        color: '#e2e8f0',
                        borderDash: [4, 4]
                    }
                }
            }
        }
    });
}







