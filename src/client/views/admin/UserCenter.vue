<template>
  <div class="user-center">
    <el-card class="user-info-card">
      <template #header>
        <div class="card-header">
          <h3>个人信息</h3>
        </div>
      </template>
      <div class="info-content">
        <div class="info-item">
          <span class="label">用户名：</span>
          <span class="value">{{ userStore.userInfo?.username }}</span>
        </div>
        <div class="info-item">
          <span class="label">角色：</span>
          <span class="value">
            <el-tag :type="userStore.userInfo?.role === 'admin' ? 'danger' : 'success'">
              {{ userStore.userInfo?.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </span>
        </div>
        <div class="info-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ formatDate(userStore.userInfo?.created_at) }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/user';
import dayjs from 'dayjs';

const userStore = useUserStore();

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};
</script>

<style scoped>
.user-center {
  padding: 20px;
}

.user-info-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-content {
  padding: 20px 0;
}

.info-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.label {
  width: 100px;
  color: #606266;
}

.value {
  color: #303133;
}
</style> 