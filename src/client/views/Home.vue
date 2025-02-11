<template>
    <div class="home">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>充值</span>
                            <el-button @click="$router.push('/recharge')" type="primary">
                                立即充值
                            </el-button>
                        </div>
                    </template>
                    <div class="card-content">
                        <div class="stat-item">
                            <div class="label">今日充值总额</div>
                            <div class="value">¥{{ stats.recharge?.todayAmount || 0 }}</div>
                        </div>
                        <div class="stat-item">
                            <div class="label">今日充值笔数</div>
                            <div class="value">{{ stats.recharge?.todayCount || 0 }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            
            <el-col :span="12">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>提现</span>
                            <el-button @click="$router.push('/withdraw')" type="primary">
                                立即提现
                            </el-button>
                        </div>
                    </template>
                    <div class="card-content">
                        <div class="stat-item">
                            <div class="label">今日提现总额</div>
                            <div class="value">¥{{ stats.withdraw?.todayAmount || 0 }}</div>
                        </div>
                        <div class="stat-item">
                            <div class="label">今日提现笔数</div>
                            <div class="value">{{ stats.withdraw?.todayCount || 0 }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="recent-orders">
            <el-col :span="12">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>最近充值订单</span>
                        </div>
                    </template>
                    <el-table :data="recentOrders.recharge" style="width: 100%">
                        <el-table-column prop="order_no" label="订单号" width="180" />
                        <el-table-column prop="amount" label="金额" width="100" />
                        <el-table-column prop="status" label="状态">
                            <template #default="scope">
                                <el-tag :type="getStatusType(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="created_at" label="创建时间" />
                    </el-table>
                </el-card>
            </el-col>
            
            <el-col :span="12">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>最近提现订单</span>
                        </div>
                    </template>
                    <el-table :data="recentOrders.withdraw" style="width: 100%">
                        <el-table-column prop="order_no" label="订单号" width="180" />
                        <el-table-column prop="amount" label="金额" width="100" />
                        <el-table-column prop="status" label="状态">
                            <template #default="scope">
                                <el-tag :type="getStatusType(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="created_at" label="创建时间" />
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { orderApi } from '../services/api';

const stats = ref({
    recharge: null,
    withdraw: null
});

const recentOrders = ref({
    recharge: [],
    withdraw: []
});

const loadData = async () => {
    try {
        const [rechargeOrders, withdrawOrders] = await Promise.all([
            orderApi.getRechargeOrders({ pageSize: 5 }),
            orderApi.getWithdrawOrders({ pageSize: 5 })
        ]);

        recentOrders.value = {
            recharge: rechargeOrders.data.data.list,
            withdraw: withdrawOrders.data.data.list
        };
    } catch (error) {
        console.error('加载数据失败:', error);
    }
};

const getStatusType = (status: number) => {
    const types: Record<number, string> = {
        0: 'warning',
        1: 'success',
        2: 'danger'
    };
    return types[status] || 'info';
};

const getStatusText = (status: number) => {
    const texts: Record<number, string> = {
        0: '待处理',
        1: '已完成',
        2: '已拒绝'
    };
    return texts[status] || '未知状态';
};

onMounted(() => {
    loadData();
});
</script>

<style scoped>
.home {
    padding: 20px;
}

.recent-orders {
    margin-top: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-content {
    padding: 20px 0;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.stat-item .value {
    font-size: 18px;
    font-weight: bold;
    color: #409EFF;
}
</style> 