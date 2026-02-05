// 学生管理系统
let students = JSON.parse(localStorage.getItem('students') || '[]');
let editingId = null;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    setupEventListeners();
});

// 设置事件监听
function setupEventListeners() {
    // 添加学生表单提交
    document.getElementById('studentForm').addEventListener('submit', handleAddStudent);
    
    // 搜索功能
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // 编辑表单提交
    document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
    
    // 模态框关闭
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('editModal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

// 处理添加学生
function handleAddStudent(e) {
    e.preventDefault();
    
    const student = {
        id: Date.now(),
        name: document.getElementById('studentName').value,
        subject: document.getElementById('subject').value,
        grade: document.getElementById('grade').value,
        contact: document.getElementById('contact').value,
        notes: document.getElementById('notes').value,
        addedDate: new Date().toISOString()
    };
    
    students.push(student);
    saveStudents();
    loadStudents();
    e.target.reset();
    showMessage('学生添加成功！');
}

// 保存到本地存储
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
    updateHomepageStats();
}

// 加载学生列表
function loadStudents(filterText = '') {
    const tbody = document.getElementById('studentsBody');
    const emptyState = document.getElementById('emptyState');
    const totalStudents = document.getElementById('totalStudents');
    
    let filteredStudents = students;
    if (filterText) {
        filteredStudents = students.filter(s => 
            s.name.toLowerCase().includes(filterText.toLowerCase())
        );
    }
    
    if (filteredStudents.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        tbody.innerHTML = filteredStudents.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.subject}</td>
                <td>${student.grade || '-'}</td>
                <td>${student.contact || '-'}</td>
                <td>${student.notes || '-'}</td>
                <td>${formatDate(student.addedDate)}</td>
                <td>
                    <button class="btn-edit" onclick="editStudent(${student.id})">编辑</button>
                    <button class="btn-delete" onclick="deleteStudent(${student.id})">删除</button>
                </td>
            </tr>
        `).join('');
    }
    
    totalStudents.textContent = students.length;
}

// 搜索功能
function handleSearch(e) {
    loadStudents(e.target.value);
}

// 编辑学生
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    editingId = id;
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = student.name;
    document.getElementById('editSubject').value = student.subject;
    document.getElementById('editGrade').value = student.grade || '';
    document.getElementById('editContact').value = student.contact || '';
    document.getElementById('editNotes').value = student.notes || '';
    
    document.getElementById('editModal').classList.add('show');
}

// 处理编辑提交
function handleEditSubmit(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const index = students.findIndex(s => s.id === id);
    
    if (index !== -1) {
        students[index] = {
            ...students[index],
            name: document.getElementById('editName').value,
            subject: document.getElementById('editSubject').value,
            grade: document.getElementById('editGrade').value,
            contact: document.getElementById('editContact').value,
            notes: document.getElementById('editNotes').value
        };
        
        saveStudents();
        loadStudents();
        closeModal();
        showMessage('学生信息更新成功！');
    }
}

// 删除学生
function deleteStudent(id) {
    if (!confirm('确定要删除这个学生吗？')) return;
    
    students = students.filter(s => s.id !== id);
    saveStudents();
    loadStudents();
    showMessage('学生已删除');
}

// 关闭模态框
function closeModal() {
    document.getElementById('editModal').classList.remove('show');
    editingId = null;
}
