import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../stores/user';
import UserCenter from '../views/admin/UserCenter.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        component: () => import('../layouts/AdminLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/admin/dashboard'
            },
            {
                path: 'admin/dashboard',
                name: 'Dashboard',
                component: () => import('../views/admin/Dashboard.vue'),
                meta: { title: '数据概览' }
            },
            {
                path: 'admin/recharge',
                name: 'RechargeOrders',
                component: () => import('../views/admin/RechargeOrders.vue'),
                meta: { title: '充值管理' }
            },
            {
                path: 'admin/withdraw',
                name: 'WithdrawOrders',
                component: () => import('../views/admin/WithdrawOrders.vue'),
                meta: { title: '提现管理' }
            },
            {
                path: 'admin/statistics',
                name: 'Statistics',
                component: () => import('../views/admin/Statistics.vue'),
                meta: { title: '统计报表' }
            },
            {
                path: 'admin/users',
                name: 'UserManage',
                component: () => import('../views/admin/UserManage.vue'),
                meta: { 
                    requiresAuth: true,
                    title: '用户管理'
                }
            },
            {
                path: 'user-center',
                name: 'UserCenter',
                component: UserCenter,
                meta: {
                    title: '个人中心',
                    requiresAuth: true
                }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token');
    
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.path === '/login' && isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router; 