const numberFormat = new Intl.NumberFormat("en-US");

export const toNumberFormat = (value: number) => numberFormat.format(value);
