import { db } from '../utils/db';

export class StatisticsService {
    // 获取每日统计数据
    async getDailyStatistics(date: string) {
        const result = await db.query(`
            SELECT
                'recharge' as type,
                COUNT(*) as total_count,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as success_count,
                SUM(CASE WHEN status = 1 THEN amount ELSE 0 END) as success_amount
            FROM recharge_orders
            WHERE DATE(created_at) = ?
            UNION ALL
            SELECT
                'withdraw' as type,
                COUNT(*) as total_count,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as success_count,
                SUM(CASE WHEN status = 1 THEN amount ELSE 0 END) as success_amount
            FROM withdraw_orders
            WHERE DATE(created_at) = ?
        `, [date, date]);

        return result;
    }

    // 获取日期范围内的趋势数据
    async getTrendStatistics(startDate: string, endDate: string) {
        const result = await db.query(`
            SELECT
                DATE(created_at) as date,
                'recharge' as type,
                COUNT(*) as total_count,
                SUM(CASE WHEN status = 1 THEN amount ELSE 0 END) as success_amount
            FROM recharge_orders
            WHERE DATE(created_at) BETWEEN ? AND ?
            GROUP BY DATE(created_at)
            UNION ALL
            SELECT
                DATE(created_at) as date,
                'withdraw' as type,
                COUNT(*) as total_count,
                SUM(CASE WHEN status = 1 THEN amount ELSE 0 END) as success_amount
            FROM withdraw_orders
            WHERE DATE(created_at) BETWEEN ? AND ?
            GROUP BY DATE(created_at)
            ORDER BY date, type
        `, [startDate, endDate, startDate, endDate]);

        return result;
    }
} 