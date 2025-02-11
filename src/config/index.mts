export const config = {
    server: {
        port: 3000,
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
    },
    database: {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'payment_system'
    }
}; 