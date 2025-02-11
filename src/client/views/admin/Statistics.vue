<template>
    <div class="statistics">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>数据统计</span>
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="handleDateChange"
                    />
                </div>
            </template>

            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="chart-container">
                        <h3>充值统计</h3>
                        <div class="chart" ref="rechargeChart"></div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="chart-container">
                        <h3>提现统计</h3>
                        <div class="chart" ref="withdrawChart"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="summary-row">
                <el-col :span="8">
                    <el-card shadow="never">
                        <div class="summary-item">
                            <div class="label">总充值金额</div>
                            <div class="value">¥{{ summary.totalRechargeAmount }}</div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="never">
                        <div class="summary-item">
                            <div class="label">总提现金额</div>
                            <div class="value">¥{{ summary.totalWithdrawAmount }}</div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="never">
                        <div class="summary-item">
                            <div class="label">净收入</div>
                            <div class="value" :class="{ 'positive': summary.netIncome >= 0 }">
                                ¥{{ summary.netIncome }}
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';

const dateRange = ref([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
]);

const summary = ref({
    totalRechargeAmount: 0,
    totalWithdrawAmount: 0,
    netIncome: 0
});

const rechargeChart = ref<HTMLElement>();
const withdrawChart = ref<HTMLElement>();

const initCharts = () => {
    if (rechargeChart.value) {
        const chart = echarts.init(rechargeChart.value);
        chart.setOption({
            title: { text: '' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: [] },
            yAxis: { type: 'value' },
            series: [{
                name: '充值金额',
                type: 'bar',
                data: []
            }]
        });
    }

    if (withdrawChart.value) {
        const chart = echarts.init(withdrawChart.value);
        chart.setOption({
            title: { text: '' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: [] },
            yAxis: { type: 'value' },
            series: [{
                name: '提现金额',
                type: 'bar',
                data: []
            }]
        });
    }
};

const loadData = async () => {
    try {
        // TODO: 从后端获取统计数据
        // const res = await api.getStatistics({
        //     startDate: dateRange.value[0],
        //     endDate: dateRange.value[1]
        // });
        // updateCharts(res.data);
    } catch (error) {
        ElMessage.error('加载数据失败');
    }
};

const handleDateChange = () => {
    loadData();
};

onMounted(() => {
    initCharts();
    loadData();
});
</script>

<style scoped>
.statistics {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chart-container {
    margin-bottom: 30px;
}

.chart {
    height: 300px;
}

.summary-row {
    margin-top: 20px;
}

.summary-item {
    text-align: center;
}

.summary-item .label {
    color: #666;
    margin-bottom: 10px;
}

.summary-item .value {
    font-size: 24px;
    font-weight: bold;
    color: #409EFF;
}

.summary-item .value.positive {
    color: #67C23A;
}
</style> 