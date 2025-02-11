<template>
    <div class="dashboard">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="data-card">
                    <template #header>
                        <div class="card-header">
                            <span>今日充值</span>
                        </div>
                    </template>
                    <div class="data-content">
                        <div class="data-item">
                            <div class="label">订单数</div>
                            <div class="value">{{ stats.recharge?.todayCount || 0 }}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">金额</div>
                            <div class="value">¥{{ stats.recharge?.todayAmount || 0 }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            
            <el-col :span="8">
                <el-card class="data-card">
                    <template #header>
                        <div class="card-header">
                            <span>今日提现</span>
                        </div>
                    </template>
                    <div class="data-content">
                        <div class="data-item">
                            <div class="label">订单数</div>
                            <div class="value">{{ stats.withdraw?.todayCount || 0 }}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">金额</div>
                            <div class="value">¥{{ stats.withdraw?.todayAmount || 0 }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            
            <el-col :span="8">
                <el-card class="data-card">
                    <template #header>
                        <div class="card-header">
                            <span>待处理订单</span>
                        </div>
                    </template>
                    <div class="data-content">
                        <div class="data-item">
                            <div class="label">充值订单</div>
                            <div class="value">{{ stats.recharge?.pendingCount || 0 }}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">提现订单</div>
                            <div class="value">{{ stats.withdraw?.pendingCount || 0 }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="chart-row">
            <el-col :span="12">
                <el-card class="chart-card">
                    <template #header>
                        <div class="card-header">
                            <span>近7天充值趋势</span>
                        </div>
                    </template>
                    <div class="chart" ref="rechargeChart"></div>
                </el-card>
            </el-col>
            
            <el-col :span="12">
                <el-card class="chart-card">
                    <template #header>
                        <div class="card-header">
                            <span>近7天提现趋势</span>
                        </div>
                    </template>
                    <div class="chart" ref="withdrawChart"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

const stats = ref({
    recharge: {
        todayCount: 0,
        todayAmount: 0,
        pendingCount: 0
    },
    withdraw: {
        todayCount: 0,
        todayAmount: 0,
        pendingCount: 0
    }
});

const rechargeChart = ref<HTMLElement>();
const withdrawChart = ref<HTMLElement>();

const initCharts = () => {
    if (rechargeChart.value) {
        const chart = echarts.init(rechargeChart.value);
        chart.setOption({
            title: { text: '' },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: { type: 'value' },
            series: [{
                data: [0, 0, 0, 0, 0, 0, 0],
                type: 'line',
                smooth: true
            }]
        });
    }

    if (withdrawChart.value) {
        const chart = echarts.init(withdrawChart.value);
        chart.setOption({
            title: { text: '' },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: { type: 'value' },
            series: [{
                data: [0, 0, 0, 0, 0, 0, 0],
                type: 'line',
                smooth: true
            }]
        });
    }
};

const loadData = async () => {
    try {
        // TODO: 从后端获取统计数据
        // const res = await api.getStats();
        // stats.value = res.data;
    } catch (error) {
        ElMessage.error('加载数据失败');
    }
};

onMounted(() => {
    loadData();
    initCharts();
});
</script>

<style scoped>
.dashboard {
    padding: 20px;
}

.data-card {
    margin-bottom: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.data-content {
    padding: 20px 0;
}

.data-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.data-item .label {
    color: #666;
}

.data-item .value {
    font-size: 20px;
    font-weight: bold;
    color: #409EFF;
}

.chart-row {
    margin-top: 20px;
}

.chart {
    height: 300px;
}
</style> 