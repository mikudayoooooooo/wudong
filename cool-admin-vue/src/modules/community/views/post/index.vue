<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索游记标题" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 审核弹窗 -->
		<el-dialog v-model="audit.visible" title="游记审核" width="520px">
			<el-form label-width="90px">
				<el-form-item label="标题">
					<el-text>{{ audit.row?.title }}</el-text>
				</el-form-item>
				<el-form-item label="审核结果">
					<el-radio-group v-model="audit.pass">
						<el-radio-button :value="true">通过</el-radio-button>
						<el-radio-button :value="false">下架</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核意见">
					<el-input
						v-model="audit.reason"
						type="textarea"
						:rows="3"
						maxlength="200"
						:placeholder="audit.pass ? '选填' : '下架必填，告知违规原因'"
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
	name: 'community-post'
});

import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 帖子状态
const statusDict = [
	{ label: '审核中', value: 'pending', type: 'warning' },
	{ label: '正常', value: 'normal', type: 'success' },
	{ label: '已下架', value: 'offline', type: 'danger' }
];

// cl-crud（游记管理：审核 + 删除，审核走 /audit 自定义接口）
const Crud = useCrud({ service: service.community.post }, app => {
	app.refresh();
});

// 审核弹窗状态
const audit = reactive({
	visible: false,
	loading: false,
	row: null as any,
	pass: true,
	reason: ''
});

function openAudit(row: any) {
	audit.row = row;
	audit.pass = true;
	audit.reason = '';
	audit.visible = true;
}

async function submit() {
	if (!audit.pass && !audit.reason) {
		ElMessage.warning('下架时请填写审核意见');
		return;
	}
	audit.loading = true;
	try {
		await service.request({
			url: '/admin/community/post/audit',
			method: 'POST',
			data: {
				id: audit.row?.id,
				pass: audit.pass,
				reason: audit.reason
			}
		});
		ElMessage.success(audit.pass ? '已通过' : '已下架');
		audit.visible = false;
		Crud.value?.refresh();
	} catch (err: any) {
		ElMessage.error(err.message || '审核失败');
	} finally {
		audit.loading = false;
	}
}

const Table = useTable({
	contextMenu: ['refresh'],

	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'title',
			label: '标题',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'userId',
			label: '作者ID',
			width: 80,
			align: 'center'
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
			prop: 'auditReason',
			label: '审核意见',
			minWidth: 160,
			showOverflowTooltip: true
		},
		{
			prop: 'viewCount',
			label: '浏览',
			width: 80,
			align: 'center'
		},
		{
			prop: 'likeCount',
			label: '点赞',
			width: 80,
			align: 'center'
		},
		{
			prop: 'commentCount',
			label: '评论',
			width: 80,
			align: 'center'
		},
		{
			prop: 'createTime',
			label: '发布时间',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 150,
			buttons: [
				{
					label: '审核',
					onClick: (row: any) => openAudit(row)
				},
				'delete'
			]
		}
	]
});
</script>
