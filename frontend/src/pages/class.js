// ================================================
// CLASS PAGE LOGIC
// ================================================

export async function initClassPage() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // 1. Load danh sách chi nhánh vào Modal tạo mới
    try {
        const resBranch = await fetch('/api/branches', { headers });
        if (resBranch.ok) {
            const data = await resBranch.json();
            const branches = Array.isArray(data) ? data : (data.result ? data.result : []);
            const selectBranch = document.getElementById('newClassBranch');
            if (selectBranch) {
                selectBranch.innerHTML = '<option value="" disabled selected>Chọn chi nhánh</option>';
                branches.forEach(branch => {
                    const option = document.createElement('option');
                    option.value = branch.id;
                    option.textContent = branch.name;
                    selectBranch.appendChild(option);
                });
            }
        }
    } catch (err) {
        console.error("Lỗi load danh sách chi nhánh:", err);
    }

    // 2. Mở Modal tạo mới thủ công (tránh lỗi khi load DOM động)
    const btnOpenModal = document.querySelector('.btn-create-class');
    if (btnOpenModal) {
        btnOpenModal.addEventListener('click', () => {
            if (window.bootstrap) {
                const modalEl = document.getElementById('createClassModal');
                const modalObj = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modalObj.show();
            }
        });
    }

    // 3. Nút submit tạo mới
    const btnSubmit = document.getElementById('btnSubmitCreateClass');
    if (btnSubmit) {
        const newBtn = btnSubmit.cloneNode(true);
        btnSubmit.parentNode.replaceChild(newBtn, btnSubmit);
        newBtn.addEventListener('click', async () => {
            const branchId = document.getElementById('newClassBranch').value;
            const className = document.getElementById('newClassName').value.trim();
            const level = document.getElementById('newClassLevel').value.trim();
            const price = document.getElementById('newClassPrice').value;
            if (!branchId || !className) {
                alert("Vui lòng nhập tên lớp và chọn chi nhánh!");
                return;
            }
            const payload = { 
                name: className, 
                level: level, 
                branchId: parseInt(branchId),
                price: price ? parseFloat(price) : null
            };
            try {
                newBtn.textContent = 'Đang xử lý...';
                newBtn.disabled = true;
                const res = await fetch('/api/classes', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                });
                if (res.ok || res.status === 201) {
                    alert("Tạo lớp học mới thành công!");
                    if (window.bootstrap) {
                        const modalEl = document.getElementById('createClassModal');
                        const modalObj = bootstrap.Modal.getInstance(modalEl);
                        if (modalObj) modalObj.hide();
                    }
                    document.getElementById('createClassForm').reset();
                    fetchAndRenderClasses(headers);
                } else {
                    alert("Có lỗi xảy ra, không thể tạo được lớp học!");
                }
            } catch (err) {
                console.error("Lỗi khi tạo lớp:", err);
                alert("Lỗi kết nối tới Server!");
            } finally {
                newBtn.textContent = 'Tạo mới';
                newBtn.disabled = false;
            }
        });
    }

    // 4. Fetch và render danh sách lớp học
    fetchAndRenderClasses(headers);
}

// Biến toàn cục lưu danh sách lớp học và trạng thái filter
let allClasses = [];
let _classHeaders = null;
let currentPage = 1;

async function fetchAndRenderClasses(headers) {
    _classHeaders = headers;
    const container = document.getElementById('class-list-container');
    const countText = document.getElementById('class-count-text');
    if (!container) return;

    container.innerHTML = `<div class="col-12 text-center py-4 text-muted">Đang tải dữ liệu...</div>`;

    try {
        // Check role and use appropriate API endpoint
        const role = (localStorage.getItem('userRole') || '').toUpperCase();
        const apiUrl = role === 'STUDENT'
            ? '/api/student/my-classes'
            : (role === '4' || role === 'PARENT')
                ? '/api/parent/my-classes'
                : '/api/classes';
        
        const res = await fetch(apiUrl, { headers });
        if (!res.ok) throw new Error('Không thể lấy danh sách lớp học');
        const data = await res.json();
        allClasses = Array.isArray(data) ? data : (data.result ? data.result : []);

        // Đổ options chi nhánh động (lấy unique từ dữ liệu)
        const branchSelect = document.getElementById('filter-branch');
        if (branchSelect) {
            const uniqueBranches = [...new Map(
                allClasses
                    .filter(c => c.branchName || c.branch?.name)
                    .map(c => {
                        const id = c.branchId || c.branch?.id || '';
                        const name = c.branchName || c.branch?.name || '';
                        return [id, { id, name }];
                    })
            ).values()];
            branchSelect.innerHTML = '<option value="">Tất cả</option>';
            uniqueBranches.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.id;
                opt.textContent = b.name;
                branchSelect.appendChild(opt);
            });
        }

        // Đổ options Level động (unique levels)
        const levelSelect = document.getElementById('filter-level');
        if (levelSelect) {
            const uniqueLevels = [...new Set(allClasses.map(c => c.level).filter(Boolean))].sort();
            levelSelect.innerHTML = '<option value="">Tất cả</option>';
            uniqueLevels.forEach(lv => {
                const opt = document.createElement('option');
                opt.value = lv;
                opt.textContent = lv;
                levelSelect.appendChild(opt);
            });
        }

        // Gắn event lọc (chỉ gắn 1 lần, dùng flag để tránh duplicate)
        if (!document.getElementById('filter-search')?._filterBound) {
            const inputs = ['filter-search', 'filter-branch', 'filter-level', 'filter-sort', 'filter-page-size'];
            inputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el._filterBound = true;
                    el.addEventListener('input', () => { currentPage = 1; applyFilters(); });
                    el.addEventListener('change', () => { currentPage = 1; applyFilters(); });
                }
            });

            // Nút đặt lại lọc
            const btnReset = document.getElementById('btn-reset-filter');
            if (btnReset) {
                btnReset._filterBound = true;
                btnReset.addEventListener('click', () => {
                    document.getElementById('filter-search').value = '';
                    document.getElementById('filter-branch').value = '';
                    document.getElementById('filter-level').value = '';
                    document.getElementById('filter-sort').value = 'az';
                    document.getElementById('filter-page-size').value = '12';
                    currentPage = 1;
                    applyFilters();
                });
            }
        }

        // Áp dụng filter lần đầu (hiển thị tất cả)
        currentPage = 1;
        applyFilters();

    } catch (err) {
        console.error("Lỗi fetch danh sách lớp:", err);
        if (container) {
            container.innerHTML = `<div class="col-12 text-center py-4 text-danger">Không thể tải danh sách lớp học.</div>`;
        }
    }
}

function applyFilters() {
    const search = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
    const branchId = document.getElementById('filter-branch')?.value || '';
    const level = document.getElementById('filter-level')?.value || '';
    const sort = document.getElementById('filter-sort')?.value || 'az';
    const pageSize = parseInt(document.getElementById('filter-page-size')?.value || '12');

    // 1. Lọc
    let filtered = allClasses.filter(cls => {
        const branchName = cls.branchName || cls.branch?.name || '';
        const clsLevel = cls.level || '';
        const clsBranchId = String(cls.branchId || cls.branch?.id || '');

        const matchSearch = !search ||
            (cls.name || '').toLowerCase().includes(search) ||
            branchName.toLowerCase().includes(search) ||
            clsLevel.toLowerCase().includes(search);

        const matchBranch = !branchId || clsBranchId === String(branchId);
        const matchLevel = !level || clsLevel === level;

        return matchSearch && matchBranch && matchLevel;
    });

    // 2. Sắp xếp
    filtered.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return sort === 'az' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    // 3. Phân trang
    const totalItems = filtered.length;
    const totalPages = pageSize >= 9999 ? 1 : Math.ceil(totalItems / pageSize);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const pageItems = pageSize >= 9999 ? filtered : filtered.slice(startIndex, startIndex + pageSize);

    // 4. Cập nhật text đếm
    const countText = document.getElementById('class-count-text');
    if (countText) {
        countText.textContent = `Hiển thị ${pageItems.length} / ${totalItems} lớp học`;
    }

    // 5. Render cards
    const container = document.getElementById('class-list-container');
    if (!container) return;

    if (pageItems.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="d-flex flex-column align-items-center text-muted">
                    <i class="fa-solid fa-folder-open fs-2 mb-3 text-light"></i>
                    <p class="mb-0 fs-5">Không tìm thấy lớp học nào phù hợp.</p>
                </div>
            </div>`;
    } else {
        container.innerHTML = pageItems.map(cls => `
            <div class="col-xl-4 col-md-6 mb-4">
                <div class="card lesson-card-modern edu-entity-card class-entity-card class-card-clickable h-100 d-flex flex-column" data-id="${cls.id}" tabindex="0" role="button" title="Xem chi tiết lớp học">
                    <div class="lesson-card-header">
                        <div class="lesson-icon-modern" style="background: linear-gradient(135deg, #10b981, #34d399);">
                            <i class="fa-solid fa-book-open"></i>
                        </div>
                        <div class="lesson-header-text">
                            <h5 class="fw-bold mb-1 class-card-title text-truncate" title="${cls.name || 'Không tên'}">${cls.name || 'Không tên'}</h5>
                            ${cls.level ? `<span class="badge lesson-badge-modern" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">Level ${cls.level}</span>` : '<span class="badge lesson-badge-modern" style="background: #f1f5f9; color: #64748b;">Chưa có Level</span>'}
                        </div>
                    </div>
                    <div class="lesson-card-body flex-grow-1">
                        <div class="lesson-info-row">
                            <div class="icon-bg-light icon-blue">
                                <i class="fa-solid fa-building"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Chi nhánh</span>
                                <span class="info-value fw-semibold text-dark text-truncate" title="${cls.branchName || cls.branch?.name || 'Chưa phân bổ'}">${cls.branchName || cls.branch?.name || 'Chưa phân bổ'}</span>
                            </div>
                        </div>
                        <div class="lesson-info-row mt-2">
                            <div class="icon-bg-light icon-blue" style="background: rgba(244,63,94,0.1); color: #f43f5e;">
                                <i class="fa-solid fa-money-bill-wave"></i>
                            </div>
                            <div class="lesson-info-text">
                                <span class="info-label">Học phí</span>
                                <span class="info-value fw-bold text-danger text-truncate">${cls.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cls.price) : 'Chưa có giá'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="lesson-card-footer d-flex justify-content-between gap-2">
                        <button class="btn flex-grow-1 btn-edit-modern btn-edit-class" data-id="${cls.id}">
                            <i class="fa-regular fa-pen-to-square me-1"></i> Sửa
                        </button>
                        <button class="btn flex-grow-1 btn-delete-modern btn-delete-class" data-id="${cls.id}" data-name="${cls.name}">
                            <i class="fa-regular fa-trash-can me-1"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.class-card-clickable').forEach(card => {
            const openDetail = () => {
                const cls = allClasses.find(c => String(c.id) === String(card.getAttribute('data-id')));
                if (cls) openClassDetailPage(cls);
            };

            card.addEventListener('click', (event) => {
                if (event.target.closest('button')) return;
                openDetail();
            });

            card.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                openDetail();
            });
        });

        // Gắn sự kiện nút Xóa
        container.querySelectorAll('.btn-delete-class').forEach(btn => {
            btn.addEventListener('click', () => {
                const classId = btn.getAttribute('data-id');
                const className = btn.getAttribute('data-name');
                const msgEl = document.getElementById('deleteClassMessage');
                if (msgEl) {
                    msgEl.innerHTML = `Bạn có chắc chắn muốn xóa lớp học <strong>"${className}"</strong>?<br>Hành động này không thể hoàn tác.`;
                }
                const deleteModalEl = document.getElementById('deleteClassModal');
                const deleteModal = bootstrap.Modal.getInstance(deleteModalEl) || new bootstrap.Modal(deleteModalEl);
                deleteModal.show();

                const btnConfirm = document.getElementById('btnConfirmDelete');
                const newBtnConfirm = btnConfirm.cloneNode(true);
                btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);

                newBtnConfirm.addEventListener('click', async () => {
                    try {
                        newBtnConfirm.textContent = 'Đang xóa...';
                        newBtnConfirm.disabled = true;
                        const delRes = await fetch(`/api/classes/${classId}`, { method: 'DELETE', headers: _classHeaders });
                        if (delRes.ok || delRes.status === 204) {
                            deleteModal.hide();
                            fetchAndRenderClasses(_classHeaders);
                        } else {
                            alert("Không thể xóa lớp học. Vui lòng thử lại!");
                        }
                    } catch (err) {
                        console.error("Lỗi khi xóa lớp:", err);
                        alert("Lỗi kết nối tới Server!");
                    } finally {
                        newBtnConfirm.textContent = 'Xóa';
                        newBtnConfirm.disabled = false;
                    }
                });
            });
        });

        // Gắn sự kiện nút Sửa
        container.querySelectorAll('.btn-edit-class').forEach(btn => {
            btn.addEventListener('click', () => {
                const cls = allClasses.find(c => String(c.id) === btn.getAttribute('data-id'));
                if (cls) openEditModal(cls, _classHeaders);
            });
        });
    }

    // 6. Render pagination buttons
    renderPagination(totalPages);
}

function openClassDetailPage(cls) {
    sessionStorage.setItem('selectedClassDetail', JSON.stringify(cls));
    sessionStorage.setItem('selectedClassId', cls.id);
    document.querySelectorAll('.dashboard-wrap .sidebar .nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector('.dashboard-wrap .sidebar .nav-item[data-page="class"]')?.classList.add('active');
    window.loadDashboardContent('class-detail', initClassDetailPage);
}

function renderPagination(totalPages) {
    const paginationEl = document.getElementById('pagination-controls');
    if (!paginationEl) return;

    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    const btnStyle = (isActive) => `
        style="min-width:34px; height:34px; border-radius:8px; border:1.5px solid ${isActive ? 'var(--primary-color)' : '#E0E5F2'};
        background:${isActive ? 'var(--primary-color)' : 'white'}; color:${isActive ? 'white' : '#4a5568'};
        font-weight:500; font-size:14px; cursor:pointer; transition: all 0.2s ease;"
    `;

    let html = `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}
        style="min-width:34px; height:34px; border-radius:8px; border:1.5px solid #E0E5F2; background:white;
        color:#4a5568; font-weight:500; font-size:14px; cursor:pointer; transition: all 0.2s ease;">‹</button>`;

    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="changePage(${i})" ${btnStyle(i === currentPage)}>${i}</button>`;
    }

    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}
        style="min-width:34px; height:34px; border-radius:8px; border:1.5px solid #E0E5F2; background:white;
        color:#4a5568; font-weight:500; font-size:14px; cursor:pointer; transition: all 0.2s ease;">›</button>`;

    paginationEl.innerHTML = html;
}

function changePage(page) {
    const pageSize = parseInt(document.getElementById('filter-page-size')?.value || '12');
    const search = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
    const branchId = document.getElementById('filter-branch')?.value || '';
    const level = document.getElementById('filter-level')?.value || '';
    let filtered = allClasses.filter(cls => {
        const branchName = cls.branchName || cls.branch?.name || '';
        const clsLevel = cls.level || '';
        const clsBranchId = String(cls.branchId || cls.branch?.id || '');
        const matchSearch = !search ||
            (cls.name || '').toLowerCase().includes(search) ||
            branchName.toLowerCase().includes(search) ||
            clsLevel.toLowerCase().includes(search);
        const matchBranch = !branchId || clsBranchId === String(branchId);
        const matchLevel = !level || clsLevel === level;
        return matchSearch && matchBranch && matchLevel;
    });
    const totalPages = Math.ceil(filtered.length / pageSize);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    applyFilters();
}


async function openEditModal(cls, headers) {
    // 1. Điền ID ẩn
    document.getElementById('editClassId').value = cls.id;

    // 2. Điền tên lớp & level & price
    document.getElementById('editClassName').value = cls.name || '';
    document.getElementById('editClassLevel').value = cls.level || '';
    document.getElementById('editClassPrice').value = cls.price || '';

    // 3. Load branches vào select và chọn sẵn chi nhánh hiện tại
    const selectBranch = document.getElementById('editClassBranch');
    selectBranch.innerHTML = '<option value="" disabled>Đang tải...</option>';
    try {
        const resBranch = await fetch('/api/branches', { headers });
        if (resBranch.ok) {
            const data = await resBranch.json();
            const branches = Array.isArray(data) ? data : (data.result ? data.result : []);
            selectBranch.innerHTML = '<option value="" disabled>Chọn chi nhánh</option>';
            branches.forEach(branch => {
                const option = document.createElement('option');
                option.value = branch.id;
                option.textContent = branch.name;
                // Chọn sẵn chi nhánh của lớp đang sửa
                const currentBranchId = cls.branchId || cls.branch?.id;
                if (String(branch.id) === String(currentBranchId)) {
                    option.selected = true;
                }
                selectBranch.appendChild(option);
            });
        }
    } catch (err) {
        console.error("Lỗi load branches cho form sửa:", err);
    }

    // 4. Mở modal
    const editModalEl = document.getElementById('editClassModal');
    const editModal = bootstrap.Modal.getInstance(editModalEl) || new bootstrap.Modal(editModalEl);
    editModal.show();

    // 5. Gắn sự kiện nút Lưu thay đổi (cloneNode để tránh duplicate listener)
    const btnSubmit = document.getElementById('btnSubmitEditClass');
    const newBtnSubmit = btnSubmit.cloneNode(true);
    btnSubmit.parentNode.replaceChild(newBtnSubmit, btnSubmit);

    newBtnSubmit.addEventListener('click', async () => {
        const branchId = document.getElementById('editClassBranch').value;
        const className = document.getElementById('editClassName').value.trim();
        const level = document.getElementById('editClassLevel').value.trim();
        const classId = document.getElementById('editClassId').value;
        const price = document.getElementById('editClassPrice').value;

        if (!branchId || !className) {
            alert("Vui lòng nhập tên lớp và chọn chi nhánh!");
            return;
        }

        const payload = { 
            name: className, 
            level: level, 
            branchId: parseInt(branchId),
            price: price ? parseFloat(price) : null 
        };

        try {
            newBtnSubmit.textContent = 'Đang lưu...';
            newBtnSubmit.disabled = true;

            const res = await fetch(`/api/classes/${classId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                editModal.hide();
                if (document.querySelector('.class-detail-page')) {
                    sessionStorage.setItem('selectedClassDetail', JSON.stringify({
                        ...cls,
                        name: className,
                        level: level,
                        branchId: parseInt(branchId)
                    }));
                    sessionStorage.setItem('selectedClassId', cls.id);
                    window.loadDashboardContent('class-detail', initClassDetailPage);
                } else {
                    fetchAndRenderClasses(headers);
                }
            } else {
                alert("Có lỗi xảy ra, không thể cập nhật lớp học!");
            }
        } catch (err) {
            console.error("Lỗi khi sửa lớp:", err);
            alert("Lỗi kết nối tới Server!");
        } finally {
            newBtnSubmit.textContent = 'Lưu thay đổi';
            newBtnSubmit.disabled = false;
        }
    });
}

