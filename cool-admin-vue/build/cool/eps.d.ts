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

	interface MemberUserPageResponse {
		pagination: PagePagination;
		list: MemberUserEntity[];
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

	interface PluginInfoPageResponse {
		pagination: PagePagination;
		list: PluginInfoEntity[];
	}

	interface RecycleDataPageResponse {
		pagination: PagePagination;
		list: RecycleDataEntity[];
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

	interface OrderEntity {
		id?: number;
		createTime?: string;
		updateTime?: string;
		orderNo?: string;
		userId?: number;
		orderType?: number;
		module?: string;
		totalAmount?: number;
		payAmount?: number;
		discountAmount?: number;
		status?: number;
		payTime?: string;
		completeTime?: string;
		cancelTime?: string;
		remark?: string;
	}

	interface Order {
		delete(data?: any): Promise<any>;
		update(data?: any): Promise<any>;
		page(data?: any): Promise<any>;
		list(data?: any): Promise<OrderEntity[]>;
		info(data?: any): Promise<OrderEntity>;
		add(data?: any): Promise<any>;
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
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

	interface PaymentRecordEntity {
		id?: number;
		createTime?: string;
		updateTime?: string;
		orderId?: number;
		paymentNo?: string;
		payChannel?: string;
		payAmount?: number;
		payStatus?: number;
		transactionId?: string;
		payTime?: string;
		refundTime?: string;
		refundAmount?: number;
		callbackData?: any;
	}

	interface PaymentRecord {
		page(data?: any): Promise<any>;
		list(data?: any): Promise<PaymentRecordEntity[]>;
		info(data?: any): Promise<PaymentRecordEntity>;
		permission: {
			info: string;
			list: string;
			page: string;
		};
		_permission: {
			info: boolean;
			list: boolean;
			page: boolean;
		};
		request: Request;
	}

	interface MerchantEntity {
		id?: number;
		createTime?: string;
		updateTime?: string;
		userId?: number;
		username?: string;
		shopName?: string;
		module?: string;
		contactName?: string;
		contactPhone?: string;
		idCard?: string;
		businessLicense?: string;
		status?: number;
		joinedAt?: string;
	}

	interface Merchant {
		delete(data?: any): Promise<any>;
		update(data?: any): Promise<any>;
		page(data?: any): Promise<any>;
		list(data?: any): Promise<MerchantEntity[]>;
		info(data?: any): Promise<MerchantEntity>;
		add(data?: any): Promise<any>;
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
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

	interface MerchantApplicationEntity {
		id?: number;
		createTime?: string;
		updateTime?: string;
		userId?: number;
		shopName?: string;
		module?: string;
		contactName?: string;
		contactPhone?: string;
		idCard?: string;
		idCardFront?: string;
		idCardBack?: string;
		businessLicense?: string;
		otherMaterials?: any;
		status?: number;
		auditResult?: string;
		auditBy?: number;
		auditTime?: string;
	}

	interface MerchantApplication {
		page(data?: any): Promise<any>;
		list(data?: any): Promise<MerchantApplicationEntity[]>;
		info(data?: any): Promise<MerchantApplicationEntity>;
		permission: {
			info: string;
			list: string;
			page: string;
		};
		_permission: {
			info: boolean;
			list: boolean;
			page: boolean;
		};
		request: Request;
	}

	interface SystemMessageEntity {
		id?: number;
		createTime?: string;
		updateTime?: string;
		userId?: number;
		type?: string;
		title?: string;
		content?: string;
		linkType?: string;
		linkValue?: string;
		isRead?: number;
	}

	interface SystemMessage {
		delete(data?: any): Promise<any>;
		update(data?: any): Promise<any>;
		page(data?: any): Promise<any>;
		list(data?: any): Promise<SystemMessageEntity[]>;
		info(data?: any): Promise<SystemMessageEntity>;
		add(data?: any): Promise<any>;
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
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

	interface SensitiveWordEntity {
		id?: number;
		createTime?: string;
		updateTime?: string;
		word?: string;
		status?: number;
	}

	interface SensitiveWord {
		delete(data?: any): Promise<any>;
		update(data?: any): Promise<any>;
		page(data?: any): Promise<any>;
		list(data?: any): Promise<SensitiveWordEntity[]>;
		info(data?: any): Promise<SensitiveWordEntity>;
		add(data?: any): Promise<any>;
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
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

	type DictKey = "brand" | "occupation";

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
		demo: { goods: DemoGoods; tenant: DemoTenant };
		dict: { info: DictInfo; type: DictType };
		member: { user: MemberUser };
		message: { message: SystemMessage };
		merchant: Merchant & { application: MerchantApplication };
		operate: {
			announcement: OperateAnnouncement;
			banner: OperateBanner;
			financeRecord: OperateFinanceRecord;
		};
		order: Order;
		pay: { record: PaymentRecord };
		plugin: { info: PluginInfo };
		recycle: { data: RecycleData };
		sensitive: { word: SensitiveWord };
		space: { info: SpaceInfo; type: SpaceType };
		task: { info: TaskInfo };
		user: { address: UserAddress; info: UserInfo };
	};
}
