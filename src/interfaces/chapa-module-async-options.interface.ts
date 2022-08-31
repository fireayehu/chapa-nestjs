/* Dependencies */
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/* Interfaces */
import {
  ChapaOptions,
} from './chapa-options.interface';
import {
  ChapaOptionsFactory,
} from './chapa-options-factory.interface';

export interface ChapaAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<ChapaOptionsFactory>;
  useClass?: Type<ChapaOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<ChapaOptions> | ChapaOptions;
}