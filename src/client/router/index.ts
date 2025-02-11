import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../stores/user';

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
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    
    document.title = `${to.meta.title || '首页'} - 支付系统`;

    if (to.meta.requiresAuth) {
        if (!userStore.isLoggedIn) {
            next('/login');
            return;
        }

        if (!await userStore.checkAuth()) {
            next('/login');
            return;
        }
    }

    next();
});

export default router; 