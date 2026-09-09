<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />

			<!-- 按民宿筛选 -->
			<el-select
				v-model="hotelId"
				filterable
				clearable
				placeholder="全部民宿"
				style="width: 200px; margin-left: 10px"
				@change="onHotelChange"
			>
				<el-option
					v-for="hotel in hotelOptions"
					:key="hotel.id"
					:label="hotel.name"
					:value="hotel.id"
				/>
			</el-select>

			<cl-flex1 />
			<cl-search-key placeholder="搜索房型名称" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<template #column-status="{ scope }">
					<el-tag :type="scope.row.status == 1 ? 'success' : 'danger'" size="small">
						{{ scope.row.status == 1 ? '正常' : '停用' }}
					</el-tag>
				</template>
			</cl-table>
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
	name: 'accommodation-room-type'
});

import { ref } from 'vue';
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { Plugins } from '/#/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 民宿下拉数据
const hotelOptions = ref<any[]>([]);
const hotelId = ref<number | undefined>(undefined);

// 加载民宿（供筛选 + upsert 选择所属民宿）
async function loadHotels() {
	const res = (await service.accommodation.hotel.list()) || [];
	hotelOptions.value = res;
}

// 切换民宿筛选
function onHotelChange(val?: number | string) {
	// el-select 清空时可能返回空串，统一转为 undefined
	const id = val === '' || val == null ? undefined : Number(val);
	Crud.value?.refresh({
		page: 1,
		hotelId: id
	});
}

// 床型建议
const bedTypeOptions = [
	{ label: '大床房', value: '大床房' },
	{ label: '双床房', value: '双床房' },
	{ label: '榻榻米', value: '榻榻米' },
	{ label: '亲子房', value: '亲子房' },
	{ label: '主题房', value: '主题房' },
	{ label: '套房', value: '套房' }
];

// 设施建议
const facilityOptions = [
	{ label: 'WiFi', value: 'WiFi' },
	{ label: '空调', value: '空调' },
	{ label: '投影仪', value: '投影仪' },
	{ label: '浴缸', value: '浴缸' },
	{ label: '智能马桶', value: '智能马桶' },
	{ label: '冰箱', value: '冰箱' },
	{ label: '洗衣机', value: '洗衣机' }
];

// cl-crud
const Crud = useCrud({ service: service.accommodation.roomType }, app => {
	app.refresh();
});

// 异步加载民宿下拉（失败不影响列表刷新）
loadHotels().catch(() => undefined);

// cl-table
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'hotelId',
			label: '民宿ID',
			width: 90,
			align: 'center'
		},
		{
			prop: 'name',
			label: '房型名称',
			minWidth: 150,
			showOverflowTooltip: true
		},
		{
			prop: 'bedType',
			label: '床型',
			minWidth: 100
		},
		{
			prop: 'area',
			label: '面积(㎡)',
			width: 100,
			align: 'center'
		},
		{
			prop: 'maxGuests',
			label: '入住人数',
			width: 100,
			align: 'center'
		},
		{
			prop: 'price',
			label: '价格(元)',
			minWidth: 100,
			align: 'center'
		},
		{
			prop: 'stock',
			label: '房间数',
			width: 90,
			align: 'center'
		},
		{
			prop: 'status',
			label: '状态',
			width: 90,
			align: 'center'
		},
		{
			prop: 'createTime',
			label: '创建时间',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 150,
			buttons: ['edit', 'delete']
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '680px'
	},
	props: {
		labelWidth: '110px'
	},

	items: [
		{
			prop: 'hotelId',
			label: '所属民宿',
			span: 12,
			required: true,
			component: {
				name: 'el-select',
				options: [],
				props: {
					filterable: true,
					placeholder: '请选择所属民宿'
				}
			}
		},
		{
			prop: 'status',
			label: '状态',
			value: 1,
			span: 12,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '正常', value: 1 },
					{ label: '停用', value: 0 }
				]
			}
		},
		{
			prop: 'name',
			label: '房型名称',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入房型名称'
				}
			}
		},
		{
			prop: 'bedType',
			label: '床型',
			span: 12,
			component: {
				name: 'el-select',
				options: bedTypeOptions,
				props: {
					filterable: true,
					allowCreate: true,
					defaultFirstOption: true,
					placeholder: '选择或输入床型'
				}
			}
		},
		{
			prop: 'area',
			label: '面积(㎡)',
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 1,
					precision: 1,
					controlsPosition: 'right',
					style: 'width: 100%'
				}
			}
		},
		{
			prop: 'maxGuests',
			label: '最多入住人数',
			value: 2,
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 1,
					controlsPosition: 'right',
					style: 'width: 100%'
				}
			}
		},
		{
			prop: 'price',
			label: '基础价格(元)',
			span: 12,
			required: true,
			component: {
				name: 'el-input-number',
				props: {
					min: 0,
					precision: 2,
					step: 50,
					controlsPosition: 'right',
					style: 'width: 100%'
				}
			}
		},
		{
			prop: 'stock',
			label: '房间数量',
			value: 1,
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 1,
					controlsPosition: 'right',
					style: 'width: 100%'
				}
			}
		},
		{
			prop: 'facilities',
			label: '设施列表',
			value: [],
			span: 24,
			component: {
				name: 'el-select',
				options: facilityOptions,
				props: {
					multiple: true,
					filterable: true,
					allowCreate: true,
					defaultFirstOption: true,
					reserveKeyword: true,
					placeholder: '选择或输入自定义设施'
				}
			}
		},
		{
			prop: 'images',
			label: '房型图片',
			value: [],
			span: 24,
			component: {
				name: 'cl-upload',
				props: {
					multiple: true,
					text: '上传房型图片'
				}
			}
		}
	],

	// 打开前，填充民宿下拉选项
	async onOpen() {
		if (!hotelOptions.value.length) {
			await loadHotels();
		}
		Upsert.value?.setOptions(
			'hotelId',
			hotelOptions.value.map(h => ({
				label: h.name,
				value: h.id
			}))
		);
	},

	// 数据回填，兼容历史脏数据
	onOpened(data: any) {
		if (!data) return;
		['facilities', 'images'].forEach(key => {
			if (!Array.isArray(data[key])) {
				data[key] = data[key]
					? String(data[key])
							.split(/[,，]/)
							.map((v: string) => v.trim())
							.filter(Boolean)
					: [];
			}
		});
	},

	onSubmit(data: any, { next }: any) {
		const arr = (val?: any[]) =>
			(val || [])
				.map((v: any) => String(v).trim())
				.filter(Boolean);
		next({
			...data,
			facilities: arr(data.facilities),
			images: arr(data.images)
		});
	},

	plugins: [Plugins.Form.setFocus('name')]
});
</script>
