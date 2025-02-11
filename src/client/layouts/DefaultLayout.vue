<template>
    <el-container class="layout-container">
        <el-header>
            <div class="header-content">
                <div class="logo">支付系统</div>
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
                    <el-menu-item index="/">
                        <el-icon><HomeFilled /></el-icon>
                        <span>首页</span>
                    </el-menu-item>
                    
                    <el-menu-item index="/recharge">
                        <el-icon><Money /></el-icon>
                        <span>充值</span>
                    </el-menu-item>
                    
                    <el-menu-item index="/withdraw">
                        <el-icon><Wallet /></el-icon>
                        <span>提现</span>
                    </el-menu-item>
                    
                    <el-menu-item 
                        v-if="userStore.isAdmin" 
                        index="/admin/recharge"
                    >
                        <el-icon><Setting /></el-icon>
                        <span>充值管理</span>
                    </el-menu-item>
                    
                    <el-menu-item 
                        v-if="userStore.isAdmin" 
                        index="/admin/withdraw"
                    >
                        <el-icon><Setting /></el-icon>
                        <span>提现管理</span>
                    </el-menu-item>
                    
                    <el-menu-item 
                        v-if="userStore.isAdmin" 
                        index="/admin/statistics"
                    >
                        <el-icon><DataLine /></el-icon>
                        <span>统计报表</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>

    <!-- 修改密码对话框 -->
    <el-dialog
        v-model="passwordDialog"
        title="修改密码"
        width="400px"
    >
        <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
        >
            <el-form-item label="原密码" prop="oldPassword">
                <el-input
                    v-model="passwordForm.oldPassword"
                    type="password"
                    show-password
                />
            </el-form-item>
            
            <el-form-item label="新密码" prop="newPassword">
                <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    show-password
                />
            </el-form-item>
            
            <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    show-password
                />
            </el-form-item>
        </el-form>
        
        <template #footer>
            <el-button @click="passwordDialog = false">取消</el-button>
            <el-button type="primary" @click="handleChangePassword">
                确认
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useUserStore } from '../stores/user';
import { authApi } from '../services/auth';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 修改密码相关
const passwordDialog = ref(false);
const passwordFormRef = ref<FormInstance>();
const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const passwordRules: FormRules = {
    oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== passwordForm.value.newPassword) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ]
};

const handleCommand = (command: string) => {
    if (command === 'password') {
        passwordDialog.value = true;
    } else if (command === 'logout') {
        userStore.logout();
        router.push('/login');
    }
};

const handleChangePassword = async () => {
    if (!passwordFormRef.value) return;
    
    await passwordFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await authApi.changePassword({
                    oldPassword: passwordForm.value.oldPassword,
                    newPassword: passwordForm.value.newPassword
                });
                
                ElMessage.success('密码修改成功');
                passwordDialog.value = false;
                passwordForm.value = {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };
            } catch (error) {
                ElMessage.error('密码修改失败');
            }
        }
    });
};
</script>

<style scoped>
.layout-container {
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
</style> 