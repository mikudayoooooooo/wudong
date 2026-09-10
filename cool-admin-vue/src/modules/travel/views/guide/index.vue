<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索攻略标题、出发地" />
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
	name: 'travel-guide'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 状态
const statusDict = [
	{ label: '禁用', value: 0, type: 'danger' },
	{ label: '启用', value: 1, type: 'success' }
];

const Crud = useCrud({ service: service.travel.guide }, app => {
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
			prop: 'title',
			label: '标题',
			minWidth: 180,
			showOverflowTooltip: true
		},
		{
			prop: 'departure',
			label: '出发地',
			width: 110,
			showOverflowTooltip: true
		},
		{
			prop: 'destination',
			label: '目的地',
			width: 110,
			showOverflowTooltip: true
		},
		{
			prop: 'mode',
			label: '交通方式',
			width: 100
		},
		{
			prop: 'duration',
			label: '耗时',
			width: 90,
			align: 'center'
		},
		{
			prop: 'fee',
			label: '费用',
			width: 90,
			align: 'center'
		},
		{
			prop: 'sort',
			label: '排序',
			width: 80,
			align: 'center',
			sortable: true
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
			prop: 'title',
			label: '标题',
			span: 24,
			required: true,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
			}
		},
		{
			prop: 'departure',
			label: '出发地',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
			}
		},
		{
			prop: 'destination',
			label: '目的地',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
			}
		},
		{
			prop: 'mode',
			label: '交通方式',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 50 }
			}
		},
		{
			prop: 'duration',
			label: '耗时',
			span: 12,
			component: {
				name: 'el-input',
				placeholder: '如 2小时30分',
				props: { maxlength: 50 }
			}
		},
		{
			prop: 'fee',
			label: '费用',
			span: 12,
			component: {
				name: 'el-input-number',
				props: { min: 0, precision: 2, 'controls-position': 'right' }
			}
		},
		{
			prop: 'sort',
			label: '排序',
			span: 12,
			value: 0,
			component: {
				name: 'el-input-number',
				props: { min: 0, 'controls-position': 'right' }
			}
		},
		{
			prop: 'detail',
			label: '详情',
			span: 24,
			component: {
				name: 'el-input',
				type: 'textarea',
				props: { rows: 4, maxlength: 1000 }
			}
		},
		{
			prop: 'cover',
			label: '图片地址',
			span: 24,
			component: {
				name: 'el-input',
				props: { maxlength: 255 }
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
