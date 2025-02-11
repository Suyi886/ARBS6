import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
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
        component: () => import('../layouts/DefaultLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            // 客户端路由
            {
                path: '',
                name: 'Home',
                component: () => import('../views/Home.vue')
            },
            {
                path: 'recharge',
                name: 'Recharge',
                component: () => import('../components/RechargeOrder.vue')
            },
            {
                path: 'withdraw',
                name: 'Withdraw',
                component: () => import('../components/WithdrawOrder.vue')
            },
            // 管理后台路由
            {
                path: 'admin',
                component: () => import('../layouts/AdminLayout.vue'),
                meta: { requiresAdmin: true },
                children: [
                    {
                        path: 'recharge',
                        name: 'AdminRecharge',
                        component: () => import('../components/admin/RechargeOrderManage.vue')
                    },
                    {
                        path: 'withdraw',
                        name: 'AdminWithdraw',
                        component: () => import('../components/admin/WithdrawOrderManage.vue')
                    },
                    {
                        path: 'statistics',
                        name: 'Statistics',
                        component: () => import('../views/admin/Statistics.vue')
                    }
                ]
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
        next({ name: 'Login' });
    } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

export default router; 