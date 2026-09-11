declare namespace Eps {
	interface HotelEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商家ID（归属标识）
		 */
		merchantId?: number;

		/**
		 * 民宿名称
		 */
		name?: string;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 经度
		 */
		longitude?: number;

		/**
		 * 纬度
		 */
		latitude?: number;

		/**
		 * 风格标签
		 */
		styleTags?: any;

		/**
		 * 设施标签
		 */
		facilityTags?: any;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 图片集
		 */
		images?: any;

		/**
		 * 介绍
		 */
		intro?: string;

		/**
		 * 入住时间
		 */
		checkInTime?: string;

		/**
		 * 离店时间
		 */
		checkOutTime?: string;

		/**
		 * 宠物政策
		 */
		petPolicy?: string;

		/**
		 * 是否含早餐
		 */
		hasBreakfast?: number;

		/**
		 * 押金
		 */
		deposit?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 评价数
		 */
		reviewCount?: number;

		/**
		 * 状态：1正常 0下架
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RoomCalendarEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 房型ID
		 */
		roomTypeId?: number;

		/**
		 * 日期
		 */
		date?: Date;

		/**
		 * 当日可售间数
		 */
		availableStock?: number;

		/**
		 * 当日价格（动态定价）
		 */
		price?: number;

		/**
		 * 状态：1可订 0不可订
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RoomTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 民宿ID
		 */
		hotelId?: number;

		/**
		 * 房型名称
		 */
		name?: string;

		/**
		 * 床型
		 */
		bedType?: string;

		/**
		 * 面积(㎡)
		 */
		area?: number;

		/**
		 * 最多入住人数
		 */
		maxGuests?: number;

		/**
		 * 设施列表
		 */
		facilities?: any;

		/**
		 * 基础价格
		 */
		price?: number;

		/**
		 * 房间数量
		 */
		stock?: number;

		/**
		 * 房型图片
		 */
		images?: any;

		/**
		 * 状态：1正常 0停用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysDepartmentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 部门名称
		 */
		name?: string;

		/**
		 * 创建者ID
		 */
		userId?: number;

		/**
		 * 上级部门ID
		 */
		parentId?: number;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysLogEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 行为
		 */
		action?: string;

		/**
		 * ip
		 */
		ip?: string;

		/**
		 * 参数
		 */
		params?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysMenuEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 父菜单ID
		 */
		parentId?: number;

		/**
		 * 菜单名称
		 */
		name?: string;

		/**
		 * 菜单地址
		 */
		router?: string;

		/**
		 * 权限标识
		 */
		perms?: string;

		/**
		 * 类型 0-目录 1-菜单 2-按钮
		 */
		type?: number;

		/**
		 * 图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 视图地址
		 */
		viewPath?: string;

		/**
		 * 路由缓存
		 */
		keepAlive?: boolean;

		/**
		 * 是否显示
		 */
		isShow?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysParamEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 键
		 */
		keyName?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 数据类型 0-字符串 1-富文本 2-文件
		 */
		dataType?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysRoleEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 角色标签
		 */
		label?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 数据权限是否关联上下级
		 */
		relevance?: boolean;

		/**
		 * 菜单权限
		 */
		menuIdList?: any;

		/**
		 * 部门权限
		 */
		departmentIdList?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysUserEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 部门ID
		 */
		departmentId?: number;

		/**
		 * 创建者ID
		 */
		userId?: number;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 密码版本, 作用是改完密码，让原来的token失效
		 */
		passwordV?: number;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 头像
		 */
		headImg?: string;

		/**
		 * 手机
		 */
		phone?: string;

		/**
		 * 邮箱
		 */
		email?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * socketId
		 */
		socketId?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityCommentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 游记ID
		 */
		postId?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 内容（≤500字）
		 */
		content?: string;

		/**
		 * 父评论ID（二级回复）
		 */
		parentId?: number;

		/**
		 * 点赞数
		 */
		likeCount?: number;

		/**
		 * 状态 1显示 0隐藏
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityPostEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 作者用户ID
		 */
		userId?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 正文（≤5000字）
		 */
		content?: string;

		/**
		 * 图片（JSON数组≤9）
		 */
		images?: any;

		/**
		 * 视频地址
		 */
		videoUrl?: string;

		/**
		 * 视频时长秒（≤60）
		 */
		videoDuration?: number;

		/**
		 * 关联路线ID（模式B）
		 */
		linkedRouteId?: number;

		/**
		 * 话题ID（JSON数组）
		 */
		topicIds?: any;

		/**
		 * 浏览数
		 */
		viewCount?: number;

		/**
		 * 点赞数
		 */
		likeCount?: number;

		/**
		 * 评论数
		 */
		commentCount?: number;

		/**
		 * 收藏数
		 */
		favoriteCount?: number;

		/**
		 * 足迹总站数（发布/关联时定格）
		 */
		footprintTotal?: number;

		/**
		 * 状态 pending审核中 normal正常 offline已下架
		 */
		status?: string;

		/**
		 * 审核理由
		 */
		auditReason?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityReportEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 举报人
		 */
		userId?: number;

		/**
		 * 目标类型 post/comment/user
		 */
		targetType?: string;

		/**
		 * 目标ID
		 */
		targetId?: number;

		/**
		 * 理由
		 */
		reason?: string;

		/**
		 * 状态 pending待处理 handled已处理 rejected已驳回
		 */
		status?: string;

		/**
		 * 处理结果
		 */
		handleResult?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityTopicEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称 #xx
		 */
		name?: string;

		/**
		 * 简介
		 */
		intro?: string;

		/**
		 * 浏览数
		 */
		viewCount?: number;

		/**
		 * 粉丝数
		 */
		followerCount?: number;

		/**
		 * 帖子数
		 */
		postCount?: number;

		/**
		 * 是否热门
		 */
		isHot?: number;

		/**
		 * 是否推荐
		 */
		isRecommend?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 状态 1启用 0禁用
		 */
		status?: number;

		/**
		 * 绑定路线（JSON数组）
		 */
		bindRouteIds?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DemoGoodsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 描述
		 */
		description?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 分类
		 */
		type?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 示例图
		 */
		exampleImages?: any;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 昵称
		 */
		userName?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类型ID
		 */
		typeId?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 值
		 */
		value?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 父ID
		 */
		parentId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 标识
		 */
		key?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DishEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 餐厅ID
		 */
		restaurantId?: number;

		/**
		 * 菜品名称
		 */
		name?: string;

		/**
		 * 菜品图片
		 */
		image?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 分类
		 */
		category?: string;

		/**
		 * 菜品介绍
		 */
		description?: string;

		/**
		 * 是否推荐
		 */
		isRecommended?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FarmProductCategoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 分类名称
		 */
		name?: string;

		/**
		 * 图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 状态 1启用 0禁用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FarmProductEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 分类ID
		 */
		categoryId?: number;

		/**
		 * 产品名称
		 */
		name?: string;

		/**
		 * 封面图
		 */
		coverImage?: string;

		/**
		 * 产品图片JSON
		 */
		images?: any;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 单位
		 */
		unit?: string;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 产地
		 */
		origin?: string;

		/**
		 * 产品描述
		 */
		description?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RestaurantEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 餐厅名称
		 */
		name?: string;

		/**
		 * 封面图
		 */
		coverImage?: string;

		/**
		 * 餐厅图片JSON
		 */
		images?: any;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 经度
		 */
		longitude?: number;

		/**
		 * 纬度
		 */
		latitude?: number;

		/**
		 * 联系电话
		 */
		phone?: string;

		/**
		 * 营业时间
		 */
		businessHours?: string;

		/**
		 * 人均消费
		 */
		avgPrice?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 特色菜品
		 */
		specialty?: string;

		/**
		 * 餐厅介绍
		 */
		description?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TimeSlotEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 餐厅ID
		 */
		restaurantId?: number;

		/**
		 * 日期
		 */
		date?: Date;

		/**
		 * 时段
		 */
		timePeriod?: string;

		/**
		 * 开始时间
		 */
		startTime?: string;

		/**
		 * 结束时间
		 */
		endTime?: string;

		/**
		 * 最大预订数
		 */
		maxReservations?: number;

		/**
		 * 当前预订数
		 */
		currentReservations?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MemberUserEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 密码（bcrypt）
		 */
		password?: string;

		/**
		 * 昵称
		 */
		nickname?: string;

		/**
		 * 头像
		 */
		avatar?: string;

		/**
		 * 性别
		 */
		gender?: number;

		/**
		 * 个人简介
		 */
		bio?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 角色 1游客 2商家
		 */
		role?: number;

		/**
		 * 最后登录时间
		 */
		lastLoginTime?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MerchantApplicationEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 店铺名称
		 */
		shopName?: string;

		/**
		 * 申请模块 product/food/accommodation/travel
		 */
		module?: string;

		/**
		 * 联系人
		 */
		contactName?: string;

		/**
		 * 联系电话
		 */
		contactPhone?: string;

		/**
		 * 身份证号
		 */
		idCard?: string;

		/**
		 * 身份证正面
		 */
		idCardFront?: string;

		/**
		 * 身份证反面
		 */
		idCardBack?: string;

		/**
		 * 营业执照
		 */
		businessLicense?: string;

		/**
		 * 其他材料（JSON数组）
		 */
		otherMaterials?: any;

		/**
		 * 状态 1待审核 2已通过 3已驳回
		 */
		status?: number;

		/**
		 * 审核意见
		 */
		auditResult?: string;

		/**
		 * 审核人ID
		 */
		auditBy?: number;

		/**
		 * 审核时间
		 */
		auditTime?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MerchantEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 关联用户ID
		 */
		userId?: number;

		/**
		 * 绑定的管理端用户ID（商家角色数据权限，空为未绑定）
		 */
		adminUserId?: number;

		/**
		 * 商家账号
		 */
		username?: string;

		/**
		 * 店铺名称
		 */
		shopName?: string;

		/**
		 * 所属模块 product/food/accommodation/travel
		 */
		module?: string;

		/**
		 * 联系人
		 */
		contactName?: string;

		/**
		 * 联系电话
		 */
		contactPhone?: string;

		/**
		 * 身份证号
		 */
		idCard?: string;

		/**
		 * 营业执照URL
		 */
		businessLicense?: string;

		/**
		 * 状态 1正常 0禁用
		 */
		status?: number;

		/**
		 * 入驻时间
		 */
		joinedAt?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SystemMessageEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID（NULL表示全员消息）
		 */
		userId?: number;

		/**
		 * 消息类型 order/system/activity/interact
		 */
		type?: string;

		/**
		 * 消息标题
		 */
		title?: string;

		/**
		 * 消息内容
		 */
		content?: string;

		/**
		 * 跳转类型
		 */
		linkType?: string;

		/**
		 * 跳转地址
		 */
		linkValue?: string;

		/**
		 * 是否已读 0未读 1已读
		 */
		isRead?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MessageTemplateEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 模板编码
		 */
		code?: string;

		/**
		 * 模板名称
		 */
		name?: string;

		/**
		 * 消息类型 order/system/activity/interact
		 */
		type?: string;

		/**
		 * 标题模板（支持 {nickname} 等占位）
		 */
		title?: string;

		/**
		 * 内容模板（支持占位）
		 */
		content?: string;

		/**
		 * 状态 1启用 0停用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface AnnouncementEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 内容
		 */
		content?: string;

		/**
		 * 类型：1系统 2活动
		 */
		type?: number;

		/**
		 * 生效开始时间
		 */
		startTime?: string;

		/**
		 * 生效结束时间
		 */
		endTime?: string;

		/**
		 * 是否置顶
		 */
		isTop?: number;

		/**
		 * 状态：1发布 0草稿
		 */
		status?: number;

		/**
		 * 创建人ID
		 */
		createdBy?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BannerEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 图片URL
		 */
		image?: string;

		/**
		 * 跳转类型
		 */
		linkType?: string;

		/**
		 * 跳转地址
		 */
		linkValue?: string;

		/**
		 * 位置：home/product/food/accommodation等
		 */
		position?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 生效开始时间
		 */
		startTime?: string;

		/**
		 * 生效结束时间
		 */
		endTime?: string;

		/**
		 * 状态：1启用 0禁用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FinanceRecordEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单ID
		 */
		orderId?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 订单金额
		 */
		orderAmount?: number;

		/**
		 * 抽佣比例%
		 */
		commissionRate?: number;

		/**
		 * 平台抽佣
		 */
		commissionAmount?: number;

		/**
		 * 商家收入
		 */
		merchantIncome?: number;

		/**
		 * 结算状态：1待结算 2已结算
		 */
		settlementStatus?: number;

		/**
		 * 结算时间
		 */
		settlementTime?: string;

		/**
		 * 结算批次号
		 */
		settlementBatch?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface OrderEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单号
		 */
		orderNo?: string;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 商家ID（归属标识，由下单调用模块解析传入，无商家归属为空）
		 */
		merchantId?: number;

		/**
		 * 订单类型 1商品 2餐位 3住宿 4门票 5路线
		 */
		orderType?: number;

		/**
		 * 所属模块 product/food/accommodation/travel
		 */
		module?: string;

		/**
		 * 订单总额
		 */
		totalAmount?: number;

		/**
		 * 实付金额
		 */
		payAmount?: number;

		/**
		 * 优惠金额
		 */
		discountAmount?: number;

		/**
		 * 状态 1待支付 2已支付 3已完成 4已取消 5已退款
		 */
		status?: number;

		/**
		 * 支付时间
		 */
		payTime?: string;

		/**
		 * 完成时间
		 */
		completeTime?: string;

		/**
		 * 取消时间
		 */
		cancelTime?: string;

		/**
		 * 订单备注
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PaymentRecordEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单ID
		 */
		orderId?: number;

		/**
		 * 商家ID（归属标识，冗余自主单，无商家归属为空）
		 */
		merchantId?: number;

		/**
		 * 支付流水号
		 */
		paymentNo?: string;

		/**
		 * 支付渠道 wechat/alipay
		 */
		payChannel?: string;

		/**
		 * 支付金额
		 */
		payAmount?: number;

		/**
		 * 支付状态 1待支付 2已支付 3已退款
		 */
		payStatus?: number;

		/**
		 * 第三方交易号
		 */
		transactionId?: string;

		/**
		 * 支付时间
		 */
		payTime?: string;

		/**
		 * 退款时间
		 */
		refundTime?: string;

		/**
		 * 退款金额
		 */
		refundAmount?: number;

		/**
		 * 支付回调数据
		 */
		callbackData?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PluginInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 简介
		 */
		description?: string;

		/**
		 * Key名
		 */
		keyName?: string;

		/**
		 * Hook
		 */
		hook?: string;

		/**
		 * 描述
		 */
		readme?: string;

		/**
		 * 版本
		 */
		version?: string;

		/**
		 * Logo(base64)
		 */
		logo?: string;

		/**
		 * 作者
		 */
		author?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * 内容
		 */
		content?: any;

		/**
		 * ts内容
		 */
		tsContent?: any;

		/**
		 * 插件的plugin.json
		 */
		pluginJson?: any;

		/**
		 * 配置
		 */
		config?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ProductCategoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 父分类ID
		 */
		parentId?: number;

		/**
		 * 分类名称
		 */
		name?: string;

		/**
		 * 分类图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ProductEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 分类ID
		 */
		categoryId?: number;

		/**
		 * 商品名称
		 */
		name?: string;

		/**
		 * 封面图
		 */
		coverImage?: string;

		/**
		 * 售价
		 */
		price?: number;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 销量
		 */
		sales?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 评价数
		 */
		reviewCount?: number;

		/**
		 * 工艺介绍
		 */
		craftIntro?: string;

		/**
		 * 传承人ID
		 */
		inheritorId?: number;

		/**
		 * 商品详情
		 */
		description?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ProductSkuEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商品ID
		 */
		productId?: number;

		/**
		 * 规格属性JSON
		 */
		attributes?: any;

		/**
		 * SKU价格
		 */
		price?: number;

		/**
		 * SKU库存
		 */
		stock?: number;

		/**
		 * SKU编码
		 */
		skuCode?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RecycleDataEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 表
		 */
		entityInfo?: any;

		/**
		 * 操作人
		 */
		userId?: number;

		/**
		 * 被删除的数据
		 */
		data?: any;

		/**
		 * 请求的接口
		 */
		url?: string;

		/**
		 * 请求参数
		 */
		params?: any;

		/**
		 * 删除数据条数
		 */
		count?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		userName?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SensitiveWordEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 敏感词
		 */
		word?: string;

		/**
		 * 状态 1启用 0禁用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 地址
		 */
		url?: string;

		/**
		 * 类型
		 */
		type?: string;

		/**
		 * 分类ID
		 */
		classifyId?: number;

		/**
		 * 文件id
		 */
		fileId?: string;

		/**
		 * 文件名
		 */
		name?: string;

		/**
		 * 文件大小
		 */
		size?: number;

		/**
		 * 文档版本
		 */
		version?: number;

		/**
		 * 文件位置
		 */
		key?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类别名称
		 */
		name?: string;

		/**
		 * 父分类ID
		 */
		parentId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TaskInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 任务ID
		 */
		jobId?: string;

		/**
		 * 任务配置
		 */
		repeatConf?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * cron
		 */
		cron?: string;

		/**
		 * 最大执行次数 不传为无限次
		 */
		limit?: number;

		/**
		 * 每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效
		 */
		every?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-停止 1-运行
		 */
		status?: number;

		/**
		 * 开始时间
		 */
		startDate?: Date;

		/**
		 * 结束时间
		 */
		endDate?: Date;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 执行的service实例ID
		 */
		service?: string;

		/**
		 * 状态 0-系统 1-用户
		 */
		type?: number;

		/**
		 * 下一次执行时间
		 */
		nextRunTime?: Date;

		/**
		 * 状态 0-cron 1-时间间隔
		 */
		taskType?: number;

		/**
		 * undefined
		 */
		lastExecuteTime?: Date;

		/**
		 * undefined
		 */
		lockExpireTime?: Date;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelETicketEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单ID
		 */
		orderId?: number;

		/**
		 * 订单号
		 */
		orderNo?: string;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 项目类型 ticket/route
		 */
		itemType?: string;

		/**
		 * 项目ID
		 */
		itemId?: number;

		/**
		 * 使用日期
		 */
		useDate?: string;

		/**
		 * 核销码
		 */
		qrCode?: string;

		/**
		 * 状态 unused未使用 used已核销 refunded已退款
		 */
		status?: string;

		/**
		 * 核销时间
		 */
		verifyTime?: string;

		/**
		 * 核销管理员ID
		 */
		verifyAdminId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelTrafficGuideEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 出发地
		 */
		departure?: string;

		/**
		 * 目的地
		 */
		destination?: string;

		/**
		 * 交通方式
		 */
		transportType?: string;

		/**
		 * 耗时
		 */
		duration?: string;

		/**
		 * 费用
		 */
		cost?: number;

		/**
		 * 详情
		 */
		detail?: string;

		/**
		 * 图片
		 */
		image?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 状态 1启用 0禁用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelInventoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 项目类型 ticket/route
		 */
		itemType?: string;

		/**
		 * 项目ID
		 */
		itemId?: number;

		/**
		 * 使用日期
		 */
		useDate?: string;

		/**
		 * 总库存
		 */
		total?: number;

		/**
		 * 已售
		 */
		sold?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelRouteItineraryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 路线ID
		 */
		routeId?: number;

		/**
		 * 第几天
		 */
		dayNo?: number;

		/**
		 * 当天顺序
		 */
		sort?: number;

		/**
		 * 行程描述
		 */
		description?: string;

		/**
		 * 景区ID（站点）
		 */
		scenicSpotId?: number;

		/**
		 * 餐饮安排
		 */
		meal?: string;

		/**
		 * 住宿安排
		 */
		stay?: string;

		/**
		 * 交通方式
		 */
		transport?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelRecommendSlotEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 位置 home焦点轮播等
		 */
		position?: string;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 副标题
		 */
		subtitle?: string;

		/**
		 * 角标
		 */
		badge?: string;

		/**
		 * 项目类型 route/scenic/post
		 */
		itemType?: string;

		/**
		 * 项目ID
		 */
		itemId?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 轮播分组
		 */
		rotationGroup?: number;

		/**
		 * 轮播间隔秒
		 */
		intervalSeconds?: number;

		/**
		 * 状态 1启用 0禁用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelReviewEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单ID
		 */
		orderId?: number;

		/**
		 * 评价目标类型 scenic/route
		 */
		targetType?: string;

		/**
		 * 评价目标ID
		 */
		targetId?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 评分 1-5
		 */
		rating?: number;

		/**
		 * 内容
		 */
		content?: string;

		/**
		 * 图片（JSON数组）
		 */
		images?: any;

		/**
		 * 商家回复
		 */
		merchantReply?: string;

		/**
		 * 回复时间
		 */
		replyTime?: string;

		/**
		 * 状态 1显示 0隐藏
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelRoutePackageEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 天数
		 */
		days?: number;

		/**
		 * 主题 亲子/摄影/研学/节庆/经典
		 */
		theme?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 包含项目（JSON数组）
		 */
		includes?: any;

		/**
		 * 出发地
		 */
		departure?: string;

		/**
		 * 目的地
		 */
		destination?: string;

		/**
		 * 住宿标准
		 */
		hotelStandard?: string;

		/**
		 * 餐饮标准
		 */
		mealStandard?: string;

		/**
		 * 预订须知
		 */
		notice?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 富文本详情
		 */
		detail?: string;

		/**
		 * 已售
		 */
		sales?: number;

		/**
		 * 状态 1上架 0下架
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelScenicSpotEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 类型 spot景点 dining餐饮 stay住宿 experience体验
		 */
		type?: string;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 经度
		 */
		longitude?: number;

		/**
		 * 纬度
		 */
		latitude?: number;

		/**
		 * 开放时间
		 */
		openTime?: string;

		/**
		 * 简介
		 */
		intro?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 状态 1启用 0禁用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelTicketTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 景区ID
		 */
		scenicSpotId?: number;

		/**
		 * 票种名称
		 */
		name?: string;

		/**
		 * 票价
		 */
		price?: number;

		/**
		 * 总库存
		 */
		totalStock?: number;

		/**
		 * 有效期规则
		 */
		validityRule?: string;

		/**
		 * 状态 1在售 0下架
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserAddressEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 联系人
		 */
		contact?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 省
		 */
		province?: string;

		/**
		 * 市
		 */
		city?: string;

		/**
		 * 区
		 */
		district?: string;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 是否默认
		 */
		isDefault?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 登录唯一ID
		 */
		unionid?: string;

		/**
		 * 头像
		 */
		avatarUrl?: string;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 性别
		 */
		gender?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 登录方式
		 */
		loginType?: number;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 介绍
		 */
		description?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	type json = any;

	type DictKey = "brand" | "occupation";

	interface PagePagination {
		size: number;
		page: number;
		total: number;
		[key: string]: any;
	}

	interface PageResponse<T> {
		pagination: PagePagination;
		list: T[];
		[key: string]: any;
	}

	interface AccommodationHotelPageResponse {
		pagination: PagePagination;
		list: HotelEntity[];
	}

	interface AccommodationRoomCalendarPageResponse {
		pagination: PagePagination;
		list: RoomCalendarEntity[];
	}

	interface AccommodationRoomTypePageResponse {
		pagination: PagePagination;
		list: RoomTypeEntity[];
	}

	interface BaseSysLogPageResponse {
		pagination: PagePagination;
		list: BaseSysLogEntity[];
	}

	interface BaseSysMenuPageResponse {
		pagination: PagePagination;
		list: BaseSysMenuEntity[];
	}

	interface BaseSysParamPageResponse {
		pagination: PagePagination;
		list: BaseSysParamEntity[];
	}

	interface BaseSysRolePageResponse {
		pagination: PagePagination;
		list: BaseSysRoleEntity[];
	}

	interface BaseSysUserPageResponse {
		pagination: PagePagination;
		list: BaseSysUserEntity[];
	}

	interface CommunityCommentPageResponse {
		pagination: PagePagination;
		list: CommunityCommentEntity[];
	}

	interface CommunityPostPageResponse {
		pagination: PagePagination;
		list: CommunityPostEntity[];
	}

	interface CommunityReportPageResponse {
		pagination: PagePagination;
		list: CommunityReportEntity[];
	}

	interface CommunityTopicPageResponse {
		pagination: PagePagination;
		list: CommunityTopicEntity[];
	}

	interface DemoGoodsPageResponse {
		pagination: PagePagination;
		list: DemoGoodsEntity[];
	}

	interface DictInfoPageResponse {
		pagination: PagePagination;
		list: DictInfoEntity[];
	}

	interface DictTypePageResponse {
		pagination: PagePagination;
		list: DictTypeEntity[];
	}

	interface FoodDishPageResponse {
		pagination: PagePagination;
		list: DishEntity[];
	}

	interface FoodFarmCategoryPageResponse {
		pagination: PagePagination;
		list: FarmProductCategoryEntity[];
	}

	interface FoodFarmProductPageResponse {
		pagination: PagePagination;
		list: FarmProductEntity[];
	}

	interface FoodRestaurantPageResponse {
		pagination: PagePagination;
		list: RestaurantEntity[];
	}

	interface FoodTimeSlotPageResponse {
		pagination: PagePagination;
		list: TimeSlotEntity[];
	}

	interface MemberUserPageResponse {
		pagination: PagePagination;
		list: MemberUserEntity[];
	}

	interface MerchantApplicationPageResponse {
		pagination: PagePagination;
		list: MerchantApplicationEntity[];
	}

	interface MerchantPageResponse {
		pagination: PagePagination;
		list: MerchantEntity[];
	}

	interface MessagePageResponse {
		pagination: PagePagination;
		list: SystemMessageEntity[];
	}

	interface MessageTemplatePageResponse {
		pagination: PagePagination;
		list: MessageTemplateEntity[];
	}

	interface OperateAnnouncementPageResponse {
		pagination: PagePagination;
		list: AnnouncementEntity[];
	}

	interface OperateBannerPageResponse {
		pagination: PagePagination;
		list: BannerEntity[];
	}

	interface OperateFinanceRecordPageResponse {
		pagination: PagePagination;
		list: FinanceRecordEntity[];
	}

	interface OrderPageResponse {
		pagination: PagePagination;
		list: OrderEntity[];
	}

	interface PayRecordPageResponse {
		pagination: PagePagination;
		list: PaymentRecordEntity[];
	}

	interface PluginInfoPageResponse {
		pagination: PagePagination;
		list: PluginInfoEntity[];
	}

	interface ProductCategoryPageResponse {
		pagination: PagePagination;
		list: ProductCategoryEntity[];
	}

	interface ProductGoodsPageResponse {
		pagination: PagePagination;
		list: ProductEntity[];
	}

	interface RecycleDataPageResponse {
		pagination: PagePagination;
		list: RecycleDataEntity[];
	}

	interface SensitiveWordPageResponse {
		pagination: PagePagination;
		list: SensitiveWordEntity[];
	}

	interface SpaceInfoPageResponse {
		pagination: PagePagination;
		list: SpaceInfoEntity[];
	}

	interface SpaceTypePageResponse {
		pagination: PagePagination;
		list: SpaceTypeEntity[];
	}

	interface TaskInfoPageResponse {
		pagination: PagePagination;
		list: TaskInfoEntity[];
	}

	interface TravelETicketPageResponse {
		pagination: PagePagination;
		list: TravelETicketEntity[];
	}

	interface TravelGuidePageResponse {
		pagination: PagePagination;
		list: TravelTrafficGuideEntity[];
	}

	interface TravelInventoryPageResponse {
		pagination: PagePagination;
		list: TravelInventoryEntity[];
	}

	interface TravelItineraryPageResponse {
		pagination: PagePagination;
		list: TravelRouteItineraryEntity[];
	}

	interface TravelRecommendPageResponse {
		pagination: PagePagination;
		list: TravelRecommendSlotEntity[];
	}

	interface TravelReviewPageResponse {
		pagination: PagePagination;
		list: TravelReviewEntity[];
	}

	interface TravelRoutePageResponse {
		pagination: PagePagination;
		list: TravelRoutePackageEntity[];
	}

	interface TravelScenicPageResponse {
		pagination: PagePagination;
		list: TravelScenicSpotEntity[];
	}

	interface TravelTicketTypePageResponse {
		pagination: PagePagination;
		list: TravelTicketTypeEntity[];
	}

	interface UserAddressPageResponse {
		pagination: PagePagination;
		list: UserAddressEntity[];
	}

	interface UserInfoPageResponse {
		pagination: PagePagination;
		list: UserInfoEntity[];
	}

	interface AccommodationHotel {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<AccommodationHotelPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<HotelEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<HotelEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface AccommodationRoomCalendar {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 批量设置房态（动态定价/关房）
		 */
		batch(data?: any): Promise<any>;

		/**
		 * 区间查询（含默认回退）
		 */
		range(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<AccommodationRoomCalendarPageResponse>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RoomCalendarEntity>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; batch: string; range: string; page: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			batch: boolean;
			range: boolean;
			page: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface AccommodationRoomType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<AccommodationRoomTypePageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<RoomTypeEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RoomTypeEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseCoding {
		/**
		 * 获取模块目录结构
		 */
		getModuleTree(data?: any): Promise<any>;

		/**
		 * 创建代码
		 */
		createCode(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { getModuleTree: string; createCode: string };

		/**
		 * 权限状态
		 */
		_permission: { getModuleTree: boolean; createCode: boolean };

		request: Request;
	}

	interface BaseComm {
		/**
		 * 修改个人信息
		 */
		personUpdate(data?: any): Promise<any>;

		/**
		 * 文件上传模式
		 */
		uploadMode(data?: any): Promise<any>;

		/**
		 * 权限与菜单
		 */
		permmenu(data?: any): Promise<any>;

		/**
		 * 编程
		 */
		program(data?: any): Promise<any>;

		/**
		 * 个人信息
		 */
		person(data?: any): Promise<any>;

		/**
		 * 文件上传
		 */
		upload(data?: any): Promise<any>;

		/**
		 * 退出
		 */
		logout(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			personUpdate: string;
			uploadMode: string;
			permmenu: string;
			program: string;
			person: string;
			upload: string;
			logout: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			personUpdate: boolean;
			uploadMode: boolean;
			permmenu: boolean;
			program: boolean;
			person: boolean;
			upload: boolean;
			logout: boolean;
		};

		request: Request;
	}

	interface BaseOpen {
		/**
		 * 刷新token
		 */
		refreshToken(data?: any): Promise<any>;

		/**
		 * 验证码
		 */
		captcha(data?: any): Promise<any>;

		/**
		 * 登录
		 */
		login(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 实体信息与路径
		 */
		eps(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			refreshToken: string;
			captcha: string;
			login: string;
			html: string;
			eps: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			refreshToken: boolean;
			captcha: boolean;
			login: boolean;
			html: boolean;
			eps: boolean;
		};

		request: Request;
	}

	interface BaseSysDepartment {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 排序
		 */
		order(data?: any): Promise<any>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysDepartmentEntity[]>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; update: string; order: string; list: string; add: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			order: boolean;
			list: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysLog {
		/**
		 * 日志保存时间
		 */
		setKeep(data?: any): Promise<any>;

		/**
		 * 获得日志保存时间
		 */
		getKeep(data?: any): Promise<any>;

		/**
		 * 清理
		 */
		clear(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysLogPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { setKeep: string; getKeep: string; clear: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { setKeep: boolean; getKeep: boolean; clear: boolean; page: boolean };

		request: Request;
	}

	interface BaseSysMenu {
		/**
		 * 创建代码
		 */
		create(data?: any): Promise<any>;

		/**
		 * 导出
		 */
		export(data?: any): Promise<any>;

		/**
		 * 导入
		 */
		import(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 解析
		 */
		parse(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysMenuEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysMenuEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysMenuPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			create: string;
			export: string;
			import: string;
			delete: string;
			update: string;
			parse: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			create: boolean;
			export: boolean;
			import: boolean;
			delete: boolean;
			update: boolean;
			parse: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysParam {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysParamEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysParamPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			html: string;
			info: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			html: boolean;
			info: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysRole {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysRoleEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysRoleEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysRolePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysUser {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 移动部门
		 */
		move(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysUserEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysUserEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysUserPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			move: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			move: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityComment {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityCommentPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityCommentEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityCommentEntity>;

		/**
		 * 权限标识
		 */
		permission: { update: string; delete: string; page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface CommunityPost {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 审核游记
		 */
		audit(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityPostPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityPostEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityPostEntity>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; audit: string; page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			audit: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface CommunityReport {
		/**
		 * 处理举报
		 */
		handle(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityReportPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityReportEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityReportEntity>;

		/**
		 * 权限标识
		 */
		permission: { handle: string; page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: { handle: boolean; page: boolean; list: boolean; info: boolean };

		request: Request;
	}

	interface CommunityTopic {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityTopicPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityTopicEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityTopicEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DemoGoods {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DemoGoodsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DemoGoodsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DemoGoodsPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DemoTenant {
		/**
		 * 局部不使用多租户
		 */
		noTenant(data?: any): Promise<any>;

		/**
		 * 不使用多租户
		 */
		noUse(data?: any): Promise<any>;

		/**
		 * use
		 */
		use(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { noTenant: string; noUse: string; use: string };

		/**
		 * 权限状态
		 */
		_permission: { noTenant: boolean; noUse: boolean; use: boolean };

		request: Request;
	}

	interface DictInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 获得所有字典类型
		 */
		types(data?: any): Promise<any>;

		/**
		 * 获得字典数据
		 */
		data(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DictInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			types: string;
			data: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			types: boolean;
			data: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DictType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DictTypePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface FoodDish {
		/**
		 * 添加菜品
		 */
		create(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodDishPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DishEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DishEntity>;

		/**
		 * 权限标识
		 */
		permission: {
			create: string;
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			create: boolean;
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface FoodFarmCategory {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodFarmCategoryPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FarmProductCategoryEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FarmProductCategoryEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface FoodFarmProduct {
		/**
		 * 上下架农产品
		 */
		updateStatus(data?: any): Promise<any>;

		/**
		 * 创建农产品
		 */
		create(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodFarmProductPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FarmProductEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FarmProductEntity>;

		/**
		 * 权限标识
		 */
		permission: {
			updateStatus: string;
			create: string;
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateStatus: boolean;
			create: boolean;
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface FoodRestaurant {
		/**
		 * 创建餐厅
		 */
		create(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodRestaurantPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<RestaurantEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RestaurantEntity>;

		/**
		 * 权限标识
		 */
		permission: {
			create: string;
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			create: boolean;
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface FoodTimeSlot {
		/**
		 * 批量创建时段
		 */
		batchCreate(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodTimeSlotPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TimeSlotEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TimeSlotEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			batchCreate: string;
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			batchCreate: boolean;
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface MemberUser {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<MemberUserPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<MemberUserEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<MemberUserEntity>;

		/**
		 * 权限标识
		 */
		permission: { update: string; delete: string; page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface MerchantApplication {
		/**
		 * 入驻审核
		 */
		audit(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<MerchantApplicationPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<MerchantApplicationEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<MerchantApplicationEntity>;

		/**
		 * 权限标识
		 */
		permission: { audit: string; page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: { audit: boolean; page: boolean; list: boolean; info: boolean };

		request: Request;
	}

	interface Merchant {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<MerchantPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<MerchantEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<MerchantEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface Message {
		/**
		 * 按模板发送
		 */
		sendByTemplate(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<MessagePageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SystemMessageEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SystemMessageEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			sendByTemplate: string;
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			sendByTemplate: boolean;
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface MessageTemplate {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<MessageTemplatePageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<MessageTemplateEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<MessageTemplateEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface OperateAnnouncement {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<OperateAnnouncementPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AnnouncementEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AnnouncementEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface OperateBanner {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<OperateBannerPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BannerEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BannerEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface OperateFinanceRecord {
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<OperateFinanceRecordPageResponse>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FinanceRecordEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FinanceRecordEntity[]>;

		/**
		 * 权限标识
		 */
		permission: { page: string; info: string; list: string };

		/**
		 * 权限状态
		 */
		_permission: { page: boolean; info: boolean; list: boolean };

		request: Request;
	}

	interface Order {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<OrderPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<OrderEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<OrderEntity>;

		/**
		 * 权限标识
		 */
		permission: { update: string; delete: string; page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface PayRecord {
		/**
		 * 退款审批
		 */
		refund(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PayRecordPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PaymentRecordEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PaymentRecordEntity>;

		/**
		 * 权限标识
		 */
		permission: { refund: string; page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: { refund: boolean; page: boolean; list: boolean; info: boolean };

		request: Request;
	}

	interface PluginInfo {
		/**
		 * 安装插件
		 */
		install(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PluginInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PluginInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PluginInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			install: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			install: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ProductCategory {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分类树
		 */
		tree(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ProductCategoryPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ProductCategoryEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ProductCategoryEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			tree: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			tree: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ProductGoods {
		/**
		 * 上下架商品
		 */
		updateStatus(data?: any): Promise<any>;

		/**
		 * 创建商品
		 */
		create(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ProductGoodsPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ProductEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ProductEntity>;

		/**
		 * 权限标识
		 */
		permission: {
			updateStatus: string;
			create: string;
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateStatus: boolean;
			create: boolean;
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface ProductSku {
		/**
		 * 获取商品SKU列表
		 */
		byProduct(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ProductSkuEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ProductSkuEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			byProduct: string;
			update: string;
			delete: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			byProduct: boolean;
			update: boolean;
			delete: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface RecycleData {
		/**
		 * 恢复数据
		 */
		restore(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RecycleDataEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<RecycleDataPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { restore: string; info: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { restore: boolean; info: boolean; page: boolean };

		request: Request;
	}

	interface SensitiveWord {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SensitiveWordPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SensitiveWordEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SensitiveWordEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface SpaceInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SpaceInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface SpaceType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SpaceTypePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TaskInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 开始
		 */
		start(data?: any): Promise<any>;

		/**
		 * 执行一次
		 */
		once(data?: any): Promise<any>;

		/**
		 * 停止
		 */
		stop(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TaskInfoEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TaskInfoPageResponse>;

		/**
		 * 日志
		 */
		log(data?: any): Promise<any>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			start: string;
			once: string;
			stop: string;
			info: string;
			page: string;
			log: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			start: boolean;
			once: boolean;
			stop: boolean;
			info: boolean;
			page: boolean;
			log: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelETicket {
		/**
		 * 核销电子票
		 */
		verify(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelETicketPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelETicketEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelETicketEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			verify: string;
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			verify: boolean;
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelGuide {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelGuidePageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelTrafficGuideEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelTrafficGuideEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelInventory {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelInventoryPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelInventoryEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelInventoryEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelItinerary {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelItineraryPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelRouteItineraryEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelRouteItineraryEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelRecommend {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelRecommendPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelRecommendSlotEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelRecommendSlotEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelReview {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelReviewPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelReviewEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelReviewEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelRoute {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelRoutePageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelRoutePackageEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelRoutePackageEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelScenic {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelScenicPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelScenicSpotEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelScenicSpotEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelTicketType {
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelTicketTypePageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelTicketTypeEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelTicketTypeEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			update: string;
			delete: string;
			page: string;
			list: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			update: boolean;
			delete: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserAddress {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserAddressEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserAddressEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserAddressPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface RequestOptions {
		url: string;
		method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
		data?: any;
		params?: any;
		headers?: any;
		timeout?: number;
		[key: string]: any;
	}

	type Request = (options: RequestOptions) => Promise<any>;

	type Service = {
		request: Request;

		accommodation: {
			hotel: AccommodationHotel;
			roomCalendar: AccommodationRoomCalendar;
			roomType: AccommodationRoomType;
		};
		base: {
			coding: BaseCoding;
			comm: BaseComm;
			open: BaseOpen;
			sys: {
				department: BaseSysDepartment;
				log: BaseSysLog;
				menu: BaseSysMenu;
				param: BaseSysParam;
				role: BaseSysRole;
				user: BaseSysUser;
			};
		};
		community: {
			comment: CommunityComment;
			post: CommunityPost;
			report: CommunityReport;
			topic: CommunityTopic;
		};
		demo: { goods: DemoGoods; tenant: DemoTenant };
		dict: { info: DictInfo; type: DictType };
		food: {
			dish: FoodDish;
			farmCategory: FoodFarmCategory;
			farmProduct: FoodFarmProduct;
			restaurant: FoodRestaurant;
			timeSlot: FoodTimeSlot;
		};
		member: { user: MemberUser };
		merchantApplication: MerchantApplication;
		merchant: Merchant;
		message: Message;
		messageTemplate: MessageTemplate;
		operate: {
			announcement: OperateAnnouncement;
			banner: OperateBanner;
			financeRecord: OperateFinanceRecord;
		};
		order: Order;
		pay: { record: PayRecord };
		plugin: { info: PluginInfo };
		product: { category: ProductCategory; goods: ProductGoods; sku: ProductSku };
		recycle: { data: RecycleData };
		sensitive: { word: SensitiveWord };
		space: { info: SpaceInfo; type: SpaceType };
		task: { info: TaskInfo };
		travel: {
			eTicket: TravelETicket;
			guide: TravelGuide;
			inventory: TravelInventory;
			itinerary: TravelItinerary;
			recommend: TravelRecommend;
			review: TravelReview;
			route: TravelRoute;
			scenic: TravelScenic;
			ticketType: TravelTicketType;
		};
		user: { address: UserAddress; info: UserInfo };
	};
}
