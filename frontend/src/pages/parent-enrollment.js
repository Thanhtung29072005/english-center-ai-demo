// ======================= PARENT ENROLLMENT PAGE =======================
let allParentEnrollments = [];

export async function initParentEnrollmentPage() {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    if (!token || !username) return;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const tbody = document.getElementById('parentEnrollmentTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">Đang tải dữ liệu...</td></tr>';

    try {
        const res = await fetch(`/api/parent/enrollment-requests?username=${username}`, { headers });
        if (res.ok) {
            allParentEnrollments = await res.json();

            if (allParentEnrollments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">Bạn chưa đăng ký khóa học nào.</td></tr>';
                return;
            }
            let choDuyet = 0;
            let daDuyet = 0;
            let tuChoi = 0;
            let tongDon = 0;
            allParentEnrollments.forEach(enroll => {
                if (enroll.status === 'PENDING') {
                    choDuyet++;
                } else if (enroll.status === 'APPROVED') {
                    daDuyet++;
                } else if (enroll.status === 'REJECTED') {
                    tuChoi++;
                }
                tongDon++;
            });
            document.getElementById('parentStatPending').innerText = choDuyet;
            document.getElementById('parentStatApproved').innerText = daDuyet;
            document.getElementById('parentStatRejected').innerText = tuChoi;
            document.getElementById('parentStatTotal').innerText = tongDon;

            setupParentEnrollmentFilters();
            
            const activeTab = document.querySelector('#parentEnrollStatusTabs .parent-enroll-tab.active');
            const activeStatus = activeTab ? activeTab.dataset.status : 'ALL';
            renderParentEnrollments(activeStatus);
        } else {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-danger">Không thể tải dữ liệu từ Server.</td></tr>';
        }
    } catch (err) {
        console.error("Lỗi fetch parent enrollment:", err);
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-danger">Lỗi kết nối.</td></tr>';
    }
}

function renderParentEnrollments(statusFilter) {
    const tbody = document.getElementById('parentEnrollmentTableBody');
    if (!tbody) return;

    let filteredEnrollments = allParentEnrollments;
    if (statusFilter !== 'ALL') {
        filteredEnrollments = allParentEnrollments.filter(e => e.status === statusFilter);
    }

    if (filteredEnrollments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">Không có đơn đăng ký nào.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    filteredEnrollments.forEach(enroll => {
        const createdAt = enroll.createdAt ? new Date(enroll.createdAt).toLocaleString('vi-VN') : 'N/A';

        let statusBadge = '';
        if (enroll.status === 'PENDING') statusBadge = '<span class="badge bg-warning text-dark">Đang chờ duyệt</span>';
        else if (enroll.status === 'APPROVED') statusBadge = '<span class="badge bg-success">Đã duyệt (Thành công)</span>';
        else if (enroll.status === 'REJECTED') statusBadge = '<span class="badge bg-danger">Đã bị từ chối</span>';
        else statusBadge = `<span class="badge bg-secondary">${enroll.status}</span>`;

        const priceFmt = enroll.classPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(enroll.classPrice) : 'Liên hệ trung tâm';
        const accountInfo = enroll.status === 'APPROVED' && enroll.studentUsername
            ? `<div class="fw-semibold text-primary">${enroll.studentUsername}</div><div class="small text-muted">Mật khẩu: 123456</div>`
            : '<span class="text-muted small">Chưa cấp</span>';
        const row = `
            <tr>
                <td class="ps-4"><strong>#${enroll.id}</strong></td>
                <td><span class="fw-medium">${enroll.studentName}</span></td>
                <td><span class="text-primary">${enroll.className || 'N/A'}</span></td>
                <td>${enroll.branchName || 'N/A'}</td>
                <td class="text-danger fw-bold">${priceFmt}</td>
                <td>${accountInfo}</td>
                <td>${statusBadge}</td>
                <td class="text-muted small">${createdAt}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function setupParentEnrollmentFilters() {
    const tabsContainer = document.getElementById('parentEnrollStatusTabs');
    if (!tabsContainer || tabsContainer.dataset.eventsBound) return;
    tabsContainer.dataset.eventsBound = 'true';

    const tabs = tabsContainer.querySelectorAll('.parent-enroll-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const status = tab.dataset.status;
            renderParentEnrollments(status);
        });
    });
}