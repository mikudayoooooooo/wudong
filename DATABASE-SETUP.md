# 📊 数据库配置和测试数据创建

## 步骤说明

### 1. 已更新数据库配置
文件: `cool-admin-midway\.env`
```
MYSQL_USER=root
MYSQL_PASSWORD=zhuwenjin
MYSQL_DATABASE=wudong_travel
```

### 2. 重启后端服务

**在后端PowerShell窗口中**:
```powershell
Ctrl+C  # 停止服务
npm run dev  # 重新启动
```

**等待启动完成**，后端会自动创建数据库表。

### 3. 导入测试数据

重启完成后，在PowerShell中执行:
```powershell
cd d:\wudong
mysql -h 127.0.0.1 -u root -pzhuwenjin wudong_travel < test-data.sql
```

### 4. 刷新浏览器

访问:
- http://localhost:5173/products - 商品列表
- http://localhost:5173/restaurants - 餐厅列表
- http://localhost:5173/farm-products - 农产品列表

应该能看到数据了！

---

## 测试数据包含

### 商品 (8个)
- 苗族银饰: 手镯、项链
- 苗族刺绣: 围巾、手提包
- 蜡染制品: 桌布、壁挂
- 民族服饰: 盛装、连衣裙

### 餐厅 (4个)
- 苗家风味餐厅
- 千户苗寨特色餐馆
- 乌东农家乐
- 苗岭山珍馆

每个餐厅都有2-4道菜品

### 农产品 (8个)
- 新鲜蔬菜: 青菜、土豆
- 时令水果: 猕猴桃、草莓
- 土特产: 蜂蜜、腊肉
- 禽蛋肉类: 土鸡蛋、土鸡

---

## 如果导入失败

手动创建数据库:
```sql
CREATE DATABASE IF NOT EXISTS wudong_travel 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

---

**按照步骤操作，页面就会有数据了！** 🎉
