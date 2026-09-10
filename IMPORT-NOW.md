# 🎯 现在导入测试数据

后端已经运行，表已经创建。

## 在PowerShell中执行：

```powershell
Get-Content test-data.sql | mysql -h 127.0.0.1 -u root -pzhuwenjin wudong_travel
```

如果成功，不会有错误信息（只有密码警告可以忽略）。

## 然后刷新浏览器

访问: http://localhost:5173/products

应该能看到8个商品了！

---

**执行上面的导入命令！** 🚀
