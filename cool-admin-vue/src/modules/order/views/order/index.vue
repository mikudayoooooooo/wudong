<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索订单号" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 编辑（仅备注） -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'order-order'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 订单类型
const orderTypeDict = [
	{ label: '商品', value: 1 },
	{ label: '餐位', value: 2 },
	{ label: '住宿', value: 3 },
	{ label: '门票', value: 4, type: 'success' },
	{ label: '路线', value: 5, type: 'warning' }
];

// 所属模块
const moduleDict = [
	{ label: '衣-商品', value: 'product' },
	{ label: '食-餐饮', value: 'food' },
	{ label: '住-住宿', value: 'accommodation' },
	{ label: '行-旅游', value: 'travel' }
];

// 订单状态
const statusDict = [
	{ label: '待支付', value: 1, type: 'warning' },
	{ label: '已支付', value: 2, type: 'success' },
	{ label: '已完成', value: 3 },
	{ label: '已取消', value: 4, type: 'info' },
	{ label: '已退款', value: 5, type: 'danger' }
];

// cl-crud
const Crud = useCrud({ service: service.order }, app => {
	app.refresh();
});

// cl-table
const Table = useTable({
	contextMenu: ['refresh'],

	columns: [
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
			prop: 'orderType',
			label: '类型',
			width: 80,
			align: 'center',
			dict: orderTypeDict,
			dictColor: true
		},
		{
			prop: 'module',
			label: '模块',
			width: 100,
			align: 'center',
			dict: moduleDict
		},
		{
			prop: 'totalAmount',
			label: '订单总额',
			width: 100,
			align: 'center',
			sortable: 'custom'
		},
		{
			prop: 'payAmount',
			label: '实付金额',
			width: 100,
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
			prop: 'payTime',
			label: '支付时间',
			minWidth: 165
		},
		{
			prop: 'remark',
			label: '备注',
			minWidth: 140,
			showOverflowTooltip: true
		},
		{
			prop: 'createTime',
			label: '创建时间',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 120,
			buttons: ['edit', 'delete']
		}
	]
});

// cl-upsert（订单不可手工创建，仅允许改备注）
const Upsert = useUpsert<Eps.OrderEntity>({
	dialog: {
		width: '560px'
	},

	items: [
		{
			prop: 'orderNo',
			label: '订单号',
			span: 24,
			component: {
				name: 'el-input',
				props: {
					disabled: true
				}
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
		},
		{
			prop: 'remark',
			label: '备注',
			span: 24,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3,
					maxlength: 500
				}
			}
		}
	]
});
</script>
