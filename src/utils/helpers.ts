import fetch from 'node-fetch';
import { Crypto } from './types';

export const countAmount = (type: string, count: number, currency, userId: number) => {
  const [btc, eth] = currency;

  if (type === 'BTC') {
    return {
      AUD: Math.floor(btc.value.result.XBTAUD.o * count),
      CAD: Math.floor(btc.value.result.XXBTZCAD.o * count),
      CHF: Math.floor(btc.value.result.XBTCHF.o * count),
      EUR: Math.floor(btc.value.result.XXBTZEUR.o * count),
      GBP: Math.floor(btc.value.result.XXBTZGBP.o * count),
      JPY: Math.floor(btc.value.result.XXBTZJPY.o * count),
      USD: Math.floor(btc.value.result.XXBTZUSD.o * count),
      userId,
    };
  }

  return {
    AUD: Math.floor(eth.value.result.ETHAUD.o * count),
    CAD: Math.floor(eth.value.result.XETHZCAD.o * count),
    CHF: Math.floor(eth.value.result.ETHCHF.o * count),
    EUR: Math.floor(eth.value.result.XETHZEUR.o * count),
    GBP: Math.floor(eth.value.result.XETHZGBP.o * count),
    JPY: Math.floor(eth.value.result.XETHZJPY.o * count),
    USD: Math.floor(eth.value.result.XETHZUSD.o * count),
    userId,
  };
};

export const getCurrencyAPI = async (params: string) => {
  const baseDomain = 'https://api.kraken.com';
  const endPointName = 'Ticker';
  const publicPath = '/0/public/';
  const inputParameters = `pair=${params}usd,${params}eur,${params}cad,${params}jpy,${params}gbp,${params}chf,${params}aud`;
  const apiEndpointFullURL = `${baseDomain}${publicPath}${endPointName}?${inputParameters}`;

  const res = await fetch(apiEndpointFullURL);
  const data = await res.json();
  return data;
};

export const getAllParamsCurrencies = () => {
  const promises = [];

  for (const value of enumKeys(Crypto)) {
    const params = value.toLowerCase();
    promises.push(getCurrencyAPI(params));
  }

  return promises;
};

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}
