<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索昵称、手机号" />
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
	name: 'member-user'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 性别
const genderDict = [
	{ label: '未知', value: 0 },
	{ label: '男', value: 1 },
	{ label: '女', value: 2 }
];

// 状态
const statusDict = [
	{ label: '禁用', value: 0, type: 'danger' },
	{ label: '正常', value: 1, type: 'success' }
];

// 角色
const roleDict = [
	{ label: '游客', value: 1 },
	{ label: '商家', value: 2, type: 'warning' }
];

// cl-crud（C端用户管理：封禁/解禁走编辑状态，后端无 add）
const Crud = useCrud({ service: service.member.user }, app => {
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
			prop: 'nickname',
			label: '昵称',
			minWidth: 140,
			showOverflowTooltip: true
		},
		{
			prop: 'phone',
			label: '手机号',
			width: 130
		},
		{
			prop: 'gender',
			label: '性别',
			width: 80,
			align: 'center',
			dict: genderDict
		},
		{
			prop: 'role',
			label: '角色',
			width: 90,
			align: 'center',
			dict: roleDict,
			dictColor: true
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
			prop: 'intro',
			label: '个人简介',
			minWidth: 180,
			showOverflowTooltip: true
		},
		{
			prop: 'lastLoginTime',
			label: '最后登录',
			minWidth: 165
		},
		{
			prop: 'createTime',
			label: '注册时间',
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

// 编辑仅用于资料修正与封禁/解禁（后端无 add）
const Upsert = useUpsert({
	items: [
		{
			prop: 'nickname',
			label: '昵称',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 50 }
			}
		},
		{
			prop: 'phone',
			label: '手机号',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 11, disabled: true }
			}
		},
		{
			prop: 'gender',
			label: '性别',
			span: 12,
			component: {
				name: 'el-select',
				options: genderDict
			}
		},
		{
			prop: 'role',
			label: '角色',
			span: 12,
			component: {
				name: 'el-select',
				options: roleDict
			}
		},
		{
			prop: 'status',
			label: '状态（封禁）',
			span: 12,
			component: {
				name: 'el-select',
				options: statusDict
			}
		},
		{
			prop: 'intro',
			label: '个人简介',
			span: 24,
			component: {
				name: 'el-input',
				type: 'textarea',
				props: { rows: 2, maxlength: 200 }
			}
		}
	]
});
</script>
