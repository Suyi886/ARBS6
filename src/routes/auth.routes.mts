import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login.bind(authController));
router.get('/user', authMiddleware, authController.getUserInfo.bind(authController));

export default router; 