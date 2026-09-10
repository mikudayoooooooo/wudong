<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索使用日期" />
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
	name: 'travel-inventory'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 项目类型
const itemTypeDict = [
	{ label: '门票', value: 'ticket' },
	{ label: '路线', value: 'route' }
];

const Crud = useCrud({ service: service.travel.inventory }, app => {
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
			width: 120,
			align: 'center'
		},
		{
			prop: 'total',
			label: '总库存',
			width: 90,
			align: 'center'
		},
		{
			prop: 'sold',
			label: '已售',
			width: 90,
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
			prop: 'itemType',
			label: '项目类型',
			span: 12,
			required: true,
			component: {
				name: 'el-select',
				options: itemTypeDict
			}
		},
		{
			prop: 'itemId',
			label: '项目ID',
			span: 12,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
			}
		},
		{
			prop: 'useDate',
			label: '使用日期',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				placeholder: 'YYYY-MM-DD',
				props: { maxlength: 20 }
			}
		},
		{
			prop: 'total',
			label: '总库存',
			span: 12,
			value: 0,
			component: {
				name: 'el-input-number',
				props: { min: 0, 'controls-position': 'right' }
			}
		},
		{
			prop: 'sold',
			label: '已售',
			span: 12,
			value: 0,
			component: {
				name: 'el-input-number',
				props: { min: 0, 'controls-position': 'right' }
			}
		}
	]
});
</script>
