<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索景区名称、地址" />
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
	name: 'travel-scenic'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 站点类型
const typeDict = [
	{ label: '景点', value: 'spot' },
	{ label: '餐饮', value: 'dining' },
	{ label: '住宿', value: 'stay' },
	{ label: '体验', value: 'experience' }
];

// 状态
const statusDict = [
	{ label: '禁用', value: 0, type: 'danger' },
	{ label: '启用', value: 1, type: 'success' }
];

const Crud = useCrud({ service: service.travel.scenic }, app => {
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
			label: '名称',
			minWidth: 160,
			showOverflowTooltip: true
		},
		{
			prop: 'type',
			label: '类型',
			width: 90,
			align: 'center',
			dict: typeDict
		},
		{
			prop: 'address',
			label: '地址',
			minWidth: 180,
			showOverflowTooltip: true
		},
		{
			prop: 'openTime',
			label: '开放时间',
			width: 130
		},
		{
			prop: 'intro',
			label: '简介',
			minWidth: 200,
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
			label: '名称',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
			}
		},
		{
			prop: 'type',
			label: '类型',
			span: 12,
			required: true,
			component: {
				name: 'el-select',
				options: typeDict
			}
		},
		{
			prop: 'address',
			label: '地址',
			span: 24,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'longitude',
			label: '经度',
			span: 12,
			component: {
				name: 'el-input-number',
				props: { precision: 6, 'controls-position': 'right' }
			}
		},
		{
			prop: 'latitude',
			label: '纬度',
			span: 12,
			component: {
				name: 'el-input-number',
				props: { precision: 6, 'controls-position': 'right' }
			}
		},
		{
			prop: 'openTime',
			label: '开放时间',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
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
		},
		{
			prop: 'cover',
			label: '主图地址',
			span: 24,
			component: {
				name: 'el-input',
				props: { maxlength: 255 }
			}
		},
		{
			prop: 'intro',
			label: '简介',
			span: 24,
			component: {
				name: 'el-input',
				type: 'textarea',
				props: { rows: 3, maxlength: 500 }
			}
		}
	]
});
</script>
