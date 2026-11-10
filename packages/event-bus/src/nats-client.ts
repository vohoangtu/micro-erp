import { connect, NatsConnection, JSONCodec, Subscription } from 'nats';
import { EventChannels } from '@erp/shared-types';

export class EventBus {
  private static instance: EventBus;
  private nc: NatsConnection | null = null;
  private jc = JSONCodec();
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public async connect(url: string = process.env.NATS_URL || 'nats://localhost:4222'): Promise<void> {
    if (this.nc || this.isConnecting) return;
    this.isConnecting = true;
    try {
      this.nc = await connect({ servers: url, reconnect: true, maxReconnectAttempts: -1 });
      console.log(`[EventBus] Connected to NATS at ${url}`);
    } catch (err) {
      console.warn(`[EventBus] Warning: Could not connect to NATS at ${url}. Operating in local memory fallback.`);
    } finally {
      this.isConnecting = false;
    }
  }

  public async publish<T>(subject: string | EventChannels, data: T): Promise<void> {
    if (!this.nc) {
      console.log(`[EventBus:MemoryFallback] Published to ${subject}:`, JSON.stringify(data));
      return;
    }
    try {
      this.nc.publish(subject, this.jc.encode(data));
    } catch (err) {
      console.error(`[EventBus] Publish error on ${subject}:`, err);
    }
  }

  public async subscribe<T>(
    subject: string | EventChannels,
    handler: (data: T) => Promise<void> | void
  ): Promise<() => void> {
    if (!this.nc) {
      console.log(`[EventBus:MemoryFallback] Subscribed to ${subject}`);
      return () => {};
    }
    const sub: Subscription = this.nc.subscribe(subject);
    (async () => {
      for await (const msg of sub) {
        try {
          const data = this.jc.decode(msg.data) as T;
          await handler(data);
        } catch (err) {
          console.error(`[EventBus] Error handling message on ${subject}:`, err);
        }
      }
    })();

    return () => sub.unsubscribe();
  }

  public async close(): Promise<void> {
    if (this.nc) {
      await this.nc.drain();
      this.nc = null;
    }
  }
}

export const eventBus = EventBus.getInstance();
