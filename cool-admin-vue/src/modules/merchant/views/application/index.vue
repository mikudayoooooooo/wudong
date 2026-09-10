<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索店铺名称、联系电话" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 审核弹窗 -->
		<el-dialog v-model="audit.visible" title="入驻审核" width="520px">
			<el-form label-width="90px">
				<el-form-item label="店铺名称">
					<el-text>{{ audit.row?.shopName }}</el-text>
				</el-form-item>
				<el-form-item label="审核结果">
					<el-radio-group v-model="audit.pass">
						<el-radio-button :value="true">通过</el-radio-button>
						<el-radio-button :value="false">驳回</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核意见">
					<el-input
						v-model="audit.auditResult"
						type="textarea"
						:rows="3"
						maxlength="500"
						:placeholder="audit.pass ? '选填' : '驳回必填，告知材料问题'"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="audit.visible = false">取消</el-button>
				<el-button type="primary" :loading="audit.loading" @click="submit">
					提交
				</el-button>
			</template>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'merchant-application'
});

import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 所属模块
const moduleDict = [
	{ label: '衣-商品', value: 'product' },
	{ label: '食-餐饮', value: 'food' },
	{ label: '住-住宿', value: 'accommodation' },
	{ label: '行-旅游', value: 'travel' }
];

// 申请状态
const statusDict = [
	{ label: '待审核', value: 1, type: 'warning' },
	{ label: '已通过', value: 2, type: 'success' },
	{ label: '已驳回', value: 3, type: 'danger' }
];

// 审核弹窗状态
const audit = reactive({
	visible: false,
	loading: false,
	row: null as Eps.MerchantApplicationEntity | null,
	pass: true,
	auditResult: ''
});

function openAudit(row: Eps.MerchantApplicationEntity) {
	audit.row = row;
	audit.pass = true;
	audit.auditResult = '';
	audit.visible = true;
}

async function submit() {
	if (!audit.pass && !audit.auditResult) {
		ElMessage.warning('驳回时请填写审核意见');
		return;
	}
	audit.loading = true;
	try {
		await service.request({
			url: '/admin/merchantApplication/audit',
			method: 'POST',
			data: {
				id: audit.row?.id,
				pass: audit.pass,
				auditResult: audit.auditResult
			}
		});
		ElMessage.success(audit.pass ? '已通过' : '已驳回');
		audit.visible = false;
		Crud.value?.refresh();
	} catch (err: any) {
		ElMessage.error(err.message || '审核失败');
	} finally {
		audit.loading = false;
	}
}

// cl-crud
const Crud = useCrud({ service: service.merchantApplication }, app => {
	app.refresh();
});

// cl-table
const Table = useTable({
	contextMenu: ['refresh'],

	columns: [
		{
			prop: 'shopName',
			label: '店铺名称',
			minWidth: 150,
			showOverflowTooltip: true
		},
		{
			prop: 'module',
			label: '申请模块',
			width: 100,
			align: 'center',
			dict: moduleDict
		},
		{
			prop: 'contactName',
			label: '联系人',
			width: 100
		},
		{
			prop: 'contactPhone',
			label: '联系电话',
			width: 130
		},
		{
			prop: 'idCard',
			label: '身份证号',
			width: 170,
			showOverflowTooltip: true
		},
		{
			prop: 'idCardFront',
			label: '身份证正面',
			width: 100,
			component: {
				name: 'cl-image',
				props: {
					size: 50
				}
			}
		},
		{
			prop: 'businessLicense',
			label: '营业执照',
			width: 100,
			component: {
				name: 'cl-image',
				props: {
					size: 50
				}
			}
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
			prop: 'auditResult',
			label: '审核意见',
			minWidth: 140,
			showOverflowTooltip: true
		},
		{
			prop: 'createTime',
			label: '申请时间',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 120,
			buttons: [
				{
					label: '审核',
					hidden: ({ scope }) => scope.row.status !== 1,
					onClick: ({ row }) => openAudit(row)
				},
				'info'
			]
		}
	]
});
</script>
