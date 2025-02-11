import WebSocket from 'ws';
import { Server } from 'http';

export class WebSocketServer {
    private static instance: WebSocketServer;
    private wss: WebSocket.Server;
    private clients: Set<WebSocket> = new Set();

    private constructor(server: Server) {
        this.wss = new WebSocket.Server({ server });
        
        this.wss.on('connection', (ws: WebSocket) => {
            this.clients.add(ws);
            
            ws.on('close', () => {
                this.clients.delete(ws);
            });
        });
    }

    public static getInstance(server?: Server): WebSocketServer {
        if (!WebSocketServer.instance && server) {
            WebSocketServer.instance = new WebSocketServer(server);
        }
        return WebSocketServer.instance;
    }

    public broadcast(event: string, data: any) {
        const message = JSON.stringify({ event, data });
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
} 