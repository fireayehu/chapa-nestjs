import { ChapaOptions } from './interfaces';

import { CHAPA_OPTIONS } from './constants';

export function createChapaProviders(
  options: ChapaOptions,
) {
  return [
    {
      provide: CHAPA_OPTIONS,
      useValue: options,
    },
  ];
}
