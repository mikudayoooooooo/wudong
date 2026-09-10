<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索餐厅名称" />
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
			namespace: 'restaurant',
			method: 'POST',
			url: '/admin/food/restaurant/page'
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
			label: '餐厅名称',
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
			label: '地址',
			prop: 'address',
			minWidth: 200
		},
		{
			label: '联系电话',
			prop: 'phone',
			width: 120
		},
		{
			label: '人均消费',
			prop: 'avgPrice',
			width: 100
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
			label: '餐厅名称',
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
			label: '地址',
			prop: 'address',
			component: { name: 'el-input' },
			required: true
		},
		{
			label: '经度',
			prop: 'longitude',
			component: { name: 'el-input-number', props: { precision: 7 } },
			required: true
		},
		{
			label: '纬度',
			prop: 'latitude',
			component: { name: 'el-input-number', props: { precision: 7 } },
			required: true
		},
		{
			label: '联系电话',
			prop: 'phone',
			component: { name: 'el-input' },
			required: true
		},
		{
			label: '营业时间',
			prop: 'businessHours',
			component: { name: 'el-input', props: { placeholder: '例如：10:00-22:00' } }
		},
		{
			label: '人均消费',
			prop: 'avgPrice',
			component: { name: 'el-input-number', props: { min: 0, precision: 2 } }
		},
		{
			label: '特色菜品',
			prop: 'specialty',
			component: { name: 'el-input', props: { type: 'textarea', rows: 3 } }
		},
		{
			label: '餐厅介绍',
			prop: 'description',
			component: { name: 'el-input', props: { type: 'textarea', rows: 4 } }
		}
	]
});
</script>
