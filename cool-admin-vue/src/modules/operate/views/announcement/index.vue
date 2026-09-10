<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新 -->
			<cl-refresh-btn />
			<!-- 新增 -->
			<cl-add-btn />
			<!-- 批量删除 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索标题" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'operate-announcement'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 类型
const typeDict = [
	{
		label: '系统公告',
		value: 1,
		type: 'primary'
	},
	{
		label: '活动公告',
		value: 2,
		type: 'warning'
	}
];

// 是否置顶
const isTopDict = [
	{
		label: '是',
		value: 1,
		type: 'danger'
	},
	{
		label: '否',
		value: 0,
		type: 'info'
	}
];

// 状态
const statusDict = [
	{
		label: '发布',
		value: 1,
		type: 'success'
	},
	{
		label: '草稿',
		value: 0,
		type: 'info'
	}
];

// cl-crud
const Crud = useCrud({ service: service.operate.announcement }, app => {
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
			prop: 'title',
			label: '标题',
			minWidth: 180
		},
		{
			prop: 'content',
			label: '内容',
			minWidth: 260,
			showOverflowTooltip: true
		},
		{
			prop: 'type',
			label: '类型',
			width: 100,
			align: 'center',
			dict: typeDict,
			dictColor: true
		},
		{
			prop: 'isTop',
			label: '是否置顶',
			width: 100,
			align: 'center',
			dict: isTopDict
		},
		{
			prop: 'startTime',
			label: '生效开始时间',
			minWidth: 165
		},
		{
			prop: 'endTime',
			label: '生效结束时间',
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

// cl-upsert
const Upsert = useUpsert<Eps.AnnouncementEntity>({
	dialog: {
		width: '800px'
	},

	items: [
		{
			prop: 'title',
			label: '标题',
			span: 24,
			required: true,
			component: {
				name: 'el-input',
				props: {
					maxlength: 100,
					placeholder: '请输入公告标题'
				}
			}
		},
		{
			prop: 'type',
			label: '类型',
			value: 1,
			span: 12,
			required: true,
			component: {
				name: 'el-radio-group',
				options: typeDict
			}
		},
		{
			prop: 'isTop',
			label: '是否置顶',
			value: 0,
			span: 12,
			component: {
				name: 'el-radio-group',
				options: isTopDict
			}
		},
		{
			prop: 'startTime',
			label: '生效开始时间',
			span: 12,
			component: {
				name: 'el-date-picker',
				props: {
					type: 'datetime',
					valueFormat: 'YYYY-MM-DD HH:mm:ss',
					placeholder: '请选择开始时间'
				}
			}
		},
		{
			prop: 'endTime',
			label: '生效结束时间',
			span: 12,
			component: {
				name: 'el-date-picker',
				props: {
					type: 'datetime',
					valueFormat: 'YYYY-MM-DD HH:mm:ss',
					placeholder: '请选择结束时间'
				}
			}
		},
		{
			prop: 'status',
			label: '状态',
			value: 0,
			span: 24,
			component: {
				name: 'el-radio-group',
				options: statusDict
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
					rows: 8,
					placeholder: '请输入公告内容'
				}
			}
		}
	]
});
</script>
