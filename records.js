// 课堂记录管理系统
let records = JSON.parse(localStorage.getItem('records') || '[]');
let students = JSON.parse(localStorage.getItem('students') || '[]');

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    loadStudentOptions();
    loadRecords();
    setupRecordEventListeners();
    setTodayDate();
});

// 设置今天的日期为默认值
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('recordDate');
    if (dateInput) dateInput.value = today;
}

// 加载学生选项
function loadStudentOptions() {
    const studentSelect = document.getElementById('recordStudent');
    const filterSelect = document.getElementById('filterStudent');
    
    if (!studentSelect || !filterSelect) return;
    
    const options = students.map(s => 
        `<option value="${s.name}">${s.name}</option>`
    ).join('');
    
    studentSelect.innerHTML = '<option value="">请选择学生</option>' + options;
    filterSelect.innerHTML = '<option value="">全部学生</option>' + options;
}

// 设置事件监听
function setupRecordEventListeners() {
    // 添加按钮
    const addBtn = document.getElementById('addRecordBtn');
    if (addBtn) addBtn.addEventListener('click', toggleForm);
    
    // 取消按钮
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', toggleForm);
    
    // 添加记录表单提交
    const form = document.getElementById('recordForm');
    if (form) form.addEventListener('submit', handleAddRecord);
    
    // 筛选和搜索
    const filterSelect = document.getElementById('filterStudent');
    const searchInput = document.getElementById('searchRecord');
    
    if (filterSelect) filterSelect.addEventListener('change', handleFilter);
    if (searchInput) searchInput.addEventListener('input', handleFilter);
}

// 切换表单显示/隐藏
function toggleForm() {
    const formCard = document.getElementById('formCard');
    if (formCard.style.display === 'none') {
        formCard.style.display = 'block';
        document.getElementById('recordForm').reset();
        setTodayDate();
    } else {
        formCard.style.display = 'none';
    }
}

// 处理添加记录
function handleAddRecord(e) {
    e.preventDefault();
    
    const record = {
        id: Date.now(),
        studentName: document.getElementById('recordStudent').value,
        date: document.getElementById('recordDate').value,
        duration: document.getElementById('duration').value,
        state: document.getElementById('state').value,
        content: document.getElementById('content').value,
        nextPlan: document.getElementById('nextPlan').value,
        suggestions: document.getElementById('suggestions').value,
        classNotes: document.getElementById('classNotes').value,
        createdAt: new Date().toISOString()
    };
    
    records.unshift(record);
    saveRecords();
    loadRecords();
    toggleForm();
    showMessage('课堂记录添加成功！');
}

// 保存到本地存储
function saveRecords() {
    localStorage.setItem('records', JSON.stringify(records));
    updateHomepageStats();
}

// 加载课堂记录
function loadRecords(filterStudent = '', searchText = '') {
    const container = document.getElementById('recordsList');
    const emptyState = document.getElementById('emptyRecords');
    const totalRecords = document.getElementById('totalRecords');
    
    if (!container) return;
    
    let filteredRecords = records;
    
    // 按学生筛选
    if (filterStudent) {
        filteredRecords = filteredRecords.filter(r => r.studentName === filterStudent);
    }
    
    // 按内容搜索
    if (searchText) {
        const search = searchText.toLowerCase();
        filteredRecords = filteredRecords.filter(r => 
            r.content.toLowerCase().includes(search) ||
            r.suggestions.toLowerCase().includes(search) ||
            r.nextPlan.toLowerCase().includes(search)
        );
    }
    
    if (filteredRecords.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        container.innerHTML = filteredRecords.map(record => `
            <div class="card" style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
                    <div>
                        <h3 style="margin:0;font-size:1rem">${record.studentName}</h3>
                        <div class="small muted" style="margin-top:2px">${formatDate(record.date)} · ${record.duration}</div>
                    </div>
                    <div style="color:var(--text-light);font-size:0.9rem;background:rgba(0,102,255,0.05);padding:4px 8px;border-radius:6px">${record.state}</div>
                </div>
                
                <div style="border-top:1px solid var(--border);padding-top:8px;margin-top:8px">
                    <div style="font-size:0.95rem;line-height:1.5;color:var(--text)">
                        <strong>📚 本节内容:</strong><br>
                        ${truncateText(record.content, 120)}
                    </div>
                    
                    ${record.suggestions ? `
                        <div style="margin-top:8px;font-size:0.95rem">
                            <strong>💡 建议:</strong><br>
                            ${truncateText(record.suggestions, 100)}
                        </div>
                    ` : ''}
                </div>
                
                <div style="display:flex;gap:8px;margin-top:10px">
                    <button class="btn ghost" style="width:60px;font-size:0.85rem;padding:6px 8px" onclick="deleteRecord(${record.id})">删除</button>
                </div>
            </div>
        `).join('');
    }
    
    if (totalRecords) totalRecords.textContent = records.length;
}

// 截断文本
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// 处理筛选
function handleFilter() {
    const filterStudent = document.getElementById('filterStudent').value;
    const searchText = document.getElementById('searchRecord').value;
    loadRecords(filterStudent, searchText);
}

// 删除记录
function deleteRecord(id) {
    if (!confirm('确定要删除这条记录吗？')) return;
    
    records = records.filter(r => r.id !== id);
    saveRecords();
    loadRecords();
    showMessage('记录已删除');
}

