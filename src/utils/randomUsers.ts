import fetch from 'node-fetch';
import { getAllParamsCurrencies } from './helpers';
import { User_API, PromiseSettledResult, Crypto } from './types';

export const randomUsers = async <T>(
  amount: string,
): Promise<{ users: User_API[]; currency: PromiseSettledResult<T>[] }> => {
  const res = await fetch(
    `https://randomuser.me/api/?results=${amount}&inc=name,email,phone,login&noinfo`,
  );
  const { results } = await res.json();
  const promises = getAllParamsCurrencies();

  const users: User_API[] = results.map((user: User_API) => {
    const type_of_crypto = Crypto[getRandomNum(0, 1)] as keyof typeof Crypto;
    const rnd_amount = getRandomNum(0, 500);
    user.count = rnd_amount;
    user.typeCount = type_of_crypto;
    return user;
  });

  const currency = await Promise.allSettled(promises);

  return { users, currency };
};

function getRandomNum(min: number, max: number) {
  const min_num = Math.ceil(min);
  const max_num = Math.floor(max);
  return Math.floor(Math.random() * (max_num - min_num + 1)) + min_num;
}
