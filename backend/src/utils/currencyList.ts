// ========== Types ==========
export type CurrencyListItem = {
  currency_symbol: string;
  currency_position: 'before' | 'after';
  decimal_sep: string;
  thousand_sep: string;
  cent_precision: number;
  zero_format: boolean;
  currency_name: string;
  currency_code: string;
  enabled: boolean;
};

// ========== Implementation ==========
export const currencyList: CurrencyListItem[] = [
  {
    currency_symbol: '$',
    currency_position: 'before',
    decimal_sep: '.',
    thousand_sep: ',',
    cent_precision: 2,
    zero_format: true,
    currency_name: 'US Dollar',
    currency_code: 'USD',
    enabled: true,
  },
  {
    currency_symbol: '€',
    currency_position: 'after',
    decimal_sep: '.',
    thousand_sep: ' ',
    cent_precision: 2,
    zero_format: true,
    currency_name: 'Euro',
    currency_code: 'EUR',
    enabled: true,
  },
];
