import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const orderController = new OrderController();

// 客户端API路由
router.post('/recharge', authMiddleware, orderController.createRecharge.bind(orderController));
router.post('/withdraw', authMiddleware, orderController.createWithdraw.bind(orderController));
router.post('/status', authMiddleware, orderController.updateStatus.bind(orderController));

// 管理后台API路由
router.get('/admin/recharge', authMiddleware, orderController.getRechargeOrders.bind(orderController));
router.get('/admin/withdraw', authMiddleware, orderController.getWithdrawOrders.bind(orderController));

export default router; 