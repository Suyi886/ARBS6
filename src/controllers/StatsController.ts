import { Request, Response } from 'express';
import { StatsService } from '../services/StatsService';

export class StatsController {
    private statsService: StatsService;

    constructor() {
        this.statsService = new StatsService();
    }

    async getDashboard(req: Request, res: Response) {
        try {
            const stats = await this.statsService.getDashboardStats();
            res.json({
                code: 0,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : '获取数据失败'
            });
        }
    }

    async getStatistics(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const stats = await this.statsService.getStatistics(
                startDate as string,
                endDate as string
            );
            res.json({
                code: 0,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : '获取数据失败'
            });
        }
    }
} 