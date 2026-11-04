// ======================= ENROLLMENT REQUEST LOGIC =======================
export async function initEnrollmentRequestPage() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // ── Fetch stat counts (all statuses) for summary cards ──
    const fetchStatCounts = async () => {
        const statuses = ['PENDING', 'APPROVED', 'REJECTED'];
        const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0, ALL: 0 };
        try {
            await Promise.all(statuses.map(async (s) => {
                const r = await fetch(`/api/admin/enrollment-requests?status=${s}`, { headers });
                if (r.ok) {
                    const d = await r.json();
                    const arr = Array.isArray(d) ? d : (d.result ? d.result : []);
                    counts[s] = arr.length;
                    counts.ALL += arr.length;
                }
            }));
        } catch (_) { }
        const setPending = document.getElementById('statEnrollPending');
        const setApproved = document.getElementById('statEnrollApproved');
        const setRejected = document.getElementById('statEnrollRejected');
        const setTotal = document.getElementById('statEnrollTotal');
        if (setPending) setPending.textContent = counts.PENDING;
        if (setApproved) setApproved.textContent = counts.APPROVED;
        if (setRejected) setRejected.textContent = counts.REJECTED;
        if (setTotal) setTotal.textContent = counts.ALL;
    };

    const fetchAndRenderEnrollments = async () => {
        const status = document.getElementById('enrollmentStatusFilter')?.value || 'PENDING';
        const tbody = document.getElementById('enrollmentTableBody');
        if (!tbody) return;

        tbody.innerHTML = `<tr><td colspan="8">
            <div class="enroll-loading-state">
                <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                Đang tải dữ liệu...
            </div>
        </td></tr>`;

        try {
            const res = await fetch(`/api/admin/enrollment-requests?status=${status}`, { headers });
            if (res.ok) {
                const data = await res.json();
                const enrollments = Array.isArray(data) ? data : (data.result ? data.result : []);

                if (enrollments.length === 0) {
                    const emptyLabel = status === 'PENDING' ? 'Không có đơn nào đang chờ duyệt'
                        : status === 'APPROVED' ? 'Chưa có đơn nào được duyệt'
                            : status === 'REJECTED' ? 'Chưa có đơn nào bị từ chối'
                                : 'Không có đơn đăng ký nào';
                    tbody.innerHTML = `<tr><td colspan="8">
                        <div class="enroll-empty-state">
                            <div class="enroll-empty-icon"><i class="fa-solid fa-inbox"></i></div>
                            <div class="enroll-empty-text">${emptyLabel}</div>
                            <div class="enroll-empty-sub">Dữ liệu sẽ xuất hiện khi có đơn mới</div>
                        </div>
                    </td></tr>`;
                    return;
                }

                tbody.innerHTML = '';
                enrollments.forEach(enroll => {
                    const dob = enroll.dateOfBirth
                        ? new Date(enroll.dateOfBirth).toLocaleDateString('vi-VN') : '—';
                    const createdAt = enroll.createdAt
                        ? new Date(enroll.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

                    let statusBadge = '';
                    if (enroll.status === 'PENDING')
                        statusBadge = '<span class="enroll-badge enroll-badge-pending"><i class="fa-regular fa-clock"></i>Chờ duyệt</span>';
                    else if (enroll.status === 'APPROVED')
                        statusBadge = '<span class="enroll-badge enroll-badge-approved"><i class="fa-solid fa-circle-check"></i>Đã duyệt</span>';
                    else if (enroll.status === 'REJECTED')
                        statusBadge = '<span class="enroll-badge enroll-badge-rejected"><i class="fa-solid fa-circle-xmark"></i>Từ chối</span>';
                    else
                        statusBadge = `<span class="enroll-badge enroll-badge-default">${enroll.status}</span>`;

                    let actionHtml = '';
                    if (enroll.status === 'PENDING') {
                        actionHtml = `
                            <button class="enroll-btn-approve btn-approve-enroll" data-id="${enroll.id}" title="Duyệt đơn này">
                                <i class="fa-solid fa-check"></i> Duyệt
                            </button>
                            <button class="enroll-btn-reject btn-reject-enroll" data-id="${enroll.id}" title="Từ chối đơn này">
                                <i class="fa-solid fa-xmark"></i> Từ chối
                            </button>
                        `;
                    }

                    const row = `
                        <tr>
                            <td>
                                <span class="enroll-id-chip"><i class="fa-solid fa-hashtag" style="font-size:10px;"></i>${enroll.id}</span>
                            </td>
                            <td>
                                <div class="enroll-student-name">${enroll.studentName || '—'}</div>
                                <div class="enroll-student-dob"><i class="fa-regular fa-calendar me-1"></i>${dob}</div>
                            </td>
                            <td>
                                <span class="enroll-class-pill">
                                    <i class="fa-solid fa-book-open" style="font-size:11px;"></i>
                                    ${enroll.className || 'N/A'}
                                </span>
                            </td>
                            <td>
                                <span class="enroll-branch-text">
                                    <i class="fa-regular fa-building me-1" style="color:#94a3b8;"></i>${enroll.branchName || 'N/A'}
                                </span>
                            </td>
                            <td>
                                <div class="enroll-parent-name"><i class="fa-solid fa-user me-1" style="color:#94a3b8;font-size:12px;"></i>${enroll.parentName || 'N/A'}</div>
                                <div class="enroll-parent-phone"><i class="fa-solid fa-phone" style="color:#94a3b8;"></i>${enroll.parentPhone || '—'}</div>
                            </td>
                            <td>${statusBadge}</td>
                            <td><span class="enroll-date-text">${createdAt}</span></td>
                            <td>
                                <div class="d-flex justify-content-end gap-2 flex-wrap">
                                    ${actionHtml}
                                </div>
                            </td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', row);
                });

                // Approve handler
                document.querySelectorAll('.btn-approve-enroll').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const id = e.currentTarget.getAttribute('data-id');
                        if (confirm(`Bạn có chắc chắn muốn DUYỆT đơn đăng ký #${id}?\nHệ thống sẽ tự động tạo học sinh mới.`)) {
                            const btnEl = e.currentTarget;
                            const origHTML = btnEl.innerHTML;
                            try {
                                btnEl.disabled = true;
                                btnEl.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Đang xử lý...';
                                const r = await fetch(`/api/admin/enrollment-requests/${id}/approve`, { method: 'POST', headers });
                                if (r.ok) {
                                    fetchAndRenderEnrollments();
                                    fetchStatCounts();
                                } else {
                                    const msg = await r.text();
                                    alert('Lỗi duyệt: ' + msg);
                                    btnEl.disabled = false;
                                    btnEl.innerHTML = origHTML;
                                }
                            } catch (err) {
                                alert('Lỗi kết nối server.');
                                btnEl.disabled = false;
                                btnEl.innerHTML = origHTML;
                            }
                        }
                    });
                });

                // Reject handler
                document.querySelectorAll('.btn-reject-enroll').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const id = e.currentTarget.getAttribute('data-id');
                        if (confirm(`Bạn có chắc chắn muốn TỪ CHỐI đơn đăng ký #${id}?`)) {
                            const btnEl = e.currentTarget;
                            const origHTML = btnEl.innerHTML;
                            try {
                                btnEl.disabled = true;
                                btnEl.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Đang xử lý...';
                                const r = await fetch(`/api/admin/enrollment-requests/${id}/reject`, { method: 'POST', headers });
                                if (r.ok) {
                                    fetchAndRenderEnrollments();
                                    fetchStatCounts();
                                } else {
                                    const msg = await r.text();
                                    alert('Lỗi từ chối: ' + msg);
                                    btnEl.disabled = false;
                                    btnEl.innerHTML = origHTML;
                                }
                            } catch (err) {
                                alert('Lỗi kết nối server.');
                                btnEl.disabled = false;
                                btnEl.innerHTML = origHTML;
                            }
                        }
                    });
                });

            } else {
                tbody.innerHTML = `<tr><td colspan="8">
                    <div class="enroll-empty-state">
                        <div class="enroll-empty-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div class="enroll-empty-text">Không thể tải dữ liệu từ Server</div>
                        <div class="enroll-empty-sub">Vui lòng thử lại sau</div>
                    </div>
                </td></tr>`;
            }
        } catch (err) {
            console.error('Lỗi fetch enrollment requests:', err);
            tbody.innerHTML = `<tr><td colspan="8">
                <div class="enroll-empty-state">
                    <div class="enroll-empty-icon"><i class="fa-solid fa-wifi" style="color:#fca5a5;"></i></div>
                    <div class="enroll-empty-text">Lỗi kết nối tới Server</div>
                    <div class="enroll-empty-sub">Kiểm tra kết nối mạng và thử lại</div>
                </div>
            </td></tr>`;
        }
    };

    // ── Tab filter UI ──
    const tabs = document.querySelectorAll('#enrollStatusTabs .enroll-tab');
    const hiddenSelect = document.getElementById('enrollmentStatusFilter');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (hiddenSelect) {
                hiddenSelect.value = tab.dataset.value;
                hiddenSelect.dispatchEvent(new Event('change'));
            }
        });
    });

    document.getElementById('btnRefreshEnrollments')?.addEventListener('click', () => {
        fetchAndRenderEnrollments();
        fetchStatCounts();
    });
    hiddenSelect?.addEventListener('change', fetchAndRenderEnrollments);

    // Initial load
    fetchStatCounts();
    fetchAndRenderEnrollments();
}