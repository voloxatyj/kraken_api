export enum Crypto {
  'BTC',
  'ETH',
  'BCH'
}

interface PromiseFulfilledResult<T> {
  status: 'fulfilled';
  value: T;
}

interface PromiseRejectedResult {
  status: 'rejected';
  reason: unknown;
}

export interface User_API {
  name: { first: string; last: string };
  email: string;
  phone: string;
  login: { sha256: string };
  count: number;
  typeCount: string;
}

export type PromiseSettledResult<T> = PromiseFulfilledResult<T[]> | PromiseRejectedResult;
