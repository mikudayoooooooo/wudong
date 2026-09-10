<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索评论内容" />
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
	name: 'community-comment'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 状态
const statusDict = [
	{ label: '隐藏', value: 0, type: 'danger' },
	{ label: '显示', value: 1, type: 'success' }
];

// cl-crud（评论管理：隐藏/删除，后端无 add）
const Crud = useCrud({ service: service.community.comment }, app => {
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
			prop: 'postId',
			label: '游记ID',
			width: 90,
			align: 'center'
		},
		{
			prop: 'userId',
			label: '用户ID',
			width: 80,
			align: 'center'
		},
		{
			prop: 'content',
			label: '评论内容',
			minWidth: 240,
			showOverflowTooltip: true
		},
		{
			prop: 'parentId',
			label: '父评论ID',
			width: 90,
			align: 'center'
		},
		{
			prop: 'likeCount',
			label: '点赞',
			width: 80,
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

// 编辑仅用于显隐（后端无 add）
const Upsert = useUpsert({
	items: [
		{
			prop: 'content',
			label: '评论内容',
			span: 24,
			component: {
				name: 'el-input',
				type: 'textarea',
				props: { rows: 3, disabled: true }
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
