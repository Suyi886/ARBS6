import { WebSocket, WebSocketServer as WSServer } from 'ws';
import { Server } from 'http';

export class WebSocketServer {
    private static instance: WebSocketServer;
    private wss: WSServer;

    private constructor(server: Server) {
        this.wss = new WSServer({ server });
        this.init();
    }

    public static getInstance(server: Server): WebSocketServer {
        if (!WebSocketServer.instance) {
            WebSocketServer.instance = new WebSocketServer(server);
        }
        return WebSocketServer.instance;
    }

    private init() {
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('Client connected');

            ws.on('message', (message: string) => {
                console.log('Received:', message);
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }

    public broadcast(message: any) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
} 