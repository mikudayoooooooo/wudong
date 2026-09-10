<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<!-- 新增即群发：用户ID留空为全员广播 -->
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索消息标题" />
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
	name: 'message-message'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 消息类型
const typeDict = [
	{ label: '订单', value: 'order' },
	{ label: '系统', value: 'system', type: 'warning' },
	{ label: '活动', value: 'activity', type: 'success' },
	{ label: '互动', value: 'interact' }
];

// 已读状态
const readDict = [
	{ label: '已读', value: 1, type: 'info' },
	{ label: '未读', value: 0, type: 'danger' }
];

// cl-crud
const Crud = useCrud({ service: service.message.message }, app => {
	app.refresh();
});

// cl-table
const Table = useTable({
	contextMenu: ['refresh'],

	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'type',
			label: '类型',
			width: 90,
			align: 'center',
			dict: typeDict,
			dictColor: true
		},
		{
			prop: 'title',
			label: '标题',
			minWidth: 160,
			showOverflowTooltip: true
		},
		{
			prop: 'content',
			label: '内容',
			minWidth: 220,
			showOverflowTooltip: true
		},
		{
			prop: 'userId',
			label: '接收用户',
			width: 100,
			align: 'center',
			template: (row: any) => {
				return row.userId ? `用户${row.userId}` : '全员广播';
			}
		},
		{
			prop: 'isRead',
			label: '已读',
			width: 80,
			align: 'center',
			dict: readDict
		},
		{
			prop: 'createTime',
			label: '发送时间',
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

// cl-upsert
const Upsert = useUpsert<Eps.SystemMessageEntity>({
	dialog: {
		width: '640px'
	},

	items: [
		{
			prop: 'type',
			label: '消息类型',
			value: 'system',
			span: 12,
			required: true,
			component: {
				name: 'el-select',
				options: typeDict
			}
		},
		{
			prop: 'userId',
			label: '接收用户ID',
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 1,
					'controls-position': 'right',
					placeholder: '留空为全员广播'
				}
			},
			helper: '留空即全员广播，填用户ID则为定向消息'
		},
		{
			prop: 'title',
			label: '标题',
			span: 24,
			required: true,
			component: {
				name: 'el-input',
				props: {
					maxlength: 200
				}
			}
		},
		{
			prop: 'content',
			label: '内容',
			span: 24,
			required: true,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 4
				}
			}
		}
	]
});
</script>
