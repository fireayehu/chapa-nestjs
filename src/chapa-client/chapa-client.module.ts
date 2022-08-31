/**
 *  ChapaClientModule is a testing module that verifies that
 *  ChapaModule was generated properly.
 *
 *  You can quickly verify this by running `npm run start:dev`, and then
 *  connecting to `http://localhost:3000` with your browser.  It should return
 *  a custom message like `Hello from ChapaModule`.
 *
 *  Once you begin customizing ChapaModule, you'll probably want
 *  to delete this module.
 */
import { Module } from '@nestjs/common';
import { ChapaClientController } from './chapa-client.controller';
import { ChapaModule } from '../chapa.module';

@Module({
  controllers: [ChapaClientController],
  imports: [ChapaModule.register({
    secretKey:"your-chapa-secret"
  })],
})
export class ChapaClientModule {}
