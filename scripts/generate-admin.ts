import bcrypt from 'bcrypt';
import { db } from '../src/utils/db.js';

async function createAdmin() {
    try {
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            ['admin', hashedPassword, 'admin']
        );

        console.log('管理员账号创建成功');
        console.log('用户名: admin');
        console.log('密码: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('创建管理员账号失败:', error);
        process.exit(1);
    }
}

createAdmin(); 