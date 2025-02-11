<template>
    <div class="withdraw-order">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
            <el-form-item label="提现金额" prop="amount">
                <el-input-number v-model="form.amount" :min="0" :precision="2" />
            </el-form-item>
            
            <el-form-item label="姓名" prop="memberName">
                <el-input v-model="form.memberName" />
            </el-form-item>
            
            <el-form-item label="银行名称" prop="bankName">
                <el-input v-model="form.bankName" />
            </el-form-item>
            
            <el-form-item label="银行卡号" prop="bankCardNo">
                <el-input v-model="form.bankCardNo" />
            </el-form-item>
            
            <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="submitForm(formRef)">提交提现</el-button>
            </el-form-item>
        </el-form>

        <!-- 提现订单列表 -->
        <el-table :data="orders" style="width: 100%">
            <el-table-column prop="order_no" label="订单号" />
            <el-table-column prop="amount" label="金额" />
            <el-table-column prop="bank_name" label="银行" />
            <el-table-column prop="bank_card_no" label="卡号" width="180" />
            <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">
                        {{ getStatusText(row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="showIncompleteButton">
                <template #default="{ row }">
                    <el-button 
                        v-if="row.status === WithdrawStatus.PAID"
                        type="warning" 
                        size="small" 
                        @click="markIncomplete(row)"
                    >
                        未完成
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" />
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { orderApi } from '../services/api';
import { WebSocketClient } from '../services/websocket';
import type { WithdrawOrder } from '../types/order';
import { WithdrawStatus } from '../types/order';

const formRef = ref<FormInstance>();
const form = ref({
    amount: 0,
    memberName: '',
    bankName: '',
    bankCardNo: '',
    remark: ''
});

const rules: FormRules = {
    amount: [{ required: true, message: '请输入提现金额', trigger: 'blur' }],
    memberName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    bankName: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
    bankCardNo: [
        { required: true, message: '请输入银行卡号', trigger: 'blur' },
        { pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号', trigger: 'blur' }
    ]
};

const orders = ref<WithdrawOrder[]>([]);
const ws = WebSocketClient.getInstance();

// 处理WebSocket消息
const handleOrderUpdate = (data: any) => {
    const index = orders.value.findIndex(order => order.order_no === data.orderNo);
    if (index !== -1) {
        orders.value[index].status = data.status;
    }
};

onMounted(() => {
    loadOrders();
    ws.subscribe('statusUpdate', handleOrderUpdate);
});

onUnmounted(() => {
    ws.unsubscribe('statusUpdate', handleOrderUpdate);
});

const loadOrders = async () => {
    try {
        const response = await orderApi.getWithdrawOrders({});
        orders.value = response.data.data.list;
    } catch (error) {
        ElMessage.error('加载订单失败');
    }
};

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    
    await formEl.validate(async (valid) => {
        if (valid) {
            try {
                await orderApi.createWithdraw({
                    memberId: 'current-user-id', // 实际应从用户状态获取
                    memberName: form.value.memberName,
                    bankName: form.value.bankName,
                    bankCardNo: form.value.bankCardNo,
                    amount: form.value.amount,
                    remark: form.value.remark
                });
                ElMessage.success('提现申请提交成功');
                formEl.resetFields();
                loadOrders();
            } catch (error) {
                ElMessage.error('提交失败');
            }
        }
    });
};

const markIncomplete = async (order: WithdrawOrder) => {
    try {
        await orderApi.updateStatus({
            orderNo: order.order_no,
            status: WithdrawStatus.INCOMPLETE
        });
        ElMessage.success('已标记为未完成');
        loadOrders();
    } catch (error) {
        ElMessage.error('操作失败');
    }
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
.withdraw-order {
    padding: 20px;
}
</style> 