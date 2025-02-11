<template>
    <el-container class="admin-layout">
        <el-header>
            <div class="header-content">
                <div class="logo">管理后台</div>
                <div class="user-info">
                    <span>{{ userStore.userInfo?.username }}</span>
                    <el-dropdown @command="handleCommand">
                        <el-button icon="el-icon-setting" circle />
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="password">
                                    修改密码
                                </el-dropdown-item>
                                <el-dropdown-item command="logout">
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        
        <el-container>
            <el-aside width="200px">
                <el-menu
                    router
                    :default-active="route.path"
                >
                    <el-menu-item index="/admin/recharge">
                        <el-icon><Money /></el-icon>
                        <span>充值管理</span>
                    </el-menu-item>
                    
                    <el-menu-item index="/admin/withdraw">
                        <el-icon><Wallet /></el-icon>
                        <span>提现管理</span>
                    </el-menu-item>
                    
                    <el-menu-item index="/admin/statistics">
                        <el-icon><TrendCharts /></el-icon>
                        <span>统计报表</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { Money, Wallet, TrendCharts } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const handleCommand = (command: string) => {
    if (command === 'password') {
        // TODO: 实现修改密码功能
    } else if (command === 'logout') {
        userStore.logout();
        router.push('/login');
    }
};
</script>

<style scoped>
.admin-layout {
    height: 100vh;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}

.logo {
    font-size: 20px;
    font-weight: bold;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.el-aside {
    background-color: #f5f7fa;
}

.el-menu {
    border-right: none;
}
</style> 