<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索游记标题" />
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
	name: 'community-post'
});

import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 帖子状态
const statusDict = [
	{ label: '审核中', value: 'pending', type: 'warning' },
	{ label: '正常', value: 'normal', type: 'success' },
	{ label: '已下架', value: 'offline', type: 'danger' }
];

// cl-crud（游记管理：平台只读+下架删除，后端仅 page/list/info/delete）
const Crud = useCrud({ service: service.community.post }, app => {
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
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'userId',
			label: '作者ID',
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
			prop: 'viewCount',
			label: '浏览',
			width: 80,
			align: 'center'
		},
		{
			prop: 'likeCount',
			label: '点赞',
			width: 80,
			align: 'center'
		},
		{
			prop: 'commentCount',
			label: '评论',
			width: 80,
			align: 'center'
		},
		{
			prop: 'favoriteCount',
			label: '收藏',
			width: 80,
			align: 'center'
		},
		{
			prop: 'createTime',
			label: '发布时间',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 100,
			buttons: ['delete']
		}
	]
});
</script>
