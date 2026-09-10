<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索举报理由" />
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
	name: 'community-report'
});

import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 举报目标类型
const targetTypeDict = [
	{ label: '帖子', value: 'post' },
	{ label: '评论', value: 'comment' },
	{ label: '用户', value: 'user' }
];

// 处理状态
const statusDict = [
	{ label: '待处理', value: 'pending', type: 'warning' },
	{ label: '已处理', value: 'handled', type: 'success' },
	{ label: '已驳回', value: 'rejected', type: 'info' }
];

// cl-crud（举报只读：后端仅 page/list/info，处理流转走后端后续接口）
const Crud = useCrud({ service: service.community.report }, app => {
	app.refresh();
});

const Table = useTable({
	contextMenu: ['refresh'],

	columns: [
		{
			prop: 'userId',
			label: '举报人ID',
			width: 90,
			align: 'center'
		},
		{
			prop: 'targetType',
			label: '目标类型',
			width: 100,
			align: 'center',
			dict: targetTypeDict
		},
		{
			prop: 'targetId',
			label: '目标ID',
			width: 90,
			align: 'center'
		},
		{
			prop: 'reason',
			label: '举报理由',
			minWidth: 240,
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
			prop: 'result',
			label: '处理结果',
			minWidth: 180,
			showOverflowTooltip: true
		},
		{
			prop: 'createTime',
			label: '举报时间',
			minWidth: 170,
			sortable: 'desc'
		}
	]
});
</script>
