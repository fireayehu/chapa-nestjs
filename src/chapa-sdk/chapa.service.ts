import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Inject,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid/async';
import { alphanumeric } from 'nanoid-dictionary';
import { CHAPA_OPTIONS } from './constants';
import { ChapaUrls } from './enums';
import {
  ChapaOptions,
  CreateSubaccountOptions,
  CreateSubaccountResponse,
  GenerateTransactionReferenceOptions,
  GetBanksResponse,
  InitializeOptions,
  InitializeResponse,
  VerifyOptions,
  VerifyResponse,
} from './interfaces';
import {
  validateCreateSubaccountOptions,
  validateInitializeOptions,
  validateVerifyOptions,
} from './validations';

/**
 * Interface for ChapaService
 *
 *
 *
 */
interface IChapaService {
  initialize(initializeOptions: InitializeOptions): Promise<InitializeResponse>;
  mobileInitialize(
    initializeOptions: InitializeOptions,
  ): Promise<InitializeResponse>;
  verify(verifyOptions: VerifyOptions): Promise<VerifyResponse>;
  generateTransactionReference(
    generateTransactionReferenceOptions?: GenerateTransactionReferenceOptions,
  ): Promise<string>;
  getBanks(): Promise<GetBanksResponse>;
  createSubaccount(
    createSubaccountOptions: CreateSubaccountOptions,
  ): Promise<CreateSubaccountResponse>;
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

  async mobileInitialize(
    initializeOptions: InitializeOptions,
  ): Promise<InitializeResponse> {
    try {
      await validateInitializeOptions(initializeOptions);

      const response = await this.httpService.axiosRef.post<InitializeResponse>(
        ChapaUrls.MOBILE_INITIALIZE,
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

  async generateTransactionReference(
    generateTransactionReferenceOptions?: GenerateTransactionReferenceOptions,
  ): Promise<string> {
    const prefix =
      generateTransactionReferenceOptions &&
      generateTransactionReferenceOptions.prefix
        ? generateTransactionReferenceOptions.prefix
        : 'TX';
    const size =
      generateTransactionReferenceOptions &&
      generateTransactionReferenceOptions.size
        ? generateTransactionReferenceOptions.size
        : 15;
    const nanoid = customAlphabet(alphanumeric, size);
    const reference = await nanoid();
    return `${prefix}-${reference.toUpperCase()}`;
  }

  async getBanks(): Promise<GetBanksResponse> {
    try {
      const banks = await this.httpService.axiosRef.get<GetBanksResponse>(
        ChapaUrls.BANKS,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        },
      );
      return banks.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        throw error;
      }
    }
  }

  async createSubaccount(
    createSubaccountOptions: CreateSubaccountOptions,
  ): Promise<CreateSubaccountResponse> {
    try {
      await validateCreateSubaccountOptions(createSubaccountOptions);
      const response =
        await this.httpService.axiosRef.post<CreateSubaccountResponse>(
          ChapaUrls.SUBACCOUNT,
          createSubaccountOptions,
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
