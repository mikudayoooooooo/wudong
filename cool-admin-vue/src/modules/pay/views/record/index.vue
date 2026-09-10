<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索支付流水号" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'pay-record'
});

import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 支付渠道
const channelDict = [
	{ label: '微信', value: 'wechat', type: 'success' },
	{ label: '支付宝', value: 'alipay' }
];

// 支付状态
const statusDict = [
	{ label: '待支付', value: 1, type: 'warning' },
	{ label: '已支付', value: 2, type: 'success' },
	{ label: '已退款', value: 3, type: 'danger' }
];

// cl-crud（支付流水只读：后端仅提供 page/list/info）
const Crud = useCrud({ service: service.pay.record }, app => {
	app.refresh();
});

// cl-table
const Table = useTable({
	contextMenu: ['refresh'],

	columns: [
		{
			prop: 'paymentNo',
			label: '支付流水号',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'orderId',
			label: '订单ID',
			width: 90,
			align: 'center'
		},
		{
			prop: 'payChannel',
			label: '渠道',
			width: 90,
			align: 'center',
			dict: channelDict,
			dictColor: true
		},
		{
			prop: 'payAmount',
			label: '支付金额',
			width: 100,
			align: 'center'
		},
		{
			prop: 'payStatus',
			label: '状态',
			width: 90,
			align: 'center',
			dict: statusDict,
			dictColor: true
		},
		{
			prop: 'transactionId',
			label: '第三方交易号',
			minWidth: 160,
			showOverflowTooltip: true
		},
		{
			prop: 'payTime',
			label: '支付时间',
			minWidth: 165
		},
		{
			prop: 'refundAmount',
			label: '退款金额',
			width: 100,
			align: 'center'
		},
		{
			prop: 'refundTime',
			label: '退款时间',
			minWidth: 165
		},
		{
			prop: 'createTime',
			label: '创建时间',
			minWidth: 170,
			sortable: 'desc'
		}
	]
});
</script>
