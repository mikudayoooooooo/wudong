<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新 -->
			<cl-refresh-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索订单ID、结算批次" />
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
	name: 'operate-finance-record'
});

import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 结算状态
const settlementStatusDict = [
	{
		label: '待结算',
		value: 1,
		type: 'warning'
	},
	{
		label: '已结算',
		value: 2,
		type: 'success'
	}
];

// cl-crud：只读，后端仅暴露 page/info/list
const Crud = useCrud({ service: service.operate.financeRecord }, app => {
	app.refresh();
});

// cl-table
const Table = useTable({
	contextMenu: ['refresh'],
	columns: [
		{
			type: 'index',
			label: '#',
			width: 60
		},
		{
			prop: 'orderId',
			label: '订单ID',
			minWidth: 120
		},
		{
			prop: 'merchantId',
			label: '商家ID',
			minWidth: 120
		},
		{
			prop: 'orderAmount',
			label: '订单金额',
			width: 120,
			align: 'right',
			headerAlign: 'center'
		},
		{
			prop: 'commissionRate',
			label: '抽佣率(%)',
			width: 110,
			align: 'right',
			headerAlign: 'center'
		},
		{
			prop: 'commissionAmount',
			label: '平台抽佣',
			width: 120,
			align: 'right',
			headerAlign: 'center'
		},
		{
			prop: 'merchantIncome',
			label: '商家收入',
			width: 120,
			align: 'right',
			headerAlign: 'center'
		},
		{
			prop: 'settlementStatus',
			label: '结算状态',
			width: 100,
			align: 'center',
			dict: settlementStatusDict,
			dictColor: true
		},
		{
			prop: 'settlementTime',
			label: '结算时间',
			minWidth: 170
		},
		{
			prop: 'settlementBatch',
			label: '结算批次',
			minWidth: 170,
			showOverflowTooltip: true
		}
	]
});
</script>
