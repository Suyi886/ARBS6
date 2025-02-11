<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>充值订单管理</span>
            </div>
        </template>

        <el-form :inline="true" :model="searchForm">
            <el-form-item label="订单状态">
                <el-select v-model="searchForm.status" placeholder="全部状态">
                    <el-option label="全部" :value="undefined" />
                    <el-option label="待处理" :value="0" />
                    <el-option label="已完成" :value="1" />
                    <el-option label="已拒绝" :value="2" />
                </el-select>
            </el-form-item>
            
            <el-form-item label="时间范围">
                <el-date-picker
                    v-model="searchForm.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="loadData">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="order_no" label="订单号" width="180" />
            <el-table-column prop="member_id" label="会员ID" width="120" />
            <el-table-column prop="amount" label="金额" width="120">
                <template #default="scope">
                    ¥{{ scope.row.amount }}
                </template>
            </el-table-column>
            <el-table-column prop="image_url" label="充值凭证" width="120">
                <template #default="scope">
                    <el-image 
                        :src="scope.row.image_url"
                        :preview-src-list="[scope.row.image_url]"
                        fit="cover"
                        style="width: 50px; height: 50px"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                    <el-tag :type="getStatusType(scope.row.status)">
                        {{ getStatusText(scope.row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="180" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                    <el-button 
                        v-if="scope.row.status === 0"
                        type="success" 
                        size="small"
                        @click="handleApprove(scope.row)"
                    >
                        通过
                    </el-button>
                    <el-button 
                        v-if="scope.row.status === 0"
                        type="danger" 
                        size="small"
                        @click="handleReject(scope.row)"
                    >
                        拒绝
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { orderApi } from '../../services/api';

const searchForm = ref({
    status: undefined as number | undefined,
    dateRange: [] as string[]
});

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

const getStatusType = (status: number) => {
    const types = {
        0: 'warning',
        1: 'success',
        2: 'danger'
    };
    return types[status] || 'info';
};

const getStatusText = (status: number) => {
    const texts = {
        0: '待处理',
        1: '已完成',
        2: '已拒绝'
    };
    return texts[status] || '未知状态';
};

const loadData = async () => {
    try {
        const params = {
            page: currentPage.value,
            pageSize: pageSize.value,
            status: searchForm.value.status,
            startDate: searchForm.value.dateRange[0],
            endDate: searchForm.value.dateRange[1]
        };

        const res = await orderApi.getRechargeOrders(params);
        if (res.data.code === 0) {
            tableData.value = res.data.data.list;
            total.value = res.data.data.total;
        }
    } catch (error) {
        ElMessage.error('加载数据失败');
    }
};

const resetSearch = () => {
    searchForm.value = {
        status: undefined,
        dateRange: []
    };
    loadData();
};

const handleSizeChange = (val: number) => {
    pageSize.value = val;
    loadData();
};

const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    loadData();
};

const handleApprove = async (row: any) => {
    try {
        await ElMessageBox.confirm('确认通过该充值订单？');
        await orderApi.updateStatus({
            orderNo: row.order_no,
            status: 1
        });
        ElMessage.success('操作成功');
        loadData();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('操作失败');
        }
    }
};

const handleReject = async (row: any) => {
    try {
        const { value: remark } = await ElMessageBox.prompt('请输入拒绝原因', '提示');
        await orderApi.updateStatus({
            orderNo: row.order_no,
            status: 2,
            remark
        });
        ElMessage.success('操作成功');
        loadData();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('操作失败');
        }
    }
};

onMounted(() => {
    loadData();
});
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}
</style> 