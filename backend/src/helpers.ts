
// ================== Types ==================
import fs from 'fs';
import currency from 'currency.js';
import moment from 'moment';

export type IconFunction = (name: string) => Buffer | null;
export type ImageFunction = (name: string) => Buffer;
export type TimeRangeFunction = (start: string | Date, end: string | Date, format?: string, interval?: number) => string[];
export type CalculateFunction = {
  add: (firstValue: number, secondValue: number) => number;
  sub: (firstValue: number, secondValue: number) => number;
  multiply: (firstValue: number, secondValue: number) => number;
  divide: (firstValue: number, secondValue: number) => number;
};

// ================ Implementation ================

export { moment };

export const icon: IconFunction = (name) => {
  try {
    return fs.readFileSync(`./public/images/icons/${name}.svg`);
  } catch (error) {
    return null;
  }
};

export const image: ImageFunction = (name) => fs.readFileSync(`./public/images/photos/${name}.jpg`);

export const siteName = `Express.js / MongoBD / Rest Api`;

export const timeRange: TimeRangeFunction = (start, end, format, interval) => {
  if (format === undefined) {
    format = 'HH:mm';
  }
  if (interval === undefined) {
    interval = 60;
  }
  interval = interval > 0 ? interval : 60;
  const range: string[] = [];
  let current = moment(start);
  const endMoment = moment(end);
  while (current.isBefore(endMoment)) {
    range.push(current.format(format));
    current = current.clone().add(interval, 'minutes');
  }
  return range;
};

export const calculate: CalculateFunction = {
  add: (firstValue, secondValue) => {
    return currency(firstValue).add(secondValue).value;
  },
  sub: (firstValue, secondValue) => {
    return currency(firstValue).subtract(secondValue).value;
  },
  multiply: (firstValue, secondValue) => {
    return currency(firstValue).multiply(secondValue).value;
  },
  divide: (firstValue, secondValue) => {
    return currency(firstValue).divide(secondValue).value;
  },
};
