import { HttpService } from '@nestjs/axios';
import { Injectable, Inject } from '@nestjs/common';
import { CHAPA_OPTIONS} from './constants';
import { ChapaOptions } from './interfaces';

/**
 * Interface for ChapaService
 *
 * 
 *
 */
interface IChapaService {
  test(): Promise<any>;
}

@Injectable()
/**
 *
 *  The only thing you need to leave intact is the `@Inject(CHAPA_OPTIONS) private chapaOptions`.
 *
 *  That injected dependency gives you access to the options passed in to
 *  ChapaService.
 *
 */
export class ChapaService implements IChapaService {
  constructor(
    @Inject(CHAPA_OPTIONS) private chapaOptions: ChapaOptions,
    private readonly httpService: HttpService
  ) {
  }

  async test(): Promise<any> {
    return 'Hello from ChapaModule!';
  }
}