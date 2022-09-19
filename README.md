<h1 align="center">
<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://chapa.co/asset/images/logo_svg.svg" width="320" alt="Nest Logo"/>
  </a>
  <p align="center">NestJS package for chapa</p>
</div>
</h1>

## Features

- Initialize Transaction
- Split Payment
- Verify Payment
- Get Banks
- Create Subaccount
- Generate Transaction Reference (Utiltiy Function)
- Full TypeScript Support

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

### Generate Transaction Reference

This utility method `ChapaService` allows you to generating a customizable random alpha numberic transaction reference.

```typescript
const tx_ref = await this.chapaService.generateTransactionReference(); // result: TX-JHBUVLM7HYMSWDA

// Or with options

const tx_ref = await this.chapaService.generateTransactionReference({
  prefix: 'tx', // defaults to `tx`
  size: 20, // defaults to `15`
});
```

### Initialize Transaction

To initialize a transaction, simply call the `initialize` method from `ChapaService` instance, and pass to it `InitializeOptions` options.

```typescript
// Generate transaction reference using our utility method or provide your own
const tx_ref = await this.chapaService.generateTransactionReference();

const response = await this.chapaService.initialize({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@gmail.com',
  currency: 'ETB',
  amount: '200',
  tx_ref: tx_ref,
  callback_url: 'https://example.com/',
  return_url: 'https://example.com/',
  customization: {
    title: 'Test Title',
    description: 'Test Description',
  },
});
```

#### InitializeOptions

```typescript
enum SplitType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
}

interface Subaccount {
  id: string;
  split_type?: SplitType;
  transaction_charge?: number;
}

interface InitializeOptions {
  first_name: string;
  last_name: string;
  email: string;
  currency: string;
  amount: string;
  tx_ref: string;
  callback_url?: string;
  return_url?: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  subaccounts?: Subaccount[];
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
const response = await this.chapaService.verify({
  tx_ref: 'TX-JHBUVLM7HYMSWDA',
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

### Get Banks

This section describes how to get bank details for all supported banks `Chapa` is working with. `getBanks` method of `ChapaService` instance returns all the Banks information for all currencies. The method does not accept any options.

```typescript
const response = await this.chapaService.getBanks();
```

#### GetBanksResponse

```typescript
interface Data {
  id: string;
  name: string;
  country_id: number;
  created_at: Date;
  updated_at: Date;
}

interface GetBanksResponse {
  message: string;
  data: Data[];
}
```

### Create Subaccount

To create subaccounts, simply call the `createSubaccount` method from `ChapaService` instance, and pass to it `CreateSubaccountOptions` options.

```typescript
const response = await this.chapaService.createSubaccount({
  business_name: 'Test Business',
  account_name: 'John Doe',
  bank_code: '80a510ea-7497-4499-8b49-ac13a3ab7d07', // Get this from the `getBanks()` method
  account_number: '0123456789',
  split_type: SplitType.PERCENTAGE,
  split_value: 0.02,
});
```

#### CreateSubaccountOptions

```typescript
interface CreateSubaccountOptions {
  business_name: string;
  account_name: string;
  bank_code: string;
  account_number: string;
  split_type: SplitType;
  split_value: number;
}
```

#### CreateSubaccountResponse

```typescript
interface CreateSubaccountResponse {
  message: string;
  status: string;
  data: string;
}
```

### Split Payment

Split payments are carried out by first creating a subaccount, then initializing the split payment. The process of implementing split payment is the same as initialize a transaction, with additional options( i.e `subaccounts`) to the `initialize` method of `ChapaService`.

```typescript
// Generate transaction reference using our utility method or provide your own
const tx_ref = await this.chapaService.generateTransactionReference();

const response = this.chapaService.initialize({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@gmail.com',
  currency: 'ETB',
  amount: '200',
  tx_ref: tx_ref,
  callback_url: 'https://example.com/',
  return_url: 'https://example.com/',
  customization: {
    title: 'Test Title',
    description: 'Test Description',
  },
  // Add this for split payment
  subaccounts: [
    {
      id: '80a510ea-7497-4499-8b49-ac13a3ab7d07',
    },
  ],
});
```

#### Overriding The Defaults

When collecting a payment, you can override the default `split_type` and `split_value` you set when creating the subaccount, by specifying these fields in the subaccounts item.

```typescript
  subaccounts: [
    {
      id: '80a510ea-7497-4499-8b49-ac13a3ab7d07',
      split_type: SplitType.FLAT,
      transaction_charge: 25
    },
  ],
```

## Stay in touch

- Author - Fireayehu Zekarias
- Github - [https://github.com/fireayehu](https://github.com/fireayehu)
- Twitter - [https://twitter.com/Fireayehu](https://twitter.com/Fireayehu)
- LinkedIn - [https://www.linkedin.com/in/fireayehu/](https://www.linkedin.com/in/fireayehu/)

## License

chapa-nestjs is [MIT licensed](LICENSE).
