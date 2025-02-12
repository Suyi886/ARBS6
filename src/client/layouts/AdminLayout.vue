<template>
    <el-container class="admin-layout">
        <el-aside width="200px">
            <div class="logo">支付系统</div>
            <el-menu
                router
                :default-active="route.path"
                background-color="#304156"
                text-color="#fff"
                active-text-color="#409EFF"
            >
                <el-menu-item index="/admin/dashboard">
                    <el-icon><DataLine /></el-icon>
                    <span>数据概览</span>
                </el-menu-item>
                
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
        
        <el-container>
            <el-header>
                <div class="header-content">
                    <el-breadcrumb>
                        <el-breadcrumb-item>管理后台</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="user-menu">
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
                    </div>
                </div>
            </el-header>
            
            <el-main>
                <router-view v-loading="loading"></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { 
    DataLine, Money, Wallet, 
    TrendCharts, ArrowDown, User, Key, SwitchButton 
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);

const handleCommand = (command: string) => {
    // 移除未使用的函数
};

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
.admin-layout {
    height: 100vh;
}

.logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    background-color: #263445;
}

.el-aside {
    background-color: #304156;
}

.el-header {
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
}

.header-content {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-menu {
    display: flex;
    align-items: center;
    gap: 12px;
}

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

.el-main {
    background-color: #f0f2f5;
    padding: 20px;
}
</style> 