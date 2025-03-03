import mysql from 'mysql2/promise';
import { config } from '../config/index.js';

const pool = mysql.createPool({
    ...config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const db = {
    query: async (sql: string, values?: any[]) => {
        try {
            const [rows] = await pool.query(sql, values);
            return [rows];
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }
};