import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            code: 401,
            message: '未登录'
        });
    }

    try {
        const decoded = jwt.verify(token, config.server.jwtSecret) as {
            id: string;
            username: string;
            role: string;
        };
        
        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: '登录已过期'
        });
    }
}; 