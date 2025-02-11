<template>
    <div class="login-container">
        <el-card class="login-card">
            <h2>系统登录</h2>
            <el-form :model="form" @submit.prevent="handleLogin">
                <el-form-item prop="username" required>
                    <el-input 
                        v-model="form.username" 
                        placeholder="用户名"
                        prefix-icon="User"
                    />
                </el-form-item>
                
                <el-form-item prop="password" required>
                    <el-input 
                        v-model="form.password" 
                        type="password" 
                        placeholder="密码"
                        prefix-icon="Lock"
                        show-password
                    />
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="handleLogin" :loading="loading">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);

const form = ref({
    username: '',
    password: ''
});

const handleLogin = async () => {
    if (!form.value.username || !form.value.password) {
        ElMessage.error('请输入用户名和密码');
        return;
    }

    try {
        loading.value = true;
        await userStore.login(form.value);
        router.push('/');
    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '登录失败');
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
}

.login-card {
    width: 400px;
}

h2 {
    text-align: center;
    margin-bottom: 30px;
}

.el-button {
    width: 100%;
}
</style> 