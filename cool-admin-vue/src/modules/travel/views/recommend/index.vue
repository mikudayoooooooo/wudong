<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索推荐标题" />
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
	name: 'travel-recommend'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 项目类型
const itemTypeDict = [
	{ label: '路线', value: 'route' },
	{ label: '景区', value: 'scenic' },
	{ label: '帖子', value: 'post' }
];

// 状态
const statusDict = [
	{ label: '禁用', value: 0, type: 'danger' },
	{ label: '启用', value: 1, type: 'success' }
];

const Crud = useCrud({ service: service.travel.recommend }, app => {
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
			prop: 'subtitle',
			label: '副标题',
			minWidth: 140,
			showOverflowTooltip: true
		},
		{
			prop: 'badge',
			label: '角标',
			width: 100
		},
		{
			prop: 'slot',
			label: '位置',
			width: 100
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
			prop: 'group',
			label: '轮播分组',
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
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'subtitle',
			label: '副标题',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'badge',
			label: '角标',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
			}
		},
		{
			prop: 'slot',
			label: '位置',
			span: 12,
			value: 'home',
			component: {
				name: 'el-input',
				props: { maxlength: 50 }
			}
		},
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
			prop: 'group',
			label: '轮播分组',
			span: 12,
			value: 1,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
			}
		},
		{
			prop: 'interval',
			label: '轮播间隔（秒）',
			span: 12,
			value: 5,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
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
