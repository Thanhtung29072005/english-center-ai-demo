
// ======================= ENROLLMENT REQUEST LOGIC =======================
async function initEnrollmentRequestPage() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const fetchAndRenderEnrollments = async () => {
        const status = document.getElementById('enrollmentStatusFilter')?.value || 'PENDING';
        const tbody = document.getElementById('enrollmentTableBody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-muted">Đang tải dữ liệu...</td></tr>';

        try {
            const res = await fetch(`/api/admin/enrollment-requests?status=${status}`, { headers });
            if (res.ok) {
                const data = await res.json();
                const enrollments = Array.isArray(data) ? data : (data.result ? data.result : []);
                
                if (enrollments.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-muted">Không có đơn đăng ký nào.</td></tr>';
                    return;
                }

                tbody.innerHTML = '';
                enrollments.forEach(enroll => {
                    const dob = enroll.dateOfBirth ? new Date(enroll.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A';
                    const createdAt = enroll.createdAt ? new Date(enroll.createdAt).toLocaleString('vi-VN') : 'N/A';
                    
                    let statusBadge = '';
                    if (enroll.status === 'PENDING') statusBadge = '<span class="badge bg-warning text-dark">Chờ duyệt</span>';
                    else if (enroll.status === 'APPROVED') statusBadge = '<span class="badge bg-success">Đã duyệt</span>';
                    else if (enroll.status === 'REJECTED') statusBadge = '<span class="badge bg-danger">Đã từ chối</span>';
                    else statusBadge = `<span class="badge bg-secondary">${enroll.status}</span>`;

                    let actionHtml = '';
                    if (enroll.status === 'PENDING') {
                        actionHtml = `
                            <button class="btn btn-sm btn-success btn-approve-enroll" data-id="${enroll.id}" title="Duyệt">
                                <i class="fa-solid fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-reject-enroll" data-id="${enroll.id}" title="Từ chối">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        `;
                    }

                    const row = `
                        <tr>
                            <td class="ps-4"><strong>#${enroll.id}</strong></td>
                            <td><span class="fw-medium">${enroll.studentName}</span></td>
                            <td>${dob}</td>
                            <td><span class="text-primary">${enroll.className || 'N/A'}</span></td>
                            <td>${enroll.branchName || 'N/A'}</td>
                            <td>
                                <div><i class="fa-solid fa-user me-1 text-muted"></i> ${enroll.parentName || 'N/A'}</div>
                                <div><i class="fa-solid fa-phone me-1 text-muted"></i> ${enroll.parentPhone || 'N/A'}</div>
                            </td>
                            <td>${statusBadge}</td>
                            <td class="text-muted small">${createdAt}</td>
                            <td class="text-end pe-4">
                                <div class="d-flex justify-content-end gap-1">
                                    ${actionHtml}
                                </div>
                            </td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', row);
                });

                document.querySelectorAll('.btn-approve-enroll').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const id = e.currentTarget.getAttribute('data-id');
                        if (confirm(`Bạn có chắc chắn muốn DUYỆT đơn đăng ký #${id} này? Hệ thống sẽ tự động tạo học sinh mới.`)) {
                            try {
                                const btnEl = e.currentTarget;
                                btnEl.disabled = true;
                                const r = await fetch(`/api/admin/enrollment-requests/${id}/approve`, {
                                    method: 'POST',
                                    headers
                                });
                                if (r.ok) {
                                    alert('Duyệt thành công!');
                                    fetchAndRenderEnrollments();
                                } else {
                                    const msg = await r.text();
                                    alert('Lỗi duyệt: ' + msg);
                                    btnEl.disabled = false;
                                }
                            } catch (err) {
                                alert('Lỗi kết nối server.');
                            }
                        }
                    });
                });

                document.querySelectorAll('.btn-reject-enroll').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const id = e.currentTarget.getAttribute('data-id');
                        if (confirm(`Bạn có chắc chắn muốn TỪ CHỐI đơn đăng ký #${id} này?`)) {
                            try {
                                const btnEl = e.currentTarget;
                                btnEl.disabled = true;
                                const r = await fetch(`/api/admin/enrollment-requests/${id}/reject`, {
                                    method: 'POST',
                                    headers
                                });
                                if (r.ok) {
                                    alert('Đã từ chối đơn đăng ký!');
                                    fetchAndRenderEnrollments();
                                } else {
                                    const msg = await r.text();
                                    alert('Lỗi từ chối: ' + msg);
                                    btnEl.disabled = false;
                                }
                            } catch (err) {
                                alert('Lỗi kết nối server.');
                            }
                        }
                    });
                });

            } else {
                tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-danger">Không thể tải dữ liệu từ Server.</td></tr>';
            }
        } catch (err) {
            console.error("Lỗi fetch enrollment requests:", err);
            tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-danger">Lỗi kết nối.</td></tr>';
        }
    };

    document.getElementById('btnRefreshEnrollments')?.addEventListener('click', fetchAndRenderEnrollments);
    document.getElementById('enrollmentStatusFilter')?.addEventListener('change', fetchAndRenderEnrollments);

    fetchAndRenderEnrollments();
}
