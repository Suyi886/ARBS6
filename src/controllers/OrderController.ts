import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { WebSocketServer } from '../utils/websocket';

export class OrderController {
    private orderService: OrderService;
    private wss: WebSocketServer;

    constructor() {
        this.orderService = new OrderService();
        this.wss = WebSocketServer.getInstance();
    }

    // 创建充值订单
    async createRecharge(req: Request, res: Response) {
        try {
            const { memberId, amount, imageUrl, remark } = req.body;
            const result = await this.orderService.createRechargeOrder({
                memberId,
                amount,
                imageUrl,
                remark
            });
            
            // 通知客户端新订单创建
            this.wss.broadcast('newOrder', {
                type: 'recharge',
                orderNo: result.orderNo
            });
            
            res.json({
                code: 0,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : '未知错误'
            });
        }
    }

    // 创建提现订单
    async createWithdraw(req: Request, res: Response) {
        try {
            const { memberId, memberName, bankName, bankCardNo, amount, remark } = req.body;
            const result = await this.orderService.createWithdrawOrder({
                memberId,
                memberName,
                bankName,
                bankCardNo,
                amount,
                remark
            });

            // 通知客户端新订单创建
            this.wss.broadcast('newOrder', {
                type: 'withdraw',
                orderNo: result.orderNo
            });

            res.json({
                code: 0,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : '未知错误'
            });
        }
    }

    // 更新订单状态
    async updateStatus(req: Request, res: Response) {
        try {
            const { orderNo, status, remark } = req.body;
            await this.orderService.updateOrderStatus(orderNo, status, remark);
            
            // 通知客户端状态更新
            this.wss.broadcast('statusUpdate', {
                orderNo,
                status
            });

            res.json({
                code: 0,
                message: '更新成功'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : '未知错误'
            });
        }
    }

    // 获取充值订单列表
    async getRechargeOrders(req: Request, res: Response) {
        try {
            const result = await this.orderService.getRechargeOrders(req.query);
            res.json({
                code: 0,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : '未知错误'
            });
        }
    }

    // 获取提现订单列表
    async getWithdrawOrders(req: Request, res: Response) {
        try {
            const result = await this.orderService.getWithdrawOrders(req.query);
            res.json({
                code: 0,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
} 