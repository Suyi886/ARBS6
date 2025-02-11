import { v4 as uuidv4 } from 'uuid';
import { db } from '../utils/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CountResult {
    total: number;
}

export class OrderService {
    // 生成订单号
    private generateOrderNo(prefix: string): string {
        const date = new Date();
        const dateStr = date.getFullYear().toString().substr(2) +
            String(date.getMonth() + 1).padStart(2, '0') +
            String(date.getDate()).padStart(2, '0');
        return `${prefix}${dateStr}${uuidv4().substr(0, 6).toUpperCase()}`;
    }

    // 创建充值订单
    async createRechargeOrder(data: {
        memberId: string;
        amount: number;
        imageUrl: string;
        remark?: string;
    }) {
        const orderNo = this.generateOrderNo('R');
        const result = await db.query(
            `INSERT INTO recharge_orders 
            (order_no, member_id, amount, image_url, remark) 
            VALUES (?, ?, ?, ?, ?)`,
            [orderNo, data.memberId, data.amount, data.imageUrl, data.remark]
        );
        return { orderNo, ...result };
    }

    // 创建提现订单
    async createWithdrawOrder(data: {
        memberId: string;
        memberName: string;
        bankName: string;
        bankCardNo: string;
        amount: number;
        remark?: string;
    }) {
        const orderNo = this.generateOrderNo('W');
        const result = await db.query(
            `INSERT INTO withdraw_orders 
            (order_no, member_id, member_name, bank_name, bank_card_no, amount, remark) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [orderNo, data.memberId, data.memberName, data.bankName, data.bankCardNo, data.amount, data.remark]
        );
        return { orderNo, ...result };
    }

    // 更新订单状态
    async updateOrderStatus(orderNo: string, status: number, remark?: string) {
        const table = orderNo.startsWith('R') ? 'recharge_orders' : 'withdraw_orders';
        const result = await db.query(
            `UPDATE ${table} SET status = ?, remark = ? WHERE order_no = ?`,
            [status, remark, orderNo]
        );
        return result;
    }

    // 获取充值订单列表
    async getRechargeOrders(query: {
        page?: number;
        pageSize?: number;
        status?: number;
        startDate?: string;
        endDate?: string;
    }) {
        const { page = 1, pageSize = 20, status, startDate, endDate } = query;
        const offset = (page - 1) * pageSize;
        
        let sql = 'SELECT * FROM recharge_orders WHERE 1=1';
        const values: any[] = [];
        
        if (status !== undefined) {
            sql += ' AND status = ?';
            values.push(status);
        }
        
        if (startDate) {
            sql += ' AND created_at >= ?';
            values.push(startDate);
        }
        
        if (endDate) {
            sql += ' AND created_at <= ?';
            values.push(endDate);
        }
        
        sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        values.push(pageSize, offset);
        
        const [[rows], [[{ total }]]] = await Promise.all([
            db.query(sql, values),
            db.query('SELECT COUNT(*) as total FROM recharge_orders WHERE 1=1', values)
        ]) as unknown as [[any[]], [[{ total: number }]]];
        
        return {
            list: rows,
            total,
            page,
            pageSize
        };
    }

    // 获取提现订单列表
    async getWithdrawOrders(query: {
        page?: number;
        pageSize?: number;
        status?: number;
        startDate?: string;
        endDate?: string;
    }) {
        const { page = 1, pageSize = 20, status, startDate, endDate } = query;
        const offset = (page - 1) * pageSize;
        
        let sql = 'SELECT * FROM withdraw_orders WHERE 1=1';
        const values: any[] = [];
        
        if (status !== undefined) {
            sql += ' AND status = ?';
            values.push(status);
        }
        
        if (startDate) {
            sql += ' AND created_at >= ?';
            values.push(startDate);
        }
        
        if (endDate) {
            sql += ' AND created_at <= ?';
            values.push(endDate);
        }
        
        sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        values.push(pageSize, offset);
        
        const [[rows], [[{ total }]]] = await Promise.all([
            db.query(sql, values),
            db.query('SELECT COUNT(*) as total FROM withdraw_orders WHERE 1=1', values)
        ]) as unknown as [[any[]], [[{ total: number }]]];
        
        return {
            list: rows,
            total,
            page,
            pageSize
        };
    }
} 