<template>
    <div class="statistics">
        <el-card class="daily-stats">
            <template #header>
                <div class="card-header">
                    <span>每日统计</span>
                    <el-date-picker
                        v-model="currentDate"
                        type="date"
                        placeholder="选择日期"
                        value-format="YYYY-MM-DD"
                        @change="loadDailyStats"
                    />
                </div>
            </template>
            
            <el-row :gutter="20">
                <el-col :span="12">
                    <h3>充值统计</h3>
                    <div class="stats-item">
                        <div class="label">总订单数</div>
                        <div class="value">{{ dailyStats.recharge?.total_count || 0 }}</div>
                    </div>
                    <div class="stats-item">
                        <div class="label">成功订单数</div>
                        <div class="value">{{ dailyStats.recharge?.success_count || 0 }}</div>
                    </div>
                    <div class="stats-item">
                        <div class="label">成功金额</div>
                        <div class="value">¥{{ dailyStats.recharge?.success_amount || 0 }}</div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <h3>提现统计</h3>
                    <div class="stats-item">
                        <div class="label">总订单数</div>
                        <div class="value">{{ dailyStats.withdraw?.total_count || 0 }}</div>
                    </div>
                    <div class="stats-item">
                        <div class="label">成功订单数</div>
                        <div class="value">{{ dailyStats.withdraw?.success_count || 0 }}</div>
                    </div>
                    <div class="stats-item">
                        <div class="label">成功金额</div>
                        <div class="value">¥{{ dailyStats.withdraw?.success_amount || 0 }}</div>
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <el-card class="trend-stats">
            <template #header>
                <div class="card-header">
                    <span>趋势统计</span>
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="YYYY-MM-DD"
                        @change="loadTrendStats"
                    />
                </div>
            </template>
            
            <div class="charts">
                <div ref="orderChart" class="chart"></div>
                <div ref="amountChart" class="chart"></div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { orderApi } from '../../services/api';

const currentDate = ref(dayjs().format('YYYY-MM-DD'));
const dateRange = ref<string[]>([
    dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
]);

const dailyStats = ref<any>({});
const orderChart = ref<HTMLElement>();
const amountChart = ref<HTMLElement>();
let orderChartInstance: echarts.ECharts;
let amountChartInstance: echarts.ECharts;

onMounted(() => {
    loadDailyStats();
    loadTrendStats();
    initCharts();
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    orderChartInstance?.dispose();
    amountChartInstance?.dispose();
});

const handleResize = () => {
    orderChartInstance?.resize();
    amountChartInstance?.resize();
};

const loadDailyStats = async () => {
    try {
        const response = await orderApi.getDailyStatistics(currentDate.value);
        const stats = response.data.data;
        dailyStats.value = {
            recharge: stats.find((item: any) => item.type === 'recharge'),
            withdraw: stats.find((item: any) => item.type === 'withdraw')
        };
    } catch (error) {
        ElMessage.error('加载统计数据失败');
    }
};

const loadTrendStats = async () => {
    try {
        const response = await orderApi.getTrendStatistics(dateRange.value[0], dateRange.value[1]);
        const stats = response.data.data;
        updateCharts(stats);
    } catch (error) {
        ElMessage.error('加载趋势数据失败');
    }
};

const initCharts = () => {
    if (orderChart.value && amountChart.value) {
        orderChartInstance = echarts.init(orderChart.value);
        amountChartInstance = echarts.init(amountChart.value);
    }
};

const updateCharts = (data: any[]) => {
    const dates = [...new Set(data.map(item => item.date))];
    const rechargeData = dates.map(date => {
        const item = data.find(d => d.date === date && d.type === 'recharge');
        return item ? item.total_count : 0;
    });
    const withdrawData = dates.map(date => {
        const item = data.find(d => d.date === date && d.type === 'withdraw');
        return item ? item.total_count : 0;
    });
    
    orderChartInstance.setOption({
        title: {
            text: '订单数量趋势'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['充值订单', '提现订单']
        },
        xAxis: {
            type: 'category',
            data: dates
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '充值订单',
                type: 'line',
                data: rechargeData
            },
            {
                name: '提现订单',
                type: 'line',
                data: withdrawData
            }
        ]
    });
    
    const rechargeAmount = dates.map(date => {
        const item = data.find(d => d.date === date && d.type === 'recharge');
        return item ? item.success_amount : 0;
    });
    const withdrawAmount = dates.map(date => {
        const item = data.find(d => d.date === date && d.type === 'withdraw');
        return item ? item.success_amount : 0;
    });
    
    amountChartInstance.setOption({
        title: {
            text: '交易金额趋势'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['充值金额', '提现金额']
        },
        xAxis: {
            type: 'category',
            data: dates
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '充值金额',
                type: 'line',
                data: rechargeAmount
            },
            {
                name: '提现金额',
                type: 'line',
                data: withdrawAmount
            }
        ]
    });
};
</script>

<style scoped>
.statistics {
    padding: 20px;
}

.daily-stats {
    margin-bottom: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.stats-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.charts {
    display: flex;
    gap: 20px;
}

.chart {
    flex: 1;
    height: 400px;
}
</style> 