import { db } from '../utils/db.js';
import bcrypt from 'bcrypt';

export class UserService {
    async createUser(data: {
        username: string;
        password: string;
        role?: string;
    }) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        
        const [result] = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [data.username, hashedPassword, data.role || 'user']
        ) as any;

        return result.insertId;
    }

    async getAllUsers() {
        const [users] = await db.query(
            'SELECT id, username, role, created_at, updated_at FROM users ORDER BY created_at DESC'
        ) as any;
        
        return users;
    }

    async updateUserRole(userId: number, role: string) {
        await db.query(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, userId]
        );
    }

    async deleteUser(userId: number) {
        await db.query('DELETE FROM users WHERE id = ?', [userId]);
    }

    async changePassword(userId: number, newPassword: string) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );
    }
} 