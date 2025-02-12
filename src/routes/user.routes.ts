import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();
const userController = new UserController();

// 所有用户路由都需要认证
router.use(authMiddleware);

// 获取所有用户
router.get('/', userController.getAllUsers);

// 创建用户
router.post('/', userController.createUser);

// 更新用户角色
router.put('/:id/role', userController.updateUserRole);

// 修改用户密码
router.put('/:id/password', userController.changePassword);

// 删除用户
router.delete('/:id', userController.deleteUser);

export default router; 