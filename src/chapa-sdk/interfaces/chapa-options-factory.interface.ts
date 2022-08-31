import {
  ChapaOptions,
} from './chapa-options.interface';

export interface ChapaOptionsFactory {
  createChapaOptions():
    | Promise<ChapaOptions>
    | ChapaOptions;
}
