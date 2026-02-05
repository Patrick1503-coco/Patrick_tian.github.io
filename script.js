// 通用函数
function updateHomepageStats() {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    
    // 更新首页卡片统计数据
    const stat1 = document.querySelector('.stat:nth-child(1) .num');
    const stat2 = document.querySelector('.stat:nth-child(2) .num');
    
    if (stat1) stat1.textContent = students.length;
    if (stat2) stat2.textContent = records.length;
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

// 显示成功消息（SaaS 风格）
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    const bgColor = type === 'success' ? '#0066ff' : '#ff4444';
    const icon = type === 'success' ? '✓' : '✕';
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 14px 18px;
        background: ${bgColor};
        color: white;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    messageDiv.innerHTML = `<span>${icon}</span><span>${message}</span>`;
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

