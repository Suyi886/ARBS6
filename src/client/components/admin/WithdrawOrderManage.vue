<template>
    <div class="withdraw-order-manage">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item label="状态">
                <el-select v-model="searchForm.status" placeholder="全部状态">
                    <el-option label="全部" :value="undefined" />
                    <el-option label="待处理" :value="WithdrawStatus.PENDING" />
                    <el-option label="已付款" :value="WithdrawStatus.PAID" />
                    <el-option label="卡号异常" :value="WithdrawStatus.CARD_ERROR" />
                    <el-option label="异常" :value="WithdrawStatus.ERROR" />
                    <el-option label="未完成" :value="WithdrawStatus.INCOMPLETE" />
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
            <el-table-column prop="member_name" label="会员姓名" />
            <el-table-column prop="amount" label="金额" />
            <el-table-column prop="bank_name" label="银行名称" />
            <el-table-column prop="bank_card_no" label="银行卡号" width="180" />
            <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">
                        {{ getStatusText(row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="280">
                <template #default="{ row }">
                    <el-button-group v-if="row.status === WithdrawStatus.PENDING">
                        <el-button 
                            type="success" 
                            size="small" 
                            @click="updateStatus(row, WithdrawStatus.PAID)"
                        >
                            已付款
                        </el-button>
                        <el-button 
                            type="danger" 
                            size="small" 
                            @click="updateStatus(row, WithdrawStatus.CARD_ERROR)"
                        >
                            卡号异常
                        </el-button>
                        <el-button 
                            type="danger" 
                            size="small" 
                            @click="updateStatus(row, WithdrawStatus.ERROR)"
                        >
                            异常
                        </el-button>
                    </el-button-group>
                    <el-button 
                        v-if="row.status === WithdrawStatus.INCOMPLETE"
                        type="primary" 
                        size="small" 
                        @click="handleIncomplete(row)"
                    >
                        处理未完成
                    </el-button>
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

        <!-- 处理未完成订单的对话框 -->
        <el-dialog
            v-model="dialogVisible"
            title="处理未完成订单"
            width="500px"
        >
            <el-form :model="handleForm" label-width="100px">
                <el-form-item label="处理方式">
                    <el-radio-group v-model="handleForm.status">
                        <el-radio :label="WithdrawStatus.PAID">重新标记为已付款</el-radio>
                        <el-radio :label="WithdrawStatus.ERROR">标记为异常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input 
                        v-model="handleForm.remark" 
                        type="textarea" 
                        placeholder="请输入处理说明"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitHandle">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { orderApi } from '../../services/api';
import type { WithdrawOrder } from '../../types/order';
import { WithdrawStatus } from '../../types/order';

const searchForm = ref({
    status: undefined as WithdrawStatus | undefined,
    dateRange: [] as string[]
});

const orders = ref<WithdrawOrder[]>([]);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);

// 处理未完成订单相关
const dialogVisible = ref(false);
const currentOrder = ref<WithdrawOrder | null>(null);
const handleForm = ref({
    status: WithdrawStatus.PAID,
    remark: ''
});

onMounted(() => {
    loadOrders();
});

const loadOrders = async () => {
    try {
        const response = await orderApi.getWithdrawOrders({
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

const updateStatus = async (order: WithdrawOrder, status: WithdrawStatus) => {
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

const handleIncomplete = (order: WithdrawOrder) => {
    currentOrder.value = order;
    handleForm.value = {
        status: WithdrawStatus.PAID,
        remark: ''
    };
    dialogVisible.value = true;
};

const submitHandle = async () => {
    if (!currentOrder.value) return;
    
    try {
        await orderApi.updateStatus({
            orderNo: currentOrder.value.order_no,
            status: handleForm.value.status,
            remark: handleForm.value.remark
        });
        
        ElMessage.success('处理成功');
        dialogVisible.value = false;
        loadOrders();
    } catch (error) {
        ElMessage.error('处理失败');
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

const getStatusType = (status: WithdrawStatus) => {
    const types = {
        [WithdrawStatus.PENDING]: 'warning',
        [WithdrawStatus.PAID]: 'success',
        [WithdrawStatus.CARD_ERROR]: 'danger',
        [WithdrawStatus.ERROR]: 'danger',
        [WithdrawStatus.INCOMPLETE]: 'info'
    };
    return types[status];
};

const getStatusText = (status: WithdrawStatus) => {
    const texts = {
        [WithdrawStatus.PENDING]: '待处理',
        [WithdrawStatus.PAID]: '已付款',
        [WithdrawStatus.CARD_ERROR]: '卡号异常',
        [WithdrawStatus.ERROR]: '异常',
        [WithdrawStatus.INCOMPLETE]: '未完成'
    };
    return texts[status];
};
</script>

<style scoped>
.withdraw-order-manage {
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