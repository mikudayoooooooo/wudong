<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索话题名称" />
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
	name: 'community-topic'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 是否标记
const flagDict = [
	{ label: '否', value: 0 },
	{ label: '是', value: 1 }
];

// 状态
const statusDict = [
	{ label: '禁用', value: 0, type: 'danger' },
	{ label: '启用', value: 1, type: 'success' }
];

const Crud = useCrud({ service: service.community.topic }, app => {
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
			label: '话题名称',
			minWidth: 160,
			showOverflowTooltip: true
		},
		{
			prop: 'intro',
			label: '简介',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'viewCount',
			label: '浏览',
			width: 80,
			align: 'center'
		},
		{
			prop: 'fansCount',
			label: '粉丝',
			width: 80,
			align: 'center'
		},
		{
			prop: 'postCount',
			label: '帖子',
			width: 80,
			align: 'center'
		},
		{
			prop: 'isHot',
			label: '热门',
			width: 80,
			align: 'center',
			dict: flagDict
		},
		{
			prop: 'isRec',
			label: '推荐',
			width: 80,
			align: 'center',
			dict: flagDict
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
			prop: 'name',
			label: '话题名称',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				placeholder: '#话题名',
				props: { maxlength: 50 }
			}
		},
		{
			prop: 'intro',
			label: '简介',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'isHot',
			label: '热门',
			span: 12,
			value: 0,
			component: {
				name: 'el-select',
				options: flagDict
			}
		},
		{
			prop: 'isRec',
			label: '推荐',
			span: 12,
			value: 0,
			component: {
				name: 'el-select',
				options: flagDict
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
