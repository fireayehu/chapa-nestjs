import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Inject,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { CHAPA_OPTIONS } from './constants';
import { ChapaUrls } from './enums/chapa-urls.enum';
import { ChapaOptions } from './interfaces';
import {
  InitializeOptions,
  InitializeResponse,
} from './interfaces/initialize.interface';
import { VerifyOptions, VerifyResponse } from './interfaces/verify.interface';
import { validateInitializeOptions } from './validations/initialize.validation';
import { validateVerifyOptions } from './validations/verify.validation';

/**
 * Interface for ChapaService
 *
 *
 *
 */
interface IChapaService {
  initialize(initializeOptions: InitializeOptions): Promise<InitializeResponse>;
  verify(VerifyOptions: VerifyOptions): Promise<VerifyResponse>;
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
    private readonly httpService: HttpService,
  ) {}
  async initialize(
    initializeOptions: InitializeOptions,
  ): Promise<InitializeResponse> {
    try {
      await validateInitializeOptions(initializeOptions);

      const response = await this.httpService.axiosRef.post<InitializeResponse>(
        ChapaUrls.INITIALIZE,
        initializeOptions,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else if (error.name === 'ValidationError') {
        throw new BadRequestException(error.errors[0]);
      } else {
        throw error;
      }
    }
  }
  async verify(verifyOptions: VerifyOptions): Promise<VerifyResponse> {
    try {
      await validateVerifyOptions(verifyOptions);
      const response = await this.httpService.axiosRef.get<VerifyResponse>(
        `${ChapaUrls.VERIFY}/${verifyOptions.tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else if (error.name === 'ValidationError') {
        throw new BadRequestException(error.errors[0]);
      } else {
        throw error;
      }
    }
  }
}
