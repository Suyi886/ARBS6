import { api } from './api';

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