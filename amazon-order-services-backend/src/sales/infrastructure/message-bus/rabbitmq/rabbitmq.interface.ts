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
