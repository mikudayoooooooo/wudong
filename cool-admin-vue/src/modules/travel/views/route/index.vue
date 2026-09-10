<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索路线标题" />
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
	name: 'travel-route'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 主题
const themeOptions = ['亲子', '摄影', '研学', '节庆', '经典'].map(s => ({
	label: s,
	value: s
}));

const Crud = useCrud({ service: service.travel.route }, app => {
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
			prop: 'title',
			label: '路线标题',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'theme',
			label: '主题',
			width: 90,
			align: 'center'
		},
		{
			prop: 'days',
			label: '天数',
			width: 70,
			align: 'center'
		},
		{
			prop: 'price',
			label: '价格',
			width: 100,
			align: 'center'
		},
		{
			prop: 'departure',
			label: '出发地',
			width: 110,
			showOverflowTooltip: true
		},
		{
			prop: 'destination',
			label: '目的地',
			width: 110,
			showOverflowTooltip: true
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
			prop: 'title',
			label: '路线标题',
			span: 24,
			required: true,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'theme',
			label: '主题',
			span: 12,
			component: {
				name: 'el-select',
				options: themeOptions,
				props: { clearable: true }
			}
		},
		{
			prop: 'days',
			label: '天数',
			span: 12,
			value: 1,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
			}
		},
		{
			prop: 'price',
			label: '价格',
			span: 12,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 0, precision: 2, 'controls-position': 'right' }
			}
		},
		{
			prop: 'departure',
			label: '出发地',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
			}
		},
		{
			prop: 'destination',
			label: '目的地',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
			}
		},
		{
			prop: 'stayStandard',
			label: '住宿标准',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'mealStandard',
			label: '餐饮标准',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'cover',
			label: '主图地址',
			span: 24,
			component: {
				name: 'el-input',
				props: { maxlength: 255 }
			}
		},
		{
			prop: 'notice',
			label: '预订须知',
			span: 24,
			component: {
				name: 'el-input',
				type: 'textarea',
				props: { rows: 3, maxlength: 500 }
			}
		},
		{
			prop: 'detail',
			label: '富文本详情',
			span: 24,
			component: {
				name: 'el-input',
				type: 'textarea',
				props: { rows: 5 }
			}
		}
	]
});
</script>
