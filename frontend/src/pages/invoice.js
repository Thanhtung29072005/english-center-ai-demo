// =============================================
//   INVOICE PAGE - Trang Hóa Đơn Học Phí
// =============================================

function fmtVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

function fmtDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function fmtDateTime(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function loadInvoice() {
    const contentEl = document.getElementById('invoiceContent');
    if (!contentEl) return;

    try {
        // Lấy enrollment data từ sessionStorage
        const enrollmentData = sessionStorage.getItem('invoiceData');
        if (!enrollmentData) {
            throw new Error('Không tìm thấy thông tin hóa đơn');
        }

        const enroll = JSON.parse(enrollmentData);
        console.log('[Invoice] Loading invoice for:', enroll);

        // Render invoice
        renderInvoice(enroll, contentEl);

        // Xóa data sau khi load xong (để bảo mật)
        sessionStorage.removeItem('invoiceData');

    } catch (err) {
        console.error('[Invoice] Error loading invoice:', err);
        contentEl.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                <h3 style="color: #1e293b; margin-bottom: 0.5rem;">Không thể tải hóa đơn</h3>
                <p style="color: #64748b;">${err.message}</p>
                <button class="invoice-btn invoice-btn-secondary" onclick="window.close()" style="margin-top: 1.5rem;">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>Quay lại</span>
                </button>
            </div>
        `;
    }
}

function renderInvoice(enroll, container) {
    const fee = Number(enroll.classPrice) || 0;
    const invoiceNumber = `INV-${String(enroll.id).padStart(6, '0')}`;
    const invoiceDate = new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    container.innerHTML = `
        <!-- Invoice Meta -->
        <div class="invoice-meta">
            <div class="invoice-meta-item">
                <h3>Số hóa đơn</h3>
                <p class="invoice-number">${invoiceNumber}</p>
                <p><strong>Ngày:</strong> ${invoiceDate}</p>
            </div>
            <div class="invoice-meta-item">
                <h3>Trạng thái</h3>
                <div class="invoice-status">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Đã thanh toán</span>
                </div>
                <p style="margin-top: 0.75rem;"><strong>Ngày thanh toán:</strong> ${fmtDate(enroll.createdAt)}</p>
            </div>
        </div>

        <!-- Student Info -->
        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 0.85rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem;">
                Thông tin học sinh
            </h3>
            <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #667eea;">
                <p style="margin-bottom: 0.75rem; color: #1e293b;">
                    <i class="fa-solid fa-user" style="color: #667eea; width: 20px;"></i>
                    <strong>Họ tên:</strong> ${enroll.studentName || '—'}
                </p>
                <p style="margin-bottom: 0.75rem; color: #1e293b;">
                    <i class="fa-solid fa-book-open" style="color: #667eea; width: 20px;"></i>
                    <strong>Lớp học:</strong> ${enroll.className || '—'}
                </p>
                <p style="margin-bottom: 0; color: #1e293b;">
                    <i class="fa-regular fa-building" style="color: #667eea; width: 20px;"></i>
                    <strong>Chi nhánh:</strong> ${enroll.branchName || '—'}
                </p>
            </div>
        </div>

        <!-- Invoice Table -->
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Mô tả</th>
                    <th style="text-align: center;">Số lượng</th>
                    <th style="text-align: right;">Đơn giá</th>
                    <th style="text-align: right;">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>Học phí khóa học: ${enroll.className || 'N/A'}</strong>
                        <div style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;">
                            Chi nhánh: ${enroll.branchName || 'N/A'}
                        </div>
                    </td>
                    <td style="text-align: center;">1</td>
                    <td style="text-align: right;">${fmtVND(fee)}</td>
                    <td style="text-align: right;"><strong>${fmtVND(fee)}</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- Total -->
        <div class="invoice-total">
            <div class="invoice-total-row">
                <span class="invoice-total-label">Tạm tính</span>
                <span class="invoice-total-value">${fmtVND(fee)}</span>
            </div>
            <div class="invoice-total-row">
                <span class="invoice-total-label">Giảm giá</span>
                <span class="invoice-total-value">0 ₫</span>
            </div>
            <div class="invoice-total-row">
                <span class="invoice-total-label">Tổng cộng</span>
                <span class="invoice-total-value">${fmtVND(fee)}</span>
            </div>
        </div>

        <!-- Payment Info -->
        <div style="background: #eff6ff; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6;">
            <h3 style="font-size: 0.9rem; color: #1e40af; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fa-solid fa-circle-info"></i>
                <span>Thông tin thanh toán</span>
            </h3>
            <p style="margin-bottom: 0.5rem; color: #334155; font-size: 0.9rem;">
                <strong>Phương thức:</strong> Chuyển khoản ngân hàng
            </p>
            <p style="margin-bottom: 0.5rem; color: #334155; font-size: 0.9rem;">
                <strong>Ngân hàng:</strong> MB Bank - Ngân hàng Quân đội
            </p>
            <p style="margin-bottom: 0.5rem; color: #334155; font-size: 0.9rem;">
                <strong>Số tài khoản:</strong> 30802040599999
            </p>
            <p style="margin-bottom: 0; color: #334155; font-size: 0.9rem;">
                <strong>Chủ tài khoản:</strong> TRAN ANH DUC
            </p>
        </div>
    `;
}

// Load invoice when page loads
document.addEventListener('DOMContentLoaded', loadInvoice);
