import { db } from '../utils/db';
import dayjs from 'dayjs';

export class StatsService {
    async getDashboardStats() {
        const today = dayjs().format('YYYY-MM-DD');
        
        const [rechargeStats] = await db.query(`
            SELECT 
                COUNT(*) as todayCount,
                SUM(amount) as todayAmount,
                COUNT(CASE WHEN status = 0 THEN 1 END) as pendingCount
            FROM recharge_orders 
            WHERE DATE(created_at) = ?
        `, [today]) as any[];

        const [withdrawStats] = await db.query(`
            SELECT 
                COUNT(*) as todayCount,
                SUM(amount) as todayAmount,
                COUNT(CASE WHEN status = 0 THEN 1 END) as pendingCount
            FROM withdraw_orders 
            WHERE DATE(created_at) = ?
        `, [today]) as any[];

        return {
            recharge: {
                todayCount: rechargeStats[0].todayCount || 0,
                todayAmount: rechargeStats[0].todayAmount || 0,
                pendingCount: rechargeStats[0].pendingCount || 0
            },
            withdraw: {
                todayCount: withdrawStats[0].todayCount || 0,
                todayAmount: withdrawStats[0].todayAmount || 0,
                pendingCount: withdrawStats[0].pendingCount || 0
            }
        };
    }

    async getStatistics(startDate: string, endDate: string) {
        const [rechargeStats] = await db.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count,
                SUM(amount) as amount
            FROM recharge_orders 
            WHERE DATE(created_at) BETWEEN ? AND ?
            GROUP BY DATE(created_at)
            ORDER BY date
        `, [startDate, endDate]) as any[];

        const [withdrawStats] = await db.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count,
                SUM(amount) as amount
            FROM withdraw_orders 
            WHERE DATE(created_at) BETWEEN ? AND ?
            GROUP BY DATE(created_at)
            ORDER BY date
        `, [startDate, endDate]) as any[];

        const [totals] = await db.query(`
            SELECT 
                (SELECT SUM(amount) FROM recharge_orders WHERE status = 1) as totalRecharge,
                (SELECT SUM(amount) FROM withdraw_orders WHERE status = 1) as totalWithdraw
        `) as any[];

        return {
            rechargeStats,
            withdrawStats,
            summary: {
                totalRechargeAmount: totals[0].totalRecharge || 0,
                totalWithdrawAmount: totals[0].totalWithdraw || 0,
                netIncome: (totals[0].totalRecharge || 0) - (totals[0].totalWithdraw || 0)
            }
        };
    }
} 