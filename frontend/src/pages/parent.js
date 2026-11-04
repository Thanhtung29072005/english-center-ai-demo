// ================================================
// PARENT PAGE LOGIC — Gán phụ huynh cho học sinh
// ================================================
let _parentHeaders = null;
let _parentAllStudents = []; // students of selected class
let _parentAllParents = [];  // all users with role PARENT

export async function initParentPage() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    _parentHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // 1. Load danh sách lớp học
    try {
        const res = await fetch('/api/classes', { headers: _parentHeaders });
        if (res.ok) {
            const data = await res.json();
            const classes = Array.isArray(data) ? data : (data.result || []);
            const sel = document.getElementById('parent-select-class');
            if (sel) {
                sel.innerHTML = '<option value="" disabled selected>-- Chọn lớp học --</option>';
                classes.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.name;
                    sel.appendChild(opt);
                });
            }
        }
    } catch (err) { console.error('Lỗi load classes (parent page):', err); }

    // 2. Load danh sách phụ huynh (role = PARENT)
    try {
        const res = await fetch('/api/Users', { headers: _parentHeaders });
        if (res.ok) {
            const data = await res.json();
            const allUsers = Array.isArray(data) ? data : (data.result || []);
            _parentAllParents = allUsers.filter(u => u.role === 'PARENT');
            const sel = document.getElementById('parent-select-parent');
            if (sel) {
                sel.innerHTML = '<option value="">-- Chọn phụ huynh --</option>';
                _parentAllParents.forEach(u => {
                    const opt = document.createElement('option');
                    opt.value = u.id;
                    opt.textContent = `${u.fullName || u.username} ${u.phone ? '— ' + u.phone : ''}`;
                    sel.appendChild(opt);
                });
            }
        }
    } catch (err) { console.error('Lỗi load parents:', err); }

    // 3. Load chi nhánh cho modal Tạo mới PH
    try {
        const res = await fetch('/api/branches', { headers: _parentHeaders });
        if (res.ok) {
            const data = await res.json();
            const branches = Array.isArray(data) ? data : (data.result || []);
            const sel = document.getElementById('newParentBranchId');
            if (sel) {
                sel.innerHTML = '<option value="" disabled selected>Chọn chi nhánh</option>';
                branches.forEach(b => {
                    const opt = document.createElement('option');
                    opt.value = b.id;
                    opt.textContent = b.name;
                    sel.appendChild(opt);
                });
            }
        }
    } catch (err) { console.error('Lỗi load branches (parent modal):', err); }

    // 4. Event: Chọn lớp → load học sinh
    const classSelect = document.getElementById('parent-select-class');
    if (classSelect) {
        classSelect.addEventListener('change', async () => {
            const classId = classSelect.value;
            if (!classId) return;
            await loadStudentsByClass(classId);
        });
    }

    // 5. Event: Tìm kiếm học sinh
    const searchInput = document.getElementById('parent-search-student');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderParentStudentList(_parentAllStudents, searchInput.value);
        });
    }

    // 6. Event: Chọn phụ huynh → hiện info card + load HS đang được gán
    const parentSelect = document.getElementById('parent-select-parent');
    if (parentSelect) {
        parentSelect.addEventListener('change', async () => {
            const parentId = parentSelect.value;
            const infoCard = document.getElementById('parent-info-card');
            const assignedSection = document.getElementById('parent-current-assigned');

            if (!parentId) {
                if (infoCard) infoCard.style.display = 'none';
                if (assignedSection) assignedSection.style.display = 'none';
                return;
            }

            const parent = _parentAllParents.find(u => String(u.id) === String(parentId));
            if (parent && infoCard) {
                document.getElementById('parent-info-name').textContent = parent.fullName || parent.username || '—';
                document.getElementById('parent-info-email').textContent = parent.email || '—';
                document.getElementById('parent-info-phone').textContent = parent.phone ? '📞 ' + parent.phone : '';
                infoCard.style.display = 'block';
                infoCard.style.background = 'rgba(123,75,239,0.05)';
                infoCard.style.border = '1px solid rgba(123,75,239,0.2)';
                infoCard.style.borderRadius = '10px';
                infoCard.style.padding = '12px';
            }

            // Load HS đang được gán cho PH này
            await loadAssignedStudents(parentId);
        });
    }

    // 7. Event: Nút Lưu gán
    const btnAssign = document.getElementById('parent-btn-assign');
    if (btnAssign) {
        btnAssign.addEventListener('click', async () => {
            const parentId = document.getElementById('parent-select-parent').value;
            if (!parentId) { alert('Vui lòng chọn phụ huynh!'); return; }

            const checked = document.querySelectorAll('.parent-student-checkbox:checked');
            if (checked.length === 0) { alert('Vui lòng chọn ít nhất một học sinh!'); return; }

            const studentIds = [...checked].map(cb => parseInt(cb.value));

            try {
                btnAssign.textContent = 'Đang lưu...';
                btnAssign.disabled = true;
                const res = await fetch(`/api/Users/${parentId}/students`, {
                    method: 'POST',
                    headers: _parentHeaders,
                    body: JSON.stringify(studentIds)
                });
                if (res.ok) {
                    alert('Gán phụ huynh thành công!');
                    await loadAssignedStudents(parentId);
                    // Bỏ chọn tất cả
                    document.querySelectorAll('.parent-student-checkbox').forEach(cb => cb.checked = false);
                    updateParentSelectedCount();
                } else {
                    const errText = await res.text();
                    console.error('API error:', errText);
                    alert('Có lỗi xảy ra, không thể gán phụ huynh!');
                }
            } catch (err) {
                console.error('Lỗi gán phụ huynh:', err);
                alert('Lỗi kết nối tới Server!');
            } finally {
                btnAssign.innerHTML = '<i class="fa-solid fa-link me-2"></i>Lưu gán phụ huynh';
                btnAssign.disabled = false;
            }
        });
    }

    // 8. Event: Nút Tạo phụ huynh mới
    const btnOpenCreate = document.getElementById('parent-btn-create-parent');
    if (btnOpenCreate) {
        btnOpenCreate.addEventListener('click', () => {
            const modalEl = document.getElementById('createParentModal');
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.show();
        });
    }

    // 9. Submit tạo PH mới
    const btnCreate = document.getElementById('btnSubmitCreateParent');
    if (btnCreate) {
        const freshBtn = btnCreate.cloneNode(true);
        btnCreate.parentNode.replaceChild(freshBtn, btnCreate);
        freshBtn.addEventListener('click', async () => {
            const username = document.getElementById('newParentUsername').value.trim();
            const password = document.getElementById('newParentPassword').value.trim();
            const fullName = document.getElementById('newParentFullName').value.trim();
            const email = document.getElementById('newParentEmail').value.trim();
            const phone = document.getElementById('newParentPhone').value.trim();
            const branchId = document.getElementById('newParentBranchId').value;

            if (!username || !password || !branchId) {
                alert('Vui lòng nhập tên đăng nhập, mật khẩu và chọn chi nhánh!');
                return;
            }

            const payload = {
                username, password, fullName, email, phone,
                role: 'PARENT',
                isActive: true,
                branchId: parseInt(branchId)
            };

            try {
                freshBtn.textContent = 'Đang xử lý...';
                freshBtn.disabled = true;
                const res = await fetch('/api/Users', {
                    method: 'POST',
                    headers: _parentHeaders,
                    body: JSON.stringify(payload)
                });
                if (res.ok || res.status === 201) {
                    alert('Tạo phụ huynh mới thành công!');
                    const modalEl = document.getElementById('createParentModal');
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                    document.getElementById('createParentForm').reset();
                    // Reload danh sách PH
                    const resU = await fetch('/api/Users', { headers: _parentHeaders });
                    if (resU.ok) {
                        const d = await resU.json();
                        const all = Array.isArray(d) ? d : (d.result || []);
                        _parentAllParents = all.filter(u => u.role === 'PARENT');
                        const sel = document.getElementById('parent-select-parent');
                        if (sel) {
                            sel.innerHTML = '<option value="">-- Chọn phụ huynh --</option>';
                            _parentAllParents.forEach(u => {
                                const opt = document.createElement('option');
                                opt.value = u.id;
                                opt.textContent = `${u.fullName || u.username} ${u.phone ? '— ' + u.phone : ''}`;
                                sel.appendChild(opt);
                            });
                        }
                    }
                } else {
                    const errText = await res.text();
                    console.error('API error:', errText);
                    alert('Có lỗi xảy ra, không thể tạo phụ huynh!');
                }
            } catch (err) {
                console.error('Lỗi tạo PH:', err);
                alert('Lỗi kết nối tới Server!');
            } finally {
                freshBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i>Tạo mới';
                freshBtn.disabled = false;
            }
        });
    }
}

async function loadStudentsByClass(classId) {
    const container = document.getElementById('parent-student-list');
    if (!container) return;
    container.innerHTML = `<div class="text-center py-4 text-muted" style="font-size: 14px;">Đang tải...</div>`;

    try {
        const res = await fetch(`/api/students/class/${classId}`, { headers: _parentHeaders });
        let students = [];
        if (res.ok) {
            const data = await res.json();
            students = Array.isArray(data) ? data : (data.result || []);
        }
        _parentAllStudents = students;
        renderParentStudentList(students, '');
    } catch (err) {
        console.error('Lỗi load students:', err);
        container.innerHTML = `<div class="text-center py-4 text-danger" style="font-size: 14px;">Không thể tải danh sách học sinh.</div>`;
    }
}

function renderParentStudentList(students, search) {
    const container = document.getElementById('parent-student-list');
    if (!container) return;

    const keyword = (search || '').toLowerCase().trim();
    const filtered = keyword
        ? students.filter(s => (s.name || s.fullName || '').toLowerCase().includes(keyword))
        : students;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center py-5 text-muted" style="font-size: 14px;">
            <i class="fa-solid fa-user-slash mb-2" style="font-size: 24px; opacity: 0.3; display: block;"></i>
            ${students.length === 0 ? 'Lớp học này chưa có học sinh nào.' : 'Không tìm thấy học sinh phù hợp.'}
        </div>`;
        return;
    }

    container.innerHTML = filtered.map(s => {
        const dob = s.dob || s.dateOfBirth;
        const dobStr = dob ? new Date(dob).toLocaleDateString('vi-VN') : null;
        const idHtml = `psc_${s.id}`;
        return `
        <label for="${idHtml}" class="parent-student-item d-flex align-items-center p-3 mb-2 rounded-3"
            style="cursor: pointer; border: 1.5px solid #E0E5F2; transition: all 0.15s ease; user-select: none;"
            onmouseover="this.style.borderColor='rgba(123,75,239,0.4)'"
            onmouseout="if(!document.getElementById('${idHtml}').checked) this.style.borderColor='#E0E5F2'">
            <input type="checkbox" class="parent-student-checkbox me-3 d-none" id="${idHtml}" value="${s.id}"
                onchange="parentStudentChecked(this)">
            <div class="parent-checkbox-visual me-3 d-flex align-items-center justify-content-center"
                style="width: 22px; height: 22px; border-radius: 6px; border: 2px solid #E0E5F2;
                       background: white; transition: all 0.15s ease; flex-shrink: 0;">
            </div>
            <div class="me-3 d-flex align-items-center justify-content-center"
                style="width: 38px; height: 38px; border-radius: 10px; background: rgba(123,75,239,0.1);
                       color: #7B4BEF; font-size: 15px; font-weight: 700; flex-shrink: 0;">
                ${(s.name || s.fullName || '?').charAt(0).toUpperCase()}
            </div>
            <div class="flex-grow-1">
                <div class="fw-semibold" style="font-size: 14px; color: #1a202c;">${s.name || s.fullName || '—'}</div>
                ${dobStr ? `<div class="text-muted" style="font-size: 12px;">Sinh ngày: ${dobStr}</div>` : ''}
            </div>
        </label>`;
    }).join('');

    updateParentSelectedCount();
}

function parentStudentChecked(cb) {
    const label = cb.closest('label');
    const visual = label ? label.querySelector('.parent-checkbox-visual') : null;
    if (cb.checked) {
        if (label) {
            label.style.borderColor = '#7B4BEF';
            label.style.background = 'rgba(123,75,239,0.05)';
        }
        if (visual) {
            visual.style.background = '#7B4BEF';
            visual.style.borderColor = '#7B4BEF';
            visual.innerHTML = '<i class="fa-solid fa-check" style="color:white; font-size: 12px;"></i>';
        }
    } else {
        if (label) {
            label.style.borderColor = '#E0E5F2';
            label.style.background = 'white';
        }
        if (visual) {
            visual.style.background = 'white';
            visual.style.borderColor = '#E0E5F2';
            visual.innerHTML = '';
        }
    }
    updateParentSelectedCount();
}

function updateParentSelectedCount() {
    const count = document.querySelectorAll('.parent-student-checkbox:checked').length;
    const info = document.getElementById('parent-assign-info');
    const countEl = document.getElementById('parent-selected-count');
    if (info) info.style.display = count > 0 ? 'block' : 'none';
    if (countEl) countEl.textContent = count;
}

async function loadAssignedStudents(parentId) {
    const section = document.getElementById('parent-current-assigned');
    const listEl = document.getElementById('parent-current-assigned-list');
    if (!section || !listEl) return;

    try {
        const res = await fetch(`/api/Users/${parentId}/students`, { headers: _parentHeaders });
        if (res.ok) {
            const data = await res.json();
            const students = Array.isArray(data) ? data : (data.result || []);
            if (students.length === 0) {
                section.style.display = 'none';
                return;
            }
            section.style.display = 'block';
            listEl.innerHTML = students.map(s => `
                <div class="d-flex align-items-center p-2 mb-1 rounded-2"
                    style="background: rgba(123,75,239,0.05); border: 1px solid rgba(123,75,239,0.1);">
                    <i class="fa-solid fa-circle-check me-2" style="color: #7B4BEF; font-size: 13px;"></i>
                    <span style="font-size: 13px; color: #4a5568;">${s.name || s.fullName || s.studentName || '—'}</span>
                </div>
            `).join('');
        } else {
            section.style.display = 'none';
        }
    } catch (err) {
        console.error('Lỗi load assigned students:', err);
        section.style.display = 'none';
    }
}