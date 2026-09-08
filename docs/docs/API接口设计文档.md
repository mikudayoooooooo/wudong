# 乌东文旅平台 - API接口设计文档

**文档版本**：V1.0  
**编制日期**：2026-09-08  
**Base URL**：`https://api.wudong.com`

---

## RESTful API设计规范

### 1. 基础规范

```
开发环境: http://localhost:7001
生产环境: https://api.wudong.com

接口前缀:
- 前台接口: /api/*
- 管理后台: /api/admin/*
- 商家后台: /api/merchant/*

请求方法:
GET     - 查询资源
POST    - 创建资源
PUT     - 更新资源（全量）
PATCH   - 更新资源（部分）
DELETE  - 删除资源
```

### 2. 统一响应格式

```json
// 成功响应
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1704067200000
}

// 分页响应
{
  "code": 200,
  "data": {
    "list": [...],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}

// 错误响应
{
  "code": 400,
  "message": "参数错误",
  "error": "INVALID_PARAMS",
  "timestamp": 1704067200000
}
```

### 3. 错误码定义

| 错误码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 客户端错误（参数错误）|
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 核心公共接口

### 用户认证

#### POST /api/auth/register - 用户注册
```json
Request:
{
  "phone": "13800138000",
  "password": "abc123456",
  "smsCode": "123456"
}

Response:
{
  "code": 200,
  "data": {
    "userId": 1,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "...",
    "expiresIn": 7200
  }
}
```

#### POST /api/auth/login - 用户登录（密码）
```json
Request:
{
  "phone": "13800138000",
  "password": "abc123456"
}

Response:
{
  "code": 200,
  "data": {
    "userId": 1,
    "nickname": "游客123",
    "avatar": "https://...",
    "token": "...",
    "expiresIn": 7200
  }
}
```

#### POST /api/auth/wechat-login - 微信小程序登录
```json
Request:
{
  "code": "061aXXXX",
  "encryptedData": "...",
  "iv": "..."
}

Response:
{
  "code": 200,
  "data": {
    "userId": 1,
    "isNewUser": true,
    "token": "...",
    "userInfo": {
      "nickname": "微信用户",
      "avatar": "https://..."
    }
  }
}
```

#### GET /api/user/profile - 获取用户信息
```
Headers: Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "id": 1,
    "phone": "13800138000",
    "nickname": "游客123",
    "avatar": "https://...",
    "gender": 1,
    "createdAt": "2024-01-01 12:00:00"
  }
}
```

---

## 模块1：衣-非遗商品

### GET /api/product/list - 商品列表
```
Query:
  page: 1
  pageSize: 20
  categoryId: 1           # 可选
  keyword: "银饰"         # 可选
  sortBy: "sales"        # sales/price/rating

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 10,
        "title": "苗族银手镯",
        "mainImage": "https://...",
        "price": 299.00,
        "sales": 128,
        "rating": 4.8
      }
    ],
    "total": 50,
    "page": 1
  }
}
```

### GET /api/product/:id - 商品详情
```
Response:
{
  "code": 200,
  "data": {
    "id": 10,
    "title": "苗族银手镯",
    "price": 299.00,
    "stock": 50,
    "detail": "<p>商品详情</p>",
    "skus": [
      {
        "id": 101,
        "name": "小号",
        "price": 299.00,
        "stock": 20
      }
    ],
    "isFavorite": false
  }
}
```

### POST /api/product/:id/favorite - 收藏商品
```
Headers: Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "收藏成功"
}
```

---

## 模块2：食-餐饮美食

### GET /api/food/restaurant/list - 餐厅列表
```
Query:
  page: 1
  sortBy: "distance"
  longitude: 108.123456
  latitude: 26.123456

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "苗家长桌宴",
        "distance": 1.2,
        "rating": 4.8,
        "avgPrice": 80
      }
    ]
  }
}
```

### POST /api/food/reservation - 创建餐位预订
```
Request:
{
  "restaurantId": 1,
  "date": "2024-01-15",
  "timeSlotId": 1,
  "guestCount": 4,
  "guestName": "张三",
  "guestPhone": "13800138000"
}

Response:
{
  "code": 200,
  "data": {
    "orderId": 2001,
    "orderNo": "WD202401020001"
  }
}
```

---

## 模块3：住-住宿预订

### GET /api/accommodation/hotel/search - 民宿搜索
```
Query:
  checkInDate: "2024-01-15"
  checkOutDate: "2024-01-16"
  guestCount: 2

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "苗寨木楼民宿",
        "minPrice": 180.00,
        "rating": 4.9
      }
    ]
  }
}
```

### POST /api/accommodation/booking - 创建住宿预订
```
Request:
{
  "hotelId": 1,
  "roomTypeId": 1,
  "checkInDate": "2024-01-15",
  "checkOutDate": "2024-01-16",
  "guestName": "张三",
  "idCard": "510101199001011234"
}

Response:
{
  "code": 200,
  "data": {
    "orderId": 3001,
    "checkInCode": "A12345"
  }
}
```

---

## 模块4：行-线路订票

### GET /api/travel/scenic-spot/:id - 景区详情
```
Response:
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "苗寨梯田景区",
    "openTime": "08:00-18:00",
    "ticketTypes": [
      {
        "id": 1,
        "name": "成人票",
        "price": 80.00
      }
    ]
  }
}
```

### POST /api/travel/ticket/buy - 购买门票
```
Request:
{
  "scenicSpotId": 1,
  "ticketTypeId": 1,
  "useDate": "2024-01-15",
  "quantity": 2,
  "visitors": [
    {
      "name": "张三",
      "phone": "13800138000",
      "idCard": "510101199001011234"
    }
  ]
}

Response:
{
  "code": 200,
  "data": {
    "orderId": 4001,
    "eTicketIds": [1, 2]
  }
}
```

---

## 模块5：社区-照片分享

### GET /api/community/post/feed - 游记信息流
```
Query:
  page: 1
  type: "recommend"  # recommend/following/latest

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "user": {
          "nickname": "旅行达人",
          "avatar": "https://..."
        },
        "content": "今天来到了美丽的乌东村...",
        "images": ["https://..."],
        "likeCount": 128,
        "isLiked": false
      }
    ]
  }
}
```

### POST /api/community/post - 发布游记
```
Request:
{
  "title": "苗寨风光",
  "content": "今天来到了美丽的乌东村...",
  "images": ["https://..."],
  "topicIds": [1, 2]
}

Response:
{
  "code": 200,
  "data": {
    "postId": 1,
    "status": 2  # 审核中
  }
}
```

---

## 统一订单接口

### POST /api/order/create - 创建订单
```
Request:
{
  "orderType": 1,
  "items": [
    {
      "skuId": 101,
      "quantity": 2,
      "price": 299.00
    }
  ],
  "addressId": 5
}

Response:
{
  "code": 200,
  "data": {
    "orderId": 1001,
    "orderNo": "WD202401010001",
    "payAmount": 598.00
  }
}
```

### GET /api/order/:orderNo - 订单详情
```
Response:
{
  "code": 200,
  "data": {
    "orderNo": "WD202401010001",
    "status": 2,
    "totalAmount": 598.00,
    "items": [...],
    "address": {...}
  }
}
```

---

## 统一支付接口

### POST /api/payment/create - 创建支付
```
Request:
{
  "orderNo": "WD202401010001",
  "payChannel": "wechat"
}

Response:
{
  "code": 200,
  "data": {
    "paymentNo": "PAY202401010001",
    "wechatParams": {
      "timeStamp": "1704067200",
      "package": "prepay_id=xxxxx",
      "paySign": "xxxxx"
    }
  }
}
```

---

## 管理后台接口

### GET /api/admin/statistics/overview - 平台总览
```
Response:
{
  "code": 200,
  "data": {
    "dau": 1234,
    "newUsers": 56,
    "orderCount": 89,
    "gmv": 15678.00
  }
}
```

### GET /api/admin/user/list - 用户列表
```
Query:
  page: 1
  keyword: ""
  status: 1

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "phone": "13800138000",
        "nickname": "游客123",
        "status": 1
      }
    ],
    "total": 1000
  }
}
```

---

## 接口文档访问

**Swagger文档地址**：
- 开发环境：http://localhost:7001/swagger-ui/index.html
- 生产环境：https://api.wudong.com/swagger-ui/index.html

**Apifox项目**：
导入Swagger JSON后可在Apifox中管理和测试

---

## 附录：完整接口清单

| 模块 | 接口数量 | 说明 |
|-----|---------|------|
| 用户认证 | 8个 | 注册/登录/个人中心 |
| 购物车 | 6个 | 增删改查 |
| 订单 | 12个 | 创建/查询/取消/退款 |
| 支付 | 3个 | 创建/查询/回调 |
| 商品 | 15个 | 列表/详情/评价/收藏 |
| 餐饮 | 12个 | 餐厅/预订/农产品 |
| 住宿 | 10个 | 民宿/房型/预订 |
| 订票 | 15个 | 景区/门票/路线/电子票 |
| 社区 | 18个 | 游记/评论/话题/关注 |
| 管理后台 | 35个 | 用户/商家/数据/运营 |

**总计约134个接口**

---

## 接口调用示例（JavaScript）

```javascript
// 使用axios调用API
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.wudong.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器（添加Token）
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器（统一错误处理）
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response.status === 401) {
      // 跳转登录页
    }
    return Promise.reject(error);
  }
);

// 调用示例
async function getProductList() {
  const res = await api.get('/api/product/list', {
    params: { page: 1, pageSize: 20 }
  });
  return res.data;
}
```

---

**文档维护**：
- 接口变更需同步更新Swagger注释
- 每次版本发布需导出最新API文档
- 重大接口变更需提前通知前端团队
