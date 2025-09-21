import currency from 'currency.js';

type AppSettings = { [key: string]: any };

const useMoney = ({ settings }: { settings: AppSettings }) => {
  const {
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  } = settings;

  function currencyFormat(amount: number) {
    return currency(amount).dollars() > 0 || !zero_format
      ? currency(amount, {
        separator: thousand_sep,
        decimal: decimal_sep,
        symbol: '',
        precision: cent_precision,
      }).format()
      : 0 +
      currency(amount, {
        separator: thousand_sep,
        decimal: decimal_sep,
        symbol: '',
        precision: cent_precision,
      }).format();
  }

  function moneyFormatter({ amount = 0 }: { amount?: number }) {
    return currency_position === 'before'
      ? currency_symbol + ' ' + currencyFormat(amount)
      : currencyFormat(amount) + ' ' + currency_symbol;
  }

  function amountFormatter({ amount = 0 }: { amount?: number }) {
    return currencyFormat(amount);
  }

  return {
    moneyFormatter,
    amountFormatter,
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  };
};

export default useMoney;
