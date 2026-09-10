# ⚠️ 找到根本原因了！

## 问题
我们添加了 `@CoolTag(TagTypes.IGNORE_TOKEN)` 但格式不对！

## 正确的做法

查看组员的代码，应该是：

```typescript
@CoolController()  // 不带路径
// 然后每个方法
@CoolTag(TagTypes.IGNORE_TOKEN)
@Get('/app/xxx', { summary: 'xxx' })
```

**但我们写成了**：
```typescript
@CoolController()
@CoolTag(TagTypes.IGNORE_TOKEN)  // 位置错了！
@Get('/app/product/list')
```

`@CoolTag` 应该在每个 `@Get` 的**正上方**，不是在类上面！

## 正在修复...
