import * as signalR from '@microsoft/signalr';
import { getAccessToken } from './tokenService';

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private callbacks: Set<(type: string, data: any) => void> = new Set();

    constructor() {
        this.connection = null;
    }

    async startConnection(hubUrl: string = `https://core.kapradaily.com/hubs/order`): Promise<void> {
        if (this.connection) return;

        try {
            const token = await getAccessToken();

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(hubUrl, {
                    accessTokenFactory: async () => token || '',
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            // Reconnection handlers
            this.connection.onreconnecting((error) => {
                console.log('📡 [SignalR] Reconnecting...', error);
                this.callbacks.forEach(callback => callback('reconnecting', error));
            });

            this.connection.onreconnected((connectionId) => {
                console.log('📡 [SignalR] Reconnected. ID:', connectionId);
                this.callbacks.forEach(callback => callback('reconnected', connectionId));
            });

            // Listen for Order Updates
            this.connection.on('ReceiveOrderUpdate', (data: any) => {
                console.log('📡 [SignalR] Order Update Received (ReceiveOrderUpdate):', data);
                this.callbacks.forEach(callback => callback('orderUpdate', data));
            });

            this.connection.on('OrderStatusUpdated', (data: any) => {
                console.log('📡 [SignalR] Order Status Updated (OrderStatusUpdated):', data);
                this.callbacks.forEach(callback => callback('orderUpdate', data));
            });

            await this.connection.start();
            console.log('📡 [SignalR] Connection Started');
        } catch (err) {
            console.error('📡 [SignalR] Connection Error:', err);
            // Retry logic
            setTimeout(() => this.startConnection(hubUrl), 5000);
        }
    }

    async subscribeToOrder(orderId: string | number): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            console.warn('📡 [SignalR] Cannot subscribe: connection not established');
            return;
        }
        try {
            await this.connection.invoke("SubscribeOrder", orderId);
            console.log('📡 [SignalR] Subscribed to order:', orderId);
        } catch (err) {
            console.error('📡 [SignalR] Subscription Error:', err);
        }
    }

    async stopConnection(): Promise<void> {
        if (!this.connection) return;
        try {
            await this.connection.stop();
            this.connection = null;
            console.log('📡 [SignalR] Connection Stopped');
        } catch (err) {
            console.error('📡 [SignalR] Stop Connection Error:', err);
        }
    }

    onEvent(callback: (type: string, data: any) => void): () => boolean {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }
}

const signalRService = new SignalRService();
export default signalRService;
