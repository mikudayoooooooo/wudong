# 🔧 快速修复指南

## 问题：vite 不是内部或外部命令

### 原因
wudong-web 项目还没有安装依赖包。

---

## 🚀 解决方案

### 步骤1: 安装前端依赖
```bash
cd d:\wudong\wudong-web
npm install
```

**等待时间**: 约2-3分钟（首次安装）

---

### 步骤2: 安装后端依赖
```bash
cd d:\wudong\cool-admin-midway
npm install
```

**等待时间**: 约3-5分钟（首次安装）

---

### 步骤3: 启动项目

#### 方法1: 使用启动脚本
```bash
# 双击运行
d:\wudong\start-all.bat
```

#### 方法2: 手动启动
```bash
# 终端1 - 启动后端
cd d:\wudong\cool-admin-midway
npm run dev

# 终端2 - 启动前端
cd d:\wudong\wudong-web
npm run dev
```

---

## ⏳ 安装过程说明

### wudong-web 依赖安装
```
正在安装约50个包...
- vue
- vite
- typescript
- vue-router
- pinia
- 等等...

预计时间: 2-3分钟
```

### cool-admin-midway 依赖安装
```
正在安装约100个包...
- @midwayjs/core
- @cool-midway/core
- typeorm
- mysql2
- 等等...

预计时间: 3-5分钟
```

---

## 💡 提示

### 如果 npm install 很慢

**使用国内镜像**:
```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 然后再安装
cd d:\wudong\wudong-web
npm install
```

---

## ✅ 完整的首次启动流程

```bash
# 1. 安装前端依赖
cd d:\wudong\wudong-web
npm install

# 2. 安装后端依赖
cd d:\wudong\cool-admin-midway
npm install

# 3. 配置数据库
# 编辑 cool-admin-midway/.env 文件
# 设置正确的数据库连接信息

# 4. 启动后端
cd d:\wudong\cool-admin-midway
npm run dev
# 等待看到: Your application is running at http://127.0.0.1:8001

# 5. 启动前端（新终端）
cd d:\wudong\wudong-web
npm run dev
# 等待看到: Local: http://localhost:5173/

# 6. 访问
# 打开浏览器: http://localhost:5173
```

---

## 🔍 验证安装成功

### 检查 node_modules 是否存在
```bash
# 前端
ls d:\wudong\wudong-web\node_modules

# 后端
ls d:\wudong\cool-admin-midway\node_modules
```

如果看到很多文件夹，说明安装成功！

---

## ⚠️ 常见问题

### 1. npm 不是内部命令
- 需要安装 Node.js
- 下载地址: https://nodejs.org/

### 2. 安装失败或超时
```bash
# 清理缓存重试
npm cache clean --force
npm install
```

### 3. 权限错误
- 以管理员身份运行 PowerShell
- 或使用 Git Bash

---

## 📞 需要帮助？

安装完成后，查看:
- **START-GUIDE.md** - 详细启动指南
- **FINAL-REPORT.md** - 项目总结

---

**正在为你安装依赖，请稍候...** ⏳
