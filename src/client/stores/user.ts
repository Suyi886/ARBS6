import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../services/api';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        userInfo: null as any
    }),
    
    actions: {
        async login(data: { username: string; password: string }) {
            try {
                console.log('发送登录请求:', data);
                const res = await authApi.login(data);
                console.log('登录响应:', res);
                
                if (res.data.code === 0 && res.data.data) {
                    this.token = res.data.data.token;
                    this.userInfo = res.data.data.user;
                    localStorage.setItem('token', this.token);
                    return true;
                } else {
                    throw new Error(res.data.message || '登录失败');
                }
            } catch (error: any) {
                console.error('登录失败:', error);
                if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
                throw error;
            }
        },
        
        logout() {
            this.token = '';
            this.userInfo = null;
            localStorage.removeItem('token');
        },

        async checkAuth() {
            if (!this.token) return false;
            
            try {
                const response = await authApi.getUserInfo();
                if (response.data.code === 0 && response.data.data) {
                    this.userInfo = response.data.data;
                    return true;
                }
                return false;
            } catch (error) {
                this.logout();
                return false;
            }
        }
    },

    getters: {
        isLoggedIn: (state) => !!state.token,
        isAdmin: (state) => state.userInfo?.role === 'admin'
    }
}); 