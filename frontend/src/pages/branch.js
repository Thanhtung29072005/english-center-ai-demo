// ================================================
// BRANCH PAGE LOGIC
// ================================================
let allBranches = [];
let _branchHeaders = null;
let branchCurrentPage = 1;

export async function initBranchPage() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    _branchHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // 1. Mở modal Tạo mới
    const btnOpen = document.getElementById('btn-open-create-branch');
    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            document.getElementById('createBranchForm').reset();
            const modalEl = document.getElementById('createBranchModal');
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.show();
        });
    }

    // 2. Submit Tạo mới
    const btnCreate = document.getElementById('btnSubmitCreateBranch');
    if (btnCreate) {
        const freshBtn = btnCreate.cloneNode(true);
        btnCreate.parentNode.replaceChild(freshBtn, btnCreate);
        freshBtn.addEventListener('click', async () => {
            const name = document.getElementById('newBranchName').value.trim();
            const address = document.getElementById('newBranchAddress').value.trim();
            const phone = document.getElementById('newBranchPhone').value.trim();

            if (!name || !address || !phone) { alert('Vui lòng nhập đầy đủ thông tin tên chi nhánh, địa chỉ và số điện thoại!'); return; }

            const payload = { name, address: address || null, phone: phone || null };

            try {
                freshBtn.textContent = 'Đang xử lý...';
                freshBtn.disabled = true;
                const res = await fetch('/api/branches', {
                    method: 'POST',
                    headers: _branchHeaders,
                    body: JSON.stringify(payload)
                });
                if (res.ok || res.status === 201) {
                    alert('Tạo chi nhánh mới thành công!');
                    const modal = bootstrap.Modal.getInstance(document.getElementById('createBranchModal'));
                    if (modal) modal.hide();
                    document.getElementById('createBranchForm').reset();
                    await fetchAndRenderBranches();
                } else {
                    const errText = await res.text();
                    console.error('API error:', errText);
                    alert('Có lỗi xảy ra, không thể tạo chi nhánh!');
                }
            } catch (err) {
                console.error('Lỗi tạo chi nhánh:', err);
                alert('Lỗi kết nối tới Server!');
            } finally {
                freshBtn.innerHTML = '<i class="fa-solid fa-plus me-1"></i>Tạo mới';
                freshBtn.disabled = false;
            }
        });
    }

    // 3. Gắn events bộ lọc
    if (!document.getElementById('branch-filter-search')?._branchFilterBound) {
        ['branch-filter-search', 'branch-filter-sort', 'branch-filter-page-size'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el._branchFilterBound = true;
                el.addEventListener('input', () => { branchCurrentPage = 1; applyBranchFilters(); });
                el.addEventListener('change', () => { branchCurrentPage = 1; applyBranchFilters(); });
            }
        });

        const btnReset = document.getElementById('branch-btn-reset-filter');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                document.getElementById('branch-filter-search').value = '';
                document.getElementById('branch-filter-sort').value = 'az';
                document.getElementById('branch-filter-page-size').value = '12';
                branchCurrentPage = 1;
                applyBranchFilters();
            });
        }
    }

    // 4. Fetch và render
    await fetchAndRenderBranches();
}

async function fetchAndRenderBranches() {
    const container = document.getElementById('branch-list-container');
    if (!container) return;
    container.innerHTML = `<div class="col-12 text-center py-5 text-muted">Đang tải dữ liệu...</div>`;

    try {
        const res = await fetch('/api/branches', { headers: _branchHeaders });
        if (!res.ok) throw new Error('Không thể lấy danh sách chi nhánh');
        const data = await res.json();
        allBranches = Array.isArray(data) ? data : (data.result || []);
        branchCurrentPage = 1;
        applyBranchFilters();
    } catch (err) {
        console.error('Lỗi fetch branches:', err);
        if (container) container.innerHTML = `<div class="col-12 text-center py-5 text-danger">Không thể tải danh sách chi nhánh.</div>`;
    }
}

function applyBranchFilters() {
    const search = (document.getElementById('branch-filter-search')?.value || '').toLowerCase().trim();
    const sort = document.getElementById('branch-filter-sort')?.value || 'az';
    const pageSize = parseInt(document.getElementById('branch-filter-page-size')?.value || '12');

    // 1. Lọc
    let filtered = allBranches.filter(b => {
        return !search ||
            (b.name || '').toLowerCase().includes(search) ||
            (b.address || '').toLowerCase().includes(search) ||
            (b.phone || '').toLowerCase().includes(search);
    });

    // 2. Sắp xếp
    filtered.sort((a, b) => {
        if (sort === 'az') return (a.name || '').localeCompare(b.name || '');
        if (sort === 'za') return (b.name || '').localeCompare(a.name || '');
        if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        return 0;
    });

    // 3. Phân trang
    const totalItems = filtered.length;
    const totalPages = pageSize >= 9999 ? 1 : Math.ceil(totalItems / pageSize);
    if (branchCurrentPage > totalPages) branchCurrentPage = Math.max(1, totalPages);
    const startIndex = (branchCurrentPage - 1) * pageSize;
    const pageItems = pageSize >= 9999 ? filtered : filtered.slice(startIndex, startIndex + pageSize);

    // 4. Count
    const countText = document.getElementById('branch-count-text');
    if (countText) countText.textContent = `Hiển thị ${pageItems.length} / ${totalItems} chi nhánh`;

    // 5. Render cards
    const container = document.getElementById('branch-list-container');
    if (!container) return;

    if (pageItems.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-5 text-muted">
            <i class="fa-solid fa-building mb-2" style="font-size:36px; opacity:0.25; display:block;"></i>
            Không tìm thấy chi nhánh nào phù hợp.
        </div>`;
    } else {
        container.innerHTML = pageItems.map(b => {
            const createdStr = b.createdAt
                ? new Date(b.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : null;
            return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card lesson-card-modern h-100 d-flex flex-column">
                    <div class="lesson-card-header">
                        <div class="lesson-icon-modern" style="background: linear-gradient(135deg, #ec4899, #f472b6);">
                            <i class="fa-regular fa-building"></i>
                        </div>
                        <div class="lesson-header-text">
                            <h5 class="fw-bold mb-1 class-card-title text-truncate" title="${b.name || '-'}">${b.name || '-'}</h5>
                            <span class="badge lesson-badge-modern" style="background: rgba(236, 72, 153, 0.1); color: #ec4899;">Chi nhánh</span>
                        </div>
                    </div>
                    <div class="lesson-card-body flex-grow-1">
                        ${b.address ? `
                        <div class="lesson-info-row">
                            <div class="icon-bg-light icon-blue">
                                <i class="fa-solid fa-location-dot"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Địa chỉ</span>
                                <span class="info-value fw-semibold text-dark text-truncate" title="${b.address}">${b.address}</span>
                            </div>
                        </div>` : ''}
                        ${b.phone ? `
                        <div class="lesson-info-row mt-3">
                            <div class="icon-bg-light" style="background: #f1f5f9; color: #64748b;">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Số điện thoại</span>
                                <span class="info-value fw-semibold text-dark">${b.phone}</span>
                            </div>
                        </div>` : ''}
                        ${b.ownerName ? `
                        <div class="lesson-info-row mt-3">
                            <div class="icon-bg-light icon-orange">
                                <i class="fa-solid fa-user-tie"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Chủ sở hữu</span>
                                <span class="info-value fw-semibold text-dark">${b.ownerName}</span>
                            </div>
                        </div>` : ''}
                        ${createdStr ? `
                        <div class="lesson-info-row mt-3">
                            <div class="icon-bg-light" style="background: #f1f5f9; color: #64748b;">
                                <i class="fa-regular fa-calendar-plus"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Ngày tạo</span>
                                <span class="info-value fw-semibold text-dark">${createdStr}</span>
                            </div>
                        </div>` : ''}
                    </div>
                    <div class="lesson-card-footer d-flex justify-content-between gap-2">
                        <button class="btn flex-grow-1 btn-edit-modern btn-edit-branch-card" data-id="${b.id}">
                            <i class="fa-regular fa-pen-to-square me-1"></i> Sửa
                        </button>
                        <button class="btn flex-grow-1 btn-delete-modern btn-delete-branch-card" data-id="${b.id}" data-name="${b.name}">
                            <i class="fa-regular fa-trash-can me-1"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

        // Gắn sự kiện Sửa
        container.querySelectorAll('.btn-edit-branch-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const b = allBranches.find(x => String(x.id) === btn.getAttribute('data-id'));
                if (b) openEditBranchModal(b);
            });
        });

        // Gắn sự kiện Xóa
        container.querySelectorAll('.btn-delete-branch-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const branchId = btn.getAttribute('data-id');
                const branchName = btn.getAttribute('data-name');
                const msgEl = document.getElementById('deleteBranchMessage');
                if (msgEl) msgEl.innerHTML = `Bạn có chắc chắn muốn xóa chi nhánh <strong>"${branchName}"</strong>?<br>Hành động này không thể hoàn tác.`;

                const deleteModalEl = document.getElementById('deleteBranchModal');
                const deleteModal = bootstrap.Modal.getInstance(deleteModalEl) || new bootstrap.Modal(deleteModalEl);
                deleteModal.show();

                const btnConfirm = document.getElementById('btnConfirmDeleteBranch');
                const newConfirm = btnConfirm.cloneNode(true);
                btnConfirm.parentNode.replaceChild(newConfirm, btnConfirm);
                newConfirm.addEventListener('click', async () => {
                    try {
                        newConfirm.textContent = 'Đang xóa...';
                        newConfirm.disabled = true;
                        const res = await fetch(`/api/branches/${branchId}`, { method: 'DELETE', headers: _branchHeaders });
                        if (res.ok || res.status === 204) {
                            deleteModal.hide();
                            await fetchAndRenderBranches();
                        } else {
                            alert('Không thể xóa chi nhánh! Có thể chi nhánh đang được sử dụng.');
                        }
                    } catch (err) {
                        alert('Lỗi kết nối tới Server!');
                    } finally {
                        newConfirm.textContent = 'Xóa';
                        newConfirm.disabled = false;
                    }
                });
            });
        });
    }

    // 6. Pagination
    renderBranchPagination(totalPages);
}

function openEditBranchModal(b) {
    document.getElementById('editBranchId').value = b.id;
    document.getElementById('editBranchName').value = b.name || '';
    document.getElementById('editBranchAddress').value = b.address || '';
    document.getElementById('editBranchPhone').value = b.phone || '';

    const editModalEl = document.getElementById('editBranchModal');
    const editModal = bootstrap.Modal.getInstance(editModalEl) || new bootstrap.Modal(editModalEl);
    editModal.show();

    const btnSubmit = document.getElementById('btnSubmitEditBranch');
    const newBtn = btnSubmit.cloneNode(true);
    btnSubmit.parentNode.replaceChild(newBtn, btnSubmit);

    newBtn.addEventListener('click', async () => {
        const branchId = document.getElementById('editBranchId').value;
        const name = document.getElementById('editBranchName').value.trim();
        const address = document.getElementById('editBranchAddress').value.trim();
        const phone = document.getElementById('editBranchPhone').value.trim();

        if (!name) { alert('Vui lòng nhập tên chi nhánh!'); return; }

        const payload = { name, address: address || null, phone: phone || null };

        try {
            newBtn.textContent = 'Đang lưu...';
            newBtn.disabled = true;
            const res = await fetch(`/api/branches/${branchId}`, {
                method: 'PUT',
                headers: _branchHeaders,
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                editModal.hide();
                await fetchAndRenderBranches();
            } else {
                const errText = await res.text();
                console.error('API error:', errText);
                alert('Có lỗi xảy ra, không thể cập nhật chi nhánh!');
            }
        } catch (err) {
            console.error('Lỗi sửa chi nhánh:', err);
            alert('Lỗi kết nối tới Server!');
        } finally {
            newBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i>Lưu thay đổi';
            newBtn.disabled = false;
        }
    });
}

function renderBranchPagination(totalPages) {
    const paginationEl = document.getElementById('branch-pagination-controls');
    if (!paginationEl) return;
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

    const btnStyle = (isActive) =>
        `style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid ${isActive ? 'var(--primary-color)' : '#E0E5F2'};background:${isActive ? 'var(--primary-color)' : 'white'};color:${isActive ? 'white' : '#4a5568'};font-weight:500;font-size:14px;cursor:pointer;transition:all 0.2s ease;"`;

    let html = `<button onclick="changeBranchPage(${branchCurrentPage - 1})" ${branchCurrentPage === 1 ? 'disabled' : ''}
        style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid #E0E5F2;background:white;color:#4a5568;font-weight:500;font-size:14px;cursor:pointer;">‹</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="changeBranchPage(${i})" ${btnStyle(i === branchCurrentPage)}>${i}</button>`;
    }
    html += `<button onclick="changeBranchPage(${branchCurrentPage + 1})" ${branchCurrentPage === totalPages ? 'disabled' : ''}
        style="min-width:34px;height:34px;border-radius:8px;border:1.5px solid #E0E5F2;background:white;color:#4a5568;font-weight:500;font-size:14px;cursor:pointer;">›</button>`;
    paginationEl.innerHTML = html;
}

function changeBranchPage(page) {
    const pageSize = parseInt(document.getElementById('branch-filter-page-size')?.value || '12');
    const totalPages = Math.ceil(allBranches.length / pageSize);
    if (page < 1 || page > totalPages) return;
    branchCurrentPage = page;
    applyBranchFilters();
}