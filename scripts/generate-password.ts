import bcrypt from 'bcrypt';

async function generateHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hash);
}

generateHash('admin123'); 