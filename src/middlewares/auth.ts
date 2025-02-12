import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
    }
}

interface JwtPayload {
    id: string;
    username: string;
    role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                code: 401,
                message: '未登录'
            });
        }

        const decoded = jwt.verify(token, config.server.jwtSecret) as {
            id: string;
            username: string;
            role: string;
        };

        // 将用户信息添加到请求对象中
        (req as any).user = decoded;

        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({
            code: 401,
            message: '登录已过期'
        });
    }
};

// 管理员权限检查中间件
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (user.role !== 'admin') {
        return res.status(403).json({
            code: 403,
            message: '需要管理员权限'
        });
    }

    next();
}; 