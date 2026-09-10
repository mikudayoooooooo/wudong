<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索订单号、核销码" />
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
	name: 'travel-e-ticket'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 项目类型
const itemTypeDict = [
	{ label: '门票', value: 'ticket' },
	{ label: '路线', value: 'route' }
];

// 票状态
const statusDict = [
	{ label: '未使用', value: 'unused', type: 'warning' },
	{ label: '已核销', value: 'used', type: 'success' },
	{ label: '已退款', value: 'refunded', type: 'danger' }
];

const Crud = useCrud({ service: service.travel.eTicket }, app => {
	app.refresh();
});

const Table = useTable({
	contextMenu: ['refresh'],

	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'checkCode',
			label: '核销码',
			minWidth: 180,
			showOverflowTooltip: true
		},
		{
			prop: 'orderNo',
			label: '订单号',
			minWidth: 180,
			showOverflowTooltip: true
		},
		{
			prop: 'userId',
			label: '用户ID',
			width: 80,
			align: 'center'
		},
		{
			prop: 'itemType',
			label: '项目类型',
			width: 100,
			align: 'center',
			dict: itemTypeDict
		},
		{
			prop: 'itemId',
			label: '项目ID',
			width: 90,
			align: 'center'
		},
		{
			prop: 'useDate',
			label: '使用日期',
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
			prop: 'checkTime',
			label: '核销时间',
			minWidth: 165
		},
		{
			prop: 'checkAdminId',
			label: '核销管理员',
			width: 100,
			align: 'center'
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

const Upsert = useUpsert({
	items: [
		{
			prop: 'orderNo',
			label: '订单号',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 32 }
			}
		},
		{
			prop: 'userId',
			label: '用户ID',
			span: 12,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
			}
		},
		{
			prop: 'itemType',
			label: '项目类型',
			span: 12,
			component: {
				name: 'el-select',
				options: itemTypeDict
			}
		},
		{
			prop: 'itemId',
			label: '项目ID',
			span: 12,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
			}
		},
		{
			prop: 'useDate',
			label: '使用日期',
			span: 12,
			component: {
				name: 'el-input',
				placeholder: 'YYYY-MM-DD',
				props: { maxlength: 20 }
			}
		},
		{
			prop: 'checkCode',
			label: '核销码',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 64 }
			}
		},
		{
			prop: 'status',
			label: '状态',
			span: 12,
			component: {
				name: 'el-select',
				options: statusDict
			}
		}
	]
});
</script>
