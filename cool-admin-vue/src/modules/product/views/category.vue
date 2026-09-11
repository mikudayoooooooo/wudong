<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索分类名称" />
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
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// CRUD 配置
const Crud = useCrud({ service: service.product.category }, (app) => {
	app.refresh();
});

// 表格配置
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{
			label: 'ID',
			prop: 'id',
			width: 80
		},
		{
			label: '分类名称',
			prop: 'name',
			minWidth: 150
		},
		{
			label: '父分类ID',
			prop: 'parentId',
			width: 100
		},
		{
			label: '图标',
			prop: 'icon',
			component: {
				name: 'cl-image',
				props: {
					size: 40
				}
			}
		},
		{
			label: '排序',
			prop: 'sort',
			width: 80
		},
		{
			label: '状态',
			prop: 'status',
			width: 100,
			dict: [
				{ label: '禁用', value: 0, type: 'danger' },
				{ label: '正常', value: 1, type: 'success' }
			]
		},
		{
			label: '创建时间',
			prop: 'createTime',
			width: 160
		},
		{ type: 'op', buttons: ['edit', 'delete'], width: 150 }
	]
});

// 新增/编辑配置
const Upsert = useUpsert({
	items: [
		{
			label: '分类名称',
			prop: 'name',
			component: { name: 'el-input' },
			required: true
		},
		{
			label: '父分类ID',
			prop: 'parentId',
			value: 0,
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{
			label: '分类图标',
			prop: 'icon',
			component: { name: 'cl-upload', props: { text: '上传图标' } }
		},
		{
			label: '排序',
			prop: 'sort',
			value: 0,
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{
			label: '状态',
			prop: 'status',
			value: 1,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '禁用', value: 0 },
					{ label: '正常', value: 1 }
				]
			}
		}
	]
});
</script>
