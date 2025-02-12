import axios from 'axios';
import { useUserStore } from '../stores/user';

// 创建axios实例
const instance = axios.create({
    baseURL: '/api'
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        const userStore = useUserStore();
        if (userStore.token) {
            config.headers.Authorization = `Bearer ${userStore.token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            const userStore = useUserStore();
            userStore.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 认证相关API
export const authApi = {
    login: (data: { username: string; password: string }) => {
        console.log('API 登录请求:', data);
        return instance.post('/auth/login', data);
    },
    getUserInfo: () => instance.get('/auth/user')
};

// 订单相关API
export const orderApi = {
    // 充值订单
    createRecharge: (data: {
        memberId: string;
        amount: number;
        imageUrl: string;
        remark?: string;
    }) => instance.post('/orders/recharge', data),

    getRechargeOrders: (params: any) => 
        instance.get('/orders/recharge', { params }),

    // 提现订单
    createWithdraw: (data: {
        memberId: string;
        memberName: string;
        bankName: string;
        bankCardNo: string;
        amount: number;
        remark?: string;
    }) => instance.post('/orders/withdraw', data),

    getWithdrawOrders: (params: any) => 
        instance.get('/orders/withdraw', { params }),

    // 更新订单状态
    updateStatus: (data: { orderNo: string; status: number; remark?: string }) => 
        instance.post('/orders/update-status', data)
};

export const statsApi = {
    getDashboard: () => 
        instance.get('/stats/dashboard'),
    getStatistics: (params: { startDate: string; endDate: string }) => 
        instance.get('/stats/report', { params })
};

// 用户管理相关API
export const userApi = {
    getAllUsers: () => 
        instance.get('/users'),
    
    createUser: (data: {
        username: string;
        password: string;
        role: string;
    }) => instance.post('/users', data),
    
    updateUserRole: (userId: number, role: string) => 
        instance.put(`/users/${userId}/role`, { role }),
    
    deleteUser: (userId: number) => 
        instance.delete(`/users/${userId}`),
    
    changePassword: (userId: number, newPassword: string) => 
        instance.put(`/users/${userId}/password`, { newPassword })
}; 