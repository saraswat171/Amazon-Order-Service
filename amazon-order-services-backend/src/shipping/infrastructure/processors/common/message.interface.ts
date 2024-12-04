import { OutBoxStatus } from 'src/shared/enums/outbox-status.enum';

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
