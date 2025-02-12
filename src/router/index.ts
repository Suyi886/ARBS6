import { createRouter, createWebHistory } from 'vue-router';
import UserCenter from '../views/admin/UserCenter.vue'; // 导入个人中心组件

const routes = [
  // 其他路由...
  {
    path: '/user-center',
    name: 'UserCenter',
    component: UserCenter,
    meta: {
      requiresAuth: true
    }
  },
  // 其他路由...
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 