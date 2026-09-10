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
			<cl-search-key placeholder="搜索标题、跳转地址" />
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
	name: 'operate-banner'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 跳转类型
const linkTypeDict = [
	{
		label: '无',
		value: 'none'
	},
	{
		label: '页面',
		value: 'page'
	},
	{
		label: '外链',
		value: 'url',
		type: 'warning'
	}
];

// 位置
const positionDict = [
	{
		label: '首页',
		value: 'home'
	},
	{
		label: '产品',
		value: 'product'
	},
	{
		label: '美食',
		value: 'food'
	},
	{
		label: '住宿',
		value: 'accommodation'
	}
];

// 状态
const statusDict = [
	{
		label: '启用',
		value: 1,
		type: 'success'
	},
	{
		label: '禁用',
		value: 0,
		type: 'danger'
	}
];

// cl-crud
const Crud = useCrud({ service: service.operate.banner }, app => {
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
			minWidth: 160
		},
		{
			prop: 'image',
			label: '图片',
			width: 100,
			component: {
				name: 'cl-image',
				props: {
					size: 60
				}
			}
		},
		{
			prop: 'linkType',
			label: '跳转类型',
			width: 100,
			dict: linkTypeDict,
			dictColor: true
		},
		{
			prop: 'linkValue',
			label: '跳转地址',
			minWidth: 150,
			showOverflowTooltip: true
		},
		{
			prop: 'position',
			label: '位置',
			width: 100,
			dict: positionDict
		},
		{
			prop: 'sort',
			label: '排序',
			width: 80,
			align: 'center'
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
const Upsert = useUpsert<Eps.BannerEntity>({
	dialog: {
		width: '760px'
	},

	items: [
		{
			prop: 'title',
			label: '标题',
			span: 16,
			required: true,
			component: {
				name: 'el-input',
				props: {
					maxlength: 100
				}
			}
		},
		{
			prop: 'sort',
			label: '排序',
			value: 0,
			span: 8,
			component: {
				name: 'el-input-number',
				props: {
					min: 0,
					max: 9999,
					'controls-position': 'right'
				}
			}
		},
		{
			prop: 'image',
			label: '图片',
			span: 12,
			required: true,
			component: {
				name: 'cl-upload',
				props: {
					text: '选择图片'
				}
			}
		},
		{
			prop: 'linkType',
			label: '跳转类型',
			value: 'none',
			span: 12,
			component: {
				name: 'el-radio-group',
				options: linkTypeDict
			}
		},
		{
			prop: 'linkValue',
			label: '跳转地址',
			span: 24,
			hidden: ({ scope }) => scope.linkType == 'none',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入跳转地址'
				}
			}
		},
		{
			prop: 'position',
			label: '位置',
			value: 'home',
			span: 12,
			component: {
				name: 'el-select',
				options: positionDict
			}
		},
		{
			prop: 'status',
			label: '状态',
			value: 1,
			span: 12,
			component: {
				name: 'el-radio-group',
				options: statusDict
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
		}
	]
});
</script>
