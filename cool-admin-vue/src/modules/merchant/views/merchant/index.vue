<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索店铺名称、联系电话、商家账号" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'merchant-merchant'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 所属模块
const moduleDict = [
	{ label: '衣-商品', value: 'product' },
	{ label: '食-餐饮', value: 'food' },
	{ label: '住-住宿', value: 'accommodation' },
	{ label: '行-旅游', value: 'travel' }
];

// 状态
const statusDict = [
	{ label: '正常', value: 1, type: 'success' },
	{ label: '禁用', value: 0, type: 'danger' }
];

// cl-crud
const Crud = useCrud({ service: service.merchant }, app => {
	app.refresh();
});

// cl-table
const Table = useTable({
	contextMenu: ['refresh'],

	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'username',
			label: '商家账号',
			width: 110
		},
		{
			prop: 'shopName',
			label: '店铺名称',
			minWidth: 160,
			showOverflowTooltip: true
		},
		{
			prop: 'module',
			label: '所属模块',
			width: 100,
			align: 'center',
			dict: moduleDict
		},
		{
			prop: 'contactName',
			label: '联系人',
			width: 100
		},
		{
			prop: 'contactPhone',
			label: '联系电话',
			width: 130
		},
		{
			prop: 'userId',
			label: '用户ID',
			width: 80,
			align: 'center'
		},
		{
			prop: 'adminUserId',
			label: '绑定管理端ID',
			width: 110,
			align: 'center'
		},
		{
			prop: 'status',
			label: '状态',
			width: 90,
			align: 'center',
			dict: statusDict,
			dictColor: true
		},
		{
			prop: 'joinedAt',
			label: '入驻时间',
			minWidth: 165
		},
		{
			prop: 'createTime',
			label: '创建时间',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 160,
			buttons: ['edit', 'delete']
		}
	]
});

// cl-upsert
const Upsert = useUpsert<Eps.MerchantEntity>({
	dialog: {
		width: '700px'
	},

	items: [
		{
			prop: 'username',
			label: '商家账号',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: {
					maxlength: 50
				}
			}
		},
		{
			prop: 'userId',
			label: '关联用户ID',
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 1,
					'controls-position': 'right'
				}
			}
		},
		{
			prop: 'adminUserId',
			label: '绑定管理端账号',
			span: 12,
			help: '填管理端 sys_user 的 ID，绑定后该账号按商家角色只能看到本商家数据',
			component: {
				name: 'el-input-number',
				props: {
					min: 1,
					'controls-position': 'right'
				}
			}
		},
		{
			prop: 'shopName',
			label: '店铺名称',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: {
					maxlength: 100
				}
			}
		},
		{
			prop: 'module',
			label: '所属模块',
			span: 12,
			required: true,
			component: {
				name: 'el-select',
				options: moduleDict
			}
		},
		{
			prop: 'contactName',
			label: '联系人',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: {
					maxlength: 50
				}
			}
		},
		{
			prop: 'contactPhone',
			label: '联系电话',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: {
					maxlength: 11
				}
			}
		},
		{
			prop: 'businessLicense',
			label: '营业执照',
			span: 24,
			component: {
				name: 'cl-upload',
				props: {
					text: '选择图片'
				}
			}
		},
		{
			prop: 'status',
			label: '状态',
			value: 1,
			span: 12,
			component: {
				name: 'el-radio-group',
				options: statusDict
			}
		}
	]
});
</script>
