import axios from 'axios';

// 创建axios实例
export const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    timeout: 10000
});

// 请求拦截器
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 认证相关API
export const authApi = {
    login: (data: {
        username: string;
        password: string;
    }) => api.post('/auth/login', data),

    getUserInfo: () => api.get('/auth/user'),

    changePassword: (data: {
        oldPassword: string;
        newPassword: string;
    }) => api.post('/auth/change-password', data)
};

// 订单相关API
export const orderApi = {
    // 充值订单
    createRecharge: (data: {
        memberId: string;
        amount: number;
        imageUrl: string;
        remark?: string;
    }) => api.post('/orders/recharge', data),

    getRechargeOrders: (params: {
        page?: number;
        pageSize?: number;
        status?: number;
        startDate?: string;
        endDate?: string;
    }) => api.get('/orders/recharge', { params }),

    // 提现订单
    createWithdraw: (data: {
        memberId: string;
        memberName: string;
        bankName: string;
        bankCardNo: string;
        amount: number;
        remark?: string;
    }) => api.post('/orders/withdraw', data),

    getWithdrawOrders: (params: {
        page?: number;
        pageSize?: number;
        status?: number;
        startDate?: string;
        endDate?: string;
    }) => api.get('/orders/withdraw', { params }),

    // 更新订单状态
    updateStatus: (data: {
        orderNo: string;
        status: number;
        remark?: string;
    }) => api.post('/orders/status', data)
}; 