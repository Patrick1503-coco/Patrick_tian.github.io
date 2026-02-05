// 学生管理系统
let students = JSON.parse(localStorage.getItem('students') || '[]');
let editingStudentId = null;
let draggedRow = null;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    setupEventListeners();
});

// 设置事件监听
function setupEventListeners() {
    // 添加按钮
    const addBtn = document.getElementById('addStudentBtn');
    if (addBtn) addBtn.addEventListener('click', toggleForm);
    
    // 取消按钮
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', toggleForm);
    
    // 关闭编辑模态框
    const closeEditModalBtn = document.getElementById('closeEditModal');
    if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', closeEditModal);
    
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);
    
    // 添加学生表单提交
    const studentForm = document.getElementById('studentForm');
    if (studentForm) studentForm.addEventListener('submit', handleAddStudent);
    
    // 编辑学生表单提交
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditStudent);
        console.log('编辑表单事件监听器已绑定');
    }
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', handleSearch);
}

// 切换表单显示/隐藏
function toggleForm() {
    const formCard = document.getElementById('formCard');
    if (formCard.style.display === 'none') {
        formCard.style.display = 'block';
        document.getElementById('studentForm').reset();
    } else {
        formCard.style.display = 'none';
    }
}

// 处理添加学生
function handleAddStudent(e) {
    e.preventDefault();
    
    const student = {
        id: Date.now(),
        organization: document.getElementById('organization').value,
        name: document.getElementById('studentName').value,
        gender: document.getElementById('gender').value,
        subject: document.getElementById('subject').value,
        grade: document.getElementById('grade').value,
        firstLessonDate: document.getElementById('firstLessonDate').value,
        totalHours: 0,
        addedDate: new Date().toISOString()
    };
    
    students.push(student);
    saveStudents();
    loadStudents();
    toggleForm();
    showMessage('学生添加成功！');
}

// 保存到本地存储
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
    console.log('数据已保存到 localStorage:', students);
    // 更新首页统计（如果函数存在）
    if (typeof updateHomepageStats === 'function') {
        updateHomepageStats();
    }
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
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        tbody.innerHTML = filteredStudents.map(student => `
            <tr draggable="true" data-student-id="${student.id}" class="student-row">
                <td>${student.organization || '-'}</td>
                <td>${student.name}</td>
                <td>${student.gender || '-'}</td>
                <td>${student.subject}</td>
                <td>${student.grade || '-'}</td>
                <td>${student.firstLessonDate ? formatDate(student.firstLessonDate) : '-'}</td>
                <td>${student.totalHours || '0'}小时</td>
                <td style="display:flex;gap:6px">
                    <button class="btn ghost" style="width:60px;font-size:0.85rem;padding:6px 8px" onclick="openEditModal(${student.id})">修改</button>
                    <button class="btn ghost" style="width:60px;font-size:0.85rem;padding:6px 8px" onclick="deleteStudent(${student.id})">删除</button>
                </td>
            </tr>
        `).join('');
    }
    
    totalStudents.textContent = students.length;
    
    // 添加拖动事件监听
    setupDragAndDrop();
}

// 搜索功能
function handleSearch(e) {
    loadStudents(e.target.value);
}

// 删除学生
function deleteStudent(id) {
    if (!confirm('确定要删除这个学生吗？')) return;
    
    students = students.filter(s => s.id !== id);
    saveStudents();
    loadStudents();
    showMessage('学生已删除');
}

// 打开编辑模态框
function openEditModal(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    editingStudentId = id;
    document.getElementById('editId').value = id;
    document.getElementById('editOrganization').value = student.organization || '';
    document.getElementById('editName').value = student.name;
    document.getElementById('editGender').value = student.gender || '';
    document.getElementById('editSubject').value = student.subject;
    document.getElementById('editGrade').value = student.grade || '';
    document.getElementById('editFirstLessonDate').value = student.firstLessonDate || '';
    document.getElementById('editTotalHours').value = student.totalHours || 0;
    
    const editModal = document.getElementById('editModal');
    editModal.style.display = 'flex';
}

// 关闭编辑模态框
function closeEditModal() {
    console.log('closeEditModal 函数被调用');
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
        console.log('editModal display 已设置为 none');
    } else {
        console.error('找不到 editModal 元素');
    }
    editingStudentId = null;
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.reset();
        console.log('编辑表单已重置');
    }
}

// 处理编辑学生 - 保存修改按钮点击事件
function handleEditStudent(e) {
    e.preventDefault();
    
    console.log('保存修改 - 开始处理');
    console.log('当前 students 数组:', students);
    
    // 第一步：获取学生ID
    const editIdInput = document.getElementById('editId');
    if (!editIdInput) {
        console.error('找不到 editId 元素');
        return;
    }
    
    const studentId = parseInt(editIdInput.value);
    console.log('学生ID:', studentId);
    
    // 在 students 数组中查找学生
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
        console.error('找不到学生记录，ID:', studentId);
        return;
    }
    
    const student = students[studentIndex];
    console.log('找到学生:', student);
    
    // 第二步：从表单中获取最新的数据
    const organizationValue = document.getElementById('editOrganization').value;
    const nameValue = document.getElementById('editName').value;
    const genderValue = document.getElementById('editGender').value;
    const subjectValue = document.getElementById('editSubject').value;
    const gradeValue = document.getElementById('editGrade').value;
    const dateValue = document.getElementById('editFirstLessonDate').value;
    
    console.log('表单数据:', { organizationValue, nameValue, genderValue, subjectValue, gradeValue, dateValue });
    
    // 直接修改数组中的对象（保证响应式）
    students[studentIndex] = {
        ...student,
        organization: organizationValue,
        name: nameValue,
        gender: genderValue,
        subject: subjectValue,
        grade: gradeValue,
        firstLessonDate: dateValue,
        totalHours: parseFloat(document.getElementById('editTotalHours').value) || 0
    };
    
    console.log('更新后的学生数据:', students[studentIndex]);
    
    // 第三步：保存到本地存储
    saveStudents();
    
    // 第四步：立即刷新 DOM（不依赖异步操作）
    console.log('即将重新渲染列表...');
    loadStudents();
    console.log('列表已重新渲染');
    
    // 第五步：显示成功提示
    showMessage('学生信息已修改');
    
    // 第六步：自动关闭弹窗
    console.log('即将关闭弹窗...');
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
        console.log('弹窗已关闭，display 值为:', editModal.style.display);
    } else {
        console.error('找不到 editModal 元素');
    }
    
    editingStudentId = null;
    document.getElementById('editForm').reset();
    console.log('修改完成');
}

// 设置拖动和放下的事件
function setupDragAndDrop() {
    const rows = document.querySelectorAll('.student-row');
    
    rows.forEach(row => {
        // 开始拖动
        row.addEventListener('dragstart', function(e) {
            draggedRow = this;
            this.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
        });
        
        // 拖动过程中
        row.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            if (this !== draggedRow) {
                this.style.borderTop = '2px solid var(--primary)';
            }
        });
        
        // 离开时移除边框
        row.addEventListener('dragleave', function(e) {
            this.style.borderTop = 'none';
        });
        
        // 放下
        row.addEventListener('drop', function(e) {
            e.preventDefault();
            
            if (this !== draggedRow) {
                // 获取拖动行和目标行的学生ID
                const draggedId = parseInt(draggedRow.dataset.studentId);
                const targetId = parseInt(this.dataset.studentId);
                
                // 找到两个学生在数组中的索引
                const draggedIndex = students.findIndex(s => s.id === draggedId);
                const targetIndex = students.findIndex(s => s.id === targetId);
                
                if (draggedIndex !== -1 && targetIndex !== -1) {
                    // 交换数组中的位置
                    [students[draggedIndex], students[targetIndex]] = [students[targetIndex], students[draggedIndex]];
                    
                    // 保存到本地存储
                    saveStudents();
                    
                    // 重新加载列表
                    loadStudents();
                }
            }
            
            this.style.borderTop = 'none';
        });
        
        // 结束拖动
        row.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
            this.style.borderTop = 'none';
            draggedRow = null;
        });
    });
}

