// =============================================
//   TRANG LỢI NHUẬN (Revenue Report)
// =============================================
let _revenueChartPie = null;
let _revenueChartBar = null;

export async function initRevenuePage() {
    const token = localStorage.getItem('accessToken');
    const userRole = (localStorage.getItem('userRole') || '').toUpperCase();

    if (!token) {
        window.location.href = '/index.html';
        return;
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // --- Hiển thị scope badge & banner theo role ---
    renderScopeUI(userRole);

    const loadingEl = document.getElementById('revenue-loading');
    const emptyEl = document.getElementById('revenue-empty');
    const accordionEl = document.getElementById('revenue-accordion');

    // Gắn sự kiện nút Làm mới
    const btnRefresh = document.getElementById('btnRefreshRevenue');
    if (btnRefresh) btnRefresh.addEventListener('click', initRevenuePage);

    await fetchAndRenderRevenue(headers, loadingEl, emptyEl, accordionEl, userRole);
}

/**
 * Render scope badge (góc phải header) và scope banner (dưới header).
 * OWNER/ADMIN → xanh lá, badge "Toàn hệ thống"
 * BRANCH_MANAGER → tím, badge "Chi nhánh của tôi"
 */
function renderScopeUI(role) {
    const badge = document.getElementById('revenue-scope-badge');
    const banner = document.getElementById('revenue-scope-banner');
    const label = document.getElementById('stat-total-revenue-label');

    if (role === 'OWNER' || role === 'ADMIN') {
        if (badge) {
            badge.innerHTML = `
                <span style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,rgba(16,185,129,.12),rgba(52,211,153,.08));
                    border:1px solid rgba(16,185,129,.3);color:#059669;border-radius:20px;padding:5px 14px;font-size:0.8rem;font-weight:600;">
                    <i class="fa-solid fa-globe" style="font-size:11px;"></i>Toàn hệ thống
                </span>`;
        }
        if (banner) {
            banner.style.display = 'block';
            banner.innerHTML = `
                <div style="display:flex;align-items:center;gap:12px;padding:14px 20px;border-radius:12px;
                    background:linear-gradient(135deg,rgba(16,185,129,.06),rgba(52,211,153,.04));
                    border:1px solid rgba(16,185,129,.2);">
                    <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#10b981,#34d399);
                        display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <i class="fa-solid fa-globe text-white" style="font-size:15px;"></i>
                    </div>
                    <div>
                        <div style="font-weight:700;font-size:0.9rem;color:#065f46;">Bạn đang xem báo cáo toàn hệ thống</div>
                        <div style="font-size:0.8rem;color:#6b7280;">Hiển thị doanh thu của tất cả chi nhánh trong hệ thống</div>
                    </div>
                </div>`;
        }
        if (label) label.textContent = 'Tổng Doanh Thu';

    } else if (role === 'BRANCH_MANAGER') {
        if (badge) {
            badge.innerHTML = `
                <span style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(129,140,248,.08));
                    border:1px solid rgba(99,102,241,.3);color:#4f46e5;border-radius:20px;padding:5px 14px;font-size:0.8rem;font-weight:600;">
                    <i class="fa-regular fa-building" style="font-size:11px;"></i>Chi nhánh của tôi
                </span>`;
        }
        if (banner) {
            banner.style.display = 'block';
            banner.innerHTML = `
                <div style="display:flex;align-items:center;gap:12px;padding:14px 20px;border-radius:12px;
                    background:linear-gradient(135deg,rgba(99,102,241,.06),rgba(129,140,248,.04));
                    border:1px solid rgba(99,102,241,.2);">
                    <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#818cf8);
                        display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <i class="fa-regular fa-building text-white" style="font-size:15px;"></i>
                    </div>
                    <div>
                        <div style="font-weight:700;font-size:0.9rem;color:#312e81;">Bạn đang xem báo cáo chi nhánh của mình</div>
                        <div style="font-size:0.8rem;color:#6b7280;">Chỉ hiển thị doanh thu từ chi nhánh bạn quản lý</div>
                    </div>
                </div>`;
        }
        if (label) label.textContent = 'Doanh Thu Chi Nhánh';
    }
}



async function fetchAndRenderRevenue(headers, loadingEl, emptyEl, accordionEl, userRole) {
    if (loadingEl) loadingEl.style.display = 'block';
    if (emptyEl) emptyEl.style.display = 'none';
    if (accordionEl) accordionEl.innerHTML = '';

    try {
        const res = await fetch('/api/reports/revenue', { headers });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();

        const totalRevenue = data.totalRevenue || 0;
        const branchRevenues = data.branchRevenues || [];
        const fmt = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

        // --- Overview cards ---
        const statTotal = document.getElementById('stat-total-revenue');
        if (statTotal) statTotal.textContent = fmt(totalRevenue);

        const statBranch = document.getElementById('stat-branch-count');
        if (statBranch) statBranch.textContent = branchRevenues.length;

        let totalStudents = 0;
        branchRevenues.forEach(b => (b.classRevenues || []).forEach(c => { totalStudents += (c.studentCount || 0); }));
        const statStudents = document.getElementById('stat-total-students');
        if (statStudents) statStudents.textContent = totalStudents;

        if (loadingEl) loadingEl.style.display = 'none';

        if (branchRevenues.length === 0) {
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }

        // --- Render charts ---
        const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];
        const branchLabels = branchRevenues.map(b => b.branchName);
        const branchValues = branchRevenues.map(b => Number(b.totalRevenue || 0));

        // Pie chart
        const pieCtx = document.getElementById('revenueByBranchChart');
        if (pieCtx) {
            if (_revenueChartPie) _revenueChartPie.destroy();
            _revenueChartPie = new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: branchLabels,
                    datasets: [{ data: branchValues, backgroundColor: COLORS, borderWidth: 2, borderColor: '#fff' }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 12 } },
                        tooltip: { callbacks: { label: (ctx) => ` ${fmt(ctx.raw)}` } }
                    },
                    cutout: '60%'
                }
            });
        }

        // Bar chart
        const barCtx = document.getElementById('revenueBarChart');
        if (barCtx) {
            if (_revenueChartBar) _revenueChartBar.destroy();
            _revenueChartBar = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: branchLabels,
                    datasets: [{
                        label: 'Doanh thu (VNĐ)',
                        data: branchValues,
                        backgroundColor: COLORS.slice(0, branchLabels.length),
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${fmt(ctx.raw)}` } } },
                    scales: {
                        y: { ticks: { callback: (v) => (v >= 1e6 ? (v / 1e6).toFixed(0) + 'tr' : v), font: { size: 11 } }, grid: { color: '#f1f5f9' } },
                        x: { ticks: { font: { size: 11 } }, grid: { display: false } }
                    }
                }
            });
        }

        // --- Accordion chi tiết từng chi nhánh ---
        branchRevenues.forEach((branch, idx) => {
            const classes = branch.classRevenues || [];
            const branchTotal = Number(branch.totalRevenue || 0);
            const collapseId = `branch-collapse-${idx}`;

            let classRows = '';
            if (classes.length === 0) {
                classRows = `<tr><td colspan="5" class="text-center text-muted py-3 fst-italic">Chi nhánh chưa có lớp học nào</td></tr>`;
            } else {
                classes.forEach(cls => {
                    const priceText = cls.price ? fmt(cls.price) : '<span class="text-muted fst-italic">Chưa đặt</span>';
                    const revenueText = Number(cls.totalRevenue) > 0
                        ? `<span class="fw-bold text-success">${fmt(cls.totalRevenue)}</span>`
                        : '<span class="text-muted">0 ₫</span>';
                    classRows += `
                        <tr>
                            <td class="ps-3">
                                <span class="fw-semibold">${cls.className || '—'}</span>
                                ${cls.level ? `<span class="badge ms-2" style="background:rgba(99,102,241,.1);color:#6366f1;font-size:0.75rem;">Level ${cls.level}</span>` : ''}
                            </td>
                            <td>${priceText}</td>
                            <td class="text-center">
                                <span class="badge" style="background:rgba(245,158,11,.1);color:#f59e0b;font-weight:600;">${cls.studentCount || 0} HS</span>
                            </td>
                            <td>${revenueText}</td>
                        </tr>`;
                });
            }

            const branchCard = `
                <div class="border rounded-3 overflow-hidden" style="border-color:#e2e8f0!important;">
                    <div class="d-flex align-items-center justify-content-between p-3 bg-light" 
                         style="cursor:pointer;" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                        <div class="d-flex align-items-center gap-3">
                            <div style="width:36px;height:36px;border-radius:10px;background:${COLORS[idx % COLORS.length]};display:flex;align-items:center;justify-content:center;">
                                <i class="fa-regular fa-building text-white" style="font-size:14px;"></i>
                            </div>
                            <div>
                                <div class="fw-bold" style="color:#1e293b;">${branch.branchName || '—'}</div>
                                <div class="text-muted" style="font-size:0.8rem;">${classes.length} lớp học</div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <div class="fw-bold" style="font-size:1.1rem;color:${COLORS[idx % COLORS.length]};">${fmt(branchTotal)}</div>
                            <i class="fa-solid fa-chevron-down text-muted" style="font-size:12px;transition:.3s;"></i>
                        </div>
                    </div>
                    <div class="collapse" id="${collapseId}">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0 align-middle">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3" style="font-size:0.82rem;">Tên Lớp</th>
                                        <th style="font-size:0.82rem;">Học Phí</th>
                                        <th class="text-center" style="font-size:0.82rem;">Số HS</th>
                                        <th style="font-size:0.82rem;">Doanh Thu</th>
                                    </tr>
                                </thead>
                                <tbody>${classRows}</tbody>
                                <tfoot>
                                    <tr class="table-light">
                                        <td colspan="3" class="ps-3 fw-bold">Tổng chi nhánh</td>
                                        <td class="fw-bold text-success">${fmt(branchTotal)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>`;
            accordionEl.insertAdjacentHTML('beforeend', branchCard);
        });

    } catch (err) {
        console.error('Lỗi fetch revenue:', err);
        if (loadingEl) loadingEl.style.display = 'none';
        if (accordionEl) accordionEl.innerHTML = `<div class="text-center text-danger py-4"><i class="fa-solid fa-circle-exclamation me-2"></i>Lỗi kết nối tới Server!</div>`;
    }
}


// ═══════════════════════════════════════════════════════════════
// PARENT ENROLLMENT PAGE
// ═══════════════════════════════════════════════════════════════

window.initParentEnrollmentPage = function () {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    if (!token || !username) return;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Lưu tất cả dữ liệu để filter client-side
    let allEnrollments = [];

    // ── Cập nhật thẻ thống kê từ data ──
    const updateStats = (data) => {
        const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
        data.forEach(e => { if (counts[e.status] !== undefined) counts[e.status]++; });

        const setPending = document.getElementById('parentStatPending');
        const setApproved = document.getElementById('parentStatApproved');
        const setRejected = document.getElementById('parentStatRejected');
        const setTotal = document.getElementById('parentStatTotal');

        if (setPending) setPending.textContent = counts.PENDING;
        if (setApproved) setApproved.textContent = counts.APPROVED;
        if (setRejected) setRejected.textContent = counts.REJECTED;
        if (setTotal) setTotal.textContent = data.length;
    };

    // ── Render bảng từ danh sách ──
    const renderTable = (enrollments) => {
        const tbody = document.getElementById('parentEnrollmentTableBody');
        if (!tbody) return;

        if (enrollments.length === 0) {
            const status = document.getElementById('parentEnrollmentStatusFilter')?.value || 'ALL';
            const emptyLabel = status === 'PENDING' ? 'Không có đơn nào đang chờ duyệt'
                : status === 'APPROVED' ? 'Chưa có đơn nào được duyệt'
                    : status === 'REJECTED' ? 'Chưa có đơn nào bị từ chối'
                        : 'Bạn chưa có đơn đăng ký nào';
            tbody.innerHTML = `<tr><td colspan="7">
                <div class="parent-enroll-empty-state">
                    <div class="parent-enroll-empty-icon"><i class="fa-solid fa-inbox"></i></div>
                    <div class="parent-enroll-empty-text">${emptyLabel}</div>
                    <div class="parent-enroll-empty-sub">Dữ liệu sẽ xuất hiện khi có đơn mới</div>
                </div>
            </td></tr>`;
            return;
        }

        tbody.innerHTML = '';
        enrollments.forEach(enroll => {
            const dob = enroll.dateOfBirth
                ? new Date(enroll.dateOfBirth).toLocaleDateString('vi-VN') : '—';
            const createdAt = enroll.createdAt
                ? new Date(enroll.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }) : '—';

            const fee = enroll.classPrice || 0;
            const feeText = fee > 0
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fee)
                : '—';

            let statusBadge = '';
            if (enroll.status === 'PENDING')
                statusBadge = '<span class="parent-enroll-badge parent-enroll-badge-pending"><i class="fa-regular fa-clock"></i>Chờ duyệt</span>';
            else if (enroll.status === 'APPROVED')
                statusBadge = '<span class="parent-enroll-badge parent-enroll-badge-approved"><i class="fa-solid fa-circle-check"></i>Đã duyệt</span>';
            else if (enroll.status === 'REJECTED')
                statusBadge = '<span class="parent-enroll-badge parent-enroll-badge-rejected"><i class="fa-solid fa-circle-xmark"></i>Từ chối</span>';
            else
                statusBadge = `<span class="parent-enroll-badge parent-enroll-badge-default">${enroll.status}</span>`;

            tbody.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><span class="parent-enroll-id-chip"><i class="fa-solid fa-hashtag" style="font-size:10px;"></i>${enroll.id}</span></td>
                    <td>
                        <div class="parent-enroll-student-name">${enroll.studentName || '—'}</div>
                        <div class="parent-enroll-student-dob"><i class="fa-regular fa-calendar me-1"></i>${dob}</div>
                    </td>
                    <td><span class="parent-enroll-class-pill"><i class="fa-solid fa-book-open" style="font-size:11px;"></i>${enroll.className || 'N/A'}</span></td>
                    <td><span class="parent-enroll-branch-text"><i class="fa-regular fa-building me-1" style="color:#94a3b8;"></i>${enroll.branchName || 'N/A'}</span></td>
                    <td><span class="parent-enroll-fee-text">${feeText}</span></td>
                    <td>${statusBadge}</td>
                    <td><span class="parent-enroll-date-text">${createdAt}</span></td>
                </tr>
            `);
        });
    };

    // ── Fetch tất cả dữ liệu 1 lần duy nhất ──
    const fetchAllEnrollments = async () => {
        const tbody = document.getElementById('parentEnrollmentTableBody');
        if (!tbody) return;

        tbody.innerHTML = `<tr><td colspan="7">
            <div class="parent-enroll-loading-state">
                <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                Đang tải dữ liệu...
            </div>
        </td></tr>`;

        try {
            const res = await fetch(`/api/parent/enrollment-requests?username=${encodeURIComponent(username)}`, { headers });

            if (res.ok) {
                const data = await res.json();
                allEnrollments = Array.isArray(data) ? data : (data.result ? data.result : []);

                // Cập nhật thẻ thống kê
                updateStats(allEnrollments);

                // Render bảng với filter hiện tại
                const currentStatus = document.getElementById('parentEnrollmentStatusFilter')?.value || 'ALL';
                const filtered = currentStatus === 'ALL'
                    ? allEnrollments
                    : allEnrollments.filter(e => e.status === currentStatus);
                renderTable(filtered);

            } else {
                tbody.innerHTML = `<tr><td colspan="7">
                    <div class="parent-enroll-empty-state">
                        <div class="parent-enroll-empty-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div class="parent-enroll-empty-text">Không thể tải dữ liệu (${res.status})</div>
                        <div class="parent-enroll-empty-sub">Vui lòng thử lại sau</div>
                    </div>
                </td></tr>`;
            }
        } catch (err) {
            console.error('Error fetching parent enrollments:', err);
            tbody.innerHTML = `<tr><td colspan="7">
                <div class="parent-enroll-empty-state">
                    <div class="parent-enroll-empty-icon"><i class="fa-solid fa-wifi" style="color:#fca5a5;"></i></div>
                    <div class="parent-enroll-empty-text">Lỗi kết nối tới Server</div>
                    <div class="parent-enroll-empty-sub">Kiểm tra kết nối mạng và thử lại</div>
                </div>
            </td></tr>`;
        }
    };

    // ── Tab filter (client-side, không fetch lại) ──
    const tabs = document.querySelectorAll('#parentEnrollStatusTabs .parent-enroll-tab');
    const hiddenSelect = document.getElementById('parentEnrollmentStatusFilter');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const status = tab.getAttribute('data-status');
            if (hiddenSelect) hiddenSelect.value = status;

            // Filter client-side, không gọi API lại
            const filtered = status === 'ALL'
                ? allEnrollments
                : allEnrollments.filter(e => e.status === status);
            renderTable(filtered);
        });
    });

    // ── Nút làm mới ──
    const refreshBtn = document.querySelector('.parent-enroll-refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchAllEnrollments);
    }

    // ── Load lần đầu ──
    fetchAllEnrollments();
};
