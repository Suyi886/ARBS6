import { Router } from 'express';
import { StatsController } from '../controllers/StatsController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const statsController = new StatsController();

router.get('/dashboard', authMiddleware, statsController.getDashboard.bind(statsController));
router.get('/report', authMiddleware, statsController.getStatistics.bind(statsController));

export default router; 