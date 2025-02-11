import { Request, Response } from 'express';
import { StatisticsService } from '../services/StatisticsService';

export class StatisticsController {
    private statisticsService: StatisticsService;

    constructor() {
        this.statisticsService = new StatisticsService();
    }

    async getDailyStatistics(req: Request, res: Response) {
        try {
            const { date } = req.query;
            const result = await this.statisticsService.getDailyStatistics(date as string);
            
            res.json({
                code: 0,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '获取统计数据失败'
            });
        }
    }

    async getTrendStatistics(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const result = await this.statisticsService.getTrendStatistics(
                startDate as string,
                endDate as string
            );
            
            res.json({
                code: 0,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '获取趋势数据失败'
            });
        }
    }
} 