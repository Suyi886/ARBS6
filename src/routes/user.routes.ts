import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();
const userController = new UserController();

// 需要管理员权限的路由
router.use(authMiddleware);
router.get('/', userController.getAllUsers.bind(userController));
router.post('/', userController.createUser.bind(userController));
router.put('/:userId/role', userController.updateUserRole.bind(userController));
router.delete('/:userId', userController.deleteUser.bind(userController));
router.put('/:userId/password', userController.changePassword.bind(userController));

export default router; 