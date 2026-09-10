<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索行程描述" />
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
	name: 'travel-itinerary'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

const Crud = useCrud({ service: service.travel.itinerary }, app => {
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
			prop: 'routeId',
			label: '路线ID',
			width: 90,
			align: 'center'
		},
		{
			prop: 'day',
			label: '第几天',
			width: 80,
			align: 'center'
		},
		{
			prop: 'sort',
			label: '当天顺序',
			width: 90,
			align: 'center'
		},
		{
			prop: 'scenicId',
			label: '景区ID（站点）',
			width: 120,
			align: 'center'
		},
		{
			prop: 'description',
			label: '行程描述',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'meal',
			label: '餐饮安排',
			minWidth: 140,
			showOverflowTooltip: true
		},
		{
			prop: 'stay',
			label: '住宿安排',
			minWidth: 140,
			showOverflowTooltip: true
		},
		{
			prop: 'traffic',
			label: '交通方式',
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
			prop: 'routeId',
			label: '路线ID',
			span: 8,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
			}
		},
		{
			prop: 'day',
			label: '第几天',
			span: 8,
			value: 1,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
			}
		},
		{
			prop: 'sort',
			label: '当天顺序',
			span: 8,
			value: 1,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
			}
		},
		{
			prop: 'scenicId',
			label: '景区ID（站点）',
			span: 12,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 1, 'controls-position': 'right' }
			}
		},
		{
			prop: 'traffic',
			label: '交通方式',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 100 }
			}
		},
		{
			prop: 'description',
			label: '行程描述',
			span: 24,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'meal',
			label: '餐饮安排',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		},
		{
			prop: 'stay',
			label: '住宿安排',
			span: 12,
			component: {
				name: 'el-input',
				props: { maxlength: 200 }
			}
		}
	]
});
</script>
