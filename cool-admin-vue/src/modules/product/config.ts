import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		order: 99,
		views: [
			{
				path: '/product/list',
				meta: {
					label: '商品列表',
					keepAlive: true
				},
				component: () => import('./views/list.vue')
			},
			{
				path: '/product/category',
				meta: {
					label: '商品分类',
					keepAlive: true
				},
				component: () => import('./views/category.vue')
			}
		]
	};
};
