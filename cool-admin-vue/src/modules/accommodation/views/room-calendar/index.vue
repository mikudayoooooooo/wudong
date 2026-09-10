<template>
	<div class="accommodation-room-calendar">
		<!-- 查询条件 -->
		<el-card shadow="never" class="filter-card">
			<div class="filter-bar">
				<span class="label">民宿</span>
				<el-select
					v-model="hotelId"
					filterable
					clearable
					placeholder="请选择民宿"
					style="width: 200px"
					@change="onHotelChange"
				>
					<el-option
						v-for="hotel in hotelOptions"
						:key="hotel.id"
						:label="hotel.name"
						:value="hotel.id"
					/>
				</el-select>

				<span class="label">房型</span>
				<el-select
					v-model="roomTypeId"
					filterable
					clearable
					:disabled="!hotelId"
					placeholder="请先选择民宿"
					style="width: 200px"
					@change="onRoomTypeChange"
				>
					<el-option
						v-for="rt in roomTypeOptions"
						:key="rt.id"
						:label="`${rt.name}（基础价 ¥${rt.price}/间，${rt.stock}间）`"
						:value="rt.id"
					/>
				</el-select>

				<span class="label">日期区间</span>
				<el-date-picker
					v-model="dateRange"
					type="daterange"
					value-format="YYYY-MM-DD"
					format="YYYY-MM-DD"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					style="width: 300px"
					:clearable="false"
				/>

				<el-button type="primary" :disabled="!roomTypeId" @click="queryRange">
					查询
				</el-button>
				<el-button type="success" :disabled="!roomTypeId" @click="openBatch">
					批量设置
				</el-button>
			</div>
			<div class="filter-tip">
				<span v-if="roomTypeId">当前房型：{{ currentRoomType?.name }}（共 {{ currentRoomType?.stock }} 间，基础价 ¥{{ currentRoomType?.price }}）。未设置日期按房型基础价/满库存展示，默认查询区间为今天起 30 天。</span>
				<span v-else>请选择民宿和房型后查询房态。</span>
			</div>
		</el-card>

		<!-- 房态列表 -->
		<el-card shadow="never" class="table-card">
			<el-table v-loading="loading" :data="rows" border stripe max-height="560" empty-text="请选择房型后点击查询">
				<el-table-column prop="date" label="日期" width="140" align="center" />
				<el-table-column label="可用间数" width="130" align="center">
					<template #default="{ row }">
						{{ row.availableStock }} / {{ currentRoomType?.stock ?? '-' }}
					</template>
				</el-table-column>
				<el-table-column label="价格(元)" width="140" align="right">
					<template #default="{ row }">
						<span class="price">¥{{ Number(row.price).toFixed(2) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" min-width="120" align="center">
					<template #default="{ row }">
						<el-tag :type="row.status == 1 ? 'success' : 'danger'" size="small">
							{{ row.status == 1 ? '可订' : '不可订' }}
						</el-tag>
					</template>
				</el-table-column>
				<template #empty>
					<div v-if="!loading" class="table-empty">暂无房态数据</div>
				</template>
			</el-table>
		</el-card>

		<!-- 批量设置弹窗 -->
		<el-dialog v-model="batchVisible" title="批量设置房态" width="620px" :close-on-click-modal="false">
			<div class="batch-form">
				<div class="batch-row">
					<span class="label">房型</span>
					<span class="value">{{ currentRoomType?.name }}（房间 {{ currentRoomType?.stock }} 间，基础价 ¥{{ currentRoomType?.price }}）</span>
				</div>

				<div class="batch-row">
					<span class="label">设置区间</span>
					<div class="dates">
						<el-date-picker
							v-model="batch.startDate"
							type="date"
							value-format="YYYY-MM-DD"
							format="YYYY-MM-DD"
							placeholder="开始日期"
							style="width: 160px"
						/>
						<span class="sep">至</span>
						<el-date-picker
							v-model="batch.endDate"
							type="date"
							value-format="YYYY-MM-DD"
							format="YYYY-MM-DD"
							placeholder="结束日期"
							style="width: 160px"
						/>
					</div>
				</div>

				<div class="batch-row">
					<span class="label">星期限定</span>
					<div class="weekdays">
						<el-select
							v-model="batch.weekDays"
							multiple
							clearable
							collapse-tags
							placeholder="不限（默认每天）"
							style="width: 360px"
						>
							<el-option v-for="w in weekOptions" :key="w.value" :label="w.label" :value="w.value" />
						</el-select>
					</div>
					<span class="hint">不选择则作用于区间内每天；0=周日 … 6=周六</span>
				</div>

				<div class="batch-row">
					<span class="label">价格(元)</span>
					<el-input-number
						v-model="batch.price"
						:min="0"
						:precision="2"
						:step="50"
						:disabled="batch.closed"
						placeholder="留空不修改"
						controls-position="right"
						style="width: 200px"
					/>
					<span class="hint">当日动态价格，留空则沿用默认</span>
				</div>

				<div class="batch-row">
					<span class="label">可用间数</span>
					<el-input-number
						v-model="batch.availableStock"
						:min="0"
						:max="Number(currentRoomType?.stock || 999)"
						:disabled="batch.closed"
						placeholder="留空不修改"
						controls-position="right"
						style="width: 200px"
					/>
					<span class="hint">不超过房型房间数({{ currentRoomType?.stock }})，超限后端自动截断</span>
				</div>

				<div class="batch-row">
					<span class="label">关闭</span>
					<el-switch
						v-model="batch.closed"
						active-text="关房（当日不可订）"
						inactive-text="开房（当日可订）"
					/>
					<span class="hint">关房优先级最高，设置后当天状态为不可订</span>
				</div>
			</div>

			<template #footer>
				<el-button @click="batchVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitting" @click="submitBatch">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'accommodation-room-calendar'
});

import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useCool } from '/@/cool';

const { service } = useCool();

// 每次 range 调用覆盖的天数上限（后端单次最多 32 天）
const MAX_CHUNK_DAYS = 31;

// 民宿 / 房型
const hotelOptions = ref<any[]>([]);
const roomTypeOptions = ref<any[]>([]);
const hotelId = ref<number | undefined>(undefined);
const roomTypeId = ref<number | undefined>(undefined);

// 日期区间默认：今天 ~ 今天+30
function formatDate(d: Date): string {
	const p = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function addDays(dateStr: string, days: number): string {
	const d = new Date(`${dateStr}T12:00:00`);
	d.setDate(d.getDate() + days);
	return formatDate(d);
}
function diffDays(start: string, end: string): number {
	return Math.round(
		(new Date(`${end}T12:00:00`).getTime() - new Date(`${start}T12:00:00`).getTime()) / 86400000
	);
}

const dateRange = ref<[string, string] | []>([addDays(formatDate(new Date()), 0), addDays(formatDate(new Date()), 30)]);

// 房态行
const rows = ref<any[]>([]);
const loading = ref(false);

const currentRoomType = computed(() => roomTypeOptions.value.find(rt => rt.id === roomTypeId.value));

// 星期选项：0=周日 ... 6=周六
const weekOptions = [
	{ label: '周日', value: 0 },
	{ label: '周一', value: 1 },
	{ label: '周二', value: 2 },
	{ label: '周三', value: 3 },
	{ label: '周四', value: 4 },
	{ label: '周五', value: 5 },
	{ label: '周六', value: 6 }
];

// 加载民宿
async function loadHotels() {
	const res = (await service.accommodation.hotel.list()) || [];
	hotelOptions.value = res;
}

// 切换民宿：加载其房型
async function onHotelChange(val?: number) {
	roomTypeId.value = undefined;
	roomTypeOptions.value = [];
	rows.value = [];
	if (!val) return;
	const res: any = await service.accommodation.roomType.page({ hotelId: val, page: 1, size: 1000 });
	roomTypeOptions.value = res?.list || [];
}

// 切换房型：清空旧数据
function onRoomTypeChange() {
	rows.value = [];
}

// 区间查询（超过单次上限自动分段）
async function queryRange() {
	if (!roomTypeId.value) {
		ElMessage.warning('请先选择民宿和房型');
		return;
	}
	const [start, end] = dateRange.value as [string, string];
	if (!start || !end) {
		ElMessage.warning('请选择日期区间');
		return;
	}
	if (start > end) {
		ElMessage.warning('开始日期不能晚于结束日期');
		return;
	}

	loading.value = true;
	rows.value = [];
	try {
		let cursor = start;
		let guard = 0;
		while (cursor <= end && guard++ < 200) {
			const chunkEnd = addDays(cursor, Math.min(MAX_CHUNK_DAYS, diffDays(cursor, end)));
			const res: any = await service.accommodation.roomCalendar.range({
				roomTypeId: Number(roomTypeId.value),
				startDate: cursor,
				endDate: chunkEnd
			});
			rows.value.push(...(Array.isArray(res) ? res : []));
			if (chunkEnd >= end) break;
			cursor = addDays(chunkEnd, 1);
		}
	} catch (e: any) {
		ElMessage.error(e?.message || '查询失败');
	} finally {
		loading.value = false;
	}
}

// 批量设置
const batchVisible = ref(false);
const submitting = ref(false);
const batch = reactive({
	startDate: '',
	endDate: '',
	weekDays: [] as number[],
	price: null as number | null,
	availableStock: null as number | null,
	closed: false
});

function openBatch() {
	if (!roomTypeId.value) {
		ElMessage.warning('请先选择房型');
		return;
	}
	const [start, end] = dateRange.value as [string, string];
	batch.startDate = start || addDays(formatDate(new Date()), 0);
	batch.endDate = end || addDays(formatDate(new Date()), 30);
	batch.weekDays = [];
	batch.price = null;
	batch.availableStock = null;
	batch.closed = false;
	batchVisible.value = true;
}

async function submitBatch() {
	if (!roomTypeId.value) {
		ElMessage.warning('请选择房型');
		return;
	}
	if (!batch.startDate || !batch.endDate || batch.startDate > batch.endDate) {
		ElMessage.warning('请选择正确的设置区间');
		return;
	}

	submitting.value = true;
	try {
		const params: any = {
			roomTypeId: Number(roomTypeId.value),
			startDate: batch.startDate,
			endDate: batch.endDate
		};
		if (batch.weekDays.length) {
			params.weekDays = batch.weekDays.map(Number);
		}
		if (batch.price != null) {
			params.price = Number(batch.price);
		}
		if (batch.availableStock != null) {
			params.availableStock = Number(batch.availableStock);
		}
		if (batch.closed) {
			params.closed = true;
		}

		const res: any = await service.accommodation.roomCalendar.batch(params);
		const count = res?.count ?? 0;
		ElMessage.success(`批量设置成功，共影响 ${count} 天`);
		batchVisible.value = false;

		// 同步查询区间并刷新列表，便于查看设置结果
		dateRange.value = [batch.startDate, batch.endDate] as [string, string];
		queryRange();
	} catch (e: any) {
		ElMessage.error(e?.message || '批量设置失败');
	} finally {
		submitting.value = false;
	}
}

// 初始化加载民宿
loadHotels();
</script>

<style lang="scss" scoped>
.accommodation-room-calendar {
	.filter-card {
		margin-bottom: 14px;
	}

	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;

		.label {
			color: #606266;
			font-size: 13px;
			white-space: nowrap;
		}
	}

	.filter-tip {
		margin-top: 12px;
		font-size: 12px;
		color: #909399;
	}

	.table-card {
		.price {
			color: #e6a23c;
			font-weight: 600;
		}

		.table-empty {
			padding: 30px 0;
			color: #909399;
		}
	}

	.batch-form {
		.batch-row {
			display: flex;
			align-items: center;
			margin-bottom: 16px;

			.label {
				width: 90px;
				color: #606266;
				font-size: 13px;
				text-align: right;
				margin-right: 10px;
				flex-shrink: 0;
			}

			.hint {
				margin-left: 12px;
				font-size: 12px;
				color: #909399;
				flex: 1;
			}

			.sep {
				margin: 0 8px;
				color: #909399;
			}

			.weekdays {
				flex: 1;
			}
		}
	}
}
</style>
