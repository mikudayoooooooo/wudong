-- ============================================
-- 乌东文旅平台 - 数据库初始化脚本
-- 版本：V1.0
-- 日期：2026-09-08
-- 说明：包含所有50张表的完整建表语句
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `wudong_platform`
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `wudong_platform`;

-- ============================================
-- 第一部分：公共表（10张）
-- ============================================

-- 1. 用户表
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  `phone` VARCHAR(11) NOT NULL UNIQUE COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
  `nickname` VARCHAR(50) DEFAULT '游客' COMMENT '昵称',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `gender` TINYINT DEFAULT 0 COMMENT '性别：0未知 1男 2女',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `region` VARCHAR(100) DEFAULT NULL COMMENT '地区',
  `bio` VARCHAR(200) DEFAULT NULL COMMENT '个人简介',
  `role` TINYINT DEFAULT 1 COMMENT '角色：1游客 2商家 3管理员',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1正常 0禁用',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_phone` (`phone`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 收货地址表
DROP TABLE IF EXISTS `user_address`;
CREATE TABLE `user_address` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `consignee` VARCHAR(50) NOT NULL COMMENT '收货人',
  `phone` VARCHAR(11) NOT NULL COMMENT '手机号',
  `province` VARCHAR(50) NOT NULL COMMENT '省',
  `city` VARCHAR(50) NOT NULL COMMENT '市',
  `district` VARCHAR(50) NOT NULL COMMENT '区',
  `address` VARCHAR(200) NOT NULL COMMENT '详细地址',
  `is_default` TINYINT DEFAULT 0 COMMENT '是否默认：1是 0否',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  CONSTRAINT `fk_address_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收货地址表';

-- 3. 订单主表
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号（唯一）',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `order_type` TINYINT NOT NULL COMMENT '订单类型：1商品 2餐位 3住宿 4门票 5路线',
  `module` VARCHAR(20) NOT NULL COMMENT '所属模块：product/food/accommodation/travel',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总额',
  `pay_amount` DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '订单状态：1待支付 2已支付 3已完成 4已取消 5已退款',
  `pay_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `complete_time` DATETIME DEFAULT NULL COMMENT '完成时间',
  `cancel_time` DATETIME DEFAULT NULL COMMENT '取消时间',
  `remark` VARCHAR(500) DEFAULT NULL COMMENT '订单备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order_no` (`order_no`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单主表';

-- 4. 商品订单子表
DROP TABLE IF EXISTS `order_product`;
CREATE TABLE `order_product` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `product_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `sku_id` INT UNSIGNED NOT NULL COMMENT 'SKU ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `sku_name` VARCHAR(100) NOT NULL COMMENT 'SKU名称',
  `product_image` VARCHAR(500) NOT NULL COMMENT '商品图片',
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `quantity` INT NOT NULL COMMENT '数量',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '小计',
  `address_id` INT UNSIGNED DEFAULT NULL COMMENT '收货地址ID',
  `express_company` VARCHAR(50) DEFAULT NULL COMMENT '快递公司',
  `express_no` VARCHAR(50) DEFAULT NULL COMMENT '快递单号',
  `ship_time` DATETIME DEFAULT NULL COMMENT '发货时间',
  `receive_time` DATETIME DEFAULT NULL COMMENT '收货时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_order_id` (`order_id`),
  CONSTRAINT `fk_order_product` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品订单子表';

-- 5. 预订订单子表（餐位/住宿）
DROP TABLE IF EXISTS `order_reservation`;
CREATE TABLE `order_reservation` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `reservation_type` TINYINT NOT NULL COMMENT '预订类型：1餐位 2住宿',
  `target_id` INT UNSIGNED NOT NULL COMMENT '目标ID（餐厅ID/民宿ID）',
  `target_name` VARCHAR(200) NOT NULL COMMENT '目标名称',
  `check_in_date` DATE NOT NULL COMMENT '入住/就餐日期',
  `check_out_date` DATE DEFAULT NULL COMMENT '离店日期（住宿用）',
  `guest_name` VARCHAR(50) NOT NULL COMMENT '入住人/就餐人姓名',
  `guest_phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `guest_count` INT NOT NULL COMMENT '人数',
  `id_card` VARCHAR(18) DEFAULT NULL COMMENT '身份证号（住宿必填）',
  `time_slot` VARCHAR(50) DEFAULT NULL COMMENT '时段（餐位用）',
  `room_type_id` INT UNSIGNED DEFAULT NULL COMMENT '房型ID（住宿用）',
  `special_request` VARCHAR(500) DEFAULT NULL COMMENT '特殊要求',
  `check_in_code` VARCHAR(20) DEFAULT NULL COMMENT '入住码/核销码',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_check_in_date` (`check_in_date`),
  CONSTRAINT `fk_order_reservation` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预订订单子表';

-- 6. 票务订单子表
DROP TABLE IF EXISTS `order_ticket`;
CREATE TABLE `order_ticket` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `ticket_type` TINYINT NOT NULL COMMENT '票类型：1门票 2路线套餐',
  `target_id` INT UNSIGNED NOT NULL COMMENT '目标ID（景区ID/路线ID）',
  `target_name` VARCHAR(200) NOT NULL COMMENT '目标名称',
  `ticket_name` VARCHAR(100) NOT NULL COMMENT '票种名称',
  `use_date` DATE NOT NULL COMMENT '使用日期',
  `quantity` INT NOT NULL COMMENT '数量',
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '总价',
  `visitor_info` JSON DEFAULT NULL COMMENT '游客信息（JSON数组）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_use_date` (`use_date`),
  CONSTRAINT `fk_order_ticket` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='票务订单子表';

-- 7. 支付记录表
DROP TABLE IF EXISTS `payment_record`;
CREATE TABLE `payment_record` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `payment_no` VARCHAR(32) NOT NULL UNIQUE COMMENT '支付流水号',
  `pay_channel` VARCHAR(20) NOT NULL COMMENT '支付渠道：wechat/alipay',
  `pay_amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  `pay_status` TINYINT DEFAULT 1 COMMENT '支付状态：1待支付 2已支付 3已退款',
  `transaction_id` VARCHAR(64) DEFAULT NULL COMMENT '第三方交易号',
  `pay_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `refund_time` DATETIME DEFAULT NULL COMMENT '退款时间',
  `refund_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '退款金额',
  `callback_data` JSON DEFAULT NULL COMMENT '支付回调数据',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_payment_no` (`payment_no`),
  CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付记录表';

-- 8. 购物车表
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `product_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `sku_id` INT UNSIGNED NOT NULL COMMENT 'SKU ID',
  `quantity` INT NOT NULL DEFAULT 1 COMMENT '数量',
  `checked` TINYINT DEFAULT 1 COMMENT '是否选中：1是 0否',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_sku` (`user_id`, `sku_id`),
  INDEX `idx_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- 9. 收藏表
DROP TABLE IF EXISTS `favorite`;
CREATE TABLE `favorite` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型：product/restaurant/hotel/scenic/post',
  `target_id` INT UNSIGNED NOT NULL COMMENT '目标ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_target` (`user_id`, `target_type`, `target_id`),
  INDEX `idx_user_id` (`user_id`),
  CONSTRAINT `fk_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 10. 系统消息表
DROP TABLE IF EXISTS `system_message`;
CREATE TABLE `system_message` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED DEFAULT NULL COMMENT '用户ID（NULL表示全员消息）',
  `type` VARCHAR(20) NOT NULL COMMENT '消息类型：order/system/activity/interact',
  `title` VARCHAR(200) NOT NULL COMMENT '消息标题',
  `content` TEXT NOT NULL COMMENT '消息内容',
  `link_type` VARCHAR(20) DEFAULT NULL COMMENT '跳转类型',
  `link_value` VARCHAR(500) DEFAULT NULL COMMENT '跳转地址',
  `is_read` TINYINT DEFAULT 0 COMMENT '是否已读：1是 0否',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_type` (`type`),
  CONSTRAINT `fk_message_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统消息表';

-- ============================================
-- 第二部分：模块1 - 衣-非遗商品（6张表）
-- ============================================

-- 11. 商品分类表
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `parent_id` INT UNSIGNED DEFAULT 0 COMMENT '父分类ID，0为一级分类',
  `icon` VARCHAR(500) DEFAULT NULL COMMENT '分类图标',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- 12. 商品表
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '商品ID',
  `title` VARCHAR(200) NOT NULL COMMENT '商品标题',
  `subtitle` VARCHAR(500) DEFAULT NULL COMMENT '副标题',
  `category_id` INT UNSIGNED NOT NULL COMMENT '分类ID',
  `merchant_id` INT UNSIGNED NOT NULL COMMENT '商家ID',
  `main_image` VARCHAR(500) NOT NULL COMMENT '主图URL',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `market_price` DECIMAL(10,2) DEFAULT NULL COMMENT '市场价',
  `stock` INT DEFAULT 0 COMMENT '总库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `detail` TEXT DEFAULT NULL COMMENT '商品详情（富文本）',
  `craft_intro` TEXT DEFAULT NULL COMMENT '工艺介绍',
  `inheritor_id` INT UNSIGNED DEFAULT NULL COMMENT '传承人ID',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1上架 0下架',
  `rating` DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_merchant_id` (`merchant_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 13. 商品SKU表
DROP TABLE IF EXISTS `product_sku`;
CREATE TABLE `product_sku` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'SKU ID',
  `product_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `name` VARCHAR(100) NOT NULL COMMENT 'SKU名称',
  `attributes` JSON DEFAULT NULL COMMENT '规格属性（JSON）',
  `price` DECIMAL(10,2) NOT NULL COMMENT 'SKU价格',
  `stock` INT NOT NULL COMMENT 'SKU库存',
  `image` VARCHAR(500) DEFAULT NULL COMMENT 'SKU图片',
  `sku_code` VARCHAR(50) DEFAULT NULL COMMENT 'SKU编码',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_product_id` (`product_id`),
  CONSTRAINT `fk_sku_product` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品SKU表';

-- 14. 商品图片表
DROP TABLE IF EXISTS `product_image`;
CREATE TABLE `product_image` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `image_url` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_product_id` (`product_id`),
  CONSTRAINT `fk_image_product` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品图片表';

-- 15. 商品评价表
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `product_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `rating` TINYINT NOT NULL COMMENT '评分：1-5星',
  `content` VARCHAR(1000) NOT NULL COMMENT '评价内容',
  `images` JSON DEFAULT NULL COMMENT '评价图片（JSON数组）',
  `merchant_reply` VARCHAR(500) DEFAULT NULL COMMENT '商家回复',
  `reply_time` DATETIME DEFAULT NULL COMMENT '回复时间',
  `append_content` VARCHAR(500) DEFAULT NULL COMMENT '追评内容',
  `append_time` DATETIME DEFAULT NULL COMMENT '追评时间',
  `is_anonymous` TINYINT DEFAULT 0 COMMENT '是否匿名：1是 0否',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1正常 0隐藏',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_product_id` (`product_id`),
  INDEX `idx_user_id` (`user_id`),
  CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`),
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价表';

-- 16. 传承人表
DROP TABLE IF EXISTS `inheritor`;
CREATE TABLE `inheritor` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '传承人姓名',
  `level` VARCHAR(50) DEFAULT NULL COMMENT '级别（国家级/省级/市级）',
  `skill` VARCHAR(100) DEFAULT NULL COMMENT '技艺',
  `intro` TEXT DEFAULT NULL COMMENT '简介',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='传承人表';

-- ============================================
-- 第三部分：模块2 - 食-餐饮美食（7张表）
-- ============================================

-- 17. 餐厅表
DROP TABLE IF EXISTS `restaurant`;
CREATE TABLE `restaurant` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `merchant_id` INT UNSIGNED NOT NULL COMMENT '商家ID',
  `name` VARCHAR(100) NOT NULL COMMENT '餐厅名称',
  `address` VARCHAR(200) NOT NULL COMMENT '地址',
  `longitude` DECIMAL(10,6) NOT NULL COMMENT '经度',
  `latitude` DECIMAL(10,6) NOT NULL COMMENT '纬度',
  `business_hours` VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  `capacity` INT DEFAULT 0 COMMENT '容纳人数',
  `intro` TEXT DEFAULT NULL COMMENT '餐厅介绍',
  `main_image` VARCHAR(500) DEFAULT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '餐厅图片（JSON数组）',
  `rating` DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1营业 0关闭',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_merchant_id` (`merchant_id`),
  INDEX `idx_location` (`longitude`, `latitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐厅表';

-- 18. 菜品表
DROP TABLE IF EXISTS `dish`;
CREATE TABLE `dish` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `restaurant_id` INT UNSIGNED NOT NULL COMMENT '餐厅ID',
  `name` VARCHAR(100) NOT NULL COMMENT '菜品名称',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `image` VARCHAR(500) DEFAULT NULL COMMENT '图片',
  `intro` VARCHAR(500) DEFAULT NULL COMMENT '介绍',
  `is_signature` TINYINT DEFAULT 0 COMMENT '是否招牌菜：1是 0否',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1在售 0停售',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fk_dish_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';

-- 19. 餐位时段表
DROP TABLE IF EXISTS `time_slot`;
CREATE TABLE `time_slot` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `restaurant_id` INT UNSIGNED NOT NULL COMMENT '餐厅ID',
  `name` VARCHAR(50) NOT NULL COMMENT '时段名称（如：午餐11:30-13:30）',
  `start_time` TIME NOT NULL COMMENT '开始时间',
  `end_time` TIME NOT NULL COMMENT '结束时间',
  `max_reservations` INT NOT NULL COMMENT '最大预订数',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fk_slot_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位时段表';

-- 20. 农产品分类表
DROP TABLE IF EXISTS `farm_product_category`;
CREATE TABLE `farm_product_category` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(500) DEFAULT NULL COMMENT '图标',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品分类表';

-- 21. 农产品表
DROP TABLE IF EXISTS `farm_product`;
CREATE TABLE `farm_product` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NOT NULL COMMENT '分类ID',
  `merchant_id` INT UNSIGNED NOT NULL COMMENT '商家ID',
  `name` VARCHAR(100) NOT NULL COMMENT '商品名称',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `spec` VARCHAR(50) DEFAULT NULL COMMENT '规格（如：500g/袋）',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `main_image` VARCHAR(500) DEFAULT NULL COMMENT '主图',
  `origin` VARCHAR(100) DEFAULT NULL COMMENT '产地',
  `shelf_life` VARCHAR(50) DEFAULT NULL COMMENT '保质期',
  `detail` TEXT DEFAULT NULL COMMENT '商品详情',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `status` TINYINT DEFAULT 1 COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_merchant_id` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品表';

-- ============================================
-- 第四部分：模块3 - 住-住宿预订（5张表）
-- ============================================

-- 22. 民宿表
DROP TABLE IF EXISTS `hotel`;
CREATE TABLE `hotel` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `merchant_id` INT UNSIGNED NOT NULL COMMENT '商家ID',
  `name` VARCHAR(100) NOT NULL COMMENT '民宿名称',
  `address` VARCHAR(200) NOT NULL COMMENT '地址',
  `longitude` DECIMAL(10,6) NOT NULL COMMENT '经度',
  `latitude` DECIMAL(10,6) NOT NULL COMMENT '纬度',
  `style_tags` JSON DEFAULT NULL COMMENT '风格标签（JSON数组）',
  `facility_tags` JSON DEFAULT NULL COMMENT '设施标签（JSON数组）',
  `main_image` VARCHAR(500) DEFAULT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '图片集（JSON数组）',
  `intro` TEXT DEFAULT NULL COMMENT '介绍',
  `check_in_time` TIME DEFAULT '14:00:00' COMMENT '入住时间',
  `check_out_time` TIME DEFAULT '12:00:00' COMMENT '离店时间',
  `pet_policy` VARCHAR(200) DEFAULT NULL COMMENT '宠物政策',
  `has_breakfast` TINYINT DEFAULT 0 COMMENT '是否含早餐',
  `deposit` DECIMAL(10,2) DEFAULT 0.00 COMMENT '押金',
  `rating` DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `status` TINYINT DEFAULT 1 COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_merchant_id` (`merchant_id`),
  INDEX `idx_location` (`longitude`, `latitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='民宿表';

-- 23. 房型表
DROP TABLE IF EXISTS `room_type`;
CREATE TABLE `room_type` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hotel_id` INT UNSIGNED NOT NULL COMMENT '民宿ID',
  `name` VARCHAR(100) NOT NULL COMMENT '房型名称',
  `bed_type` VARCHAR(50) DEFAULT NULL COMMENT '床型（如：大床/双床）',
  `area` INT DEFAULT NULL COMMENT '面积（平方米）',
  `max_guests` INT DEFAULT 2 COMMENT '最多入住人数',
  `facilities` JSON DEFAULT NULL COMMENT '设施列表（JSON数组）',
  `price` DECIMAL(10,2) NOT NULL COMMENT '基础价格',
  `stock` INT DEFAULT 1 COMMENT '房间数量',
  `images` JSON DEFAULT NULL COMMENT '房型图片（JSON数组）',
  `status` TINYINT DEFAULT 1 COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_hotel_id` (`hotel_id`),
  CONSTRAINT `fk_room_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotel`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房型表';

-- 24. 房态日历表
DROP TABLE IF EXISTS `room_calendar`;
CREATE TABLE `room_calendar` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `room_type_id` INT UNSIGNED NOT NULL COMMENT '房型ID',
  `date` DATE NOT NULL COMMENT '日期',
  `available_stock` INT NOT NULL COMMENT '可用库存',
  `price` DECIMAL(10,2) NOT NULL COMMENT '当日价格（支持动态定价）',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1可订 0不可订',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_room_date` (`room_type_id`, `date`),
  INDEX `idx_date` (`date`),
  CONSTRAINT `fk_calendar_room` FOREIGN KEY (`room_type_id`) REFERENCES `room_type`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房态日历表';

-- ============================================
-- 第五部分：模块4 - 行-线路订票（7张表）
-- ============================================

-- 25. 景区表
DROP TABLE IF EXISTS `scenic_spot`;
CREATE TABLE `scenic_spot` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT '景区名称',
  `address` VARCHAR(200) NOT NULL COMMENT '地址',
  `longitude` DECIMAL(10,6) NOT NULL COMMENT '经度',
  `latitude` DECIMAL(10,6) NOT NULL COMMENT '纬度',
  `open_time` VARCHAR(100) DEFAULT NULL COMMENT '开放时间',
  `intro` TEXT DEFAULT NULL COMMENT '景区介绍',
  `main_image` VARCHAR(500) DEFAULT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '图片集（JSON数组）',
  `rating` DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1开放 0关闭',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_location` (`longitude`, `latitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景区表';

-- 26. 票种表
DROP TABLE IF EXISTS `ticket_type`;
CREATE TABLE `ticket_type` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `scenic_spot_id` INT UNSIGNED NOT NULL COMMENT '景区ID',
  `name` VARCHAR(100) NOT NULL COMMENT '票种名称（成人票/儿童票/学生票/家庭套票）',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `stock` INT DEFAULT 9999 COMMENT '库存（-1表示不限量）',
  `valid_days` INT DEFAULT 1 COMMENT '有效天数',
  `intro` VARCHAR(500) DEFAULT NULL COMMENT '票种说明',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1在售 0停售',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_scenic_spot_id` (`scenic_spot_id`),
  CONSTRAINT `fk_ticket_scenic` FOREIGN KEY (`scenic_spot_id`) REFERENCES `scenic_spot`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='票种表';

-- 27. 路线套餐表
DROP TABLE IF EXISTS `route_package`;
CREATE TABLE `route_package` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL COMMENT '套餐标题',
  `days` TINYINT NOT NULL COMMENT '行程天数（1/2/3天）',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `include_items` JSON DEFAULT NULL COMMENT '包含项目（JSON数组）',
  `departure` VARCHAR(100) DEFAULT NULL COMMENT '出发地',
  `destination` VARCHAR(100) DEFAULT NULL COMMENT '目的地',
  `accommodation_standard` VARCHAR(200) DEFAULT NULL COMMENT '住宿标准',
  `meal_standard` VARCHAR(200) DEFAULT NULL COMMENT '餐饮标准',
  `notice` TEXT DEFAULT NULL COMMENT '注意事项',
  `main_image` VARCHAR(500) DEFAULT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '图片集（JSON数组）',
  `detail` TEXT DEFAULT NULL COMMENT '详情',
  `stock` INT DEFAULT 9999 COMMENT '库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `rating` DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `theme_tags` JSON DEFAULT NULL COMMENT '主题标签（亲子/摄影/研学/节庆）',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1上架 0下架',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_days` (`days`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线套餐表';

-- 28. 路线行程表
DROP TABLE IF EXISTS `route_itinerary`;
CREATE TABLE `route_itinerary` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `route_id` INT UNSIGNED NOT NULL COMMENT '路线ID',
  `day_number` TINYINT NOT NULL COMMENT '第几天',
  `title` VARCHAR(200) DEFAULT NULL COMMENT '当日标题',
  `description` TEXT DEFAULT NULL COMMENT '行程描述',
  `scenic_spots` VARCHAR(500) DEFAULT NULL COMMENT '景点列表',
  `meals` VARCHAR(100) DEFAULT NULL COMMENT '用餐安排（早/中/晚）',
  `accommodation` VARCHAR(200) DEFAULT NULL COMMENT '住宿安排',
  `transportation` VARCHAR(200) DEFAULT NULL COMMENT '交通方式',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_route_id` (`route_id`),
  CONSTRAINT `fk_itinerary_route` FOREIGN KEY (`route_id`) REFERENCES `route_package`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线行程表';

-- 29. 电子票表
DROP TABLE IF EXISTS `e_ticket`;
CREATE TABLE `e_ticket` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ticket_no` VARCHAR(32) NOT NULL UNIQUE COMMENT '电子票号',
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `ticket_type` TINYINT NOT NULL COMMENT '票类型：1门票 2路线套餐',
  `target_id` INT UNSIGNED NOT NULL COMMENT '目标ID（景区ID/路线ID）',
  `target_name` VARCHAR(200) NOT NULL COMMENT '目标名称',
  `qr_code` VARCHAR(500) NOT NULL COMMENT '二维码URL',
  `valid_date` DATE NOT NULL COMMENT '有效日期',
  `visitor_name` VARCHAR(50) DEFAULT NULL COMMENT '游客姓名',
  `visitor_phone` VARCHAR(11) DEFAULT NULL COMMENT '游客手机',
  `visitor_id_card` VARCHAR(18) DEFAULT NULL COMMENT '游客身份证',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1未使用 2已使用 3已退款',
  `used_time` DATETIME DEFAULT NULL COMMENT '使用时间',
  `used_by` VARCHAR(50) DEFAULT NULL COMMENT '核销人',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ticket_no` (`ticket_no`),
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_valid_date` (`valid_date`),
  CONSTRAINT `fk_eticket_order` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='电子票表';

-- 30. 交通攻略表
DROP TABLE IF EXISTS `traffic_guide`;
CREATE TABLE `traffic_guide` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL COMMENT '攻略标题',
  `departure` VARCHAR(100) NOT NULL COMMENT '出发地',
  `destination` VARCHAR(100) NOT NULL COMMENT '目的地',
  `transport_mode` VARCHAR(50) NOT NULL COMMENT '交通方式（飞机/高铁/汽车/自驾）',
  `duration` VARCHAR(50) DEFAULT NULL COMMENT '时长',
  `cost` VARCHAR(100) DEFAULT NULL COMMENT '费用',
  `description` TEXT DEFAULT NULL COMMENT '详细说明',
  `images` JSON DEFAULT NULL COMMENT '攻略图片（JSON数组）',
  `status` TINYINT DEFAULT 1 COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_departure` (`departure`),
  INDEX `idx_destination` (`destination`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='交通攻略表';

-- ============================================
-- 第六部分：模块5 - 社区-照片分享（7张表）
-- ============================================

-- 31. 游记表
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `title` VARCHAR(200) DEFAULT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '文字内容',
  `images` JSON DEFAULT NULL COMMENT '图片列表（JSON数组，最多9张）',
  `video_url` VARCHAR(500) DEFAULT NULL COMMENT '视频URL',
  `video_cover` VARCHAR(500) DEFAULT NULL COMMENT '视频封面',
  `location_type` VARCHAR(20) DEFAULT NULL COMMENT '关联地点类型（restaurant/hotel/scenic）',
  `location_id` INT UNSIGNED DEFAULT NULL COMMENT '关联地点ID',
  `location_name` VARCHAR(200) DEFAULT NULL COMMENT '关联地点名称',
  `topic_ids` JSON DEFAULT NULL COMMENT '话题ID列表（JSON数组）',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `comment_count` INT DEFAULT 0 COMMENT '评论数',
  `favorite_count` INT DEFAULT 0 COMMENT '收藏数',
  `view_count` INT DEFAULT 0 COMMENT '浏览数',
  `status` TINYINT DEFAULT 2 COMMENT '状态：1正常 2审核中 3已下架',
  `audit_result` VARCHAR(500) DEFAULT NULL COMMENT '审核结果',
  `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
  `is_featured` TINYINT DEFAULT 0 COMMENT '是否精选：1是 0否',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`),
  CONSTRAINT `fk_post_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记表';

-- 32. 评论表
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT UNSIGNED NOT NULL COMMENT '游记ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `content` VARCHAR(500) NOT NULL COMMENT '评论内容',
  `parent_id` INT UNSIGNED DEFAULT 0 COMMENT '父评论ID，0为一级评论',
  `reply_to_user_id` INT UNSIGNED DEFAULT NULL COMMENT '回复给谁（二级评论用）',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1正常 0已删除',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_post_id` (`post_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_parent_id` (`parent_id`),
  CONSTRAINT `fk_comment_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 33. 话题表
DROP TABLE IF EXISTS `topic`;
CREATE TABLE `topic` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE COMMENT '话题名称（如：#苗寨风光#）',
  `intro` VARCHAR(500) DEFAULT NULL COMMENT '话题简介',
  `cover_image` VARCHAR(500) DEFAULT NULL COMMENT '封面图',
  `follow_count` INT DEFAULT 0 COMMENT '关注数',
  `post_count` INT DEFAULT 0 COMMENT '游记数',
  `is_hot` TINYINT DEFAULT 0 COMMENT '是否热门：1是 0否',
  `is_recommended` TINYINT DEFAULT 0 COMMENT '是否推荐：1是 0否',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='话题表';

-- 34. 关注关系表
DROP TABLE IF EXISTS `follow`;
CREATE TABLE `follow` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '关注者ID',
  `follow_user_id` INT UNSIGNED NOT NULL COMMENT '被关注者ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_follow` (`user_id`, `follow_user_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_follow_user_id` (`follow_user_id`),
  CONSTRAINT `fk_follow_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_follow_target` FOREIGN KEY (`follow_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='关注关系表';

-- 35. 点赞表
DROP TABLE IF EXISTS `post_like`;
CREATE TABLE `post_like` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型：post/comment',
  `target_id` INT UNSIGNED NOT NULL COMMENT '目标ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_target` (`user_id`, `target_type`, `target_id`),
  INDEX `idx_user_id` (`user_id`),
  CONSTRAINT `fk_like_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- 36. 游记收藏表
DROP TABLE IF EXISTS `post_favorite`;
CREATE TABLE `post_favorite` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `post_id` INT UNSIGNED NOT NULL COMMENT '游记ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_post` (`user_id`, `post_id`),
  INDEX `idx_user_id` (`user_id`),
  CONSTRAINT `fk_post_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_post_favorite_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记收藏表';

-- 37. 举报表
DROP TABLE IF EXISTS `report`;
CREATE TABLE `report` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '举报用户ID',
  `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型：post/comment/user',
  `target_id` INT UNSIGNED NOT NULL COMMENT '目标ID',
  `reason` VARCHAR(500) NOT NULL COMMENT '举报原因',
  `status` TINYINT DEFAULT 1 COMMENT '处理状态：1待处理 2已处理 3已驳回',
  `handle_result` VARCHAR(500) DEFAULT NULL COMMENT '处理结果',
  `handle_by` INT UNSIGNED DEFAULT NULL COMMENT '处理人ID',
  `handle_time` DATETIME DEFAULT NULL COMMENT '处理时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_report_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='举报表';

-- ============================================
-- 第七部分：模块6 - 平台管理后台（13张表）
-- ============================================

-- 38. 管理员表
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
  `real_name` VARCHAR(50) NOT NULL COMMENT '真实姓名',
  `role_id` INT UNSIGNED NOT NULL COMMENT '角色ID',
  `phone` VARCHAR(11) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1正常 0禁用',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_username` (`username`),
  INDEX `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 39. 角色表
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `code` VARCHAR(50) NOT NULL UNIQUE COMMENT '角色代码（如：super_admin/admin/operator）',
  `description` VARCHAR(200) DEFAULT NULL COMMENT '角色描述',
  `permission_ids` JSON DEFAULT NULL COMMENT '权限ID列表（JSON数组）',
  `status` TINYINT DEFAULT 1 COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 40. 权限表
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '权限名称',
  `code` VARCHAR(100) NOT NULL UNIQUE COMMENT '权限代码（如：product:create）',
  `type` TINYINT NOT NULL COMMENT '权限类型：1菜单 2按钮 3接口',
  `parent_id` INT UNSIGNED DEFAULT 0 COMMENT '父权限ID',
  `path` VARCHAR(200) DEFAULT NULL COMMENT '路由路径',
  `icon` VARCHAR(50) DEFAULT NULL COMMENT '图标',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_code` (`code`),
  INDEX `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 41. 商家表
DROP TABLE IF EXISTS `merchant`;
CREATE TABLE `merchant` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '关联用户ID',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '商家账号',
  `shop_name` VARCHAR(100) NOT NULL COMMENT '店铺名称',
  `module` VARCHAR(20) NOT NULL COMMENT '所属模块：product/food/accommodation/travel',
  `contact_name` VARCHAR(50) NOT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `id_card` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
  `business_license` VARCHAR(500) DEFAULT NULL COMMENT '营业执照URL',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1正常 0禁用',
  `joined_at` DATETIME DEFAULT NULL COMMENT '入驻时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_module` (`module`),
  CONSTRAINT `fk_merchant_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家表';

-- 42. 商家入驻申请表
DROP TABLE IF EXISTS `merchant_application`;
CREATE TABLE `merchant_application` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `shop_name` VARCHAR(100) NOT NULL COMMENT '店铺名称',
  `module` VARCHAR(20) NOT NULL COMMENT '申请模块',
  `contact_name` VARCHAR(50) NOT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `id_card` VARCHAR(18) NOT NULL COMMENT '身份证号',
  `id_card_front` VARCHAR(500) NOT NULL COMMENT '身份证正面',
  `id_card_back` VARCHAR(500) NOT NULL COMMENT '身份证反面',
  `business_license` VARCHAR(500) NOT NULL COMMENT '营业执照',
  `other_materials` JSON DEFAULT NULL COMMENT '其他材料（JSON数组）',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1待审核 2已通过 3已驳回',
  `audit_result` VARCHAR(500) DEFAULT NULL COMMENT '审核意见',
  `audit_by` INT UNSIGNED DEFAULT NULL COMMENT '审核人ID',
  `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_application_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家入驻申请表';

-- 43. 轮播图表
DROP TABLE IF EXISTS `banner`;
CREATE TABLE `banner` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `image` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `link_type` VARCHAR(20) NOT NULL COMMENT '跳转类型：page/url/none',
  `link_value` VARCHAR(500) DEFAULT NULL COMMENT '跳转地址',
  `position` VARCHAR(20) NOT NULL COMMENT '位置：home/product/food等',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_position` (`position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 44. 公告表
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `type` TINYINT DEFAULT 1 COMMENT '类型：1系统公告 2活动公告',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `is_top` TINYINT DEFAULT 0 COMMENT '是否置顶：1是 0否',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1发布 0草稿',
  `created_by` INT UNSIGNED NOT NULL COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';

-- 45. 财务记录表
DROP TABLE IF EXISTS `finance_record`;
CREATE TABLE `finance_record` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `merchant_id` INT UNSIGNED NOT NULL COMMENT '商家ID',
  `order_amount` DECIMAL(10,2) NOT NULL COMMENT '订单金额',
  `commission_rate` DECIMAL(5,2) NOT NULL COMMENT '抽佣比例（%）',
  `commission_amount` DECIMAL(10,2) NOT NULL COMMENT '平台抽佣',
  `merchant_income` DECIMAL(10,2) NOT NULL COMMENT '商家收入',
  `settlement_status` TINYINT DEFAULT 1 COMMENT '结算状态：1待结算 2已结算',
  `settlement_time` DATETIME DEFAULT NULL COMMENT '结算时间',
  `settlement_batch` VARCHAR(50) DEFAULT NULL COMMENT '结算批次号',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_merchant_id` (`merchant_id`),
  INDEX `idx_settlement_status` (`settlement_status`),
  CONSTRAINT `fk_finance_order` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`),
  CONSTRAINT `fk_finance_merchant` FOREIGN KEY (`merchant_id`) REFERENCES `merchant`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='财务记录表';

-- 46. 操作日志表
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT UNSIGNED NOT NULL COMMENT '操作人ID',
  `admin_name` VARCHAR(50) NOT NULL COMMENT '操作人姓名',
  `module` VARCHAR(50) NOT NULL COMMENT '操作模块',
  `action` VARCHAR(50) NOT NULL COMMENT '操作类型（create/update/delete）',
  `target_type` VARCHAR(50) DEFAULT NULL COMMENT '操作对象类型',
  `target_id` INT UNSIGNED DEFAULT NULL COMMENT '操作对象ID',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '操作描述',
  `request_data` JSON DEFAULT NULL COMMENT '请求数据',
  `ip` VARCHAR(45) NOT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT 'User-Agent',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_admin_id` (`admin_id`),
  INDEX `idx_module` (`module`),
  INDEX `idx_created_at` (`created_at`),
  CONSTRAINT `fk_log_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin_user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- 47. 敏感词表
DROP TABLE IF EXISTS `sensitive_word`;
CREATE TABLE `sensitive_word` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `word` VARCHAR(50) NOT NULL UNIQUE COMMENT '敏感词',
  `level` TINYINT DEFAULT 1 COMMENT '级别：1一般 2严重 3违法',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_word` (`word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='敏感词表';

-- ============================================
-- 第八部分：初始化数据
-- ============================================

-- 插入初始管理员（密码: admin123）
INSERT INTO `admin_user` (`username`, `password`, `real_name`, `role_id`) VALUES
('admin', '$2a$10$XxNKjI5EQvhRqN9mK.zQ5.8N8YJ9g0h5G5Y3Q8L0J9K5N6M7O8P9Q', '超级管理员', 1);

-- 插入角色
INSERT INTO `role` (`name`, `code`, `description`) VALUES
('超级管理员', 'super_admin', '拥有所有权限'),
('平台管理员', 'platform_admin', '管理平台内容和用户'),
('商家', 'merchant', '管理自家商品和订单');

-- 插入商品分类
INSERT INTO `category` (`name`, `parent_id`, `sort`) VALUES
('银饰', 0, 1),
('蜡染', 0, 2),
('刺绣', 0, 3),
('苗族服饰', 0, 4),
('其他手工艺', 0, 5);

-- 插入农产品分类
INSERT INTO `farm_product_category` (`name`, `sort`) VALUES
('茶叶', 1),
('腊肉', 2),
('米酒', 3),
('酸食', 4),
('其他特产', 5);

-- 插入话题
INSERT INTO `topic` (`name`, `intro`, `is_hot`) VALUES
('#苗寨风光#', '分享苗寨美景', 1),
('#美食打卡#', '发现地道美食', 1),
('#非遗文化#', '传承非遗技艺', 1),
('#民宿体验#', '特色住宿分享', 0);

-- ============================================
-- 初始化完成
-- ============================================

SELECT '数据库初始化完成！共创建50张表。' AS message;
