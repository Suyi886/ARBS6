import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from './utils/websocket.js';
import authRoutes from './routes/auth.routes.js';
import orderRoutes from './routes/order.routes.js';
import statsRoutes from './routes/stats.routes.js';
import { config } from './config/index.js';

// 全局异常处理
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

const app = express();
const server = createServer(app);

// 初始化WebSocket服务
const wsServer = WebSocketServer.getInstance(server);

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// 错误处理
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Express Error:', err.stack);
    res.status(500).json({
        code: 500,
        message: '服务器内部错误'
    });
});

try {
    server.listen(config.server.port, () => {
        console.log(`服务器运行在端口 ${config.server.port}`);
    });
} catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
}

export default app; 