<template>
    <div class="login-container">
        <el-card class="login-card">
            <h2>系统登录</h2>
            <el-form 
                ref="formRef"
                :model="form" 
                :rules="rules"
                @submit.prevent="handleLogin"
            >
                <el-form-item prop="username">
                    <el-input 
                        v-model="form.username" 
                        placeholder="用户名"
                        prefix-icon="User"
                    />
                </el-form-item>
                
                <el-form-item prop="password">
                    <el-input 
                        v-model="form.password" 
                        type="password" 
                        placeholder="密码"
                        prefix-icon="Lock"
                        show-password
                    />
                </el-form-item>
                
                <el-form-item>
                    <el-button 
                        type="primary" 
                        @click="handleLogin" 
                        :loading="loading"
                        style="width: 100%"
                    >
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
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user';
import type { FormInstance } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = ref({
    username: '',
    password: ''
});

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
};

const handleLogin = async () => {
    if (!formRef.value) return;
    
    try {
        await formRef.value.validate();
        loading.value = true;
        
        console.log('登录请求参数:', form.value);
        await userStore.login(form.value);
        console.log('登录成功，Token:', userStore.token);
        
        router.push('/');
        ElMessage.success('登录成功');
    } catch (error) {
        console.error('登录失败:', error);
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
</style> 