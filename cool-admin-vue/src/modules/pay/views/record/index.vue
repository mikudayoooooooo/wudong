<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索支付流水号" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'pay-record'
});

import { ElMessage, ElMessageBox } from 'element-plus';
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 退款审批：仅已支付可退，默认全额
async function onRefund(row: any) {
	if (row.payStatus !== 2) {
		ElMessage.warning('仅已支付的流水可退款');
		return;
	}
	try {
		const { value } = await ElMessageBox.prompt(
			`订单 ${row.orderId}，支付金额 ¥${row.payAmount}`,
			'退款审批',
			{
				confirmButtonText: '确认退款',
				cancelButtonText: '取消',
				inputValue: String(row.payAmount ?? ''),
				inputPattern: /^\d+(\.\d{1,2})?$/,
				inputErrorMessage: '请输入正确的退款金额'
			}
		);
		await service.request({
			url: '/admin/pay/record/refund',
			method: 'POST',
			data: { id: row.id, amount: Number(value) }
		});
		ElMessage.success('退款成功');
		Crud.value?.refresh();
	} catch (err: any) {
		if (err === 'cancel' || err?.message === 'cancel') return;
		ElMessage.error(err.message || '退款失败');
	}
}

// 支付渠道
const channelDict = [
	{ label: '微信', value: 'wechat', type: 'success' },
	{ label: '支付宝', value: 'alipay' }
];

// 支付状态
const statusDict = [
	{ label: '待支付', value: 1, type: 'warning' },
	{ label: '已支付', value: 2, type: 'success' },
	{ label: '已退款', value: 3, type: 'danger' }
];

// cl-crud（支付流水只读：后端仅提供 page/list/info）
const Crud = useCrud({ service: service.pay.record }, app => {
	app.refresh();
});

// cl-table
const Table = useTable({
	contextMenu: ['refresh'],

	columns: [
		{
			prop: 'paymentNo',
			label: '支付流水号',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'orderId',
			label: '订单ID',
			width: 90,
			align: 'center'
		},
		{
			prop: 'merchantId',
			label: '商家ID',
			width: 80,
			align: 'center'
		},
		{
			prop: 'payChannel',
			label: '渠道',
			width: 90,
			align: 'center',
			dict: channelDict,
			dictColor: true
		},
		{
			prop: 'payAmount',
			label: '支付金额',
			width: 100,
			align: 'center'
		},
		{
			prop: 'payStatus',
			label: '状态',
			width: 90,
			align: 'center',
			dict: statusDict,
			dictColor: true
		},
		{
			prop: 'transactionId',
			label: '第三方交易号',
			minWidth: 160,
			showOverflowTooltip: true
		},
		{
			prop: 'payTime',
			label: '支付时间',
			minWidth: 165
		},
		{
			prop: 'refundAmount',
			label: '退款金额',
			width: 100,
			align: 'center'
		},
		{
			prop: 'refundTime',
			label: '退款时间',
			minWidth: 165
		},
		{
			prop: 'createTime',
			label: '创建时间',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 100,
			buttons: [
				{
					label: '退款',
					onClick: (row: any) => onRefund(row)
				}
			]
		}
	]
});
</script>
