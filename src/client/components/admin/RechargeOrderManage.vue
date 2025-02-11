<template>
    <div class="recharge-order-manage">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item label="状态">
                <el-select v-model="searchForm.status" placeholder="全部状态">
                    <el-option label="全部" :value="undefined" />
                    <el-option label="待审核" :value="RechargeStatus.PENDING" />
                    <el-option label="已到账" :value="RechargeStatus.CONFIRMED" />
                    <el-option label="未到账" :value="RechargeStatus.REJECTED" />
                </el-select>
            </el-form-item>
            
            <el-form-item label="日期范围">
                <el-date-picker
                    v-model="searchForm.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 订单列表 -->
        <el-table :data="orders" style="width: 100%">
            <el-table-column prop="order_no" label="订单号" />
            <el-table-column prop="member_id" label="会员ID" />
            <el-table-column prop="amount" label="金额" />
            <el-table-column label="充值凭证">
                <template #default="{ row }">
                    <el-image
                        :src="row.image_url"
                        :preview-src-list="[row.image_url]"
                        fit="cover"
                        style="width: 50px; height: 50px"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">
                        {{ getStatusText(row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button-group v-if="row.status === RechargeStatus.PENDING">
                        <el-button 
                            type="success" 
                            size="small" 
                            @click="updateStatus(row, RechargeStatus.CONFIRMED)"
                        >
                            确认到账
                        </el-button>
                        <el-button 
                            type="danger" 
                            size="small" 
                            @click="updateStatus(row, RechargeStatus.REJECTED)"
                        >
                            未到账
                        </el-button>
                    </el-button-group>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" />
            <el-table-column prop="remark" label="备注" />
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                v-model:current-page="page"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { orderApi } from '../../services/api';
import type { RechargeOrder } from '../../types/order';
import { RechargeStatus } from '../../types/order';

const searchForm = ref({
    status: undefined as RechargeStatus | undefined,
    dateRange: [] as string[]
});

const orders = ref<RechargeOrder[]>([]);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);

onMounted(() => {
    loadOrders();
});

const loadOrders = async () => {
    try {
        const response = await orderApi.getRechargeOrders({
            page: page.value,
            pageSize: pageSize.value,
            status: searchForm.value.status,
            startDate: searchForm.value.dateRange[0],
            endDate: searchForm.value.dateRange[1]
        });
        orders.value = response.data.data.list;
        total.value = response.data.data.total;
    } catch (error) {
        ElMessage.error('加载订单失败');
    }
};

const search = () => {
    page.value = 1;
    loadOrders();
};

const resetSearch = () => {
    searchForm.value = {
        status: undefined,
        dateRange: []
    };
    search();
};

const updateStatus = async (order: RechargeOrder, status: RechargeStatus) => {
    try {
        await ElMessageBox.confirm(
            `确认将订单 ${order.order_no} 标记为${getStatusText(status)}？`,
            '确认操作'
        );
        
        await orderApi.updateStatus({
            orderNo: order.order_no,
            status
        });
        
        ElMessage.success('操作成功');
        loadOrders();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('操作失败');
        }
    }
};

const handleSizeChange = (val: number) => {
    pageSize.value = val;
    loadOrders();
};

const handleCurrentChange = (val: number) => {
    page.value = val;
    loadOrders();
};

const getStatusType = (status: RechargeStatus) => {
    const types = {
        [RechargeStatus.PENDING]: 'warning',
        [RechargeStatus.CONFIRMED]: 'success',
        [RechargeStatus.REJECTED]: 'danger'
    };
    return types[status];
};

const getStatusText = (status: RechargeStatus) => {
    const texts = {
        [RechargeStatus.PENDING]: '待审核',
        [RechargeStatus.CONFIRMED]: '已到账',
        [RechargeStatus.REJECTED]: '未到账'
    };
    return texts[status];
};
</script>

<style scoped>
.recharge-order-manage {
    padding: 20px;
}

.search-form {
    margin-bottom: 20px;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}
</style> 