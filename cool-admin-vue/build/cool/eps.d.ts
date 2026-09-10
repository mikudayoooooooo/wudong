declare namespace Eps {
	interface HotelEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RoomCalendarEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RoomTypeEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysDepartmentEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysLogEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysMenuEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysParamEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysRoleEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysUserEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DemoGoodsEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictTypeEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MemberUserEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface AnnouncementEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BannerEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FinanceRecordEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PluginInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RecycleDataEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceTypeEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TaskInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserAddressEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface OrderEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PaymentRecordEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MerchantEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MerchantApplicationEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SystemMessageEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SensitiveWordEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RoutePackageEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ScenicSpotEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TicketTypeEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelInventoryEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RouteItineraryEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ETicketEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RecommendSlotEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TrafficGuideEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelReviewEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityPostEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityTopicEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityCommentEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityReportEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MessageTemplateEntity {
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

	interface OrderPageResponse {
		pagination: PagePagination;
		list: OrderEntity[];
	}

	interface PayRecordPageResponse {
		pagination: PagePagination;
		list: PaymentRecordEntity[];
	}

	interface MerchantPageResponse {
		pagination: PagePagination;
		list: MerchantEntity[];
	}

	interface MessagePageResponse {
		pagination: PagePagination;
		list: SystemMessageEntity[];
	}

	interface SensitiveWordPageResponse {
		pagination: PagePagination;
		list: SensitiveWordEntity[];
	}

	interface TravelRoutePageResponse {
		pagination: PagePagination;
		list: RoutePackageEntity[];
	}

	interface TravelScenicPageResponse {
		pagination: PagePagination;
		list: ScenicSpotEntity[];
	}

	interface TravelTicketTypePageResponse {
		pagination: PagePagination;
		list: TicketTypeEntity[];
	}

	interface TravelInventoryPageResponse {
		pagination: PagePagination;
		list: TravelInventoryEntity[];
	}

	interface TravelItineraryPageResponse {
		pagination: PagePagination;
		list: RouteItineraryEntity[];
	}

	interface TravelETicketPageResponse {
		pagination: PagePagination;
		list: ETicketEntity[];
	}

	interface TravelRecommendPageResponse {
		pagination: PagePagination;
		list: RecommendSlotEntity[];
	}

	interface TravelGuidePageResponse {
		pagination: PagePagination;
		list: TrafficGuideEntity[];
	}

	interface TravelReviewPageResponse {
		pagination: PagePagination;
		list: TravelReviewEntity[];
	}

	interface CommunityPostPageResponse {
		pagination: PagePagination;
		list: CommunityPostEntity[];
	}

	interface CommunityTopicPageResponse {
		pagination: PagePagination;
		list: CommunityTopicEntity[];
	}

	interface CommunityCommentPageResponse {
		pagination: PagePagination;
		list: CommunityCommentEntity[];
	}

	interface CommunityReportPageResponse {
		pagination: PagePagination;
		list: CommunityReportEntity[];
	}

	interface AccommodationHotel {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<AccommodationHotelPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<HotelEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<HotelEntity>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * batch
		 */
		batch(data?: any): Promise<any>;

		/**
		 * range
		 */
		range(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<AccommodationRoomCalendarPageResponse>;

		/**
		 * info
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<AccommodationRoomTypePageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<RoomTypeEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<RoomTypeEntity>;

		/**
		 * add
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
		 * getModuleTree
		 */
		getModuleTree(data?: any): Promise<any>;

		/**
		 * createCode
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
		 * personUpdate
		 */
		personUpdate(data?: any): Promise<any>;

		/**
		 * uploadMode
		 */
		uploadMode(data?: any): Promise<any>;

		/**
		 * permmenu
		 */
		permmenu(data?: any): Promise<any>;

		/**
		 * program
		 */
		program(data?: any): Promise<any>;

		/**
		 * person
		 */
		person(data?: any): Promise<any>;

		/**
		 * upload
		 */
		upload(data?: any): Promise<any>;

		/**
		 * logout
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
		 * refreshToken
		 */
		refreshToken(data?: any): Promise<any>;

		/**
		 * captcha
		 */
		captcha(data?: any): Promise<any>;

		/**
		 * login
		 */
		login(data?: any): Promise<any>;

		/**
		 * html
		 */
		html(data?: any): Promise<any>;

		/**
		 * eps
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * order
		 */
		order(data?: any): Promise<any>;

		/**
		 * list
		 */
		list(data?: any): Promise<BaseSysDepartmentEntity[]>;

		/**
		 * add
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
		 * setKeep
		 */
		setKeep(data?: any): Promise<any>;

		/**
		 * getKeep
		 */
		getKeep(data?: any): Promise<any>;

		/**
		 * clear
		 */
		clear(data?: any): Promise<any>;

		/**
		 * page
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
		 * create
		 */
		create(data?: any): Promise<any>;

		/**
		 * export
		 */
		export(data?: any): Promise<any>;

		/**
		 * import
		 */
		import(data?: any): Promise<any>;

		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * parse
		 */
		parse(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<BaseSysMenuEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<BaseSysMenuEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<BaseSysMenuPageResponse>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * html
		 */
		html(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<BaseSysParamEntity>;

		/**
		 * page
		 */
		page(data?: any): Promise<BaseSysParamPageResponse>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<BaseSysRoleEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<BaseSysRoleEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<BaseSysRolePageResponse>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * move
		 */
		move(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<BaseSysUserEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<BaseSysUserEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<BaseSysUserPageResponse>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<DemoGoodsEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<DemoGoodsEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<DemoGoodsPageResponse>;

		/**
		 * add
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
		 * noTenant
		 */
		noTenant(data?: any): Promise<any>;

		/**
		 * noUse
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * types
		 */
		types(data?: any): Promise<any>;

		/**
		 * data
		 */
		data(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<DictInfoEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<DictInfoEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<DictInfoPageResponse>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<DictTypeEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<DictTypeEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<DictTypePageResponse>;

		/**
		 * add
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
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<MemberUserPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<MemberUserEntity[]>;

		/**
		 * info
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<OperateAnnouncementPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<AnnouncementEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<AnnouncementEntity>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<OperateBannerPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<BannerEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<BannerEntity>;

		/**
		 * add
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
		 * page
		 */
		page(data?: any): Promise<OperateFinanceRecordPageResponse>;

		/**
		 * info
		 */
		info(data?: any): Promise<FinanceRecordEntity>;

		/**
		 * list
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
		 * install
		 */
		install(data?: any): Promise<any>;

		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<PluginInfoEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<PluginInfoEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<PluginInfoPageResponse>;

		/**
		 * add
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
		 * restore
		 */
		restore(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<RecycleDataEntity>;

		/**
		 * page
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<SpaceInfoEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<SpaceInfoEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<SpaceInfoPageResponse>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<SpaceTypeEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<SpaceTypeEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<SpaceTypePageResponse>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * start
		 */
		start(data?: any): Promise<any>;

		/**
		 * once
		 */
		once(data?: any): Promise<any>;

		/**
		 * stop
		 */
		stop(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<TaskInfoEntity>;

		/**
		 * page
		 */
		page(data?: any): Promise<TaskInfoPageResponse>;

		/**
		 * log
		 */
		log(data?: any): Promise<any>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<UserAddressEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<UserAddressEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<UserAddressPageResponse>;

		/**
		 * add
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
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<UserInfoEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<UserInfoEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<UserInfoPageResponse>;

		/**
		 * add
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

	interface Order {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<OrderPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<OrderEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<OrderEntity>;

		/**
		 * add
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

	interface PayRecord {
		/**
		 * page
		 */
		page(data?: any): Promise<PayRecordPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<PaymentRecordEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<PaymentRecordEntity>;

		/**
		 * 权限标识
		 */
		permission: { page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: { page: boolean; list: boolean; info: boolean };

		request: Request;
	}

	interface Merchant {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<MerchantPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<MerchantEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<MerchantEntity>;

		/**
		 * add
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

	interface Message {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<MessagePageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<SystemMessageEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<SystemMessageEntity>;

		/**
		 * add
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

	interface SensitiveWord {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<SensitiveWordPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<SensitiveWordEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<SensitiveWordEntity>;

		/**
		 * add
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

	interface TravelRoute {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<TravelRoutePageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<RoutePackageEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<RoutePackageEntity>;

		/**
		 * add
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

	interface TravelScenic {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<TravelScenicPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<ScenicSpotEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<ScenicSpotEntity>;

		/**
		 * add
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

	interface TravelTicketType {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<TravelTicketTypePageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<TicketTypeEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<TicketTypeEntity>;

		/**
		 * add
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

	interface TravelInventory {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<TravelInventoryPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<TravelInventoryEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<TravelInventoryEntity>;

		/**
		 * add
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

	interface TravelItinerary {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<TravelItineraryPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<RouteItineraryEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<RouteItineraryEntity>;

		/**
		 * add
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

	interface TravelETicket {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<TravelETicketPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<ETicketEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<ETicketEntity>;

		/**
		 * add
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

	interface TravelRecommend {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<TravelRecommendPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<RecommendSlotEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<RecommendSlotEntity>;

		/**
		 * add
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

	interface TravelGuide {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<TravelGuidePageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<TrafficGuideEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<TrafficGuideEntity>;

		/**
		 * add
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

	interface TravelReview {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<TravelReviewPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<TravelReviewEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<TravelReviewEntity>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; update: string; page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface CommunityPost {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<CommunityPostPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<CommunityPostEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<CommunityPostEntity>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: { delete: boolean; page: boolean; list: boolean; info: boolean };

		request: Request;
	}

	interface CommunityTopic {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<CommunityTopicPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<CommunityTopicEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<CommunityTopicEntity>;

		/**
		 * add
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

	interface CommunityComment {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<CommunityCommentPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<CommunityCommentEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<CommunityCommentEntity>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; update: string; page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface CommunityReport {
		/**
		 * page
		 */
		page(data?: any): Promise<CommunityReportPageResponse>;

		/**
		 * list
		 */
		list(data?: any): Promise<CommunityReportEntity[]>;

		/**
		 * info
		 */
		info(data?: any): Promise<CommunityReportEntity>;

		/**
		 * 权限标识
		 */
		permission: { page: string; list: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: { page: boolean; list: boolean; info: boolean };

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
		demo: { goods: DemoGoods; tenant: DemoTenant };
		dict: { info: DictInfo; type: DictType };
		member: { user: MemberUser };
		operate: {
			announcement: OperateAnnouncement;
			banner: OperateBanner;
			financeRecord: OperateFinanceRecord;
		};
		plugin: { info: PluginInfo };
		recycle: { data: RecycleData };
		space: { info: SpaceInfo; type: SpaceType };
		task: { info: TaskInfo };
		user: { address: UserAddress; info: UserInfo };
		order: Order;
		pay: { record: PayRecord };
		merchant: Merchant;
		merchantApplication: MerchantApplication;
		message: Message;
		sensitive: { word: SensitiveWord };
		travel: {
			route: TravelRoute;
			scenic: TravelScenic;
			ticketType: TravelTicketType;
			inventory: TravelInventory;
			itinerary: TravelItinerary;
			eTicket: TravelETicket;
			recommend: TravelRecommend;
			guide: TravelGuide;
			review: TravelReview;
		};
		community: {
			post: CommunityPost;
			topic: CommunityTopic;
			comment: CommunityComment;
			report: CommunityReport;
		};
	};
}
