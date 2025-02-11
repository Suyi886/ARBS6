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
            const res = await authApi.login(data);
            if (res.data.code === 0) {
                this.token = res.data.data.token;
                this.userInfo = res.data.data.user;
                localStorage.setItem('token', this.token);
            } else {
                throw new Error(res.data.message);
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
                this.userInfo = response.data.data;
                return true;
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