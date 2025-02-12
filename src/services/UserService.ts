import bcrypt from 'bcrypt';
import { db } from '../utils/db.js';

export class UserService {
    async getAllUsers() {
        try {
            const [users] = await db.query(
                'SELECT id, username, role, created_at, updated_at FROM users'
            ) as any[];
            return users;
        } catch (error) {
            console.error('Get all users error:', error);
            throw error;
        }
    }

    async createUser(data: { username: string; password: string; role: string }) {
        try {
            // 检查用户名是否已存在
            const [existing] = await db.query(
                'SELECT id FROM users WHERE username = ?',
                [data.username]
            ) as any[];

            if (existing.length > 0) {
                throw new Error('用户名已存在');
            }

            // 加密密码
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(data.password, salt);

            // 创建用户
            const [result] = await db.query(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [data.username, hashedPassword, data.role]
            ) as any;

            return result.insertId;
        } catch (error) {
            console.error('Create user error:', error);
            throw error;
        }
    }

    async updateUserRole(userId: number, role: string) {
        try {
            await db.query(
                'UPDATE users SET role = ? WHERE id = ?',
                [role, userId]
            );
        } catch (error) {
            console.error('Update user role error:', error);
            throw error;
        }
    }

    async changePassword(userId: number, newPassword: string) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await db.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, userId]
            );
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    }

    async deleteUser(userId: number) {
        try {
            await db.query('DELETE FROM users WHERE id = ?', [userId]);
        } catch (error) {
            console.error('Delete user error:', error);
            throw error;
        }
    }
} 