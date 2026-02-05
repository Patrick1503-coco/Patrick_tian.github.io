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
    document.getElementById('recordDate').value = today;
}

// 加载学生选项
function loadStudentOptions() {
    const studentSelect = document.getElementById('recordStudent');
    const filterSelect = document.getElementById('filterStudent');
    
    const options = students.map(s => 
        `<option value="${s.name}">${s.name}</option>`
    ).join('');
    
    studentSelect.innerHTML = '<option value="">请选择学生</option>' + options;
    filterSelect.innerHTML = '<option value="">全部学生</option>' + options;
}

// 设置事件监听
function setupRecordEventListeners() {
    // 添加记录表单提交
    document.getElementById('recordForm').addEventListener('submit', handleAddRecord);
    
    // 筛选和搜索
    document.getElementById('filterStudent').addEventListener('change', handleFilter);
    document.getElementById('searchRecord').addEventListener('input', handleFilter);
    
    // 模态框关闭
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeViewModal);
    }
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('viewModal');
        if (e.target === modal) {
            closeViewModal();
        }
    });
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
    
    records.unshift(record); // 添加到数组开头，最新的在前面
    saveRecords();
    loadRecords();
    e.target.reset();
    setTodayDate();
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
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        container.innerHTML = filteredRecords.map(record => `
            <div class="record-card">
                <div class="record-header">
                    <h4>${record.studentName}</h4>
                    <span class="record-date">${formatDate(record.date)}</span>
                </div>
                
                <div class="record-info">
                    <div class="info-item">
                        <span class="info-label">时长:</span>
                        <span>${record.duration}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">状态:</span>
                        <span>${record.state}</span>
                    </div>
                </div>
                
                <div class="record-content">
                    <p><strong>本节内容:</strong> ${truncateText(record.content, 100)}</p>
                    ${record.suggestions ? `<p><strong>课后建议:</strong> ${truncateText(record.suggestions, 100)}</p>` : ''}
                </div>
                
                <div class="record-actions">
                    <button class="btn-view" onclick="viewRecord(${record.id})">查看详情</button>
                    <button class="btn-edit" onclick="editRecord(${record.id})">编辑</button>
                    <button class="btn-delete" onclick="deleteRecord(${record.id})">删除</button>
                </div>
            </div>
        `).join('');
    }
    
    totalRecords.textContent = records.length;
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

// 查看记录详情
function viewRecord(id) {
    const record = records.find(r => r.id === id);
    if (!record) return;
    
    const detailHtml = `
        <h3>课堂记录详情</h3>
        <div style="margin-top: 1.5rem;">
            <div style="margin-bottom: 1rem;">
                <strong>学生姓名:</strong> ${record.studentName}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>上课日期:</strong> ${formatDate(record.date)}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>上课时长:</strong> ${record.duration}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>上课状态:</strong> ${record.state}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>本节所讲内容:</strong><br>
                <p style="margin-top: 0.5rem; line-height: 1.6;">${record.content}</p>
            </div>
            ${record.nextPlan ? `
                <div style="margin-bottom: 1rem;">
                    <strong>下节计划:</strong><br>
                    <p style="margin-top: 0.5rem; line-height: 1.6;">${record.nextPlan}</p>
                </div>
            ` : ''}
            ${record.suggestions ? `
                <div style="margin-bottom: 1rem;">
                    <strong>课后建议:</strong><br>
                    <p style="margin-top: 0.5rem; line-height: 1.6;">${record.suggestions}</p>
                </div>
            ` : ''}
            ${record.classNotes ? `
                <div style="margin-bottom: 1rem;">
                    <strong>学生课堂情况:</strong><br>
                    <p style="margin-top: 0.5rem; line-height: 1.6;">${record.classNotes}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('recordDetail').innerHTML = detailHtml;
    document.getElementById('viewModal').classList.add('show');
}

// 编辑记录（简化版，直接删除重建）
function editRecord(id) {
    const record = records.find(r => r.id === id);
    if (!record) return;
    
    // 填充表单
    document.getElementById('recordStudent').value = record.studentName;
    document.getElementById('recordDate').value = record.date;
    document.getElementById('duration').value = record.duration;
    document.getElementById('state').value = record.state;
    document.getElementById('content').value = record.content;
    document.getElementById('nextPlan').value = record.nextPlan || '';
    document.getElementById('suggestions').value = record.suggestions || '';
    document.getElementById('classNotes').value = record.classNotes || '';
    
    // 删除原记录
    deleteRecord(id, false);
    
    // 滚动到表单顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showMessage('记录已加载到表单，修改后请重新提交');
}

// 删除记录
function deleteRecord(id, confirm = true) {
    if (confirm && !window.confirm('确定要删除这条记录吗？')) return;
    
    records = records.filter(r => r.id !== id);
    saveRecords();
    loadRecords();
    if (confirm) {
        showMessage('记录已删除');
    }
}

// 关闭查看模态框
function closeViewModal() {
    document.getElementById('viewModal').classList.remove('show');
}
