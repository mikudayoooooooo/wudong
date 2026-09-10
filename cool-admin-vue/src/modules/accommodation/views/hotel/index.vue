<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索民宿名称、地址" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<template #column-styleTags="{ scope }">
					<el-tag
						v-for="(tag, i) in scope.row.styleTags || []"
						:key="i"
						size="small"
						style="margin-right: 4px; margin-bottom: 2px"
						>{{ tag }}</el-tag
					>
					<span v-if="!(scope.row.styleTags || []).length" class="text-muted">-</span>
				</template>

				<template #column-facilityTags="{ scope }">
					<el-tag
						v-for="(tag, i) in scope.row.facilityTags || []"
						:key="i"
						size="small"
						type="info"
						style="margin-right: 4px; margin-bottom: 2px"
						>{{ tag }}</el-tag
					>
					<span v-if="!(scope.row.facilityTags || []).length" class="text-muted">-</span>
				</template>

				<template #column-hasBreakfast="{ scope }">
					<el-tag :type="scope.row.hasBreakfast == 1 ? 'warning' : 'info'" size="small">
						{{ scope.row.hasBreakfast == 1 ? '含早' : '不含早' }}
					</el-tag>
				</template>

				<template #column-status="{ scope }">
					<el-tag :type="scope.row.status == 1 ? 'success' : 'danger'" size="small">
						{{ scope.row.status == 1 ? '正常' : '下架' }}
					</el-tag>
				</template>

				<template #column-rating="{ scope }">
					<span class="rating">⭐ {{ scope.row.rating }}</span>
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
	name: 'accommodation-hotel'
});

import { reactive } from 'vue';
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { Plugins } from '/#/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 标签建议
const options = reactive({
	styleTags: [
		{ label: '亲子', value: '亲子' },
		{ label: '情侣', value: '情侣' },
		{ label: '网红打卡', value: '网红打卡' },
		{ label: '海景', value: '海景' },
		{ label: '山景', value: '山景' },
		{ label: '安静', value: '安静' },
		{ label: '设计感', value: '设计感' },
		{ label: '团建', value: '团建' }
	],
	facilityTags: [
		{ label: 'WiFi', value: 'WiFi' },
		{ label: '停车场', value: '停车场' },
		{ label: '空调', value: '空调' },
		{ label: '厨房', value: '厨房' },
		{ label: '洗衣机', value: '洗衣机' },
		{ label: '游泳池', value: '游泳池' },
		{ label: '健身房', value: '健身房' },
		{ label: '投影仪', value: '投影仪' },
		{ label: '宠物友好', value: '宠物友好' }
	]
});

// cl-crud
const Crud = useCrud({ service: service.accommodation.hotel }, app => {
	app.refresh();
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'mainImage',
			label: '主图',
			width: 90,
			component: {
				name: 'cl-image',
				props: {
					size: 56,
					radius: 6
				}
			}
		},
		{
			prop: 'name',
			label: '民宿名称',
			minWidth: 150,
			showOverflowTooltip: true
		},
		{
			prop: 'address',
			label: '地址',
			minWidth: 190,
			showOverflowTooltip: true
		},
		{
			prop: 'styleTags',
			label: '风格标签',
			minWidth: 140
		},
		{
			prop: 'facilityTags',
			label: '设施标签',
			minWidth: 150
		},
		{
			prop: 'rating',
			label: '评分',
			width: 90,
			align: 'center'
		},
		{
			prop: 'hasBreakfast',
			label: '含早餐',
			width: 100,
			align: 'center'
		},
		{
			prop: 'status',
			label: '状态',
			width: 90,
			align: 'center'
		},
		{
			prop: 'merchantId',
			label: '商家ID',
			minWidth: 90
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
		width: '820px'
	},
	props: {
		labelWidth: '110px'
	},

	items: [
		{
			prop: 'name',
			label: '民宿名称',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入民宿名称'
				}
			}
		},
		{
			prop: 'merchantId',
			label: '商家ID',
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
			prop: 'status',
			label: '状态',
			value: 1,
			span: 12,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '正常', value: 1 },
					{ label: '下架', value: 0 }
				]
			}
		},
		{
			prop: 'hasBreakfast',
			label: '含早餐',
			value: 0,
			span: 12,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '不含早', value: 0 },
					{ label: '含早', value: 1 }
				]
			}
		},
		{
			prop: 'address',
			label: '地址',
			span: 24,
			required: true,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入详细地址'
				}
			}
		},
		{
			prop: 'longitude',
			label: '经度',
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: -180,
					max: 180,
					precision: 6,
					step: 0.000001,
					controlsPosition: 'right',
					style: 'width: 100%'
				}
			}
		},
		{
			prop: 'latitude',
			label: '纬度',
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: -90,
					max: 90,
					precision: 6,
					step: 0.000001,
					controlsPosition: 'right',
					style: 'width: 100%'
				}
			}
		},
		{
			prop: 'mainImage',
			label: '主图',
			span: 24,
			component: {
				name: 'cl-upload',
				props: {
					text: '上传主图',
					tip: '建议尺寸 800*600'
				}
			}
		},
		{
			prop: 'images',
			label: '图片集',
			value: [],
			span: 24,
			component: {
				name: 'cl-upload',
				props: {
					multiple: true,
					text: '上传更多图片'
				}
			}
		},
		{
			prop: 'styleTags',
			label: '风格标签',
			value: [],
			span: 12,
			component: {
				name: 'el-select',
				options: options.styleTags,
				props: {
					multiple: true,
					filterable: true,
					allowCreate: true,
					defaultFirstOption: true,
					reserveKeyword: true,
					placeholder: '选择或输入自定义标签'
				}
			}
		},
		{
			prop: 'facilityTags',
			label: '设施标签',
			value: [],
			span: 12,
			component: {
				name: 'el-select',
				options: options.facilityTags,
				props: {
					multiple: true,
					filterable: true,
					allowCreate: true,
					defaultFirstOption: true,
					reserveKeyword: true,
					placeholder: '选择或输入自定义标签'
				}
			}
		},
		{
			prop: 'intro',
			label: '民宿介绍',
			span: 24,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3,
					placeholder: '请输入民宿介绍'
				}
			}
		},
		{
			prop: 'checkInTime',
			label: '入住时间',
			value: '14:00',
			span: 12,
			component: {
				name: 'el-time-picker',
				props: {
					format: 'HH:mm',
					valueFormat: 'HH:mm',
					placeholder: '选择入住时间'
				}
			}
		},
		{
			prop: 'checkOutTime',
			label: '离店时间',
			value: '12:00',
			span: 12,
			component: {
				name: 'el-time-picker',
				props: {
					format: 'HH:mm',
					valueFormat: 'HH:mm',
					placeholder: '选择离店时间'
				}
			}
		},
		{
			prop: 'petPolicy',
			label: '宠物政策',
			span: 12,
			component: {
				name: 'el-input',
				props: {
					placeholder: '如：允许小型犬、需加收清洁费'
				}
			}
		},
		{
			prop: 'deposit',
			label: '押金(元)',
			value: 0,
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 0,
					precision: 2,
					step: 100,
					controlsPosition: 'right',
					style: 'width: 100%'
				}
			}
		},
		{
			prop: 'rating',
			label: '评分',
			value: 5,
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 0,
					max: 5,
					precision: 1,
					step: 0.1,
					controlsPosition: 'right',
					style: 'width: 100%'
				}
			}
		},
		{
			prop: 'reviewCount',
			label: '评价数',
			value: 0,
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 0,
					controlsPosition: 'right',
					style: 'width: 100%'
				}
			}
		}
	],

	// 打开后数据回填，兼容历史脏数据（字符串标签）
	onOpened(data: any) {
		if (!data) return;
		['styleTags', 'facilityTags', 'images'].forEach(key => {
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
		const tags = (arr?: any[]) =>
			(arr || [])
				.map((v: any) => String(v).trim())
				.filter(Boolean);
		next({
			...data,
			styleTags: tags(data.styleTags),
			facilityTags: tags(data.facilityTags),
			images: tags(data.images)
		});
	},

	plugins: [Plugins.Form.setFocus('name')]
});
</script>

<style lang="scss" scoped>
.text-muted {
	color: #a0a0a0;
}

.rating {
	color: #e6a23c;
	font-weight: 600;
}
</style>
