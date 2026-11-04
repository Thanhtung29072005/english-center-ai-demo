// =============================================
//   LESSON DETAIL PAGE
// =============================================

let currentLessonId = null;
let currentLesson = null;
let vocabularyList = [];
let grammarList = [];
let homeworkList = [];
let isReadOnly = false;

function getMaterialUrl() {
    if (!currentLesson?.materialFileUrl) return '';
    if (currentLesson.materialFileUrl.startsWith('http')) return currentLesson.materialFileUrl;
    return `http://localhost:8080${currentLesson.materialFileUrl}`;
}

function fmtDate(dateString) {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtTime(dateString) {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export async function initLessonDetailPage() {
    const lessonData = sessionStorage.getItem('lessonDetailData');
    if (!lessonData) {
        alert('Không tìm thấy thông tin buổi học');
        window.loadDashboardContent('lesson', window.initLessonPage);
        return;
    }

    const role = localStorage.getItem('userRole');
    isReadOnly = ['3', '4', 'STUDENT', 'PARENT'].includes(String(role).toUpperCase());

    try {
        currentLesson = JSON.parse(lessonData);
        currentLessonId = currentLesson.id;

        // Render lesson info
        document.getElementById('lesson-detail-name').textContent = currentLesson.lessonName || 'Buổi học';
        document.getElementById('lesson-detail-class').textContent = currentLesson.className || '—';
        document.getElementById('lesson-detail-teacher').textContent = currentLesson.teacherName || '—';
        document.getElementById('lesson-detail-date').textContent = fmtDate(currentLesson.lessonDate);
        document.getElementById('lesson-detail-time').textContent = fmtTime(currentLesson.lessonDate);

        // Debug: Check what's in currentLesson
        console.log('[LessonDetail] currentLesson:', currentLesson);
        console.log('[LessonDetail] Has vocabulary?', currentLesson.vocabulary);
        console.log('[LessonDetail] Has grammar?', currentLesson.grammar);
        console.log('[LessonDetail] Has homework?', currentLesson.homework);

        // Load data from lesson object (from API) if available, otherwise localStorage
        vocabularyList = Array.isArray(currentLesson.vocabulary) && currentLesson.vocabulary.length > 0
            ? currentLesson.vocabulary
            : JSON.parse(localStorage.getItem(`lesson_${currentLessonId}_vocab`) || '[]');
        grammarList = Array.isArray(currentLesson.grammar) && currentLesson.grammar.length > 0
            ? currentLesson.grammar
            : JSON.parse(localStorage.getItem(`lesson_${currentLessonId}_grammar`) || '[]');
        homeworkList = Array.isArray(currentLesson.homework) && currentLesson.homework.length > 0
            ? currentLesson.homework
            : JSON.parse(localStorage.getItem(`lesson_${currentLessonId}_homework`) || '[]');

        renderMaterial();
        renderVocabulary();
        renderGrammar();
        renderHomework();
        setupEventHandlers();
    } catch (err) {
        console.error('[LessonDetail] Error:', err);
        alert('Lỗi khi tải thông tin buổi học');
    }
}

function renderMaterial() {
    const container = document.getElementById('lesson-material-content');
    if (!container) return;

    const materialUrl = getMaterialUrl();
    if (!materialUrl) {
        container.innerHTML = '<div class="lesson-detail-empty"><i class="fa-solid fa-file-pdf"></i><p>Chưa có tài liệu PDF</p></div>';
        return;
    }

    const fileName = currentLesson.materialFileName || 'Tài liệu bài học.pdf';
    container.innerHTML = `
        <div class="lesson-detail-item">
            <div class="lesson-detail-item-header">
                <div class="lesson-detail-item-title">
                    <strong><i class="fa-solid fa-file-pdf text-danger me-2"></i>${fileName}</strong>
                    ${currentLesson.materialUploadedAt ? `<span class="lesson-detail-due-date"><i class="fa-regular fa-calendar"></i> ${fmtDate(currentLesson.materialUploadedAt)}</span>` : ''}
                </div>
                <div class="lesson-detail-item-actions">
                    <a class="btn lesson-detail-btn lesson-detail-btn-outline" href="${materialUrl}" target="_blank" rel="noopener">
                        <i class="fa-solid fa-up-right-from-square"></i>
                        <span>Mở tab mới</span>
                    </a>
                </div>
            </div>
            <div class="lesson-detail-item-body">
                <iframe src="${materialUrl}" title="Tài liệu PDF" style="width:100%;height:700px;border:1px solid #e5e7eb;border-radius:12px;"></iframe>
            </div>
        </div>
    `;
}

async function uploadLessonMaterial(file) {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`/api/lessons/${currentLessonId}/material`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) return false;
        const updatedLesson = await response.json();
        currentLesson = { ...currentLesson, ...updatedLesson };
        sessionStorage.setItem('lessonDetailData', JSON.stringify(currentLesson));
        return true;
    } catch (err) {
        console.error('[LessonDetail] Error uploading material:', err);
        return false;
    }
}

function renderVocabulary() {
    const container = document.getElementById('vocabulary-list');
    const countEl = document.getElementById('vocab-count');
    countEl.textContent = vocabularyList.length;

    if (vocabularyList.length === 0) {
        container.innerHTML = '<div class="lesson-detail-empty"><i class="fa-solid fa-book"></i><p>Chưa có từ vựng nào</p></div>';
        return;
    }

    container.innerHTML = vocabularyList.map((vocab, idx) => `
        <div class="lesson-detail-item">
            <div class="lesson-detail-item-header">
                <div class="lesson-detail-item-title">
                    <strong>${vocab.word}</strong>
                    ${vocab.pronunciation ? `<span class="lesson-detail-pronunciation">${vocab.pronunciation}</span>` : ''}
                </div>
                ${!isReadOnly ? `
                <div class="lesson-detail-item-actions">
                    <button class="btn-icon" onclick="window.editVocab(${idx})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon btn-icon-danger" onclick="window.deleteVocab(${idx})"><i class="fa-solid fa-trash"></i></button>
                </div>
                ` : ''}
            </div>
            <div class="lesson-detail-item-body">
                <p><strong>Nghĩa:</strong> ${vocab.translation || vocab.meaning || ''}</p>
                ${vocab.example ? `<p class="lesson-detail-example"><strong>Ví dụ:</strong> ${vocab.example}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function renderGrammar() {
    const container = document.getElementById('grammar-list');
    const countEl = document.getElementById('grammar-count');
    countEl.textContent = grammarList.length;

    if (grammarList.length === 0) {
        container.innerHTML = '<div class="lesson-detail-empty"><i class="fa-solid fa-book-open"></i><p>Chưa có ngữ pháp nào</p></div>';
        return;
    }

    container.innerHTML = grammarList.map((grammar, idx) => `
        <div class="lesson-detail-item">
            <div class="lesson-detail-item-header">
                <div class="lesson-detail-item-title"><strong>${grammar.topic || grammar.title || ''}</strong></div>
                ${!isReadOnly ? `
                <div class="lesson-detail-item-actions">
                    <button class="btn-icon" onclick="window.editGrammar(${idx})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon btn-icon-danger" onclick="window.deleteGrammar(${idx})"><i class="fa-solid fa-trash"></i></button>
                </div>
                ` : ''}
            </div>
            <div class="lesson-detail-item-body">
                <p>${grammar.description || grammar.content || ''}</p>
                ${grammar.example ? `<p class="lesson-detail-example"><strong>Ví dụ:</strong> ${grammar.example}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function renderHomework() {
    const container = document.getElementById('homework-list');
    const countEl = document.getElementById('homework-count');
    countEl.textContent = homeworkList.length;

    if (homeworkList.length === 0) {
        container.innerHTML = '<div class="lesson-detail-empty"><i class="fa-solid fa-tasks"></i><p>Chưa có bài tập nào</p></div>';
        return;
    }

    container.innerHTML = homeworkList.map((hw, idx) => `
        <div class="lesson-detail-item">
            <div class="lesson-detail-item-header">
                <div class="lesson-detail-item-title">
                    <strong>${hw.page || hw.title || ''}</strong>
                    ${hw.dueDate ? `<span class="lesson-detail-due-date"><i class="fa-regular fa-calendar"></i> ${fmtDate(hw.dueDate)}</span>` : ''}
                </div>
                ${!isReadOnly ? `
                <div class="lesson-detail-item-actions">
                    <button class="btn-icon" onclick="window.editHomework(${idx})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon btn-icon-danger" onclick="window.deleteHomework(${idx})"><i class="fa-solid fa-trash"></i></button>
                </div>
                ` : ''}
            </div>
            <div class="lesson-detail-item-body"><p>${hw.description}</p></div>
        </div>
    `).join('');
}

// Helper function to update lesson via API
async function updateLessonAPI() {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    const payload = {
        classId: currentLesson.classId,
        teacherId: currentLesson.teacherId,
        lessonDate: currentLesson.lessonDate,
        lessonNumber: currentLesson.lessonNumber,
        content: currentLesson.content || '',
        generalComment: currentLesson.generalComment || '',
        vocabulary: vocabularyList,
        grammar: grammarList,
        homework: homeworkList
    };

    try {
        const response = await fetch(`/api/lessons/${currentLessonId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const updatedLesson = await response.json();
            currentLesson.vocabulary = updatedLesson.vocabulary || vocabularyList;
            currentLesson.grammar = updatedLesson.grammar || grammarList;
            currentLesson.homework = updatedLesson.homework || homeworkList;
            return true;
        }
        return false;
    } catch (err) {
        console.error('[LessonDetail] Error updating lesson:', err);
        return false;
    }
}

// Global functions for onclick handlers
window.editVocab = function (index) {
    const vocab = vocabularyList[index];
    document.getElementById('vocabModalTitle').textContent = 'Sửa từ vựng';
    document.getElementById('vocabId').value = index;
    document.getElementById('vocabWord').value = vocab.word;
    document.getElementById('vocabMeaning').value = vocab.translation || vocab.meaning || '';
    document.getElementById('vocabPronunciation').value = vocab.pronunciation || '';
    document.getElementById('vocabExample').value = vocab.example || '';
    new bootstrap.Modal(document.getElementById('vocabModal')).show();
};

window.deleteVocab = async function (index) {
    if (confirm('Xóa từ vựng này?')) {
        vocabularyList.splice(index, 1);
        const success = await updateLessonAPI();
        if (success) {
            renderVocabulary();
        } else {
            alert('Lỗi khi cập nhật. Vui lòng thử lại!');
            // Reload to get fresh data
            window.location.reload();
        }
    }
};

window.editGrammar = function (index) {
    const grammar = grammarList[index];
    document.getElementById('grammarModalTitle').textContent = 'Sửa ngữ pháp';
    document.getElementById('grammarId').value = index;
    document.getElementById('grammarTitle').value = grammar.topic || grammar.title || '';
    document.getElementById('grammarContent').value = grammar.description || grammar.content || '';
    document.getElementById('grammarExample').value = grammar.example || '';
    new bootstrap.Modal(document.getElementById('grammarModal')).show();
};

window.deleteGrammar = async function (index) {
    if (confirm('Xóa ngữ pháp này?')) {
        grammarList.splice(index, 1);
        const success = await updateLessonAPI();
        if (success) {
            renderGrammar();
        } else {
            alert('Lỗi khi cập nhật. Vui lòng thử lại!');
            window.location.reload();
        }
    }
};

window.editHomework = function (index) {
    const hw = homeworkList[index];
    document.getElementById('homeworkModalTitle').textContent = 'Sửa bài tập';
    document.getElementById('homeworkId').value = index;
    document.getElementById('homeworkTitle').value = hw.page || hw.title || '';
    document.getElementById('homeworkDescription').value = hw.description || '';
    document.getElementById('homeworkDueDate').value = hw.dueDate || '';
    new bootstrap.Modal(document.getElementById('homeworkModal')).show();
};

window.deleteHomework = async function (index) {
    if (confirm('Xóa bài tập này?')) {
        homeworkList.splice(index, 1);
        const success = await updateLessonAPI();
        if (success) {
            renderHomework();
        } else {
            alert('Lỗi khi cập nhật. Vui lòng thử lại!');
            window.location.reload();
        }
    }
};

function setupEventHandlers() {
    // Back button (works for all users)
    document.getElementById('lesson-detail-btn-back')?.addEventListener('click', () => {
        window.loadDashboardContent('lesson', window.initLessonPage);
    });

    document.getElementById('btn-upload-material')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf,.pdf';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                alert('Vui lòng chọn file PDF');
                return;
            }

            const success = await uploadLessonMaterial(file);
            if (success) {
                renderMaterial();
                alert('Upload PDF thành công');
            } else {
                alert('Upload PDF thất bại. Vui lòng thử lại!');
            }
        };
        input.click();
    });

    if (isReadOnly) {
        document.getElementById('btn-upload-material')?.style.setProperty('display', 'none');
        document.getElementById('btn-add-vocab')?.style.setProperty('display', 'none');
        document.getElementById('btn-add-grammar')?.style.setProperty('display', 'none');
        document.getElementById('btn-add-homework')?.style.setProperty('display', 'none');
        document.getElementById('lesson-detail-btn-edit')?.style.setProperty('display', 'none');
        document.getElementById('lesson-detail-btn-delete')?.style.setProperty('display', 'none');
        return;
    }

    // Add vocabulary
    document.getElementById('btn-add-vocab')?.addEventListener('click', () => {
        document.getElementById('vocabModalTitle').textContent = 'Thêm từ vựng';
        document.getElementById('vocabForm').reset();
        document.getElementById('vocabId').value = '';
        new bootstrap.Modal(document.getElementById('vocabModal')).show();
    });

    // Submit vocabulary
    document.getElementById('btnSubmitVocab')?.addEventListener('click', async () => {
        const id = document.getElementById('vocabId').value;
        const vocab = {
            word: document.getElementById('vocabWord').value.trim(),
            translation: document.getElementById('vocabMeaning').value.trim(),
            pronunciation: document.getElementById('vocabPronunciation').value.trim(),
            example: document.getElementById('vocabExample').value.trim()
        };

        if (!vocab.word || !vocab.translation) {
            alert('Vui lòng nhập từ vựng và nghĩa');
            return;
        }

        if (id === '') {
            vocabularyList.push(vocab);
        } else {
            vocabularyList[parseInt(id)] = vocab;
        }

        const success = await updateLessonAPI();
        if (success) {
            renderVocabulary();
            bootstrap.Modal.getInstance(document.getElementById('vocabModal')).hide();
        } else {
            alert('Lỗi khi cập nhật. Vui lòng thử lại!');
        }
    });

    // Add grammar
    document.getElementById('btn-add-grammar')?.addEventListener('click', () => {
        document.getElementById('grammarModalTitle').textContent = 'Thêm ngữ pháp';
        document.getElementById('grammarForm').reset();
        document.getElementById('grammarId').value = '';
        new bootstrap.Modal(document.getElementById('grammarModal')).show();
    });

    // Submit grammar
    document.getElementById('btnSubmitGrammar')?.addEventListener('click', async () => {
        const id = document.getElementById('grammarId').value;
        const grammar = {
            topic: document.getElementById('grammarTitle').value.trim(),
            description: document.getElementById('grammarContent').value.trim(),
            example: document.getElementById('grammarExample').value.trim()
        };

        if (!grammar.topic || !grammar.description) {
            alert('Vui lòng nhập tiêu đề và nội dung');
            return;
        }

        if (id === '') {
            grammarList.push(grammar);
        } else {
            grammarList[parseInt(id)] = grammar;
        }

        const success = await updateLessonAPI();
        if (success) {
            renderGrammar();
            bootstrap.Modal.getInstance(document.getElementById('grammarModal')).hide();
        } else {
            alert('Lỗi khi cập nhật. Vui lòng thử lại!');
        }
    });

    // Add homework
    document.getElementById('btn-add-homework')?.addEventListener('click', () => {
        document.getElementById('homeworkModalTitle').textContent = 'Thêm bài tập';
        document.getElementById('homeworkForm').reset();
        document.getElementById('homeworkId').value = '';
        new bootstrap.Modal(document.getElementById('homeworkModal')).show();
    });

    // Submit homework
    document.getElementById('btnSubmitHomework')?.addEventListener('click', async () => {
        const id = document.getElementById('homeworkId').value;
        const homework = {
            page: document.getElementById('homeworkTitle').value.trim(),
            description: document.getElementById('homeworkDescription').value.trim(),
            dueDate: document.getElementById('homeworkDueDate').value
        };

        if (!homework.page || !homework.description) {
            alert('Vui lòng nhập tiêu đề và mô tả');
            return;
        }

        if (id === '') {
            homeworkList.push(homework);
        } else {
            homeworkList[parseInt(id)] = homework;
        }

        const success = await updateLessonAPI();
        if (success) {
            renderHomework();
            bootstrap.Modal.getInstance(document.getElementById('homeworkModal')).hide();
        } else {
            alert('Lỗi khi cập nhật. Vui lòng thử lại!');
        }
    });
}
