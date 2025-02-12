import bcrypt from 'bcrypt';

async function verifyPassword(password: string, hash: string) {
    const isValid = await bcrypt.compare(password, hash);
    console.log('Password valid:', isValid);
}

// 使用示例
const password = 'admin123';
const hash = '$2b$10$s5pU1qj43Jh8Y9DZw3qQT.LqpzjZVsw17ZwB5WBw3cNOZwPBfeePi';
verifyPassword(password, hash);