import { OutBoxStatus } from "../enums/outbox-status.enum";


interface MessageHeaders {
  type: string;
  content_type: string;
}

interface MessageProperties {
  messageId: string;
  type: string;
  appId: string;
  contentType: string;
  headers: MessageHeaders;
}

export interface Message<T> {
  id: number;
  messageId: string;
  type: string;
  headers: MessageHeaders;
  properties: MessageProperties;
  body: T;
  status: OutBoxStatus;
  sent_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
export interface ConfigType {
    username: string;
    password: string;
    appName: string;
    fanoutExchange: string;
    heartbeatInterval: number;
    dsn: string;
    directExchange: string;
    primaryQueue: string;
    retryQueue: string;
    retryBindingKey: string;
    errorBindingKey: string;
    delayedRetriesNumber: number;
    immediateRetriesNumber: number;
    retryQueueMessageTtl: number;
    consumeMessageLimit: number;
    dispatchMessageLimit: number;
  }
  
  export interface RabbitMQPublishMessage {
    exchange: string;
    bindingKey: string;
    content: string;
    properties: any;
  }
  
  export interface QueueConfig {
    durable: boolean;
    deadLetterExchange?: string;
    messageTtl?: number;
  }
  
  export interface RabbitMQConsumeMessage {
    fields: {
      consumerTag: string;
      deliveryTag: number;
      redelivered: boolean;
      exchange: string;
      routingKey: string;
    };
    properties: {
      contentType: string;
      contentEncoding?: string;
      headers: {
        content_type: string;
        type: string;
      };
      deliveryMode: number;
      priority?: number;
      correlationId?: string;
      replyTo?: string;
      expiration?: number;
      messageId: string;
      timestamp?: number;
      type: string;
      userId?: string;
      appId: string;
      clusterId?: string;
    };
    content: Buffer;
  }
  
  export interface InboxMessagePayload {
    message_id: string;
    handler_name: string;
  }
  
