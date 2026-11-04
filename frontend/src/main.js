// Hàm giải mã JWT Token (Base64 Decode)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

document.getElementById('btnLogin').addEventListener('click', async (e) => {
  const userVal = document.getElementById('username').value;
  const passVal = document.getElementById('password').value;

  const loginData = {
    username: userVal,
    password: passVal
  };

  try {
    const response = await fetch('/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();

    if (result.authenticated === true && result.token) {
      // 1. Lưu Token vào localStorage (Quan trọng nhất)
      localStorage.setItem('accessToken', result.token);

      // 2. Giải mã Token để lấy Role và Username
      const payload = decodeJWT(result.token);

      if (payload) {
        // Lưu Role và Username để dùng cho Dashboard
        localStorage.setItem('userRole', payload.roles);
        localStorage.setItem('username', payload.sub);

        console.log("Đã lưu Role:", payload.roles);

        // 3. Điều hướng theo Role
        if (payload.roles.toUpperCase() === 'PARENT') {
          // Đóng Modal đăng nhập
          const modalEl = document.getElementById('loginModal');
          if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
          }
          // Cập nhật lại thanh Navbar
          checkLoginState();
          // alert("Đăng nhập thành công! Hãy chọn khóa học ở bên dưới nhé.");
        } else {
          // Các role khác vào thẳng Dashboard
          window.location.href = '/dashboard.html';
        }
      } else {
        alert("Lỗi: Token không hợp lệ!");
      }

    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }

  } catch (error) {
    console.error("Lỗi kết nối:", error);
    alert("Lỗi hệ thống! Khải kiểm tra lại Backend hoặc Vite Proxy nhé.");
  }
});

// Load các khóa học đang mở
function renderCourseFilters(classes) {
  const filterBar = document.getElementById('courseFilters');
  if (!filterBar) return;
  const levels = [...new Set(classes.map(c => c.level).filter(Boolean))];
  filterBar.innerHTML = '<button class="course-filter-chip active" data-level="all">Tất cả</button>' + levels.map(level => `<button class="course-filter-chip" data-level="${level}">${level}</button>`).join('');
  filterBar.querySelectorAll('.course-filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.course-filter-chip').forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
      const selected = btn.dataset.level;
      document.querySelectorAll('.course-item').forEach(item => {
        item.style.display = selected === 'all' || item.dataset.level === selected ? '' : 'none';
      });
    });
  });
}

async function loadClasses() {
  try {
    const res = await fetch('/api/classes');
    // const res = await fetch("/api/classes"); // Dùng Vite Proxy để tránh lỗi CORS khi chạy ở localhost
    if (res.ok) {
      const classes = await res.json();
      const listContainer = document.getElementById('coursesList');
      if (!listContainer) return;
      solop = classes.length;
      const solophocElement = document.querySelector('.solophoc');
      if (solophocElement) {
        solophocElement.textContent = solop;
      }
      listContainer.innerHTML = '';

      const openClasses = classes.filter(c => c.isCompleted === false);
      renderCourseFilters(openClasses);

      if (openClasses.length === 0) {
        listContainer.innerHTML = `
          <div class="col-12">
            <div class="text-center py-5">
              <i class="fa-solid fa-book-open" style="font-size:3rem;color:#e2e8f0;margin-bottom:16px;display:block;"></i>
              <p class="text-muted" style="font-size:1.1rem;">Hiện tại không có khóa học nào đang mở.</p>
            </div>
          </div>`;
        return;
      }

      const courseImage = './src/assets/combo_intensive.webp';
      const gradients = [
        'linear-gradient(135deg, #ff589e 0%, #ff7eb3 100%)',
        'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
        'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
        'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
      ];

      openClasses.forEach((c, idx) => {
        const branchName = c.branchName || "Đang cập nhật";
        const branchId = c.branchId || null;
        const price = c.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.price) : "Liên hệ";
        const gradient = gradients[idx % gradients.length];
        const levelBadge = c.level
          ? `<span class="course-card-level">${c.level}</span>`
          : '';

        listContainer.innerHTML += `
          <div class="col-lg-4 col-md-6 mb-4 course-item" data-level="${c.level || 'Khác'}">
            <div class="course-card">
              <div class="course-card-header">
                <div class="course-card-gradient" style="background: ${gradient};">
                  <div class="course-card-icon">
                    <i class="fa-solid fa-graduation-cap"></i>
                  </div>
                  ${levelBadge}
                </div>
                <img class="course-card-image" src="${courseImage}" alt="${c.name}">
              </div>
              <div class="course-card-body">
                <h5 class="course-card-title">${c.name}</h5>
                <div class="course-card-info">
                  <div class="course-card-info-item">
                    <i class="fa-solid fa-building"></i>
                    <span>${branchName}</span>
                  </div>
                  <div class="course-card-info-item">
                    <i class="fa-solid fa-money-bill-wave"></i>
                    <span class="course-card-price">${price}</span>
                  </div>
                </div>
                <button class="course-card-btn" onclick="openEnrollModal(${c.id}, '${c.name.replace(/'/g, "\\'")}', ${branchId})">
                  <i class="fa-solid fa-paper-plane me-2"></i>Đăng ký ngay
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }
  } catch (e) {
    console.error("Lỗi tải lớp học:", e);
  }
}

// Đăng ký tài khoản
if (document.getElementById('btnSubmitRegisterAccount')) {
  document.getElementById('btnSubmitRegisterAccount').addEventListener('click', async () => {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const fullName = document.getElementById('regFullName').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;

    if (!username || !password || !fullName || !phone) {
      alert("Vui lòng điền đủ các thông tin bắt buộc!");
      return;
    }

    const payload = {
      username, password, fullName, phone, email,
      role: "PARENT",
      isActive: true
    };

    try {
      const res = await fetch('/api/Users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Đăng ký tài khoản thành công! Vui lòng dùng tài khoản vừa tạo để Đăng nhập.");
        const modal = bootstrap.Modal.getInstance(document.getElementById('registerAccountModal'));
        modal.hide();
        document.getElementById('username').value = username;
        document.getElementById('password').value = password;
      } else {
        alert("Đăng ký thất bại, có thể tên đăng nhập đã tồn tại.");
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi kết nối tới server.");
    }
  });
}

// Mở modal đăng ký lớp
window.openEnrollModal = (classId, className, branchId) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert("Vui lòng Đăng nhập tài khoản phụ huynh trước khi đăng ký lớp học!");
    document.getElementById('username').focus();
    return;
  }

  document.getElementById('enrollClassId').value = classId;
  document.getElementById('enrollBranchId').value = branchId;
  document.getElementById('enrollClassName').value = className;

  const modal = new bootstrap.Modal(document.getElementById('enrollClassModal'));
  modal.show();
};

// Gửi form đăng ký lớp
if (document.getElementById('btnSubmitEnroll')) {
  document.getElementById('btnSubmitEnroll').addEventListener('click', async () => {
    const classId = document.getElementById('enrollClassId').value;
    const branchId = document.getElementById('enrollBranchId').value;
    const studentName = document.getElementById('enrollStudentName').value;
    const dateOfBirth = document.getElementById('enrollDob').value;
    const username = localStorage.getItem('username'); // lấy username của phụ huynh đang đăng nhập
    const token = localStorage.getItem('accessToken');

    if (!studentName) {
      alert("Vui lòng nhập tên học sinh!");
      return;
    }

    const payload = {
      classId: parseInt(classId),
      branchId: branchId && branchId !== "null" ? parseInt(branchId) : null,
      studentName,
      dateOfBirth,
      username
    };

    try {
      const res = await fetch('/api/parent/enrollment-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Gửi đơn đăng ký thành công! Vui lòng chờ Trung tâm liên hệ và duyệt.");
        const modal = bootstrap.Modal.getInstance(document.getElementById('enrollClassModal'));
        modal.hide();
        // Reset form
        document.getElementById('enrollStudentName').value = '';
        document.getElementById('enrollDob').value = '';
      } else {
        const err = await res.text();
        alert("Lỗi đăng ký: " + err);
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi kết nối tới server.");
    }
  });
}

// Kiểm tra trạng thái đăng nhập trên trang chủ
function checkLoginState() {
  const token = localStorage.getItem('accessToken');
  const username = localStorage.getItem('username');

  const guestItems = document.querySelectorAll('.guest-only');
  const authItems = document.querySelectorAll('.auth-only');
  const navUsername = document.getElementById('nav-username');

  if (token && username) {
    // Đã đăng nhập
    guestItems.forEach(el => el.style.setProperty('display', 'none', 'important'));
    authItems.forEach(el => el.style.setProperty('display', 'inline-block', 'important'));
    if (navUsername) navUsername.textContent = username;
  } else {
    // Chưa đăng nhập
    guestItems.forEach(el => el.style.setProperty('display', 'inline-block', 'important'));
    authItems.forEach(el => el.style.setProperty('display', 'none', 'important'));
  }
}

window.logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('studentId');
  localStorage.removeItem('classId');
  window.location.reload();
}

if (document.getElementById('nav-logout-btn')) {
  document.getElementById('nav-logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

// Load danh sách lớp khi vào trang
window.addEventListener('DOMContentLoaded', () => {
  loadClasses();
  checkLoginState();
});
