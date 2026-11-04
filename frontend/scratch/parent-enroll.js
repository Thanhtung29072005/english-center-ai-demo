
// ═══════════════════════════════════════════════════════════════
// PARENT ENROLLMENT PAGE
// ═══════════════════════════════════════════════════════════════

window.initParentEnrollmentPage = function() {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

    // ── Fetch statistics ──
    const fetchStatCounts = async () => {
        try {
            const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
                fetch('/api/parent/enrollments?status=PENDING', { headers }),
                fetch('/api/parent/enrollments?status=APPROVED', { headers }),
                fetch('/api/parent/enrollments?status=REJECTED', { headers })
            ]);

            const counts = {
                PENDING: 0,
                APPROVED: 0,
                REJECTED: 0,
                ALL: 0
            };

            if (pendingRes.ok) {
                const data = await pendingRes.json();
                counts.PENDING = Array.isArray(data) ? data.length : (data.result ? data.result.length : 0);
            }
            if (approvedRes.ok) {
                const data = await approvedRes.json();
                counts.APPROVED = Array.isArray(data) ? data.length : (data.result ? data.result.length : 0);
            }
            if (rejectedRes.ok) {
                const data = await rejectedRes.json();
                counts.REJECTED = Array.isArray(data) ? data.length : (data.result ? data.result.length : 0);
            }

            counts.ALL = counts.PENDING + counts.APPROVED + counts.REJECTED;

            const setPending = document.getElementById('parentStatPending');
            const setApproved = document.getElementById('parentStatApproved');
            const setRejected = document.getElementById('parentStatRejected');
            const setTotal = document.getElementById('parentStatTotal');

            if (setPending) setPending.textContent = counts.PENDING;
            if (setApproved) setApproved.textContent = counts.APPROVED;
            if (setRejected) setRejected.textContent = counts.REJECTED;
            if (setTotal) setTotal.textContent = counts.ALL;
        } catch (err) {
            console.error('Error fetching parent enrollment stats:', err);
        }
    };

    // ── Fetch and render enrollments ──
    const fetchAndRenderEnrollments = async () => {
        const status = document.getElementById('parentEnrollmentStatusFilter')?.value || 'ALL';
        const tbody = document.getElementById('parentEnrollmentTableBody');
        if (!tbody) return;

        tbody.innerHTML = `<tr><td colspan="7">
            <div class="parent-enroll-loading-state">
                <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                Đang tải dữ liệu...
            </div>
        </td></tr>`;

        try {
            const endpoint = status === 'ALL' 
                ? '/api/parent/enrollments' 
                : `/api/parent/enrollments?status=${status}`;
            const res = await fetch(endpoint, { headers });

            if (res.ok) {
                const data = await res.json();
                const enrollments = Array.isArray(data) ? data : (data.result ? data.result : []);

                if (enrollments.length === 0) {
                    const emptyLabel = status === 'PENDING' ? 'Không có đơn nào đang chờ duyệt'
                        : status === 'APPROVED' ? 'Chưa có đơn nào được duyệt'
                        : status === 'REJECTED' ? 'Chưa có đơn nào bị từ chối'
                        : 'Không có đơn đăng ký nào';
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
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        }) : '—';

                    // Format fee
                    const fee = enroll.fee || enroll.tuitionFee || 0;
                    const feeText = new Intl.NumberFormat('vi-VN', { 
                        style: 'currency', 
                        currency: 'VND' 
                    }).format(fee);

                    // Status badge
                    let statusBadge = '';
                    if (enroll.status === 'PENDING')
                        statusBadge = '<span class="parent-enroll-badge parent-enroll-badge-pending"><i class="fa-regular fa-clock"></i>Chờ duyệt</span>';
                    else if (enroll.status === 'APPROVED')
                        statusBadge = '<span class="parent-enroll-badge parent-enroll-badge-approved"><i class="fa-solid fa-circle-check"></i>Đã duyệt</span>';
                    else if (enroll.status === 'REJECTED')
                        statusBadge = '<span class="parent-enroll-badge parent-enroll-badge-rejected"><i class="fa-solid fa-circle-xmark"></i>Từ chối</span>';
                    else
                        statusBadge = `<span class="parent-enroll-badge parent-enroll-badge-default">${enroll.status}</span>`;

                    const row = `
                        <tr>
                            <td>
                                <span class="parent-enroll-id-chip"><i class="fa-solid fa-hashtag" style="font-size:10px;"></i>${enroll.id}</span>
                            </td>
                            <td>
                                <div class="parent-enroll-student-name">${enroll.studentName || '—'}</div>
                                <div class="parent-enroll-student-dob"><i class="fa-regular fa-calendar me-1"></i>${dob}</div>
                            </td>
                            <td>
                                <span class="parent-enroll-class-pill">
                                    <i class="fa-solid fa-book-open" style="font-size:11px;"></i>
                                    ${enroll.className || 'N/A'}
                                </span>
                            </td>
                            <td>
                                <span class="parent-enroll-branch-text">
                                    <i class="fa-regular fa-building me-1" style="color:#94a3b8;"></i>${enroll.branchName || 'N/A'}
                                </span>
                            </td>
                            <td>
                                <span class="parent-enroll-fee-text">${feeText}</span>
                            </td>
                            <td>${statusBadge}</td>
                            <td><span class="parent-enroll-date-text">${createdAt}</span></td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', row);
                });

            } else {
                tbody.innerHTML = `<tr><td colspan="7">
                    <div class="parent-enroll-empty-state">
                        <div class="parent-enroll-empty-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div class="parent-enroll-empty-text">Không thể tải dữ liệu từ Server</div>
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

    // ── Tab filter UI ──
    const tabs = document.querySelectorAll('#parentEnrollStatusTabs .parent-enroll-tab');
    const hiddenSelect = document.getElementById('parentEnrollmentStatusFilter');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const status = tab.getAttribute('data-status');
            if (hiddenSelect) hiddenSelect.value = status;
            fetchAndRenderEnrollments();
        });
    });

    // ── Initial load ──
    fetchStatCounts();
    fetchAndRenderEnrollments();
};
