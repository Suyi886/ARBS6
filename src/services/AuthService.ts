import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db.js';
import { config } from '../config/index.js';

export class AuthService {
    async login(username: string, password: string) {
        try {
            console.log('Login attempt:', { username });

            // 查询用户
            const [users] = await db.query(
                'SELECT * FROM users WHERE username = ?',
                [username]
            ) as any[];

            console.log('Query result:', users);

            const user = users[0];
            if (!user) {
                throw new Error('用户不存在');
            }

            // 验证密码
            const isValid = await bcrypt.compare(password, user.password);
            console.log('Password validation:', isValid);

            if (!isValid) {
                throw new Error('密码错误');
            }

            // 生成 token
            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },
                config.server.jwtSecret,
                { expiresIn: '24h' }
            );

            return {
                code: 0,  // 添加状态码
                data: {   // 包装返回数据
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                code: 500,
                message: error instanceof Error ? error.message : '登录失败'
            };
        }
    }

    async getUserInfo(userId: string) {
        const [users] = await db.query(
            'SELECT id, username, role FROM users WHERE id = ?',
            [userId]
        ) as any[];
        
        return {
            code: 0,
            data: users[0]
        };
    }
} 