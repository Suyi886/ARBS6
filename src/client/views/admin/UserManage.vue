<template>
    <div class="user-manage">
        <div class="header">
            <h2>用户管理</h2>
            <el-button type="primary" @click="showCreateDialog">
                创建用户
            </el-button>
        </div>

        <el-table :data="users" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="用户名" width="120" />
            <el-table-column prop="role" label="角色" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
                        {{ row.role === 'admin' ? '管理员' : '普通用户' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="180">
                <template #default="{ row }">
                    {{ formatDate(row.created_at) }}
                </template>
            </el-table-column>
            <el-table-column prop="updated_at" label="更新时间" width="180">
                <template #default="{ row }">
                    {{ formatDate(row.updated_at) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template #default="{ row }">
                    <el-button-group>
                        <el-button 
                            type="primary" 
                            @click="handleChangeRole(row)"
                            :disabled="row.id === userStore.userInfo?.id"
                        >
                            {{ row.role === 'admin' ? '取消管理员' : '设为管理员' }}
                        </el-button>
                        <el-button 
                            type="warning"
                            @click="showPasswordDialog(row)"
                        >
                            修改密码
                        </el-button>
                        <el-button 
                            type="danger" 
                            @click="handleDelete(row)"
                            :disabled="row.id === userStore.userInfo?.id"
                        >
                            删除
                        </el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <!-- 创建用户对话框 -->
        <el-dialog
            v-model="createDialogVisible"
            title="创建用户"
            width="500px"
        >
            <el-form 
                ref="createFormRef"
                :model="createForm"
                :rules="createRules"
                label-width="100px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="createForm.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input 
                        v-model="createForm.password" 
                        type="password" 
                        show-password
                    />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input 
                        v-model="createForm.confirmPassword" 
                        type="password" 
                        show-password
                    />
                </el-form-item>
                <el-form-item label="角色">
                    <el-radio-group v-model="createForm.role">
                        <el-radio label="user">普通用户</el-radio>
                        <el-radio label="admin">管理员</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="createDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleCreate" :loading="creating">
                    创建
                </el-button>
            </template>
        </el-dialog>

        <!-- 修改密码对话框 -->
        <el-dialog
            v-model="passwordDialogVisible"
            title="修改密码"
            width="500px"
        >
            <el-form 
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                label-width="100px"
            >
                <el-form-item label="新密码" prop="password">
                    <el-input 
                        v-model="passwordForm.password" 
                        type="password" 
                        show-password
                    />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input 
                        v-model="passwordForm.confirmPassword" 
                        type="password" 
                        show-password
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="passwordDialogVisible = false">取消</el-button>
                <el-button 
                    type="primary" 
                    @click="handleChangePassword" 
                    :loading="changingPassword"
                >
                    确认
                </el-button>
            </template>
        </el-dialog>

        <div class="user-options">
            <router-link to="/admin/user-center">个人中心</router-link>
            <router-link to="/admin/change-password">修改密码</router-link>
            <router-link to="/admin/logout">退出登录</router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { userApi } from '../../services/api';
import { useUserStore } from '../../stores/user';
import dayjs from 'dayjs';

const userStore = useUserStore();

// 用户列表数据
const users = ref<any[]>([]);
const loading = ref(false);

// 创建用户相关
const createDialogVisible = ref(false);
const createFormRef = ref<FormInstance>();
const creating = ref(false);
const createForm = ref({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user'
});

// 修改密码相关
const passwordDialogVisible = ref(false);
const passwordFormRef = ref<FormInstance>();
const changingPassword = ref(false);
const passwordForm = ref({
    userId: '',
    password: '',
    confirmPassword: ''
});
const currentUser = ref<any>(null);

// 表单验证规则
const createRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
            validator: (rule: any, value: string, callback: Function) => {
                if (value !== createForm.value.password) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ]
};

const passwordRules = {
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            validator: (rule: any, value: string, callback: Function) => {
                if (value !== passwordForm.value.password) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ]
};

// 加载用户列表
const loadUsers = async () => {
    try {
        loading.value = true;
        const response = await userApi.getAllUsers();
        users.value = response.data;
    } catch (error) {
        console.error('Failed to load users:', error);
        ElMessage.error('加载用户列表失败');
    } finally {
        loading.value = false;
    }
};

// 显示创建用户对话框
const showCreateDialog = () => {
    createForm.value = {
        username: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    };
    createDialogVisible.value = true;
};

// 创建用户
const handleCreate = async () => {
    if (!createFormRef.value) return;
    
    try {
        await createFormRef.value.validate();
        creating.value = true;
        
        await userApi.createUser({
            username: createForm.value.username,
            password: createForm.value.password,
            role: createForm.value.role
        });
        
        ElMessage.success('创建用户成功');
        createDialogVisible.value = false;
        loadUsers();
    } catch (error: any) {
        console.error('Failed to create user:', error);
        ElMessage.error(error.response?.data?.message || '创建用户失败');
    } finally {
        creating.value = false;
    }
};

// 显示修改密码对话框
const showPasswordDialog = (user: any) => {
    currentUser.value = user;
    passwordForm.value = {
        userId: user.id,
        password: '',
        confirmPassword: ''
    };
    passwordDialogVisible.value = true;
};

// 修改密码
const handleChangePassword = async () => {
    if (!passwordFormRef.value || !currentUser.value) return;
    
    try {
        await passwordFormRef.value.validate();
        changingPassword.value = true;
        
        await userApi.changePassword(
            currentUser.value.id,
            passwordForm.value.password
        );
        
        ElMessage.success('修改密码成功');
        passwordDialogVisible.value = false;
    } catch (error: any) {
        console.error('Failed to change password:', error);
        ElMessage.error(error.response?.data?.message || '修改密码失败');
    } finally {
        changingPassword.value = false;
    }
};

// 修改用户角色
const handleChangeRole = async (user: any) => {
    try {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        await userApi.updateUserRole(user.id, newRole);
        ElMessage.success('修改角色成功');
        loadUsers();
    } catch (error: any) {
        console.error('Failed to update role:', error);
        ElMessage.error(error.response?.data?.message || '修改角色失败');
    }
};

// 删除用户
const handleDelete = async (user: any) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除用户 "${user.username}" 吗？`,
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        );
        
        await userApi.deleteUser(user.id);
        ElMessage.success('删除用户成功');
        loadUsers();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('Failed to delete user:', error);
            ElMessage.error(error.response?.data?.message || '删除用户失败');
        }
    }
};

// 格式化日期
const formatDate = (date: string) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

onMounted(() => {
    loadUsers();
});
</script>

<style scoped>
.user-manage {
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

h2 {
    margin: 0;
}

.user-options {
    margin-top: 20px;
    display: flex;
    gap: 15px;
    justify-content: flex-end;
}
</style> 