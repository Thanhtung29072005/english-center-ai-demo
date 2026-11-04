// ================================================
// CLASS DETAIL PAGE LOGIC
// ================================================

// Helper functions
function normalizeApiList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    if (Array.isArray(data?.data)) return data.data;
    return [];
}

function safeJsonParse(value) {
    try { return value ? JSON.parse(value) : null; } catch { return null; }
}

async function fetchApiList(url, headers) {
    const res = await fetch(url, { headers });
    if (!res.ok) return [];
    return normalizeApiList(await res.json());
}

async function fetchStudentsForClass(classId, headers) {
    const byClass = await fetchApiList(`/api/students/class/${classId}`, headers);
    if (byClass.length) return byClass;
    const all = await fetchApiList('/api/students', headers);
    return all.filter(s => String(s.classId) === String(classId));
}

async function fetchExamsForClass(classId, headers) {
    const byClass = await fetchApiList(`/api/exams/class/${classId}`, headers);
    if (byClass.length) return byClass;
    const all = await fetchApiList('/api/exams', headers);
    return all.filter(ex => String(ex.classId) === String(classId));
}

function getClassDetailTeachers(classId, classInfo, lessons, exams, teachers) {
    const map = new Map();
    const addTeacher = (id, name) => {
        const key = id ? String(id) : name;
        if (!key) return;
        map.set(key, { id, name: name || `GV-${id}` });
    };

    if (classInfo.teacherId || classInfo.teacherName) addTeacher(classInfo.teacherId, classInfo.teacherName);
    (classInfo.teachers || []).forEach(t => addTeacher(t.teacherId || t.id, t.teacherName || t.name || t.fullName));
    lessons.forEach(ls => addTeacher(ls.teacherId, ls.teacherName));
    exams.forEach(ex => addTeacher(ex.teacherId, ex.teacherName));
    teachers
        .filter(t => String(t.classId || '') === String(classId) ||
            (Array.isArray(t.classIds) && t.classIds.some(id => String(id) === String(classId))) ||
            (Array.isArray(t.classes) && t.classes.some(c => String(c.id) === String(classId))))
        .forEach(t => addTeacher(t.id, t.name || t.fullName));

    return [...map.values()];
}

function escapeClassDetailHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function formatClassDetailDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function renderClassDetailEmpty(text) {
    return `<div class="class-detail-empty">${text}</div>`;
}

function isClassDetailReadOnlyRole() {
    const role = localStorage.getItem('userRole');
    return ['3', '4', 'STUDENT', 'PARENT'].includes(String(role).toUpperCase());
}

function hideClassDetailAdminActions() {
    [
        'class-detail-btn-share',
        'class-detail-btn-edit',
        'class-detail-btn-delete',
        'class-detail-btn-assign-teacher',
        'class-detail-btn-add-student',
        'class-detail-btn-add-lesson',
        'class-detail-btn-add-exam'
    ].forEach(id => document.getElementById(id)?.style.setProperty('display', 'none'));
}

function renderClassDetailTeachers(teachers, classInfo, headers, isReadOnly = false) {
    const container = document.getElementById('class-detail-teacher-list');
    if (!container) return;
    container.innerHTML = teachers.length ? teachers.map(t => `
        <article class="class-detail-mini-card">
            <strong>${escapeClassDetailHtml(t.name || '-')}</strong>
            ${!isReadOnly && t.id ? `<button type="button" class="btn class-detail-remove-teacher" data-teacher-id="${t.id}" data-teacher-name="${escapeClassDetailHtml(t.name || '-')}">
                <i class="fa-regular fa-trash-can"></i>
            </button>` : ''}
        </article>
    `).join('') : renderClassDetailEmpty('Chưa có giáo viên');

    if (isReadOnly) return;

    container.querySelectorAll('.class-detail-remove-teacher').forEach(btn => {
        btn.addEventListener('click', async () => {
            const teacherId = btn.getAttribute('data-teacher-id');
            const teacherName = btn.getAttribute('data-teacher-name') || 'giáo viên này';
            if (!teacherId || !confirm(`Bỏ gán ${teacherName} khỏi lớp này?`)) return;

            try {
                btn.disabled = true;
                const res = await fetch(`/api/classes/${classInfo.id}/teachers/${teacherId}`, {
                    method: 'DELETE',
                    headers
                });

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(errText || 'Không thể bỏ gán giáo viên khỏi lớp');
                }

                sessionStorage.setItem('selectedClassDetail', JSON.stringify(classInfo));
                sessionStorage.setItem('selectedClassId', classInfo.id);
                window.loadDashboardContent('class-detail', initClassDetailPage);
            } catch (err) {
                console.error('Lỗi bỏ gán giáo viên khỏi lớp:', err);
                alert('Không thể bỏ gán giáo viên khỏi lớp. Vui lòng thử lại.');
            } finally {
                btn.disabled = false;
            }
        });
    });
}

function renderClassDetailStudents(students) {
    const container = document.getElementById('class-detail-student-list');
    if (!container) return;
    container.innerHTML = students.length ? students.slice(0, 4).map(s => `
        <article class="class-detail-mini-card">
            <div>
                <strong>${escapeClassDetailHtml(s.name || '-')}</strong>
                <span>${escapeClassDetailHtml(s.parentPhone || s.parentName || 'Chưa có thông tin phụ huynh')}</span>
            </div>
            <i class="fa-solid fa-chevron-down"></i>
        </article>
    `).join('') : renderClassDetailEmpty('Chưa có học sinh');
}

function renderClassDetailLessons(lessons, isReadOnly = false) {
    const container = document.getElementById('class-detail-lesson-list');
    if (!container) return;
    const sorted = [...lessons].sort((a, b) => new Date(b.lessonDate || 0) - new Date(a.lessonDate || 0));
    container.innerHTML = sorted.length ? sorted.slice(0, 3).map(ls => `
        <article class="class-detail-lesson-card">
            <div class="class-detail-lesson-head">
                <div class="class-detail-lesson-icon">
                    <i class="fa-solid fa-layer-group"></i>
                </div>
                <div class="class-detail-lesson-title">
                    <h4>${escapeClassDetailHtml(ls.className || `Buổi ${ls.lessonNumber ?? ''}`)}</h4>
                    <span class="class-detail-lesson-badge">Buổi ${escapeClassDetailHtml(ls.lessonNumber ?? '—')}</span>
                </div>
            </div>
            <div class="class-detail-lesson-body">
                <div class="class-detail-lesson-row">
                    <div class="class-detail-lesson-icon-sm class-detail-lesson-icon-date">
                        <i class="fa-regular fa-calendar"></i>
                    </div>
                    <div>
                        <span>Ngày học</span>
                        <strong>${formatClassDetailDate(ls.lessonDate)}</strong>
                    </div>
                </div>
                <div class="class-detail-lesson-row">
                    <div class="class-detail-lesson-icon-sm class-detail-lesson-icon-teacher">
                        <i class="fa-solid fa-chalkboard-user"></i>
                    </div>
                    <div>
                        <span>Giáo viên</span>
                        <strong>${escapeClassDetailHtml(ls.teacherName || '—')}</strong>
                    </div>
                </div>
            </div>
            ${!isReadOnly ? `
            <div class="class-detail-lesson-actions">
                <button class="btn class-detail-lesson-btn class-detail-lesson-btn-primary">
                    <i class="fa-regular fa-pen-to-square"></i>
                    <span>Sửa</span>
                </button>
                <button class="btn class-detail-lesson-btn class-detail-lesson-btn-danger">
                    <i class="fa-regular fa-trash-can"></i>
                    <span>Xóa</span>
                </button>
            </div>
            ` : ''}
        </article>
    `).join('') : renderClassDetailEmpty('Chưa có buổi học');
}

function renderClassDetailExams(exams) {
    const container = document.getElementById('class-detail-exam-list');
    if (!container) return;
    const sorted = [...exams].sort((a, b) => new Date(b.examDate || 0) - new Date(a.examDate || 0));
    container.innerHTML = sorted.length ? sorted.slice(0, 4).map(ex => `
        <article class="class-detail-mini-card class-detail-exam-card">
            <div>
                <strong>${escapeClassDetailHtml(ex.examType || 'Bài kiểm tra')}</strong>
                <span><i class="fa-regular fa-calendar"></i>${formatClassDetailDate(ex.examDate)}</span>
            </div>
        </article>
    `).join('') : renderClassDetailEmpty('Chưa có bài kiểm tra');
}

function openAssignTeachersModal(classInfo, branchTeachers, currentTeachers, headers) {
    const modalEl = document.getElementById('assignTeacherModal');
    if (!modalEl) return;

    const classId = String(classInfo.id);
    const assignedIds = new Set((currentTeachers || [])
        .map(t => t.teacherId || t.id)
        .filter(Boolean)
        .map(id => String(id)));
    const candidates = (branchTeachers || []).filter(teacher => !assignedIds.has(String(teacher.id)));

    const searchInput = document.getElementById('assign-teacher-search');
    const clearBtn = document.getElementById('assign-teacher-clear');
    const listEl = document.getElementById('assign-teacher-list');
    const emptyEl = document.getElementById('assign-teacher-empty');
    const countEl = document.getElementById('assign-teacher-count');
    const submitBtn = document.getElementById('btnSubmitAssignTeachers');

    if (!searchInput || !clearBtn || !listEl || !emptyEl || !countEl || !submitBtn) return;

    const state = {
        selected: new Set(),
        items: candidates
    };

    const render = () => {
        const keyword = searchInput.value.trim().toLowerCase();
        const filtered = state.items.filter(teacher => {
            return !keyword ||
                (teacher.name || teacher.fullName || '').toLowerCase().includes(keyword) ||
                (teacher.email || '').toLowerCase().includes(keyword) ||
                (teacher.phone || '').toLowerCase().includes(keyword);
        });

        emptyEl.style.display = filtered.length ? 'none' : 'block';
        countEl.textContent = String(state.selected.size);
        listEl.innerHTML = filtered.map(teacher => {
            const checked = state.selected.has(String(teacher.id)) ? 'checked' : '';
            return `
                <label class="d-flex align-items-center p-3 mb-2 rounded-3"
                    style="cursor:pointer; border:1px solid #E0E5F2; transition:all 0.15s ease; user-select:none;">
                    <input type="checkbox" class="assign-teacher-checkbox me-3" value="${teacher.id}" ${checked}
                        style="width:18px; height:18px; accent-color:#7B4BEF;">
                    <div class="flex-grow-1">
                        <div class="fw-semibold" style="font-size:14px; color:#1a202c;">
                            ${escapeClassDetailHtml(teacher.name || teacher.fullName || '—')}
                        </div>
                        <div class="text-muted" style="font-size:12px;">
                            ${escapeClassDetailHtml(teacher.email || 'Chưa có email')}
                            ${teacher.phone ? ` - ${escapeClassDetailHtml(teacher.phone)}` : ''}
                        </div>
                    </div>
                </label>
            `;
        }).join('');

        listEl.querySelectorAll('.assign-teacher-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                if (cb.checked) state.selected.add(String(cb.value));
                else state.selected.delete(String(cb.value));
                countEl.textContent = String(state.selected.size);
            });
        });
    };

    searchInput.oninput = render;
    clearBtn.onclick = () => {
        searchInput.value = '';
        render();
    };

    const freshSubmit = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(freshSubmit, submitBtn);
    freshSubmit.addEventListener('click', async () => {
        if (state.selected.size === 0) {
            alert('Vui lòng chọn ít nhất một giáo viên.');
            return;
        }

        try {
            freshSubmit.disabled = true;
            freshSubmit.textContent = 'Đang gán...';

            for (const teacherId of state.selected) {
                const res = await fetch(`/api/classes/${classId}/teachers/${teacherId}`, {
                    method: 'POST',
                    headers
                });

                if (!res.ok) {
                    const errText = await res.text();
                    if (res.status === 404 && errText.includes('Teacher already assigned')) continue;
                    throw new Error(errText || `Không thể gán giáo viên ${teacherId}`);
                }
            }

            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.hide();
            sessionStorage.setItem('selectedClassDetail', JSON.stringify(classInfo));
            sessionStorage.setItem('selectedClassId', classInfo.id);
            window.loadDashboardContent('class-detail', initClassDetailPage);
        } catch (err) {
            console.error('Lỗi gán giáo viên vào lớp:', err);
            alert('Không thể gán giáo viên vào lớp. Vui lòng thử lại.');
        } finally {
            freshSubmit.disabled = false;
            freshSubmit.textContent = 'Gán vào lớp';
        }
    });

    searchInput.value = '';
    render();
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
}

function openAssignStudentsModal(classInfo, students, classes, headers) {
    const modalEl = document.getElementById('assignStudentModal');
    if (!modalEl) return;

    const classId = String(classInfo.id);
    const classMap = new Map((classes || []).map(c => [String(c.id), c]));
    const candidates = (students || []).filter(student => String(student.classId || '') !== classId);

    const searchInput = document.getElementById('assign-student-search');
    const clearBtn = document.getElementById('assign-student-clear');
    const listEl = document.getElementById('assign-student-list');
    const emptyEl = document.getElementById('assign-student-empty');
    const countEl = document.getElementById('assign-student-count');
    const submitBtn = document.getElementById('btnSubmitAssignStudents');

    if (!searchInput || !clearBtn || !listEl || !emptyEl || !countEl || !submitBtn) return;

    const state = {
        selected: new Set(),
        items: candidates
    };

    const render = () => {
        const keyword = searchInput.value.trim().toLowerCase();
        const filtered = state.items.filter(student => {
            const className = classMap.get(String(student.classId))?.name || student.className || '';
            return !keyword ||
                (student.name || student.fullName || '').toLowerCase().includes(keyword) ||
                (student.parentName || '').toLowerCase().includes(keyword) ||
                className.toLowerCase().includes(keyword);
        });

        emptyEl.style.display = filtered.length ? 'none' : 'block';
        countEl.textContent = String(state.selected.size);
        listEl.innerHTML = filtered.map(student => {
            const studentClass = classMap.get(String(student.classId));
            const studentClassName = studentClass?.name || student.className || 'Chưa có lớp';
            const checked = state.selected.has(String(student.id)) ? 'checked' : '';
            return `
                <label class="d-flex align-items-center p-3 mb-2 rounded-3"
                    style="cursor:pointer; border:1px solid #E0E5F2; transition:all 0.15s ease; user-select:none;">
                    <input type="checkbox" class="assign-student-checkbox me-3" value="${student.id}" ${checked}
                        style="width:18px; height:18px; accent-color:#7B4BEF;">
                    <div class="flex-grow-1">
                        <div class="fw-semibold" style="font-size:14px; color:#1a202c;">
                            ${escapeClassDetailHtml(student.name || student.fullName || '—')}
                        </div>
                        <div class="text-muted" style="font-size:12px;">
                            ${escapeClassDetailHtml(studentClassName)}
                            ${student.parentName ? ` - ${escapeClassDetailHtml(student.parentName)}` : ''}
                        </div>
                    </div>
                </label>
            `;
        }).join('');

        listEl.querySelectorAll('.assign-student-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                if (cb.checked) state.selected.add(String(cb.value));
                else state.selected.delete(String(cb.value));
                countEl.textContent = String(state.selected.size);
            });
        });
    };

    searchInput.oninput = render;
    clearBtn.onclick = () => {
        searchInput.value = '';
        render();
    };

    const freshSubmit = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(freshSubmit, submitBtn);
    freshSubmit.addEventListener('click', async () => {
        if (state.selected.size === 0) {
            alert('Vui lòng chọn ít nhất một học sinh.');
            return;
        }

        try {
            freshSubmit.disabled = true;
            freshSubmit.textContent = 'Đang gán...';

            const selectedStudents = candidates.filter(s => state.selected.has(String(s.id)));
            for (const student of selectedStudents) {
                const payload = {
                    name: student.name || student.fullName || '',
                    dateOfBirth: student.dateOfBirth || student.dob || null,
                    classId: parseInt(classId),
                    parentName: student.parentName || null,
                    parentPhone: student.parentPhone || null,
                    parentEmail: student.parentEmail || null
                };

                const res = await fetch(`/api/students/${student.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(errText || `Không thể gán học sinh ${student.name || student.id}`);
                }
            }

            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.hide();
            sessionStorage.setItem('selectedClassDetail', JSON.stringify(classInfo));
            sessionStorage.setItem('selectedClassId', classInfo.id);
            window.loadDashboardContent('class-detail', initClassDetailPage);
        } catch (err) {
            console.error('Lỗi gán học sinh vào lớp:', err);
            alert('Không thể gán học sinh vào lớp. Vui lòng thử lại.');
        } finally {
            freshSubmit.disabled = false;
            freshSubmit.textContent = 'Gán vào lớp';
        }
    });

    render();
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
}

function openClassCreateModalFromDetail(pageName, initCallback, modalId, selectId, classInfo) {
    const run = async () => {
        if (typeof initCallback === 'function') {
            await initCallback();
        }
        const select = document.getElementById(selectId);
        if (select) {
            select.value = String(classInfo.id);
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.show();
        }
    };

    window.loadDashboardContent(pageName, () => {
        run().catch(err => console.error(`Lỗi mở form ${pageName}:`, err));
    });
}

// Main export function
export async function initClassDetailPage() {
    const token = localStorage.getItem('accessToken');
    const classId = sessionStorage.getItem('selectedClassId');
    if (!token || !classId) {
        window.loadDashboardContent('class', window.initClassPage);
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const isReadOnly = isClassDetailReadOnlyRole();
    const storedClass = safeJsonParse(sessionStorage.getItem('selectedClassDetail')) || {};
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? '-';
    };

    document.getElementById('class-detail-btn-back')?.addEventListener('click', () => {
        window.loadDashboardContent('class', window.initClassPage);
    });

    if (isReadOnly) {
        hideClassDetailAdminActions();
    } else {
        document.getElementById('class-detail-btn-share')?.addEventListener('click', async () => {
            const shareText = `${storedClass.name || 'Lớp học'} - Mã lớp: ${classId}`;
            try {
                await navigator.clipboard?.writeText(shareText);
                alert('Đã sao chép thông tin lớp học!');
            } catch {
                alert(shareText);
            }
        });
    }

    const goToPage = (pageName, initCallback) => {
        const navItem = document.querySelector(`.dashboard-wrap .sidebar .nav-item[data-page="${pageName}"]`);
        if (navItem) navItem.click();
        else window.loadDashboardContent(pageName, initCallback);
    };

    document.getElementById('class-detail-btn-view-students')?.addEventListener('click', () => goToPage('student', window.initStudentPage));
    document.getElementById('class-detail-btn-view-lessons')?.addEventListener('click', () => goToPage('lesson', window.initLessonPage));
    document.getElementById('class-detail-btn-view-exams')?.addEventListener('click', () => goToPage('exam', window.initExamPage));

    try {
        const [classes, students, allStudents, lessons, exams, teachers] = await Promise.all([
            fetchApiList('/api/classes', headers),
            fetchStudentsForClass(classId, headers),
            fetchApiList('/api/students', headers),
            fetchApiList('/api/lessons', headers),
            fetchExamsForClass(classId, headers),
            fetchApiList('/api/teachers', headers)
        ]);

        const classInfo = classes.find(c => String(c.id) === String(classId)) || storedClass;
        const branchId = classInfo.branchId || classInfo.branch?.id;
        const branchTeachers = branchId ? await fetchApiList(`/api/teachers/branch/${branchId}`, headers) : [];
        const classLessons = lessons.filter(ls => String(ls.classId) === String(classId));
        const classExams = exams.filter(ex => !ex.classId || String(ex.classId) === String(classId));
        const classTeachers = getClassDetailTeachers(classId, classInfo, classLessons, classExams, teachers);

        if (!isReadOnly) {
            document.getElementById('class-detail-btn-edit')?.addEventListener('click', () => {
                window.openEditModal(classInfo, headers);
            });

            document.getElementById('class-detail-btn-assign-teacher')?.addEventListener('click', () => {
                if (!branchId) {
                    alert('Lớp học chưa có chi nhánh nên không thể lọc giáo viên.');
                    return;
                }
                openAssignTeachersModal(classInfo, branchTeachers, classTeachers, headers);
            });

            document.getElementById('class-detail-btn-add-student')?.addEventListener('click', () => {
                openAssignStudentsModal(classInfo, allStudents, classes, headers);
            });

            document.getElementById('class-detail-btn-add-lesson')?.addEventListener('click', () => {
                openClassCreateModalFromDetail('lesson', window.initLessonPage, 'createLessonModal', 'newLessonClassId', classInfo);
            });

            document.getElementById('class-detail-btn-add-exam')?.addEventListener('click', () => {
                openClassCreateModalFromDetail('exam', window.initExamPage, 'createExamModal', 'newExamClassId', classInfo);
            });

            document.getElementById('class-detail-btn-delete')?.addEventListener('click', () => {
                const deleteModalEl = document.getElementById('deleteClassModal');
                const deleteModal = bootstrap.Modal.getInstance(deleteModalEl) || new bootstrap.Modal(deleteModalEl);
                const msgEl = document.getElementById('deleteClassMessage');
                if (msgEl) {
                    msgEl.innerHTML = `Bạn có chắc chắn muốn xóa lớp học <strong>"${classInfo.name || 'Lớp học'}"</strong>?<br>Hành động này không thể hoàn tác.`;
                }
                deleteModal.show();

                const btnConfirm = document.getElementById('btnConfirmDelete');
                const newBtnConfirm = btnConfirm.cloneNode(true);
                btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);

                newBtnConfirm.addEventListener('click', async () => {
                    try {
                        newBtnConfirm.textContent = 'Đang xóa...';
                        newBtnConfirm.disabled = true;
                        const res = await fetch(`/api/classes/${classId}`, {
                            method: 'DELETE',
                            headers
                        });
                        if (res.ok || res.status === 204) {
                            deleteModal.hide();
                            sessionStorage.removeItem('selectedClassDetail');
                            sessionStorage.removeItem('selectedClassId');
                            window.loadDashboardContent('class', window.initClassPage);
                        } else {
                            alert('Không thể xóa lớp học. Vui lòng thử lại!');
                        }
                    } catch (err) {
                        console.error('Lỗi khi xóa lớp từ trang chi tiết:', err);
                        alert('Lỗi kết nối tới Server!');
                    } finally {
                        newBtnConfirm.textContent = 'Xác nhận Xóa';
                        newBtnConfirm.disabled = false;
                    }
                });
            });
        }

        setText('class-detail-name', classInfo.name || 'Lớp học');
        setText('class-detail-branch', classInfo.branchName || classInfo.branch?.name || 'Chi nhánh chính');
        setText('class-detail-created-date', formatClassDetailDate(classInfo.createdAt || classInfo.createdDate || classInfo.createDate));
        setText('class-detail-lesson-count', classLessons.length);
        setText('class-detail-exam-count', classExams.length);
        setText('class-detail-student-count', students.length);
        setText('class-detail-teacher-count', classTeachers.length);
        setText('class-detail-teacher-title-count', classTeachers.length);
        setText('class-detail-student-title-count', students.length);
        setText('class-detail-lesson-title-count', classLessons.length);
        setText('class-detail-exam-title-count', classExams.length);

        renderClassDetailTeachers(classTeachers, classInfo, headers, isReadOnly);
        renderClassDetailStudents(students);
        renderClassDetailLessons(classLessons, isReadOnly);
        renderClassDetailExams(classExams);
    } catch (err) {
        console.error('Lỗi tải chi tiết lớp:', err);
        setText('class-detail-name', storedClass.name || 'Không thể tải lớp học');
    }
}
