<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索敏感词" />
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
	name: 'sensitive-word'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 状态
const statusDict = [
	{ label: '启用', value: 1, type: 'success' },
	{ label: '禁用', value: 0, type: 'danger' }
];

// cl-crud
const Crud = useCrud({ service: service.sensitive.word }, app => {
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
			prop: 'word',
			label: '敏感词',
			minWidth: 200
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
const Upsert = useUpsert<Eps.SensitiveWordEntity>({
	dialog: {
		width: '480px'
	},

	items: [
		{
			prop: 'word',
			label: '敏感词',
			span: 24,
			required: true,
			component: {
				name: 'el-input',
				props: {
					maxlength: 50
				}
			}
		},
		{
			prop: 'status',
			label: '状态',
			value: 1,
			span: 24,
			component: {
				name: 'el-radio-group',
				options: statusDict
			}
		}
	]
});
</script>
