import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignatureTypes } from '../processors/common/signature-types.service';
import { RabbitMQConsumeMessage } from './rabbitmq/rabbitmq.interface';
import { RabbitmqConnectionService } from './rabbitmq/config/rabbitmq-connection.service';
import { InboxMessageRepository } from '../repositories/billing-inbox-message/inbox-message.repository';


@Injectable()
export class InboxMessageHandler {
  constructor(
    private readonly rabbitmqConnectionService: RabbitmqConnectionService,
    private readonly signatureTypes: SignatureTypes,
    @InjectRepository(InboxMessageRepository)
    private inboxMessageRepository: InboxMessageRepository,
  ) {}

  getSignatureType() {
    return Object.keys(this.signatureTypes.getSignatureTypes());
  }

  async handleMessage(
    message: RabbitMQConsumeMessage,
    max_retry_counts: number,
  ) {
    const messageId = message.properties.messageId;
    const message_type =
      message.properties.type || message.properties.headers.type;
    const signatureTypes = this.signatureTypes.getSignatureTypes();
    const handlers = signatureTypes[message_type];
    for (const handler of handlers) {
      let retryCount = max_retry_counts;
      const duplicateMessage =
        await this.inboxMessageRepository.getDuplicateInboxMessage(
          messageId,
          handler.getHandlerName(),
        );
      if (duplicateMessage) {
        console.log(
          `INFO Message with id ${messageId} already handled with ${handler.getHandlerName()}. Duplicate message ignored.`,
        );
        continue;
      }
      const parsedMessage =
        this.rabbitmqConnectionService.robustParseMessageContent(message);

      console.log(
        'INFO Handling message with the following parsed content:',
        parsedMessage,
      );

      const message_obj = {
        messageId: messageId,
        body: parsedMessage,
      };

      let err: Error;

      while (retryCount >= 0) {
        try {
          console.log(
            `INFO Handling message with messageId: ${messageId} and handler ${handler.getHandlerName()}`,
          );
          await handler.handleEvent(message_obj);
          console.log(`INFO Message ${messageId} handled successfully.`);
          break;
        } catch (error) {
          retryCount--;
          err = error;
        }
      }

      if (retryCount < 0) throw err;
    }
  }
}
