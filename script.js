// 通用函数
function updateHomepageStats() {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    
    const studentCountElement = document.getElementById('studentCount');
    const recordCountElement = document.getElementById('recordCount');
    
    if (studentCountElement) {
        studentCountElement.textContent = students.length;
    }
    if (recordCountElement) {
        recordCountElement.textContent = records.length;
    }
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    updateHomepageStats();
});

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 显示成功消息
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
