import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';

interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
    }
}

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response) {
        try {
            console.log('Login request received:', req.body);
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({
                    code: 400,
                    message: '用户名和密码不能为空'
                });
            }

            const result = await this.authService.login(username, password);
            
            if (result.code === 0) {
                res.json(result);
            } else {
                res.status(401).json(result);
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : '登录失败'
            });
        }
    }

    async getUserInfo(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                throw new Error('未登录');
            }

            const result = await this.authService.getUserInfo(userId);
            res.json(result);
        } catch (error) {
            res.status(401).json({
                code: 401,
                message: error instanceof Error ? error.message : '获取用户信息失败'
            });
        }
    }
} 