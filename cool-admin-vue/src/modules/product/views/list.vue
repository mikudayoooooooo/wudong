<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索商品名称" />
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
const Crud = useCrud(
	{
		service: service.request({
			namespace: 'product',
			method: 'POST',
			url: '/admin/product/page'
		})
	},
	(app) => {
		app.refresh();
	}
);

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
			label: '商品名称',
			prop: 'name',
			minWidth: 150
		},
		{
			label: '封面图',
			prop: 'coverImage',
			component: {
				name: 'cl-image',
				props: {
					size: 60
				}
			}
		},
		{
			label: '价格',
			prop: 'price',
			width: 100
		},
		{
			label: '库存',
			prop: 'stock',
			width: 80
		},
		{
			label: '销量',
			prop: 'sales',
			width: 80
		},
		{
			label: '状态',
			prop: 'status',
			width: 100,
			dict: [
				{ label: '下架', value: 0, type: 'danger' },
				{ label: '上架', value: 1, type: 'success' }
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
			label: '分类ID',
			prop: 'categoryId',
			component: { name: 'el-input-number' },
			required: true
		},
		{
			label: '商品名称',
			prop: 'name',
			component: { name: 'el-input' },
			required: true
		},
		{
			label: '封面图',
			prop: 'coverImage',
			component: { name: 'cl-upload', props: { text: '上传封面' } },
			required: true
		},
		{
			label: '价格',
			prop: 'price',
			component: { name: 'el-input-number', props: { min: 0, precision: 2 } },
			required: true
		},
		{
			label: '库存',
			prop: 'stock',
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{
			label: '工艺介绍',
			prop: 'craftIntro',
			component: { name: 'el-input', props: { type: 'textarea', rows: 4 } }
		},
		{
			label: '传承人ID',
			prop: 'inheritorId',
			component: { name: 'el-input-number' }
		},
		{
			label: '商品详情',
			prop: 'description',
			component: { name: 'el-input', props: { type: 'textarea', rows: 6 } }
		},
		{
			label: '状态',
			prop: 'status',
			value: 0,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '下架', value: 0 },
					{ label: '上架', value: 1 }
				]
			}
		}
	]
});
</script>
