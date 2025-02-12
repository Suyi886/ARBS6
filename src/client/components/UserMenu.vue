<template>
  <el-dropdown trigger="click">
    <span class="user-dropdown">
      {{ userStore.userInfo?.username }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="goToUserCenter">
          <el-icon><user /></el-icon>个人中心
        </el-dropdown-item>
        <el-dropdown-item @click="showChangePassword">
          <el-icon><key /></el-icon>修改密码
        </el-dropdown-item>
        <el-dropdown-item divided @click="handleLogout">
          <el-icon><switch-button /></el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { ArrowDown, User, Key, SwitchButton } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();

const goToUserCenter = () => {
  router.push('/user-center');
};

const showChangePassword = () => {
  router.push('/change-password');
};

const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #409EFF;
}

.el-dropdown-menu {
  padding: 5px;
}

.el-dropdown-menu__item {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style> 