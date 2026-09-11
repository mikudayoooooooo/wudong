<template>
	<el-scrollbar>
		<div class="demo-home">
			<el-row :gutter="10">
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<div class="card__header">
							<span class="label">有效订单数</span>
							<span class="icon">🧾</span>
						</div>
						<div class="card__container">
							<span class="num">{{ stats.orderTotal }}</span>
						</div>
						<div class="card__footer">
							<span class="label">今日新增</span>
							<span>{{ stats.orderToday }}</span>
						</div>
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<div class="card__header">
							<span class="label">今日订单</span>
							<span class="icon">📅</span>
						</div>
						<div class="card__container">
							<span class="num">{{ stats.orderToday }}</span>
						</div>
						<div class="card__footer">
							<span class="label">数据口径</span>
							<span>已支付+已完成</span>
						</div>
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<div class="card__header">
							<span class="label">总销售额 (元)</span>
							<span class="icon">💰</span>
						</div>
						<div class="card__container">
							<span class="num">{{ fmtMoney(stats.salesTotal) }}</span>
						</div>
						<div class="card__footer">
							<span class="label">实付金额</span>
							<span>实时聚合</span>
						</div>
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<div class="card__header">
							<span class="label">今日销售额 (元)</span>
							<span class="icon">⚡</span>
						</div>
						<div class="card__container">
							<span class="num">{{ fmtMoney(stats.salesToday) }}</span>
						</div>
						<div class="card__footer">
							<span class="label">更新方式</span>
							<el-link type="primary" :underline="false" @click="refresh">刷新</el-link>
						</div>
					</div>
				</el-col>
			</el-row>

			<el-row :gutter="10">
				<el-col :lg="24" :xs="24">
					<div class="card">
						<div class="card__header">
							<span class="label">近 7 日趋势</span>
						</div>
						<div class="chart-box">
							<v-chart v-if="stats.trend.length" :option="trendOption" autoresize />
							<el-empty v-else-if="!stats.loading" description="暂无订单数据" :image-size="60" />
						</div>
					</div>
				</el-col>
			</el-row>

			<el-row :gutter="10">
				<el-col :lg="14" :sm="24">
					<div class="card">
						<div class="card__header">
							<span class="label">热门排行</span>
							<span class="sub">按有效订单数 Top5</span>
						</div>
						<div class="table-box">
							<el-table :data="stats.hot" size="small">
								<el-table-column type="index" label="排名" width="70" align="center" />
								<el-table-column prop="name" label="项目名称" min-width="180" show-overflow-tooltip />
								<el-table-column prop="orderCount" label="订单数" width="100" align="center" />
							</el-table>
						</div>
					</div>
				</el-col>
				<el-col :lg="10" :sm="24">
					<div class="card">
						<div class="card__header">
							<span class="label">品类占比</span>
						</div>
						<div class="chart-box">
							<v-chart v-if="ratioData.length" :option="ratioOption" autoresize />
							<el-empty v-else-if="!stats.loading" description="暂无订单数据" :image-size="60" />
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</el-scrollbar>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'home'
});

import { computed, onMounted, reactive } from 'vue';
import dayjs from 'dayjs';
import { request } from '/@/cool/service/request';
import { config } from '/@/config';
import { useDark } from '@vueuse/core';

// 品类字典（order.module）
const moduleDict: Record<string, string> = {
	product: '商品',
	food: '餐饮',
	accommodation: '住宿',
	travel: '门票·路线'
};

const stats = reactive<{
	loading: boolean;
	orderTotal: number;
	orderToday: number;
	salesTotal: number;
	salesToday: number;
	trend: { date: string; orderCount: number; salesAmount: number }[];
	hot: { name: string; orderCount: number }[];
	moduleRatio: { module: string; orderCount: number }[];
}>({
	loading: true,
	orderTotal: 0,
	orderToday: 0,
	salesTotal: 0,
	salesToday: 0,
	trend: [],
	hot: [],
	moduleRatio: []
});

const isDark = useDark();

async function refresh() {
	stats.loading = true;
	try {
		// 真实聚合接口（order 模块，商家账号自动只统计本商家）；裸请求需手动拼 baseUrl（prod=/api）
		const data: any = await request({
			url: `${config.baseUrl}/admin/order/stats`,
			method: 'get'
		});
		Object.assign(stats, {
			orderTotal: data?.orderTotal ?? 0,
			orderToday: data?.orderToday ?? 0,
			salesTotal: data?.salesTotal ?? 0,
			salesToday: data?.salesToday ?? 0,
			trend: data?.trend ?? [],
			hot: data?.hot ?? [],
			moduleRatio: data?.moduleRatio ?? []
		});
	} catch (e: any) {
		console.error('看板统计加载失败', e?.message);
	} finally {
		stats.loading = false;
	}
}

onMounted(refresh);

function fmtMoney(v: number): string {
	return Number(v || 0).toLocaleString('zh-CN', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}

const axisColor = computed(() => (isDark.value ? '#6e6e6e' : '#c7c7c7'));

const trendOption = computed(() => ({
	grid: { containLabel: true, left: '5%', right: '5%', top: 40 },
	tooltip: { trigger: 'axis' },
	legend: { data: ['销售额(元)', '订单数'], top: 0 },
	xAxis: {
		type: 'category',
		data: stats.trend.map(e => dayjs(e.date).format('MM-DD')),
		axisLine: { lineStyle: { color: axisColor.value } }
	},
	yAxis: [
		{ type: 'value', name: '销售额', axisLine: { lineStyle: { color: axisColor.value } } },
		{ type: 'value', name: '订单数', axisLine: { lineStyle: { color: axisColor.value } } }
	],
	series: [
		{
			name: '销售额(元)',
			type: 'bar',
			barMaxWidth: 30,
			data: stats.trend.map(e => e.salesAmount),
			itemStyle: { borderRadius: [4, 4, 0, 0] }
		},
		{
			name: '订单数',
			type: 'line',
			yAxisIndex: 1,
			smooth: true,
			data: stats.trend.map(e => e.orderCount)
		}
	]
}));

const ratioData = computed(() =>
	stats.moduleRatio.map(e => ({
		name: moduleDict[e.module] || e.module,
		value: e.orderCount
	}))
);

const ratioOption = computed(() => ({
	tooltip: { trigger: 'item' },
	legend: { bottom: 0 },
	series: [
		{
			type: 'pie',
			radius: ['40%', '65%'],
			itemStyle: { borderRadius: 6 },
			label: { formatter: '{b}: {c}' },
			data: ratioData.value
		}
	]
}));
</script>

<style lang="scss">
.demo-home {
	overflow-x: hidden;

	.card {
		border-radius: 10px;
		margin-bottom: 10px;
		border: 1px solid var(--el-border-color-extra-light);
		background-color: var(--el-bg-color);
		color: var(--el-text-color-primary);
		user-select: none;

		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 20px;
			min-height: 50px;

			.label {
				font-size: 15px;
			}

			.sub {
				font-size: 12px;
				color: var(--el-text-color-secondary);
			}

			.icon {
				font-size: 26px;
				background-color: var(--el-fill-color-light);
				padding: 5px;
				border-radius: 6px;
			}
		}

		&__container {
			padding: 0 20px;
			min-height: 50px;

			.num {
				font-size: 32px;
			}
		}

		&__footer {
			display: flex;
			align-items: center;
			height: 50px;
			margin: 0 5px;
			padding: 0 15px;
			box-sizing: border-box;
			font-size: 12px;

			.label {
				margin-right: 10px;
			}
		}
	}

	.chart-box {
		height: 300px;
		padding: 10px 20px;

		.v-chart {
			height: 100%;
			width: 100%;
		}
	}

	.table-box {
		padding: 10px 20px 20px;
	}
}
</style>
