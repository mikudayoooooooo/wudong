<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索票种名称" />
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
	name: 'travel-ticket-type'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 状态
const statusDict = [
	{ label: '下架', value: 0, type: 'danger' },
	{ label: '在售', value: 1, type: 'success' }
];

const Crud = useCrud({ service: service.travel.ticketType }, app => {
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
			prop: 'name',
			label: '票种名称',
			minWidth: 160,
			showOverflowTooltip: true
		},
		{
			prop: 'scenicId',
			label: '景区ID',
			width: 90,
			align: 'center'
		},
		{
			prop: 'price',
			label: '票价',
			width: 100,
			align: 'center'
		},
		{
			prop: 'stock',
			label: '总库存',
			width: 90,
			align: 'center'
		},
		{
			prop: 'validRule',
			label: '有效期规则',
			minWidth: 160,
			showOverflowTooltip: true
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
			prop: 'name',
			label: '票种名称',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
			}
		},
		{
			prop: 'scenicId',
			label: '景区ID',
			span: 12,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
			}
		},
		{
			prop: 'price',
			label: '票价',
			span: 12,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 0, precision: 2, 'controls-position': 'right' }
			}
		},
		{
			prop: 'stock',
			label: '总库存',
			span: 12,
			value: 0,
			component: {
				name: 'el-input-number',
				props: { min: 0, 'controls-position': 'right' }
			}
		},
		{
			prop: 'validRule',
			label: '有效期规则',
			span: 24,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'status',
			label: '状态',
			span: 12,
			value: 1,
			component: {
				name: 'el-select',
				options: statusDict
			}
		}
	]
});
</script>
