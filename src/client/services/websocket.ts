import { config } from '../config';

export class WebSocketClient {
    private static instance: WebSocketClient;
    private ws: WebSocket | null = null;
    private listeners: Map<string, Set<(data: any) => void>> = new Map();

    private constructor() {
        this.connect();
    }

    public static getInstance(): WebSocketClient {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient();
        }
        return WebSocketClient.instance;
    }

    private connect() {
        this.ws = new WebSocket(config.wsUrl);

        this.ws.onmessage = (event) => {
            const { event: eventName, data } = JSON.parse(event.data);
            this.notifyListeners(eventName, data);
        };

        this.ws.onclose = () => {
            setTimeout(() => this.connect(), 3000); // 断线重连
        };
    }

    public subscribe(event: string, callback: (data: any) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(callback);
    }

    public unsubscribe(event: string, callback: (data: any) => void) {
        this.listeners.get(event)?.delete(callback);
    }

    private notifyListeners(event: string, data: any) {
        this.listeners.get(event)?.forEach(callback => callback(data));
    }
} 