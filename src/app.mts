import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from './utils/websocket.mjs';
import authRoutes from './routes/auth.routes.mjs';
import orderRoutes from './routes/order.routes.mjs';
import statsRoutes from './routes/stats.routes.mjs';
import { config } from './config/index.mjs';

const app = express();
const server = createServer(app);

// 初始化WebSocket服务
WebSocketServer.getInstance(server);

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
    console.error(err.stack);
    res.status(500).json({
        code: 500,
        message: '服务器内部错误'
    });
});

server.listen(config.server.port, () => {
    console.log(`服务器运行在端口 ${config.server.port}`);
}); 