let allExams = [];
let _examHeaders = null;
let examCurrentPage = 1;
let examTimerId = null;

const $ = (id) => document.getElementById(id);
const role = () => String(localStorage.getItem('userRole') || '').toUpperCase();
const isStudent = () => ['3', 'STUDENT'].includes(role());
const isParent = () => ['4', 'PARENT'].includes(role());
const unwrap = (data) => Array.isArray(data) ? data : (data?.result || data?.data || []);
const esc = (v = '') => String(v ?? '').replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const fmtDate = (v) => v ? new Date(v).toLocaleDateString('vi-VN') : 'N/A';
const fmtDateTime = (v) => v ? new Date(v).toLocaleString('vi-VN') : 'N/A';
const toLocalInput = (v) => v ? String(v).slice(0, 16) : '';
const toApiDateTime = (v) => v ? `${v}:00` : null;
const authJson = () => ({ 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Content-Type': 'application/json' });
const authOnly = () => ({ 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` });
const fileUrl = (url) => url?.startsWith('http') ? url : url || '';
const parseScore = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : null;
};
const avgExamScore = (r) => {
    const scores = [r.readingWritingScore, r.listeningScore, r.speakingScore].map(parseScore).filter(v => v !== null);
    return scores.length ? scores.reduce((sum, v) => sum + v, 0) / scores.length : null;
};
const fmtAvgScore = (r) => {
    const avg = avgExamScore(r);
    return avg === null ? 'Chưa có điểm' : avg.toFixed(2);
};

export async function initExamPage() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    _examHeaders = authJson();
    if (isStudent()) {
        await renderStudentExamList();
        return;
    }
    if (isParent()) {
        await renderParentExamResults();
        return;
    }
    await loadExamSelects();
    bindCreateExam();
    bindFilters();
    await fetchAndRenderExams();
}

async function apiList(url, headers = _examHeaders) {
    const res = await fetch(url, { headers });
    if (!res.ok) return [];
    return unwrap(await res.json());
}

async function apiOne(url, headers = _examHeaders) {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    return await res.json();
}

async function loadExamSelects() {
    try {
        const [classes, teachers] = await Promise.all([apiList('/api/classes'), apiList('/api/teachers')]);
        ['newExamClassId', 'editExamClassId', 'exam-filter-class'].forEach(id => {
            const sel = $(id);
            if (!sel) return;
            const first = id === 'exam-filter-class' ? '<option value="">-- Tất cả lớp --</option>' : '<option value="" disabled selected>Chọn lớp học</option>';
            sel.innerHTML = first + classes.map(c => `<option value="${c.id}">${esc(c.name || c.className || `Lớp ${c.id}`)}</option>`).join('');
        });
        ['newExamTeacherId', 'editExamTeacherId'].forEach(id => {
            const sel = $(id);
            if (!sel) return;
            sel.innerHTML = '<option value="" disabled selected>Chọn giáo viên</option>' + teachers.map(t => `<option value="${t.id}">${esc(t.name || t.fullName || `GV-${t.id}`)}</option>`).join('');
        });
    } catch (err) {
        console.error('Lỗi load select exam:', err);
    }
}

function getExamPayload(prefix) {
    const classId = $(`${prefix}ExamClassId`)?.value;
    const teacherId = $(`${prefix}ExamTeacherId`)?.value;
    const examType = $(`${prefix}ExamType`)?.value;
    const examDate = $(`${prefix}ExamDate`)?.value;
    const title = $(`${prefix}ExamTitle`)?.value?.trim();
    const durationMinutes = $(`${prefix}ExamDuration`)?.value;
    if (!classId || !teacherId || !examType || !examDate || !title || !durationMinutes) {
        alert('Vui lòng nhập đủ lớp, giáo viên, loại, tiêu đề, thời lượng và ngày kiểm tra!');
        return null;
    }
    return {
        classId: parseInt(classId),
        teacherId: parseInt(teacherId),
        examType,
        examDate,
        title,
        description: $(`${prefix}ExamDescription`)?.value?.trim() || '',
        durationMinutes: parseInt(durationMinutes),
        startTime: toApiDateTime($(`${prefix}ExamStartTime`)?.value),
        endTime: toApiDateTime($(`${prefix}ExamEndTime`)?.value),
        status: $(`${prefix}ExamStatus`)?.value || 'DRAFT'
    };
}

function bindCreateExam() {
    document.querySelector('.btn-create-exam')?.addEventListener('click', () => {
        const modalEl = $('createExamModal');
        if (modalEl && window.bootstrap) (bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)).show();
    });
    const btn = $('btnSubmitCreateExam');
    if (!btn) return;
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', async () => {
        const payload = getExamPayload('new');
        if (!payload) return;
        await submitButton(fresh, 'Đang xử lý...', async () => {
            const res = await fetch('/api/exams', { method: 'POST', headers: _examHeaders, body: JSON.stringify(payload) });
            if (!res.ok && res.status !== 201) throw new Error(await res.text());
            const createdExam = await res.json();
            const pdfFile = $('newExamPdf')?.files?.[0];
            if (pdfFile && createdExam?.id) await uploadPdfFile(createdExam.id, pdfFile);
            bootstrap.Modal.getInstance($('createExamModal'))?.hide();
            $('createExamForm')?.reset();
            await fetchAndRenderExams();
        }, 'Tạo mới', 'Tạo bài kiểm tra mới thành công!');
    });
}

function bindFilters() {
    if ($('exam-filter-search')?._examFilterBound) return;
    $('exam-filter-class')?.addEventListener('change', async e => { examCurrentPage = 1; await fetchAndRenderExams(e.target.value || null); });
    ['exam-filter-search', 'exam-filter-teacher', 'exam-filter-type', 'exam-filter-date-from', 'exam-filter-date-to', 'exam-filter-sort', 'exam-filter-page-size']
        .forEach(id => $(id)?.addEventListener('input', () => { examCurrentPage = 1; applyExamFilters(); }));
    $('exam-btn-reset-filter')?.addEventListener('click', async () => {
        ['exam-filter-class', 'exam-filter-search', 'exam-filter-teacher', 'exam-filter-type', 'exam-filter-date-from', 'exam-filter-date-to'].forEach(id => { if ($(id)) $(id).value = ''; });
        if ($('exam-filter-sort')) $('exam-filter-sort').value = 'newest';
        if ($('exam-filter-page-size')) $('exam-filter-page-size').value = '12';
        examCurrentPage = 1;
        await fetchAndRenderExams(null);
    });
    if ($('exam-filter-search')) $('exam-filter-search')._examFilterBound = true;
}

async function fetchAndRenderExams(classId = null) {
    const container = $('exam-list-container');
    if (!container) return;
    container.innerHTML = '<div class="col-12 text-center py-4 text-muted">Đang tải dữ liệu...</div>';
    try {
        let url = isParent() ? '/api/parent/my-exam-results' : (classId ? `/api/exams/class/${classId}` : '/api/exams');
        allExams = await apiList(url);
        fillDynamicFilters();
        applyExamFilters();
    } catch (err) {
        console.error('Lỗi fetch exams:', err);
        container.innerHTML = '<div class="col-12 text-center py-4 text-danger">Không thể tải danh sách bài kiểm tra.</div>';
    }
}

function fillDynamicFilters() {
    const teacherSelect = $('exam-filter-teacher');
    if (teacherSelect) {
        const current = teacherSelect.value;
        teacherSelect.innerHTML = '<option value="">Tất cả</option>' + [...new Set(allExams.map(e => e.teacherName).filter(Boolean))].sort().map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
        teacherSelect.value = current;
    }
    const typeSelect = $('exam-filter-type');
    if (typeSelect) {
        const current = typeSelect.value;
        typeSelect.innerHTML = '<option value="">Tất cả</option>' + [...new Set(allExams.map(e => e.examType).filter(Boolean))].sort().map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
        typeSelect.value = current;
    }
}

function applyExamFilters() {
    const search = ($('exam-filter-search')?.value || '').toLowerCase().trim();
    const teacher = $('exam-filter-teacher')?.value || '';
    const type = $('exam-filter-type')?.value || '';
    const dateFrom = $('exam-filter-date-from')?.value || '';
    const dateTo = $('exam-filter-date-to')?.value || '';
    const sort = $('exam-filter-sort')?.value || 'newest';
    const pageSize = parseInt($('exam-filter-page-size')?.value || '12');
    let filtered = allExams.filter(ex => {
        const hay = `${ex.title || ''} ${ex.className || ''} ${ex.examType || ''} ${ex.teacherName || ''}`.toLowerCase();
        const exDate = ex.examDate ? new Date(ex.examDate) : null;
        return (!search || hay.includes(search)) && (!teacher || ex.teacherName === teacher) && (!type || ex.examType === type)
            && (!dateFrom || (exDate && exDate >= new Date(dateFrom))) && (!dateTo || (exDate && exDate <= new Date(`${dateTo}T23:59:59`)));
    });
    filtered.sort((a, b) => sort === 'oldest' ? new Date(a.examDate || 0) - new Date(b.examDate || 0)
        : sort === 'az' ? (a.className || '').localeCompare(b.className || '')
            : sort === 'za' ? (b.className || '').localeCompare(a.className || '')
                : new Date(b.examDate || 0) - new Date(a.examDate || 0));
    const totalItems = filtered.length;
    const totalPages = pageSize >= 9999 ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));
    examCurrentPage = Math.min(examCurrentPage, totalPages);
    const pageItems = pageSize >= 9999 ? filtered : filtered.slice((examCurrentPage - 1) * pageSize, examCurrentPage * pageSize);
    if ($('exam-count-text')) $('exam-count-text').textContent = `Hiển thị ${pageItems.length} / ${totalItems} bài kiểm tra`;
    renderExamCards(pageItems);
    renderExamPagination(totalPages);
}

function renderExamCards(items) {
    const container = $('exam-list-container');
    if (!container) return;
    if (!items.length) {
        container.innerHTML = '<div class="col-12 text-center py-4 text-muted">Không tìm thấy bài kiểm tra nào phù hợp.</div>';
        return;
    }
    container.innerHTML = items.map(ex => `
        <div class="col-xl-4 col-md-6 mb-4">
            <div class="card lesson-card-modern edu-entity-card exam-entity-card h-100 d-flex flex-column">
                <div class="exam-card-clickable lesson-card-header" data-id="${ex.id}" style="cursor:pointer;" title="Xem chi tiết">
                    <div class="lesson-icon-modern" style="background: linear-gradient(135deg, #8b5cf6, #d946ef);"><i class="fa-solid fa-file-signature"></i></div>
                    <div class="lesson-header-text">
                        <h5 class="fw-bold mb-1 class-card-title text-truncate" title="${esc(ex.title || ex.className)}">${esc(ex.title || ex.className || 'Không tên')}</h5>
                        <span class="badge lesson-badge-modern" style="background: rgba(139,92,246,.1); color:#8b5cf6;">${esc(ex.status || ex.examType || 'DRAFT')}</span>
                    </div>
                </div>
                <div class="exam-card-clickable lesson-card-body flex-grow-1" data-id="${ex.id}" style="cursor:pointer;">
                    ${infoRow('fa-regular fa-calendar', 'Ngày thi', fmtDate(ex.examDate))}
                    ${infoRow('fa-solid fa-clock', 'Thời lượng', `${ex.durationMinutes || 0} phút`)}
                    ${infoRow('fa-solid fa-chalkboard-user', 'Giáo viên', esc(ex.teacherName || 'N/A'))}
                    ${ex.pdfFileUrl ? infoRow('fa-regular fa-file-pdf', 'PDF', 'Đã upload') : ''}
                </div>
                <div class="lesson-card-footer d-flex justify-content-between gap-2">
                    <button class="btn flex-grow-1 btn-edit-modern btn-edit-exam" data-id="${ex.id}"><i class="fa-regular fa-pen-to-square me-1"></i> Sửa</button>
                    <button class="btn flex-grow-1 btn-delete-modern btn-delete-exam" data-id="${ex.id}" data-name="${esc(ex.title || ex.className)}"><i class="fa-regular fa-trash-can me-1"></i> Xóa</button>
                </div>
            </div>
        </div>`).join('');
    container.querySelectorAll('.exam-card-clickable').forEach(el => el.addEventListener('click', () => openExamDetailById(el.dataset.id)));
    container.querySelectorAll('.btn-edit-exam').forEach(btn => btn.addEventListener('click', () => openEditExamModal(allExams.find(e => String(e.id) === btn.dataset.id))));
    container.querySelectorAll('.btn-delete-exam').forEach(btn => btn.addEventListener('click', () => deleteExam(btn.dataset.id, btn.dataset.name)));
}

function infoRow(icon, label, value) {
    return `<div class="lesson-info-row mt-3"><div class="icon-bg-light icon-blue"><i class="${icon}"></i></div><div class="lesson-info-text"><span class="info-label">${label}</span><span class="info-value fw-semibold text-dark">${value}</span></div></div>`;
}

function renderExamPagination(totalPages) {
    const el = $('exam-pagination-controls');
    if (!el || totalPages <= 1) { if (el) el.innerHTML = ''; return; }
    el.innerHTML = `<button class="btn btn-sm btn-outline-secondary" data-page="${examCurrentPage - 1}" ${examCurrentPage === 1 ? 'disabled' : ''}>‹</button>`
        + Array.from({ length: totalPages }, (_, i) => `<button class="btn btn-sm ${i + 1 === examCurrentPage ? 'btn-primary' : 'btn-outline-secondary'}" data-page="${i + 1}">${i + 1}</button>`).join('')
        + `<button class="btn btn-sm btn-outline-secondary" data-page="${examCurrentPage + 1}" ${examCurrentPage === totalPages ? 'disabled' : ''}>›</button>`;
    el.querySelectorAll('button[data-page]').forEach(b => b.addEventListener('click', () => { examCurrentPage = parseInt(b.dataset.page); applyExamFilters(); }));
}

async function openEditExamModal(ex) {
    if (!ex) return;
    $('editExamId').value = ex.id;
    $('editExamDate').value = ex.examDate || '';
    $('editExamTitle').value = ex.title || '';
    $('editExamDescription').value = ex.description || '';
    $('editExamDuration').value = ex.durationMinutes || '';
    $('editExamStartTime').value = toLocalInput(ex.startTime);
    $('editExamEndTime').value = toLocalInput(ex.endTime);
    if ($('editExamStatus')) $('editExamStatus').value = ex.status || 'DRAFT';
    ['editExamType', 'editExamClassId', 'editExamTeacherId'].forEach(id => {
        const value = id.includes('Type') ? ex.examType : id.includes('Class') ? ex.classId : ex.teacherId;
        if ($(id)) $(id).value = value || '';
    });
    const modalEl = $('editExamModal');
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
    const btn = $('btnSubmitEditExam');
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', async () => {
        const payload = getExamPayload('edit');
        if (!payload) return;
        await submitButton(fresh, 'Đang lưu...', async () => {
            const res = await fetch(`/api/exams/${ex.id}`, { method: 'PUT', headers: _examHeaders, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error(await res.text());
            modal.hide();
            await fetchAndRenderExams();
        }, 'Lưu thay đổi');
    });
}

async function deleteExam(id, name) {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài kiểm tra "${name}"?`)) return;
    const res = await fetch(`/api/exams/${id}`, { method: 'DELETE', headers: _examHeaders });
    if (res.ok || res.status === 204) await fetchAndRenderExams(); else alert('Không thể xóa bài kiểm tra.');
}

async function openExamDetailById(id) {
    const res = await fetch(`/api/exams/${id}`, { headers: _examHeaders });
    const ex = res.ok ? await res.json() : allExams.find(e => String(e.id) === String(id));
    await openExamDetail(ex);
}

async function openExamDetail(ex) {
    const area = document.querySelector('.dashboard-wrap .main-content');
    if (!area || !ex) return;
    area.innerHTML = `
    <div class="content teacher-exam-detail-page" id="exam-detail-page">
        <section class="teacher-exam-hero">
            <button class="teacher-back-btn" id="btn-back-to-exams"><i class="fa-solid fa-arrow-left"></i> Quay lại</button>
            <div class="teacher-exam-title">
                <span><i class="fa-solid fa-file-circle-check"></i> Quản lý bài kiểm tra</span>
                <h2>${esc(ex.title || ex.className || 'Bài kiểm tra')}</h2>
                <p>${esc(ex.description || 'Thiết lập đáp án, theo dõi kết quả và chấm điểm học sinh.')}</p>
            </div>
            <div class="teacher-exam-actions">
                <button class="btn teacher-action-btn publish" id="btn-publish-exam"><i class="fa-solid fa-paper-plane"></i> Giao bài</button>
                <button class="btn teacher-action-btn edit" id="btn-edit-detail"><i class="fa-regular fa-pen-to-square"></i> Sửa</button>
                <button class="btn teacher-action-btn danger" id="btn-delete-detail"><i class="fa-regular fa-trash-can"></i> Xóa</button>
            </div>
        </section>
        <section class="teacher-exam-meta">
            ${teacherMetaItem('fa-solid fa-users', 'Lớp', ex.className)}
            ${teacherMetaItem('fa-solid fa-chalkboard-user', 'Giáo viên', ex.teacherName)}
            ${teacherMetaItem('fa-solid fa-tags', 'Loại', ex.examType)}
            ${teacherMetaItem('fa-solid fa-signal', 'Trạng thái', ex.status || 'DRAFT')}
            ${teacherMetaItem('fa-regular fa-calendar', 'Ngày', fmtDate(ex.examDate))}
            ${teacherMetaItem('fa-solid fa-clock', 'Thời lượng', `${ex.durationMinutes || 0} phút`)}
            ${teacherMetaItem('fa-solid fa-play', 'Bắt đầu', fmtDateTime(ex.startTime))}
            ${teacherMetaItem('fa-solid fa-stop', 'Kết thúc', fmtDateTime(ex.endTime))}
        </section>
        <div class="row g-4 align-items-start">
            <div class="col-xl-7">
                <section class="teacher-panel teacher-pdf-panel">
                    <div class="teacher-panel-head">
                        <div><span>Tài liệu</span><h5>PDF đề kiểm tra</h5></div>
                        <div class="teacher-upload-row"><input type="file" id="exam-pdf-file" accept="application/pdf" class="form-control"><button class="btn" id="btn-upload-pdf"><i class="fa-solid fa-upload"></i> Upload</button></div>
                    </div>
                    <div id="exam-pdf-box">${ex.pdfFileUrl ? `<iframe src="${esc(fileUrl(ex.pdfFileUrl))}"></iframe>` : '<div class="teacher-empty-box">Chưa có PDF đề.</div>'}</div>
                </section>
            </div>
            <div class="col-xl-5">
                <section class="teacher-panel teacher-answer-panel">
                    <div class="teacher-panel-head"><div><span>Đáp án</span><h5>Thiết lập answer key</h5></div></div>
                    <div class="teacher-answer-tools">
                        <input type="number" id="answer-total-count" min="1" class="form-control" placeholder="Số câu trong đề">
                        <button class="btn" id="btn-generate-answer-sheet"><i class="fa-solid fa-wand-magic-sparkles"></i> Tạo phiếu</button>
                    </div>
                    <div id="answer-key-list" class="teacher-answer-list">Đang tải...</div>
                    <button class="btn teacher-save-all-btn" id="btn-save-all-answers"><i class="fa-solid fa-floppy-disk"></i> Lưu toàn bộ đáp án</button>
                </section>
            </div>
        </div>
        <section class="teacher-panel teacher-results-panel mt-4">
            <div class="teacher-panel-head">
                <div><span>Chấm điểm</span><h5>Kết quả học sinh</h5></div>
                <div class="teacher-result-actions"><button class="btn danger" id="btn-finish-exam"><i class="fa-solid fa-lock"></i> Kết thúc bài kiểm tra</button><button class="btn success" id="btn-export-csv"><i class="fa-solid fa-file-csv"></i> CSV</button></div>
            </div>
            <div class="teacher-result-table-wrap"><table class="table teacher-result-table"><thead><tr><th>#</th><th>Học sinh</th><th>Reading/Writing</th><th>Listening</th><th>Speaking</th><th>Nhận xét</th><th></th></tr></thead><tbody id="exam-results-body"><tr><td colspan="7" class="text-center text-muted">Đang tải...</td></tr></tbody></table></div>
        </section>
    </div>`;
    $('btn-back-to-exams')?.addEventListener('click', () => window.loadDashboardContent('exam', initExamPage));
    $('btn-edit-detail')?.addEventListener('click', () => window.loadDashboardContent('exam', () => setTimeout(() => openEditExamModal(ex), 300)));
    $('btn-delete-detail')?.addEventListener('click', () => deleteExam(ex.id, ex.title || ex.className));
    $('btn-publish-exam')?.addEventListener('click', async () => { const r = await fetch(`/api/exams/${ex.id}/publish`, { method: 'PUT', headers: _examHeaders }); if (r.ok) { alert('Đã publish/giao bài.'); await openExamDetailById(ex.id); } else alert('Không publish được.'); });
    $('btn-finish-exam')?.addEventListener('click', async () => finishExam(ex));
    $('btn-upload-pdf')?.addEventListener('click', () => uploadExamPdf(ex.id));
    $('btn-generate-answer-sheet')?.addEventListener('click', () => renderAnswerSheet(parseInt($('answer-total-count')?.value || '0'), []));
    $('btn-save-all-answers')?.addEventListener('click', () => saveAllAnswerKeys(ex.id));
    await Promise.all([loadAnswerKeys(ex.id), loadExamResults(ex.id)]);
}

function detailItem(label, value) {
    return `<div class="col-md-3"><span class="text-muted small d-block">${label}</span><strong>${esc(value || 'N/A')}</strong></div>`;
}

function teacherMetaItem(icon, label, value) {
    return `<div class="teacher-meta-item"><div><i class="${icon}"></i></div><span>${label}</span><strong>${esc(value || 'N/A')}</strong></div>`;
}

async function uploadPdfFile(examId, file) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`/api/exams/${examId}/pdf`, { method: 'POST', headers: authOnly(), body: fd });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function uploadExamPdf(examId) {
    const file = $('exam-pdf-file')?.files?.[0];
    if (!file) return alert('Chọn file PDF trước.');
    try {
        await uploadPdfFile(examId, file);
        alert('Upload PDF thành công.');
        await openExamDetailById(examId);
    } catch (err) {
        console.error(err);
        alert('Upload PDF thất bại.');
    }
}

async function loadAnswerKeys(examId) {
    const qs = (await apiList(`/api/exams/${examId}/questions`)).sort((a, b) => a.questionNumber - b.questionNumber);
    const maxQuestion = qs.length ? Math.max(...qs.map(q => Number(q.questionNumber) || 0)) : 0;
    if ($('answer-total-count')) $('answer-total-count').value = maxQuestion || '';
    renderAnswerSheet(maxQuestion || 1, qs);
}

function renderAnswerSheet(total, questions = []) {
    const box = $('answer-key-list');
    if (!box) return;
    const count = Number(total) || 0;
    if (count <= 0) {
        box.innerHTML = '<div class="text-muted">Nhập số câu rồi bấm Tạo phiếu.</div>';
        return;
    }
    const answerMap = new Map(questions.map(q => [Number(q.questionNumber), q]));
    box.innerHTML = Array.from({ length: count }, (_, idx) => {
        const questionNumber = idx + 1;
        const saved = answerMap.get(questionNumber);
        const selected = saved?.correctAnswer || '';
        return `<div class="answer-key-row teacher-answer-row" data-question="${questionNumber}" data-id="${saved?.id || ''}"><div class="teacher-answer-row-head"><strong>Câu ${questionNumber}</strong>${saved?.id ? `<button class="btn btn-del-answer" data-id="${saved.id}"><i class="fa-regular fa-trash-can"></i></button>` : ''}</div><div class="teacher-answer-options">${['A', 'B', 'C', 'D'].map(a => `<input type="radio" class="btn-check" name="answer-key-${questionNumber}" id="answer-key-${questionNumber}-${a}" value="${a}" ${selected === a ? 'checked' : ''}><label for="answer-key-${questionNumber}-${a}">${a}</label>`).join('')}</div></div>`;
    }).join('');
    box.querySelectorAll('.btn-del-answer').forEach(b => b.addEventListener('click', async () => {
        await fetch(`/api/exams/questions/${b.dataset.id}`, { method: 'DELETE', headers: _examHeaders });
        b.closest('.answer-key-row')?.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
        b.remove();
    }));
}

async function saveAllAnswerKeys(examId) {
    const rows = [...document.querySelectorAll('#answer-key-list .answer-key-row')];
    if (!rows.length) return alert('Chưa có phiếu đáp án.');
    const missing = rows.filter(row => !row.querySelector('input:checked')).map(row => row.dataset.question);
    if (missing.length && !confirm(`Các câu chưa chọn đáp án: ${missing.join(', ')}. Vẫn lưu các câu đã chọn?`)) return;
    const existing = await apiList(`/api/exams/${examId}/questions`);
    const existingMap = new Map(existing.map(q => [Number(q.questionNumber), q.id]));
    try {
        for (const row of rows) {
            const questionNumber = Number(row.dataset.question);
            const selectedAnswer = row.querySelector('input:checked')?.value;
            if (!selectedAnswer) continue;
            const oldId = existingMap.get(questionNumber);
            if (oldId) await fetch(`/api/exams/questions/${oldId}`, { method: 'DELETE', headers: _examHeaders });
            const res = await fetch(`/api/exams/${examId}/questions`, { method: 'POST', headers: _examHeaders, body: JSON.stringify({ questionNumber, correctAnswer: selectedAnswer }) });
            if (!res.ok && res.status !== 201) throw new Error(await res.text());
        }
        alert('Đã lưu answer key.');
        await loadAnswerKeys(examId);
    } catch (err) {
        console.error(err);
        alert('Không lưu được answer key.');
    }
}

async function loadExamResults(examId) {
    const body = $('exam-results-body');
    if (!body) return;
    const results = await apiList(`/api/exams/${examId}/results`);
    body.innerHTML = results.length ? results.map((r, i) => `<tr data-id="${r.id}" data-student-id="${r.studentId}"><td><span class="teacher-row-index">${i + 1}</span></td><td><div class="teacher-student-cell"><strong>${esc(r.studentName || r.studentId)}</strong><small>ID: ${esc(r.studentId || '')}</small></div></td><td><input class="form-control score-reading" value="${esc(r.readingWritingScore || '')}" placeholder="0-10"></td><td><input class="form-control score-listening" value="${esc(r.listeningScore || '')}" placeholder="0-10"></td><td><input class="form-control score-speaking" value="${esc(r.speakingScore || '')}" placeholder="0-10"></td><td><input class="form-control score-comment" value="${esc(r.comment || '')}" placeholder="Nhận xét..."></td><td><button class="btn btn-save-result" data-id="${r.id}"><i class="fa-solid fa-floppy-disk"></i> Lưu</button></td></tr>`).join('') : '<tr><td colspan="7" class="text-center text-muted">Chưa có kết quả.</td></tr>';
    body.querySelectorAll('.btn-save-result').forEach(btn => btn.addEventListener('click', () => saveExamResultScore(examId, btn.closest('tr'))));
    $('btn-export-csv')?.addEventListener('click', () => exportResultsCsv(results));
}

async function saveExamResultScore(examId, row) {
    if (!row) return;
    const btn = row.querySelector('.btn-save-result');
    const payload = {
        examId,
        studentId: Number(row.dataset.studentId),
        readingWritingScore: row.querySelector('.score-reading')?.value?.trim() || '',
        listeningScore: row.querySelector('.score-listening')?.value?.trim() || '',
        speakingScore: row.querySelector('.score-speaking')?.value?.trim() || '',
        comment: row.querySelector('.score-comment')?.value?.trim() || ''
    };
    try {
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu'; }
        const res = await fetch(`/api/exams/results/${row.dataset.id}`, { method: 'PUT', headers: _examHeaders, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(await res.text());
        if (btn) btn.innerHTML = '<i class="fa-solid fa-check"></i> Đã lưu';
        row.classList.add('is-saved');
        setTimeout(() => { if (btn) { btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu'; btn.disabled = false; } row.classList.remove('is-saved'); }, 1200);
    } catch (err) {
        console.error(err);
        alert('Không lưu được điểm/nhận xét.');
        if (btn) { btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu'; btn.disabled = false; }
    }
}

async function finishExam(ex) {
    if (!ex?.id) return;
    if (!confirm(`Kết thúc bài kiểm tra "${ex.title || ex.examType || ex.id}"? Học sinh sẽ không thấy bài này trong danh sách bài đang mở.`)) return;
    const payload = { ...ex, status: 'FINISHED' };
    const res = await fetch(`/api/exams/${ex.id}`, { method: 'PUT', headers: _examHeaders, body: JSON.stringify(payload) });
    if (res.ok) { alert('Đã kết thúc bài kiểm tra.'); await openExamDetailById(ex.id); } else alert('Không kết thúc được bài kiểm tra.');
}

function exportResultsCsv(results) {
    const rows = [['#', 'Hoc sinh', 'Reading/Writing', 'Listening', 'Speaking', 'Nhan xet'], ...results.map((r, i) => [i + 1, r.studentName || r.studentId, r.readingWritingScore || '', r.listeningScore || '', r.speakingScore || '', r.comment || ''])];
    const blob = new Blob(['\uFEFF' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam-results.csv';
    a.click();
    URL.revokeObjectURL(url);
}

async function renderParentExamResults() {
    const area = document.querySelector('.dashboard-wrap .main-content') || document.querySelector('.content');
    if (!area) return;
    area.innerHTML = `
        <div class="content edu-page parent-exam-page">
            <section class="edu-hero parent-exam-hero">
                <div>
                    <span class="edu-eyebrow"><i class="fa-solid fa-square-poll-vertical"></i> Theo dõi kết quả</span>
                    <h2>Kết quả bài kiểm tra</h2>
                    <p>Phụ huynh bấm vào từng bài để xem điểm chi tiết, nhận xét và tiến độ học tập.</p>
                </div>
                <div class="parent-exam-summary">
                    <span>Tổng kết quả</span>
                    <strong id="parent-exam-total">0</strong>
                </div>
            </section>
            <section class="edu-list-toolbar">
                <span id="parent-exam-count">Đang tải...</span>
            </section>
            <div class="row edu-grid" id="parent-exam-results">
                <div class="col-12 text-center text-muted py-4">Đang tải...</div>
            </div>
        </div>`;
    const list = $('parent-exam-results');
    try {
        const results = await apiList('/api/parent/my-exam-results');
        if ($('parent-exam-total')) $('parent-exam-total').textContent = results.length;
        if ($('parent-exam-count')) $('parent-exam-count').textContent = `Hiển thị ${results.length} kết quả`;
        list.innerHTML = results.length ? results.map(r => `
            <div class="col-xl-4 col-md-6 mb-4">
                <div class="card lesson-card-modern edu-entity-card parent-exam-result-card h-100" data-id="${r.id}" style="cursor:pointer;">
                    <div class="lesson-card-header">
                        <div class="lesson-icon-modern" style="background:linear-gradient(135deg,#10b981,#22c55e);">
                            <i class="fa-solid fa-square-poll-vertical"></i>
                        </div>
                        <div class="lesson-header-text">
                            <h5 class="fw-bold mb-1 class-card-title text-truncate" title="${esc(r.examTitle || r.examType || 'Bài kiểm tra')}">${esc(r.examTitle || r.examType || 'Bài kiểm tra')}</h5>
                            <span class="badge lesson-badge-modern parent-score-badge">Điểm TB: ${esc(fmtAvgScore(r))}</span>
                        </div>
                    </div>
                    <div class="lesson-card-body flex-grow-1">
                        ${infoRow('fa-regular fa-calendar', 'Ngày', fmtDate(r.examDate))}
                        ${infoRow('fa-solid fa-user-graduate', 'Học sinh', esc(r.studentName || 'N/A'))}
                        ${infoRow('fa-solid fa-book-open', 'Loại bài', esc(r.examType || 'N/A'))}
                    </div>
                    <div class="lesson-card-footer">
                        <button class="btn btn-primary w-100 btn-parent-result-detail" data-id="${r.id}">
                            <i class="fa-solid fa-eye me-1"></i> Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>`).join('') : '<div class="col-12 text-center text-muted py-4">Chưa có kết quả bài kiểm tra.</div>';
        list.querySelectorAll('.parent-exam-result-card').forEach(card => card.addEventListener('click', () => openParentExamResultDetail(results.find(r => String(r.id) === card.dataset.id))));
        list.querySelectorAll('.btn-parent-result-detail').forEach(btn => btn.addEventListener('click', ev => { ev.stopPropagation(); openParentExamResultDetail(results.find(r => String(r.id) === btn.dataset.id)); }));
    } catch (err) {
        console.error(err);
        list.innerHTML = '<div class="col-12 text-center text-danger py-4">Không tải được kết quả bài kiểm tra.</div>';
    }
}

function openParentExamResultDetail(result) {
    const area = document.querySelector('.dashboard-wrap .main-content') || document.querySelector('.content');
    if (!area || !result) return;
    area.innerHTML = `
        <div class="content edu-page parent-exam-page">
            <button class="btn edu-back-btn mb-4" id="btn-back-parent-results">
                <i class="fa-solid fa-arrow-left"></i> Quay lại
            </button>
            <section class="parent-result-detail-card">
                <div class="parent-result-head">
                    <div class="lesson-icon-modern" style="background:linear-gradient(135deg,#10b981,#22c55e);">
                        <i class="fa-solid fa-square-poll-vertical"></i>
                    </div>
                    <div>
                        <span>Chi tiết kết quả</span>
                        <h2>${esc(result.examTitle || 'Bài kiểm tra')}</h2>
                        <p>${esc(result.examType || '')}</p>
                    </div>
                    <strong>${esc(fmtAvgScore(result))}</strong>
                </div>
                <div class="parent-result-grid">
                    ${detailItem('Lớp', result.className)}
                    ${detailItem('Học sinh', result.studentName)}
                    ${detailItem('Ngày thi', fmtDate(result.examDate))}
                    ${detailItem('Điểm trung bình', fmtAvgScore(result))}
                    ${detailItem('Reading/Writing', result.readingWritingScore || 'Chưa có điểm')}
                    ${detailItem('Listening', result.listeningScore || 'N/A')}
                    ${detailItem('Speaking', result.speakingScore || 'N/A')}
                </div>
                ${result.comment ? `<div class="parent-result-comment"><strong>Nhận xét:</strong> ${esc(result.comment)}</div>` : ''}
            </section>
        </div>`;
    $('btn-back-parent-results')?.addEventListener('click', renderParentExamResults);
}

async function renderStudentExamList() {
    const area = document.querySelector('.dashboard-wrap .main-content') || document.querySelector('.content');
    if (!area) return;
    area.innerHTML = `
        <div class="content edu-page student-exam-page">
            <section class="edu-hero student-exam-hero">
                <div>
                    <span class="edu-eyebrow"><i class="fa-solid fa-file-pen"></i> Phòng thi online</span>
                    <h2>Bài kiểm tra được giao</h2>
                    <p>Chọn bài đang mở để làm bài. Bài đã kết thúc hoặc đã nộp sẽ bị khóa.</p>
                </div>
                <div class="parent-exam-summary">
                    <span>Bài đang có</span>
                    <strong id="student-exam-total">0</strong>
                </div>
            </section>
            <section class="edu-list-toolbar">
                <span id="student-exam-count">Đang tải...</span>
            </section>
            <div class="row edu-grid" id="student-exam-list">
                <div class="col-12 text-center text-muted py-4">Đang tải...</div>
            </div>
        </div>`;
    const list = $('student-exam-list');
    try {
        const classId = await resolveStudentClassId();
        if (!classId) { list.innerHTML = '<div class="col-12 text-center text-danger py-4">Không xác định được lớp học của học sinh.</div>'; return; }
        const studentId = await resolveStudentId();
        const [availableExams, submittedResults] = await Promise.all([
            apiList(`/api/exams/class/${classId}/available`),
            studentId ? apiList(`/api/exams/results/student/${studentId}`) : Promise.resolve([])
        ]);
        const submittedIds = new Set(submittedResults.map(r => String(r.examId)).filter(Boolean));
        const exams = availableExams.map(ex => submittedIds.has(String(ex.id)) ? { ...ex, submitted: true, resultStatus: 'SUBMITTED' } : ex);
        if ($('student-exam-total')) $('student-exam-total').textContent = exams.length;
        if ($('student-exam-count')) $('student-exam-count').textContent = `Hiển thị ${exams.length} bài kiểm tra`;
        list.innerHTML = exams.length ? exams.map(ex => renderStudentExamCard(ex)).join('') : '<div class="col-12 text-center text-muted py-4">Chưa có bài kiểm tra được giao.</div>';
        list.querySelectorAll('.student-exam-card:not(.is-locked)').forEach(card => card.addEventListener('click', () => startStudentExam(card.dataset.id)));
        list.querySelectorAll('.btn-start-exam:not(:disabled)').forEach(b => b.addEventListener('click', ev => { ev.stopPropagation(); startStudentExam(b.dataset.id); }));
    } catch (err) {
        console.error(err);
        list.innerHTML = '<div class="col-12 text-center text-danger py-4">Không tải được bài kiểm tra.</div>';
    }
}

function renderStudentExamCard(ex) {
    const state = getStudentExamState(ex);
    return `
        <div class="col-xl-4 col-md-6 mb-4">
            <div class="card lesson-card-modern edu-entity-card student-exam-card ${state.locked ? 'is-locked' : ''} h-100" data-id="${ex.id}">
                <div class="lesson-card-header">
                    <div class="lesson-icon-modern" style="background:linear-gradient(135deg,#8b5cf6,#d946ef);">
                        <i class="fa-solid fa-file-signature"></i>
                    </div>
                    <div class="lesson-header-text">
                        <h5 class="fw-bold mb-1 class-card-title text-truncate" title="${esc(ex.title || ex.examType)}">${esc(ex.title || ex.examType || 'Bài kiểm tra')}</h5>
                        <span class="badge lesson-badge-modern ${state.badgeClass}">${state.label}</span>
                    </div>
                </div>
                <div class="lesson-card-body flex-grow-1">
                    ${infoRow('fa-regular fa-calendar', 'Ngày', fmtDate(ex.examDate))}
                    ${infoRow('fa-solid fa-clock', 'Thời lượng', `${ex.durationMinutes || 0} phút`)}
                    ${infoRow('fa-solid fa-layer-group', 'Trạng thái', esc(ex.status || 'PUBLISHED'))}
                </div>
                <div class="lesson-card-footer">
                    <button class="btn w-100 btn-start-exam ${state.locked ? 'btn-secondary' : 'btn-primary'}" data-id="${ex.id}" ${state.locked ? 'disabled' : ''}>
                        <i class="fa-solid ${state.locked ? 'fa-lock' : 'fa-play'} me-1"></i> ${state.action}
                    </button>
                </div>
            </div>
        </div>`;
}

function getStudentExamState(ex) {
    const status = String(ex.status || '').toUpperCase();
    const attemptStatus = String(ex.attemptStatus || ex.resultStatus || '').toUpperCase();
    const submitted = ex.submitted || ex.submittedAt || ex.resultId || ['SUBMITTED', 'COMPLETED', 'EXPIRED'].includes(attemptStatus);
    const finished = ['FINISHED', 'CLOSED', 'ENDED', 'DONE'].includes(status) || isExamTimeClosed(ex);
    if (submitted) return { locked: true, label: 'Đã nộp', action: 'Đã nộp bài', badgeClass: 'student-exam-submitted' };
    if (finished) return { locked: true, label: 'Đã kết thúc', action: 'Không thể vào', badgeClass: 'student-exam-closed' };
    return { locked: false, label: 'Có thể làm', action: 'Làm bài', badgeClass: 'student-exam-open' };
}

function isExamTimeClosed(ex) {
    const now = Date.now();
    const end = ex.endTime ? new Date(ex.endTime).getTime() : null;
    if (end && Number.isFinite(end) && now > end) return true;
    const start = ex.startTime ? new Date(ex.startTime).getTime() : null;
    const duration = Number(ex.durationMinutes || 0);
    if (start && Number.isFinite(start) && duration > 0 && now > start + duration * 60000) return true;
    return false;
}

async function resolveStudentClassId() {
    if (localStorage.getItem('classId')) return localStorage.getItem('classId');
    const classes = await apiList('/api/student/my-classes');
    const first = classes[0];
    if (first?.id) localStorage.setItem('classId', first.id);
    return first?.id || null;
}

async function resolveStudentId() {
    const cached = localStorage.getItem('studentId') || localStorage.getItem('userId');
    if (cached) return cached;
    const me = await apiOne('/api/student/me');
    const sid = me?.studentId || me?.id || me?.data?.studentId || me?.data?.id;
    if (sid) localStorage.setItem('studentId', sid);
    return sid || null;
}

async function startStudentExam(examId) {
    const exam = document.querySelector(`.student-exam-card[data-id="${examId}"]`);
    if (exam?.classList.contains('is-locked')) return alert('Bài kiểm tra này đã khóa.');
    const studentId = await resolveStudentId();
    if (!studentId) return alert('Tài khoản này chưa được liên kết hồ sơ học sinh.');
    const res = await fetch(`/api/exams/${examId}/start?studentId=${encodeURIComponent(studentId)}`, { method: 'POST', headers: _examHeaders });
    if (!res.ok) {
        const message = await readErrorMessage(res);
        return alert(message || 'Không bắt đầu được bài kiểm tra. Bài có thể đã kết thúc hoặc bạn đã nộp bài.');
    }
    const attempt = await res.json();
    const attemptStatus = String(attempt.status || attempt.attemptStatus || '').toUpperCase();
    if (['SUBMITTED', 'COMPLETED', 'FINISHED', 'CLOSED'].includes(attemptStatus)) return alert('Bài kiểm tra đã kết thúc hoặc bạn đã nộp bài.');
    renderExamAttempt(attempt);
}

async function readErrorMessage(res) {
    const text = await res.text();
    if (!text) return '';
    try {
        const data = JSON.parse(text);
        return data.message || data.error || 'Không bắt đầu được bài kiểm tra. Bài có thể đã kết thúc hoặc bạn đã nộp bài.';
    } catch {
        return text;
    }
}

function renderExamAttempt(attempt) {
    clearInterval(examTimerId);
    const area = document.querySelector('.dashboard-wrap .main-content') || document.querySelector('.content');
    const questions = (attempt.questions || []).sort((a, b) => a.questionNumber - b.questionNumber);
    const total = questions.length || Number(attempt.totalQuestions) || Number(attempt.questionCount) || 0;
    area.innerHTML = `
        <div class="content student-attempt-page">
            <section class="student-attempt-hero">
                <div>
                    <span><i class="fa-solid fa-pen-nib"></i> Đang làm bài</span>
                    <h2>${esc(attempt.title || 'Làm bài kiểm tra')}</h2>
                    <p>Đọc đề bên trái, chọn đáp án bên phải rồi nộp bài trước khi hết giờ.</p>
                </div>
                <div class="student-exam-timer" id="exam-timer">--:--</div>
            </section>
            <div class="row g-4 align-items-start">
                <div class="col-lg-8">
                    <section class="student-exam-paper">
                        <div class="student-section-head">
                            <h5>Đề bài</h5>
                            <span>${total || 0} câu</span>
                        </div>
                        ${attempt.pdfFileUrl ? `<iframe src="${esc(fileUrl(attempt.pdfFileUrl))}"></iframe>` : '<div class="student-empty-paper">Không có PDF đề.</div>'}
                    </section>
                </div>
                <div class="col-lg-4">
                    <section class="student-answer-card">
                        <div class="student-section-head">
                            <h5>Phiếu trả lời</h5>
                            <span id="student-answered-count">0/${total}</span>
                        </div>
                        <div id="student-answer-sheet" class="student-answer-sheet">
                            ${total ? Array.from({ length: total }, (_, idx) => answerRow(questions[idx]?.questionNumber || idx + 1)).join('') : '<div class="text-muted">Bài này chưa có answer key nên chưa tạo được phiếu trả lời.</div>'}
                        </div>
                        <button class="btn student-submit-btn w-100 mt-4" id="btn-submit-attempt" ${total ? '' : 'disabled'}>
                            <i class="fa-solid fa-paper-plane me-1"></i> Nộp bài
                        </button>
                    </section>
                </div>
            </div>
        </div>`;
    $('btn-submit-attempt')?.addEventListener('click', () => submitAttempt(attempt.attemptId));
    document.querySelectorAll('#student-answer-sheet input[type="radio"]').forEach(input => input.addEventListener('change', preserveAnswerScroll));
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateStudentAnsweredCount();
    startTimer(attempt.deadline, () => submitAttempt(attempt.attemptId, true));
}

function answerRow(n) {
    return `<div class="student-answer-row" data-question="${n}"><div class="fw-semibold mb-2">Câu ${n}</div><div class="student-answer-options">${['A', 'B', 'C', 'D'].map(a => `<input type="radio" class="btn-check" name="q${n}" id="q${n}${a}" value="${a}"><label for="q${n}${a}">${a}</label>`).join('')}</div></div>`;
}

function preserveAnswerScroll() {
    const pageX = window.scrollX;
    const pageY = window.scrollY;
    updateStudentAnsweredCount();
    requestAnimationFrame(() => window.scrollTo(pageX, pageY));
}

function updateStudentAnsweredCount() {
    const rows = [...document.querySelectorAll('#student-answer-sheet .student-answer-row')];
    const answered = rows.filter(row => row.querySelector('input:checked')).length;
    const el = $('student-answered-count');
    if (el) el.textContent = `${answered}/${rows.length}`;
}

function startTimer(deadline, onExpire) {
    const tick = () => {
        const remain = new Date(deadline).getTime() - Date.now();
        if (remain <= 0) { clearInterval(examTimerId); $('exam-timer').textContent = '00:00'; onExpire(); return; }
        const m = Math.floor(remain / 60000);
        const s = Math.floor((remain % 60000) / 1000);
        $('exam-timer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };
    tick();
    examTimerId = setInterval(tick, 1000);
}

async function submitAttempt(attemptId, auto = false) {
    const btn = $('btn-submit-attempt');
    if (btn?.disabled) return;
    if (!auto && !confirm('Nộp bài kiểm tra?')) return;
    if (btn) btn.disabled = true;
    const answers = [...document.querySelectorAll('#student-answer-sheet .student-answer-row')].map(row => {
        const questionNumber = Number(row.dataset.question);
        const selectedAnswer = row.querySelector('input:checked')?.value || '';
        return { questionNumber, selectedAnswer };
    }).filter(a => a.questionNumber && a.selectedAnswer);
    const res = await fetch(`/api/exams/attempts/${attemptId}/submit`, { method: 'POST', headers: _examHeaders, body: JSON.stringify({ answers }) });
    if (!res.ok) { alert('Nộp bài thất bại.'); if (btn) btn.disabled = false; return; }
    clearInterval(examTimerId);
    renderSubmitResult(await res.json());
}

function renderSubmitResult(result) {
    const area = document.querySelector('.dashboard-wrap .main-content') || document.querySelector('.content');
    area.innerHTML = `<div class="content"><div class="card stat-card-box p-5 text-center" style="max-width:640px;margin:40px auto;"><h2 class="fw-bold mb-4">Kết quả bài kiểm tra</h2><div class="display-4 fw-bold text-primary mb-3">${esc(result.score ?? '0.00')}</div><p class="fs-5">Số câu đúng: <strong>${esc(result.correctCount ?? 0)}/${esc(result.totalQuestions ?? 0)}</strong></p><p>Trạng thái: <span class="badge bg-success">${esc(result.status || 'SUBMITTED')}</span></p><button class="btn btn-primary mt-3" id="btn-back-student-exams">Quay lại danh sách</button></div></div>`;
    $('btn-back-student-exams')?.addEventListener('click', renderStudentExamList);
}

async function submitButton(btn, loadingText, fn, resetText, okMsg) {
    try {
        btn.textContent = loadingText;
        btn.disabled = true;
        await fn();
        if (okMsg) alert(okMsg);
    } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
        btn.textContent = resetText;
        btn.disabled = false;
    }
}

window.changeExamPage = (page) => { examCurrentPage = page; applyExamFilters(); };
