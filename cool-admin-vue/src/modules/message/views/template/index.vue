<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索模板编码、名称" />
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
	name: 'message-template'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 消息类型
const typeDict = [
	{ label: '订单', value: 'order' },
	{ label: '系统', value: 'system' },
	{ label: '活动', value: 'activity' },
	{ label: '互动', value: 'interact' }
];

// 状态
const statusDict = [
	{ label: '停用', value: 0, type: 'danger' },
	{ label: '启用', value: 1, type: 'success' }
];

const Crud = useCrud({ service: service.messageTemplate }, app => {
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
			prop: 'code',
			label: '模板编码',
			width: 140
		},
		{
			prop: 'name',
			label: '模板名称',
			minWidth: 140,
			showOverflowTooltip: true
		},
		{
			prop: 'type',
			label: '消息类型',
			width: 100,
			align: 'center',
			dict: typeDict
		},
		{
			prop: 'title',
			label: '标题模板',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'content',
			label: '内容模板',
			minWidth: 260,
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
			prop: 'code',
			label: '模板编码',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				placeholder: '如 order-paid',
				props: { maxlength: 50 }
			}
		},
		{
			prop: 'name',
			label: '模板名称',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
			}
		},
		{
			prop: 'type',
			label: '消息类型',
			span: 12,
			value: 'system',
			component: {
				name: 'el-select',
				options: typeDict
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
			prop: 'title',
			label: '标题模板',
			span: 24,
			required: true,
			component: {
				name: 'el-input',
				placeholder: '支持 {nickname} 等占位',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'content',
			label: '内容模板',
			span: 24,
			required: true,
			component: {
				name: 'el-input',
				type: 'textarea',
				props: { rows: 5 }
			}
		}
	]
});
</script>
