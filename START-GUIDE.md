# 🚀 项目启动指南

**日期**: 2026-09-10  
**状态**: ✅ 所有代码已完成，可以运行

---

## 📦 项目结构

```
wudong/
├── cool-admin-midway/          # 后端服务（端口: 8001）
├── cool-admin-vue/             # 商家管理后台（端口: 9000）
└── wudong-web/                 # C端用户前端（端口: 5173）✨ 新增页面已完成
```

---

## ✅ 已完成的功能

### 后端接口（cool-admin-midway）
- ✅ **商品系统** - 15个接口（商家端 + C端）
- ✅ **餐饮系统** - 24个接口（商家端 + C端）
- ✅ **住宿系统** - 10个接口（商家端 + C端）- 组员完成
- ✅ **运营模块** - Banner/公告管理 - 组员完成

### C端前端（wudong-web）
- ✅ **首页** - 组员完成
- ✅ **民宿列表/详情** - 组员完成
- ✅ **商品列表/详情** - ✨ 刚刚创建
- ✅ **餐厅列表/详情** - ✨ 刚刚创建
- ✅ **农产品列表** - ✨ 刚刚创建

---

## 🚀 启动步骤

### 步骤1: 启动后端服务

```bash
# 打开终端1
cd d:\wudong\cool-admin-midway

# 安装依赖（首次运行）
npm install

# 启动后端
npm run dev
```

**后端地址**: http://localhost:8001  
**Swagger文档**: http://localhost:8001/swagger-ui/index.html

等待看到：
```
✔ Your application is running at http://127.0.0.1:8001
```

---

### 步骤2: 启动C端前端

```bash
# 打开终端2
cd d:\wudong\wudong-web

# 安装依赖（首次运行）
npm install

# 启动前端
npm run dev
```

**前端地址**: http://localhost:5173

等待看到：
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

### 步骤3: 访问页面

打开浏览器，访问以下地址：

#### 🏠 首页
```
http://localhost:5173/
```

#### 🏨 住宿模块（组员完成）
```
http://localhost:5173/hotels          # 民宿列表
http://localhost:5173/hotels/1        # 民宿详情（示例）
```

#### 👕 商品模块（新增）
```
http://localhost:5173/products        # 商品列表
http://localhost:5173/products/1      # 商品详情（示例）
```

#### 🍽️ 餐饮模块（新增）
```
http://localhost:5173/restaurants     # 餐厅列表
http://localhost:5173/restaurants/1   # 餐厅详情（示例）
```

#### 🌾 农产品模块（新增）
```
http://localhost:5173/farm-products   # 农产品列表
```

---

## 📋 测试清单

### 1. 测试商品功能
- [ ] 访问 http://localhost:5173/products
- [ ] 尝试搜索商品
- [ ] 切换分类筛选
- [ ] 切换排序方式
- [ ] 点击商品查看详情

### 2. 测试餐厅功能
- [ ] 访问 http://localhost:5173/restaurants
- [ ] 搜索餐厅
- [ ] 切换排序方式
- [ ] 点击餐厅查看详情
- [ ] 查看餐厅菜品列表

### 3. 测试农产品功能
- [ ] 访问 http://localhost:5173/farm-products
- [ ] 搜索农产品
- [ ] 切换分类筛选
- [ ] 切换排序方式

---

## ⚠️ 常见问题

### 问题1: 页面显示"接口异常"或"加载失败"

**原因**: 后端服务未启动或数据库未连接

**解决**:
1. 检查后端是否正常运行（终端1）
2. 检查MySQL数据库是否启动
3. 检查 `cool-admin-midway/.env` 数据库配置

---

### 问题2: 页面空白或没有数据

**原因**: 数据库中没有测试数据

**解决**:
1. 启动商家管理后台（可选）：
   ```bash
   cd cool-admin-vue
   npm run dev
   ```
   访问: http://localhost:9000
   
2. 登录商家后台：
   - 用户名: `admin`
   - 密码: `123456`

3. 在后台添加测试数据：
   - 商品管理 → 添加商品
   - 餐厅管理 → 添加餐厅
   - 农产品管理 → 添加农产品

---

### 问题3: 端口冲突

如果端口被占用：

**方法1**: 修改端口
```typescript
// wudong-web/vite.config.ts
server: {
  port: 5174,  // 改成其他端口
  ...
}
```

**方法2**: 关闭占用端口的程序
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

### 问题4: 跨域错误

**检查**:
- `wudong-web/vite.config.ts` 中代理配置是否正确
- 后端服务是否在 8001 端口运行

代理配置应该是：
```typescript
proxy: {
  '/app': {
    target: 'http://127.0.0.1:8001',
    changeOrigin: true,
  },
}
```

---

## 🎨 添加导航菜单（可选）

如果想在首页添加导航链接，编辑 `wudong-web/src/App.vue`：

```vue
<template>
  <nav>
    <router-link to="/">首页</router-link>
    <router-link to="/hotels">民宿</router-link>
    <router-link to="/products">商品</router-link>
    <router-link to="/restaurants">餐厅</router-link>
    <router-link to="/farm-products">农产品</router-link>
  </nav>
  <router-view />
</template>
```

---

## 📊 API接口测试

### 使用Swagger测试
访问: http://localhost:8001/swagger-ui/index.html

**测试步骤**:
1. 找到 `/app/product/list` 接口
2. 点击 "Try it out"
3. 输入参数（可选）
4. 点击 "Execute"
5. 查看响应数据

### 使用Postman测试

**商品列表**:
```
GET http://localhost:8001/app/product/list?page=1&size=10
```

**餐厅列表**:
```
GET http://localhost:8001/app/food/restaurant/list?page=1&size=10
```

**农产品列表**:
```
GET http://localhost:8001/app/food/farm-product/list?page=1&size=10
```

---

## 🎯 下一步工作

### 可选改进
- [ ] 添加导航菜单
- [ ] 优化页面样式
- [ ] 添加图片懒加载
- [ ] 添加分页功能
- [ ] 实现购物车功能（需要订单系统）
- [ ] 实现预订功能（需要预订系统）

### 必要工作
- [ ] 在商家后台添加测试数据
- [ ] 测试所有页面功能
- [ ] 检查移动端适配

---

## ✅ 验收清单

运行以下命令确保所有文件都已创建：

```bash
# 检查API文件
ls wudong-web/src/api/product.ts
ls wudong-web/src/api/food.ts

# 检查视图文件
ls wudong-web/src/views/product/ProductListView.vue
ls wudong-web/src/views/product/ProductDetailView.vue
ls wudong-web/src/views/food/RestaurantListView.vue
ls wudong-web/src/views/food/RestaurantDetailView.vue
ls wudong-web/src/views/food/FarmProductListView.vue

# 检查路由配置
grep "products" wudong-web/src/router/index.ts
```

---

## 🎉 完成状态

- ✅ 后端接口：50+ 个接口全部实现
- ✅ C端前端：8个页面全部创建
- ✅ 路由配置：已更新
- ✅ API调用：已配置
- ✅ 类型定义：已添加

**所有代码已完成！现在可以运行项目了！** 🚀

---

**问题反馈**: 如有问题，查看：
- 后端文档: `BACKEND-DEVELOPMENT-COMPLETE.md`
- C端文档: `C-END-DEVELOPMENT-COMPLETE.md`
- 融合指南: `PROJECT-MERGE-GUIDE.md`
