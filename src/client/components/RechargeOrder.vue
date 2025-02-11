<template>
    <div class="recharge-order">
        <el-form :model="form" label-width="120px">
            <el-form-item label="充值金额">
                <el-input-number v-model="form.amount" :min="0" :precision="2" />
            </el-form-item>
            
            <el-form-item label="充值凭证">
                <el-upload
                    :action="config.uploadUrl"
                    :on-success="handleUploadSuccess"
                    :before-upload="beforeUpload"
                >
                    <el-button type="primary">上传图片</el-button>
                </el-upload>
            </el-form-item>
            
            <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交充值</el-button>
            </el-form-item>
        </el-form>

        <!-- 充值订单列表 -->
        <el-table :data="orders" style="width: 100%">
            <el-table-column prop="order_no" label="订单号" />
            <el-table-column prop="amount" label="金额" />
            <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">
                        {{ getStatusText(row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" />
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { orderApi } from '../services/api';
import { WebSocketClient } from '../services/websocket';
import { config } from '../config';
import type { RechargeOrder } from '../types/order';
import { RechargeStatus } from '../types/order';

const form = ref({
    amount: 0,
    imageUrl: '',
    remark: ''
});

const orders = ref<RechargeOrder[]>([]);
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
        const response = await orderApi.getRechargeOrders({});
        orders.value = response.data.data.list;
    } catch (error) {
        ElMessage.error('加载订单失败');
    }
};

const handleUploadSuccess = (response: any) => {
    form.value.imageUrl = response.data.url;
};

const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        ElMessage.error('只能上传图片文件！');
    }
    return isImage;
};

const submitForm = async () => {
    try {
        await orderApi.createRecharge({
            memberId: 'current-user-id', // 实际应从用户状态获取
            amount: form.value.amount,
            imageUrl: form.value.imageUrl,
            remark: form.value.remark
        });
        ElMessage.success('充值申请提交成功');
        form.value = { amount: 0, imageUrl: '', remark: '' };
        loadOrders();
    } catch (error) {
        ElMessage.error('提交失败');
    }
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
.recharge-order {
    padding: 20px;
}
</style> 