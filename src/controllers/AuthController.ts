import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

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
            const { username, password } = req.body;
            const result = await this.authService.login(username, password);
            
            res.json({
                code: 0,
                data: result
            });
        } catch (error) {
            res.status(401).json({
                code: 401,
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

            const user = await this.authService.getUserInfo(userId);
            res.json({
                code: 0,
                data: user
            });
        } catch (error) {
            res.status(401).json({
                code: 401,
                message: error instanceof Error ? error.message : '获取用户信息失败'
            });
        }
    }
} 