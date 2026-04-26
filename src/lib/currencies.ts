export interface CurrencyDef {
  code: string;
  symbol: string;
  symbolAfter: boolean;
  decimals: number;
}

export const CURRENCIES: CurrencyDef[] = [
  { code: 'EUR', symbol: '€', symbolAfter: true, decimals: 2 },
  { code: 'USD', symbol: '$', symbolAfter: false, decimals: 2 },
  { code: 'GBP', symbol: '£', symbolAfter: false, decimals: 2 },
];

export function getCurrency(code: string): CurrencyDef {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function formatAmount(n: number, currencyCode = 'EUR'): string {
  const cur = getCurrency(currencyCode);
  const abs = Math.abs(n).toFixed(cur.decimals);
  const [int, dec] = abs.split('.');
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const numStr = cur.decimals > 0 ? intFmt + ',' + dec : intFmt;
  const sign = n < 0 ? '- ' : '';
  return cur.symbolAfter
    ? sign + numStr + ' ' + cur.symbol
    : sign + cur.symbol + numStr;
}
