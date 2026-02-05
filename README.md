# 教师个人网站使用说明

## 📋 项目简介
这是一个简单的教师个人展示和学生管理网站，包含：
- 个人介绍页面
- 学生信息管理
- 课堂记录管理
- 数据本地存储（使用浏览器localStorage）

## 🚀 部署到GitHub Pages的步骤

### 1. 创建GitHub仓库
1. 登录GitHub账号
2. 点击右上角 "+" → "New repository"
3. 仓库名称填写：`你的用户名.github.io` (例如：`zhangsan.github.io`)
4. 设置为Public（公开）
5. 点击 "Create repository"

### 2. 上传文件到GitHub

**方法一：使用Git命令行（推荐）**

在VS Code中打开终端（Terminal → New Terminal），依次执行：

```bash
# 1. 初始化Git仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交文件
git commit -m "Initial commit"

# 4. 添加远程仓库（替换成你的仓库地址）
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git

# 5. 推送到GitHub
git branch -M main
git push -u origin main
```

**方法二：使用GitHub网页上传**

1. 进入你创建的仓库
2. 点击 "uploading an existing file"
3. 将所有文件拖拽到页面上
4. 点击 "Commit changes"

### 3. 启用GitHub Pages

1. 进入仓库的 Settings（设置）
2. 左侧菜单找到 "Pages"
3. Source选择 "Deploy from a branch"
4. Branch选择 "main" 和 "/(root)"
5. 点击 "Save"
6. 等待1-2分钟，页面会显示网站地址：`https://你的用户名.github.io`

## 📂 文件结构说明

```
website/
├── index.html          # 首页（个人介绍）
├── students.html       # 学生管理页面
├── records.html        # 课堂记录页面
├── styles.css          # 样式文件
├── script.js           # 通用JavaScript
├── students.js         # 学生管理功能
├── records.js          # 课堂记录功能
└── README.md          # 说明文档
```

## 💡 使用说明

### 首页
- 显示个人介绍和教学理念
- 自动统计学生数量和课堂记录数量

### 学生管理
- **添加学生**：填写表单后点击"添加学生"
- **搜索学生**：在搜索框输入学生姓名
- **编辑学生**：点击"编辑"按钮修改信息
- **删除学生**：点击"删除"按钮（会要求确认）

### 课堂记录
- **添加记录**：选择学生，填写课堂信息
- **筛选记录**：按学生姓名筛选
- **搜索记录**：搜索记录内容
- **查看详情**：点击"查看详情"查看完整记录
- **编辑/删除**：支持编辑和删除记录

## ⚠️ 重要提示

1. **数据存储**：所有数据保存在浏览器本地（localStorage），不会上传到服务器
2. **清除数据**：清除浏览器缓存会导致数据丢失
3. **备份建议**：定期导出重要数据（可以复制localStorage内容）
4. **隐私保护**：不要在公共电脑上使用，避免学生信息泄露

## 🔧 自定义修改

### 修改个人信息
编辑 `index.html` 文件中的以下部分：
- 网站标题：`<title>` 标签
- 个人照片：修改 `<img src="">` 的地址
- 联系方式：修改联系方式部分的内容
- 教学经验：修改关于我部分的内容

### 修改颜色主题
编辑 `styles.css` 文件中的颜色值：
- 主色调：`#667eea` 和 `#764ba2`（渐变色）
- 可以搜索这两个颜色值并替换成你喜欢的颜色

### 添加更多功能
- 可以继续添加作业管理、成绩统计等功能
- 遵循现有代码结构添加新页面和功能

## 🆘 常见问题

**Q: 网站打开后没有样式？**
A: 检查文件路径是否正确，确保所有文件在同一目录

**Q: 数据丢失了怎么办？**
A: 数据存储在浏览器本地，如果清除了缓存就会丢失。建议定期备份

**Q: 如何更新网站？**
A: 修改文件后，使用git命令重新提交：
```bash
git add .
git commit -m "更新说明"
git push
```

**Q: 可以在手机上使用吗？**
A: 可以！网站是响应式设计，支持手机、平板访问

## 📧 技术支持

如有问题，请查看：
- GitHub Pages官方文档：https://pages.github.com/
- Git使用教程：https://git-scm.com/book/zh/v2

祝您使用愉快！🎉
