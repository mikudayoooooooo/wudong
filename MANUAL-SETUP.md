# 📋 手动创建表和导入数据

## 步骤1: 创建表结构

```powershell
Get-Content create-tables.sql | mysql -h 127.0.0.1 -u root -pzhuwenjin wudong_travel
```

## 步骤2: 导入测试数据

```powershell
Get-Content test-data.sql | mysql -h 127.0.0.1 -u root -pzhuwenjin wudong_travel
```

## 步骤3: 刷新浏览器

访问: http://localhost:5173/products

应该能看到数据了！

---

**请在PowerShell中依次执行这两个命令！** 🚀
