<template>
  <div class="user-center">
    <el-card class="user-info-card">
      <template #header>
        <div class="card-header">
          <h3>个人信息</h3>
        </div>
      </template>
      
      <div class="info-content">
        <!-- 头像上传区域 -->
        <div class="avatar-container">
          <el-upload
            class="avatar-uploader"
            action="/api/user/avatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="avatar-tip">点击上传头像</div>
        </div>

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

        <!-- 修改密码按钮 -->
        <div class="action-buttons">
          <el-button type="primary" @click="showPasswordDialog">修改密码</el-button>
        </div>
      </div>
    </el-card>

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
        label-width="120px"
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
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword" :loading="changing">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../../stores/user';
import { ElMessage } from 'element-plus';
import type { FormInstance, UploadProps } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

const userStore = useUserStore();
const passwordDialogVisible = ref(false);
const passwordFormRef = ref<FormInstance>();
const changing = ref(false);

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

const showPasswordDialog = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  passwordDialogVisible.value = true;
};

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return;
  
  try {
    await passwordFormRef.value.validate();
    changing.value = true;
    
    // 调用修改密码 API
    await userStore.changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    });
    
    ElMessage.success('密码修改成功');
    passwordDialogVisible.value = false;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '修改密码失败');
  } finally {
    changing.value = false;
  }
};

// 头像上传相关方法
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  if (response.code === 0) {
    userStore.updateAvatar(response.data.avatarUrl);
    ElMessage.success('头像上传成功');
  } else {
    ElMessage.error('头像上传失败');
  }
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!');
  }
  return isJPG && isLt2M;
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

.avatar-container {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}

.avatar-tip {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
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

.action-buttons {
  margin-top: 30px;
  text-align: center;
}
</style> 