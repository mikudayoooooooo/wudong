import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		order: 98,
		views: [
			{
				path: '/food/restaurant',
				meta: {
					label: '餐厅管理',
					keepAlive: true
				},
				component: () => import('./views/restaurant.vue')
			},
			{
				path: '/food/farm-product',
				meta: {
					label: '农产品管理',
					keepAlive: true
				},
				component: () => import('./views/farm-product.vue')
			}
		]
	};
};
