import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';
import { config } from '../config';

export class AuthService {
    async login(username: string, password: string) {
        try {
            console.log('Attempting login for user:', username);
            const [users] = await db.query(
                'SELECT * FROM users WHERE username = ?',
                [username]
            ) as any[];

            console.log('Query result:', users);

            const user = users[0];
            if (!user) {
                throw new Error('用户不存在');
            }

            const isValid = await bcrypt.compare(password, user.password);
            console.log('Password validation:', isValid);
            
            if (!isValid) {
                throw new Error('密码错误');
            }

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
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async getUserInfo(userId: string) {
        const [users] = await db.query(
            'SELECT id, username, role FROM users WHERE id = ?',
            [userId]
        ) as any[];
        
        return users[0];
    }
} 