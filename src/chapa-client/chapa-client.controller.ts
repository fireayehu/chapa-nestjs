/**
 *  ChapaClientController is a testing controller that verifies that
 *  ChapaModule was generated properly.
 *
 *  You can quickly verify this by running `npm run start:dev`, and then
 *  connecting to `http://localhost:3000` with your browser.  It should return
 *  a custom message like `Hello from ChapaModule`.
 *
 *  Once you begin customizing ChapaModule, you'll probably want
 *  to delete this controller.
 */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InitializeOptions } from '../chapa-sdk/interfaces/initialize.interface';
import { VerifyOptions } from '../chapa-sdk/interfaces/verify.interface';
import { ChapaService } from '../chapa-sdk/chapa.service';

@Controller()
export class ChapaClientController {
  constructor(private readonly chapaService: ChapaService) {}

  @Post('initialize')
  async initialize(@Body() initializeOptions: InitializeOptions) {
    const tx_ref = await this.chapaService.generateTransactionReference();
    return this.chapaService.initialize({
      ...initializeOptions,
      tx_ref,
    });
  }

  @Get('verify/:tx_ref')
  verify(@Param() verifyOptions: VerifyOptions) {
    return this.chapaService.verify(verifyOptions);
  }
}
