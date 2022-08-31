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
import { Controller, Get } from '@nestjs/common';
import { ChapaService } from '../chapa.service';

@Controller()
export class ChapaClientController {
  constructor(private readonly chapaService: ChapaService) {}

  @Get()
  index() {
    return this.chapaService.test();
  }
}
