import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { ConfigType } from '../rabbitmq.interface';

@Injectable()
export class RabbitmqConfigService {
  constructor(private configService: ConfigService) {}
  private maxReconnectTries: number = 3;
  private reconnectPolicy = true;
  private config: ConfigType = {
    username: this.configService.get<string>('RABBITMQ_USERNAME'),
    password: this.configService.get<string>('RABBITMQ_PASSWORD'),
    appName: this.configService.get<string>('APP_NAME'),
    fanoutExchange: this.configService.get<string>('RABBITMQ_FANOUT_EXCHANGE'),
    heartbeatInterval: this.configService.get<number>(
      'RABBITMQ_HEARTBEAT_INTERVAL',
    ),
    dsn: this.configService.get<string>('RABBITMQ_DSN'),
    directExchange: this.configService.get<string>('RABBITMQ_DIRECT_EXCHANGE'),
    primaryQueue: this.configService.get<string>('RABBITMQ_BILLING_QUEUE'),
    retryQueue: this.configService.get<string>('RABBITMQ_BILLING_RETRY_QUEUE'),
    retryBindingKey: this.configService.get<string>(
      'RABBITMQ_BILLING_RETRY_BINDING_KEY',
    ),
    errorBindingKey: this.configService.get<string>(
      'RABBITMQ_BILLING_ERROR_BINDING_KEY',
    ),
    delayedRetriesNumber: parseInt(
      this.configService.get<string>('FAILED_MESSAGE_DELAYED_RETRIES'),
    ),
    immediateRetriesNumber: parseInt(
      this.configService.get<string>('FAILED_MESSAGE_IMMEDIATE_RETRIES'),
    ),
    retryQueueMessageTtl: parseInt(
      this.configService.get<string>('RETRY_QUEUE_MESSAGE_TTL'),
    ),
    consumeMessageLimit: parseInt(
      this.configService.get<string>('CONSUME_MESSAGE_LIMIT'),
    ),
    dispatchMessageLimit: parseInt(
      this.configService.get<string>('DISPATCH_MESSAGE_LIMIT'),
    ),
  };

  async validateConfig() {
    const requiredVariables = [
      'username',
      'password',
      'appName',
      'fanoutExchange',
      'directExchange',
      'primaryQueue',
      'retryQueue',
      'retryBindingKey',
      'errorBindingKey',
      'delayedRetriesNumber',
      'immediateRetriesNumber',
      'retryQueueMessageTtl',
      'dsn',
      'heartbeatInterval',
    ];

    const missingVariables = requiredVariables.filter(
      (variable) => !this.config[variable],
    );

    if (missingVariables.length === 0)
      console.log('All prerequisites are met for RabbitMQ.');
    else {
      missingVariables.forEach((variable) => {
        console.log(`Missing required environment variable: ${variable}`);
      });
      process.exit(1);
    }
  }

  getConfig() {
    return this.config;
  }

  getConnectionString() {
    return this.config.dsn;
  }

  getConnectionParams() {
    return {
      credentials: amqp.credentials.plain(
        this.config.username,
        this.config.password,
      ),
      heartbeat: this.config.heartbeatInterval || 30,
    };
  }

  getmaxReconnectTrialsData() {
    return {
      maxReconnectTries: this.maxReconnectTries,
      reconnectPolicy: this.reconnectPolicy,
    };
  }
}
