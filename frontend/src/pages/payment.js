// =============================================
//   TRANG THANH TOÁN HỌC PHÍ (Payment Page)
//   VietQR – MB Bank · 30802040599999 · TRAN ANH DUC
// =============================================

const PAYMENT_CONFIG = {
    bank: 'MB',
    accountNo: '30802040599999',
    accountName: 'TRAN ANH DUC',
    template: 'compact2'
};

function buildVietQRUrl(amount, description) {
    const encodedDesc = encodeURIComponent(description);
    const encodedName = encodeURIComponent(PAYMENT_CONFIG.accountName);
    return `https://img.vietqr.io/image/${PAYMENT_CONFIG.bank}-${PAYMENT_CONFIG.accountNo}-${PAYMENT_CONFIG.template}.png?amount=${amount}&addInfo=${encodedDesc}&accountName=${encodedName}`;
}

function fmtVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

function buildTransferDesc(enroll) {
    // Nội dung chuyển khoản: "HP <TenLop> - <TenHocSinh>"
    const className = (enroll.className || '').replace(/\s+/g, ' ').trim();
    const studentName = (enroll.studentName || '').replace(/\s+/g, ' ').trim();
    return `HP ${className} ${studentName}`.substring(0, 100);
}

export async function initPaymentPage() {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    if (!token || !username) return;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const grid = document.getElementById('paymentCardGrid');
    const emptyState = document.getElementById('paymentEmptyState');
    if (!grid) return;

    // Reset về skeleton loading
    grid.innerHTML = `
        <div class="payment-skeleton-card">
            <div class="payment-skeleton-line w-60"></div>
            <div class="payment-skeleton-line w-40"></div>
            <div class="payment-skeleton-line w-80"></div>
        </div>
        <div class="payment-skeleton-card">
            <div class="payment-skeleton-line w-60"></div>
            <div class="payment-skeleton-line w-40"></div>
            <div class="payment-skeleton-line w-80"></div>
        </div>
        <div class="payment-skeleton-card">
            <div class="payment-skeleton-line w-60"></div>
            <div class="payment-skeleton-line w-40"></div>
            <div class="payment-skeleton-line w-80"></div>
        </div>
    `;
    if (emptyState) emptyState.style.display = 'none';

    try {
        const res = await fetch(`/api/parent/enrollment-requests?username=${encodeURIComponent(username)}`, { headers });
        console.log('[Payment] API status:', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log('[Payment] Raw data:', data);

        const enrollments = Array.isArray(data) ? data : (data.result || data.data || []);
        console.log('[Payment] Enrollments count:', enrollments.length, enrollments);

        // Hiển thị TẤT CẢ đơn (không chỉ APPROVED)
        const approved = enrollments.filter(e => e.status === 'APPROVED');
        const totalAmount = approved.reduce((sum, e) => sum + (Number(e.classPrice) || 0), 0);
        const uniqueStudents = new Set(enrollments.map(e => e.studentName)).size;

        // Cập nhật stats
        const elTotal = document.getElementById('payStatTotal');
        const elAmount = document.getElementById('payStatAmount');
        const elStudents = document.getElementById('payStatStudents');

        if (elTotal) elTotal.textContent = approved.length;
        if (elAmount) elAmount.textContent = fmtVND(totalAmount);
        if (elStudents) elStudents.textContent = uniqueStudents;

        grid.innerHTML = '';

        if (enrollments.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }

        // Sắp xếp: APPROVED lên trước
        const sorted = [...enrollments].sort((a, b) => {
            const order = { 'APPROVED': 0, 'PENDING': 1, 'REJECTED': 2 };
            return (order[a.status] ?? 9) - (order[b.status] ?? 9);
        });

        // Debug: Kiểm tra xem có đơn nào sẽ hiển thị QR không
        const pendingWithFee = sorted.filter(e => e.status === 'PENDING' && Number(e.classPrice) > 0);
        console.log('[Payment] PENDING enrollments with fee (will show QR):', pendingWithFee.length, pendingWithFee);
        console.log('[Payment] All sorted enrollments:', sorted.map(e => ({
            id: e.id,
            student: e.studentName,
            status: e.status,
            fee: e.classPrice
        })));

        // Render từng card
        sorted.forEach((enroll) => {
            const fee = Number(enroll.classPrice) || 0;
            const feeText = fee > 0 ? fmtVND(fee) : 'Liên hệ trung tâm';
            const isApproved = enroll.status === 'APPROVED';
            const isPending  = enroll.status === 'PENDING';
            const isRejected = enroll.status === 'REJECTED';

            // Badge theo trạng thái
            let statusBadge = '';
            if (isApproved) {
                statusBadge = `<span class="payment-card-badge-approved"><i class="fa-solid fa-circle-check"></i> Đã duyệt</span>`;
            } else if (isPending) {
                statusBadge = `<span class="payment-card-badge-pending"><i class="fa-regular fa-clock"></i> Chờ duyệt</span>`;
            } else if (isRejected) {
                statusBadge = `<span class="payment-card-badge-rejected"><i class="fa-solid fa-circle-xmark"></i> Từ chối</span>`;
            }

            // Nút action
            let actionBtn = '';
            if (isApproved) {
                // Đã duyệt/thanh toán → Xuất hóa đơn
                const enrollJson = JSON.stringify(enroll).replace(/"/g, '&quot;');
                actionBtn = `
                    <button class="payment-qr-btn payment-invoice-btn" onclick="exportInvoice('${enrollJson}')">
                        <i class="fa-solid fa-file-invoice"></i>
                        <span>Xuất hóa đơn</span>
                    </button>`;
            } else if (isPending) {
                actionBtn = `
                    <button class="payment-qr-btn payment-qr-btn-pending" disabled>
                        <i class="fa-regular fa-hourglass-half"></i>
                        <span>Chờ xét duyệt</span>
                    </button>`;
            } else {
                actionBtn = `
                    <button class="payment-qr-btn payment-qr-btn-disabled" disabled>
                        <i class="fa-solid fa-ban"></i>
                        <span>Không hợp lệ</span>
                    </button>`;
            }

            const card = document.createElement('div');
            card.className = `payment-enroll-card${isRejected ? ' payment-card-rejected' : ''}`;
            card.innerHTML = `
                <div class="payment-card-header">
                    <div class="payment-card-avatar ${isPending ? 'avatar-pending' : isRejected ? 'avatar-rejected' : ''}">
                        <i class="fa-solid fa-user-graduate"></i>
                    </div>
                    <div class="payment-card-meta">
                        <div class="payment-card-student">${enroll.studentName || '—'}</div>
                        <div class="payment-card-id">#${enroll.id}</div>
                    </div>
                    ${statusBadge}
                </div>

                <div class="payment-card-body">
                    <div class="payment-card-detail-row">
                        <i class="fa-solid fa-book-open"></i>
                        <span class="payment-card-detail-label">Lớp học:</span>
                        <span class="payment-card-detail-val">${enroll.className || 'N/A'}</span>
                    </div>
                    <div class="payment-card-detail-row">
                        <i class="fa-regular fa-building"></i>
                        <span class="payment-card-detail-label">Chi nhánh:</span>
                        <span class="payment-card-detail-val">${enroll.branchName || 'N/A'}</span>
                    </div>
                    <div class="payment-card-detail-row">
                        <i class="fa-solid fa-calendar-day"></i>
                        <span class="payment-card-detail-label">Ngày đăng ký:</span>
                        <span class="payment-card-detail-val">${enroll.createdAt ? new Date(enroll.createdAt).toLocaleDateString('vi-VN') : '—'}</span>
                    </div>
                </div>

                ${isPending && fee > 0 ? `
                <div class="payment-card-qr-section">
                    <div class="payment-qr-container">
                        <img src="${(() => {
                            const qrUrl = buildVietQRUrl(fee, buildTransferDesc(enroll));
                            console.log('[Payment] QR URL for', enroll.studentName, ':', qrUrl);
                            return qrUrl;
                        })()}" 
                             alt="QR Thanh toán" 
                             class="payment-qr-image"
                             onclick="openPaymentModal('${JSON.stringify(enroll).replace(/"/g, '&quot;')}')"
                             style="cursor: pointer;"
                             title="Click để xem lớn hơn"
                             onerror="console.error('[Payment] QR image failed to load for', '${enroll.studentName}'); this.style.border='2px solid red';">
                    </div>
                    <div class="payment-qr-info">
                        <div class="payment-qr-bank">
                            <i class="fa-solid fa-building-columns"></i>
                            <span>MB Bank - 30802040599999</span>
                        </div>
                        <div class="payment-qr-desc">
                            <i class="fa-solid fa-comment-dots"></i>
                            <span>${buildTransferDesc(enroll)}</span>
                        </div>
                        <div class="payment-qr-hint">
                            <i class="fa-solid fa-hand-pointer"></i>
                            <span>Click QR để xem chi tiết</span>
                        </div>
                    </div>
                </div>
                ` : ''}

                <div class="payment-card-footer">
                    <div class="payment-card-fee">
                        <div class="payment-card-fee-label">Học phí</div>
                        <div class="payment-card-fee-val ${!isApproved ? 'fee-muted' : ''}">${feeText}</div>
                    </div>
                    ${actionBtn}
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error('Lỗi fetch payment data:', err);
        grid.innerHTML = `
            <div class="payment-error-state">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>Không thể tải dữ liệu. Vui lòng thử lại sau.</div>
            </div>
        `;
    }
}

// ── Open QR Modal ──
window.openPaymentModal = function (enroll) {
    if (typeof enroll === 'string') {
        try { enroll = JSON.parse(enroll); } catch { return; }
    }

    const modal = document.getElementById('paymentQRModal');
    const qrImg = document.getElementById('paymentQRImage');
    const qrLoading = document.getElementById('qrLoading');
    const modalClassName = document.getElementById('modalClassName');
    const modalStudentName = document.getElementById('modalStudentName');
    const modalBranchName = document.getElementById('modalBranchName');
    const modalAmount = document.getElementById('modalAmount');
    const modalDesc = document.getElementById('modalTransferDesc');

    if (!modal) return;

    const fee = Number(enroll.classPrice) || 0;
    const desc = buildTransferDesc(enroll);
    const qrUrl = buildVietQRUrl(fee, desc);

    // Điền thông tin vào modal
    if (modalClassName) modalClassName.textContent = enroll.className || '—';
    if (modalStudentName) modalStudentName.innerHTML = `<i class="fa-solid fa-user me-1"></i>${enroll.studentName || '—'}`;
    if (modalBranchName) modalBranchName.innerHTML = `<i class="fa-regular fa-building me-1"></i>${enroll.branchName || '—'}`;
    if (modalAmount) modalAmount.textContent = fmtVND(fee);
    if (modalDesc) modalDesc.textContent = desc;

    // Reset và load QR
    if (qrLoading) qrLoading.style.display = 'flex';
    if (qrImg) {
        qrImg.style.display = 'none';
        qrImg.src = '';
        setTimeout(() => { qrImg.src = qrUrl; }, 50);
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('payment-modal-visible'), 10);
};

// ── Close Modal ──
window.closePaymentModal = function (e) {
    if (e && e.target !== document.getElementById('paymentQRModal')) return;
    const modal = document.getElementById('paymentQRModal');
    if (!modal) return;
    modal.classList.remove('payment-modal-visible');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        const qrImg = document.getElementById('paymentQRImage');
        if (qrImg) { qrImg.src = ''; qrImg.style.display = 'none'; }
    }, 250);
};

// ── Handle QR Error ──
window.handleQRError = function () {
    const qrLoading = document.getElementById('qrLoading');
    const qrImg = document.getElementById('paymentQRImage');
    if (qrLoading) {
        qrLoading.innerHTML = `
            <div style="text-align:center; color:#ef4444;">
                <i class="fa-solid fa-wifi" style="font-size:24px; margin-bottom:8px;"></i>
                <div style="font-size:13px;">Không thể tải QR. Kiểm tra kết nối mạng.</div>
            </div>
        `;
        qrLoading.style.display = 'flex';
    }
    if (qrImg) qrImg.style.display = 'none';
};

// ── Copy Account Number ──
window.copyAccountNumber = function () {
    navigator.clipboard.writeText(PAYMENT_CONFIG.accountNo).then(() => {
        const btn = document.querySelector('.payment-copy-btn');
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.color = '#10b981';
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
                btn.style.color = '';
            }, 2000);
        }
    }).catch(() => {
        // Fallback
        const el = document.createElement('textarea');
        el.value = PAYMENT_CONFIG.accountNo;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    });
};

// ── Export Invoice ──
window.exportInvoice = function (enrollJson) {
    let enroll;
    if (typeof enrollJson === 'string') {
        try { enroll = JSON.parse(enrollJson); } catch { 
            alert('Lỗi: Không thể đọc thông tin đơn đăng ký');
            return; 
        }
    } else {
        enroll = enrollJson;
    }

    console.log('[Payment] Exporting invoice for:', enroll);

    // Lưu data vào sessionStorage để trang invoice đọc
    sessionStorage.setItem('invoiceData', JSON.stringify(enroll));

    // Mở trang hóa đơn trong tab mới
    const invoiceWindow = window.open('/pages/invoice.html', '_blank');
    
    if (!invoiceWindow) {
        alert('Không thể mở cửa sổ mới. Vui lòng cho phép popup trong trình duyệt.');
        sessionStorage.removeItem('invoiceData');
    }
};

// Keyboard ESC to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('paymentQRModal');
        if (modal && modal.style.display !== 'none') {
            closePaymentModal();
        }
    }
});
