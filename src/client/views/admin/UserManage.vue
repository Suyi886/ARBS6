<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>用户管理</span>
                <el-button type="primary" @click="showCreateDialog">
                    创建用户
                </el-button>
            </div>
        </template>

        <!-- 用户列表 -->
        <el-table :data="users" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="用户名" width="150" />
            <el-table-column prop="role" label="角色" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
                        {{ row.role === 'admin' ? '管理员' : '普通用户' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="180" />
            <el-table-column prop="updated_at" label="更新时间" width="180" />
            <el-table-column label="操作" width="250" fixed="right">
                <template #default="{ row }">
                    <el-button-group>
                        <el-button 
                            type="primary" 
                            size="small"
                            @click="showChangePasswordDialog(row)"
                        >
                            修改密码
                        </el-button>
                        <el-button 
                            :type="row.role === 'admin' ? 'warning' : 'success'"
                            size="small"
                            @click="handleRoleChange(row)"
                        >
                            {{ row.role === 'admin' ? '取消管理员' : '设为管理员' }}
                        </el-button>
                        <el-button 
                            type="danger" 
                            size="small"
                            @click="handleDelete(row)"
                        >
                            删除
                        </el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <!-- 创建用户对话框 -->
        <el-dialog
            v-model="createDialog.visible"
            title="创建用户"
            width="400px"
        >
            <el-form
                ref="createFormRef"
                :model="createDialog.form"
                :rules="createDialog.rules"
                label-width="80px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="createDialog.form.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input 
                        v-model="createDialog.form.password"
                        type="password"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="角色">
                    <el-radio-group v-model="createDialog.form.role">
                        <el-radio label="user">普通用户</el-radio>
                        <el-radio label="admin">管理员</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="createDialog.visible = false">取消</el-button>
                <el-button type="primary" @click="handleCreate">确认</el-button>
            </template>
        </el-dialog>

        <!-- 修改密码对话框 -->
        <el-dialog
            v-model="passwordDialog.visible"
            title="修改密码"
            width="400px"
        >
            <el-form
                ref="passwordFormRef"
                :model="passwordDialog.form"
                :rules="passwordDialog.rules"
                label-width="100px"
            >
                <el-form-item label="新密码" prop="newPassword">
                    <el-input
                        v-model="passwordDialog.form.newPassword"
                        type="password"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input
                        v-model="passwordDialog.form.confirmPassword"
                        type="password"
                        show-password
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="passwordDialog.visible = false">取消</el-button>
                <el-button type="primary" @click="handleChangePassword">确认</el-button>
            </template>
        </el-dialog>
    </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { userApi } from '../../services/api';

const users = ref([]);

// 创建用户相关
const createDialog = ref({
    visible: false,
    form: {
        username: '',
        password: '',
        role: 'user'
    },
    rules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
    } as FormRules
});

// 修改密码相关
const passwordDialog = ref({
    visible: false,
    currentUser: null as any,
    form: {
        newPassword: '',
        confirmPassword: ''
    },
    rules: {
        newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
            { required: true, message: '请确认新密码', trigger: 'blur' },
            {
                validator: (rule, value, callback) => {
                    if (value !== passwordDialog.value.form.newPassword) {
                        callback(new Error('两次输入的密码不一致'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }
        ]
    } as FormRules
});

const createFormRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();

const loadUsers = async () => {
    try {
        const res = await userApi.getAllUsers();
        users.value = res.data.data;
    } catch (error) {
        ElMessage.error('加载用户列表失败');
    }
};

const showCreateDialog = () => {
    createDialog.value.form = {
        username: '',
        password: '',
        role: 'user'
    };
    createDialog.value.visible = true;
};

const handleCreate = async () => {
    if (!createFormRef.value) return;
    
    await createFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await userApi.createUser(createDialog.value.form);
                ElMessage.success('创建成功');
                createDialog.value.visible = false;
                loadUsers();
            } catch (error) {
                ElMessage.error('创建失败');
            }
        }
    });
};

const showChangePasswordDialog = (user: any) => {
    passwordDialog.value.currentUser = user;
    passwordDialog.value.form = {
        newPassword: '',
        confirmPassword: ''
    };
    passwordDialog.value.visible = true;
};

const handleChangePassword = async () => {
    if (!passwordFormRef.value || !passwordDialog.value.currentUser) return;
    
    await passwordFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await userApi.changePassword(
                    passwordDialog.value.currentUser.id,
                    passwordDialog.value.form.newPassword
                );
                ElMessage.success('密码修改成功');
                passwordDialog.value.visible = false;
            } catch (error) {
                ElMessage.error('密码修改失败');
            }
        }
    });
};

const handleRoleChange = async (user: any) => {
    try {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        await ElMessageBox.confirm(
            `确认将用户 ${user.username} 的角色改为${newRole === 'admin' ? '管理员' : '普通用户'}？`
        );
        
        await userApi.updateUserRole(user.id, newRole);
        ElMessage.success('修改成功');
        loadUsers();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('修改失败');
        }
    }
};

const handleDelete = async (user: any) => {
    try {
        await ElMessageBox.confirm(
            `确认删除用户 ${user.username}？此操作不可恢复！`,
            '警告',
            {
                type: 'warning'
            }
        );
        
        await userApi.deleteUser(user.id);
        ElMessage.success('删除成功');
        loadUsers();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败');
        }
    }
};

onMounted(() => {
    loadUsers();
});
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style> 