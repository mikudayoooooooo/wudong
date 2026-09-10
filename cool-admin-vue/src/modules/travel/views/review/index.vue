<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索评价内容" />
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
	name: 'travel-review'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 评价目标
const targetTypeDict = [
	{ label: '景区', value: 'scenic' },
	{ label: '路线', value: 'route' }
];

// 状态
const statusDict = [
	{ label: '隐藏', value: 0, type: 'danger' },
	{ label: '显示', value: 1, type: 'success' }
];

// cl-crud（评价管理：商家回复/隐藏，后端无 add）
const Crud = useCrud({ service: service.travel.review }, app => {
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
			prop: 'userId',
			label: '用户ID',
			width: 80,
			align: 'center'
		},
		{
			prop: 'score',
			label: '评分',
			width: 80,
			align: 'center'
		},
		{
			prop: 'content',
			label: '评价内容',
			minWidth: 220,
			showOverflowTooltip: true
		},
		{
			prop: 'merchantReply',
			label: '商家回复',
			minWidth: 180,
			showOverflowTooltip: true
		},
		{
			prop: 'replyTime',
			label: '回复时间',
			minWidth: 165
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

// 编辑仅用于回复与显隐（后端无 add）
const Upsert = useUpsert({
	items: [
		{
			prop: 'content',
			label: '评价内容',
			span: 24,
			component: {
				name: 'el-input',
				type: 'textarea',
				props: { rows: 3, disabled: true }
			}
		},
		{
			prop: 'merchantReply',
			label: '商家回复',
			span: 24,
			component: {
				name: 'el-input',
				type: 'textarea',
				props: { rows: 3, maxlength: 500 }
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
