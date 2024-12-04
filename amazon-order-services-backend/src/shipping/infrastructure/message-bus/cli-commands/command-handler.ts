import { RabbitmqModule } from '../rabbitmq.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  await CommandFactory.runWithoutClosing(RabbitmqModule, ['warn', 'error']);
}

bootstrap();
