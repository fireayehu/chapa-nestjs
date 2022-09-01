<h1 align="center">
<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://chapa.co/asset/images/logo_svg.svg" width="320" alt="Nest Logo"/>
  </a>
  <p align="center">NestJS package for chapa</p>
</div>
</h1>

## Features

- Initialize Transaction and Get payment link
- Verify Payments

## Installation

**NPM**

```bash
$ npm i -s chapa-nestjs
```

**Yarn**

```bash
$ yarn add chapa-nestjs
```

## Getting started

Once the installation process is complete, we can import the module either synchronously or asynchronosly into the root `AppModule` or any other module.

&nbsp;

### Synchronous configuration

```typescript
import { Module } from '@nestjs/common';
import { ChapaModule } from 'chapa-nestjs';

@Module({
  imports: [
    ChapaModule.register({
      secretKey: 'your-chapa-secret-key',
    }),
  ],
})
export class AppModule {}
```

### Asynchronous configuration

In this example, the module integrates with the awesome [@nestjs/config](https://github.com/nestjs/config) package.

`useFactory` should return an object with `ChapaOptions`.

```typescript
import { Module } from '@nestjs/common';
import { ChapaModule } from 'chapa-nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ChapaModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secretKey: configService.get('SECRET_KEY'),
      }),
    }),
  ],
})
export class AppModule {}
```

> **Note**: You can import this module from not only the root module of your app but also from other feature modules where you want to use it.

&nbsp;

### Initialize Transaction

To initialize a transaction, simply call the `initialize` method from `ChapaService` instance, and pass to it `InitializeOptions` options.

```typescript
await this.chapaService.initialize({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@gmail.com',
  currency: 'ETB',
  amount: '200',
  tx_ref: '02f8a19d-99a5-4598-b90d-3fb5b7a485ab',
});
```

#### InitializeOptions

```typescript
interface InitializeOptions {
  first_name: string;
  last_name: string;
  email: string;
  currency: string;
  amount: string;
  tx_ref: string;
  callback_url?: string;
  'customization[title]'?: string;
  'customization[description]'?: string;
}
```

#### InitializeResponse

```typescript
interface InitializeResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
  };
}
```

### Verify Payment

To verify payment, simply call the `verify` method from `ChapaService` instance, and pass to it `VerifyOptions` options.

```typescript
await this.chapaService.verify({
  tx_ref: '02f8a19d-99a5-4598-b90d-3fb5b7a485ab',
});
```

#### VerifyOptions

```typescript
interface VerifyOptions {
  tx_ref: string;
}
```

#### VerifyResponse

```typescript
interface VerifyResponse {
  message: string;
  status: string;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    currency: string;
    amount: string;
    charge: string;
    mode: string;
    method: string;
    type: string;
    status: string;
    reference: string;
    tx_ref: string;
    customization: {
      title: string;
      description: string;
      logo: string;
    };
    meta: any;
    created_at: Date;
    updated_at: Date;
  };
}
```

## Stay in touch

- Author - Fireayehu Zekarias
- Github - [https://github.com/fireayehu](https://github.com/fireayehu)
- Twitter - [https://twitter.com/Fireayehu](https://twitter.com/Fireayehu)
- LinkedIn - [https://www.linkedin.com/in/fireayehu/](https://www.linkedin.com/in/fireayehu/)

## License

chapa-nestjs is [MIT licensed](LICENSE).
