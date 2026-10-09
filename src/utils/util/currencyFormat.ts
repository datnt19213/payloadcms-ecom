const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
export const FormattedCurrencyWithDot = (currency: any) => {
  if (currency !== null || currency !== undefined) {
    let currency_parse = parseInt(currency);
    if (currency_parse >= 0) {
      return currencyFormatter.format(currency_parse);
    }
  }
};

export const FormattedCurrencyWithUnit = (currency: any) => {
  if (currency !== null && currency !== undefined) {
    let currency_parse = parseInt(currency);
    if (currency_parse >= 0) {
      if (currency_parse >= 1000000000) {
        return `${(currency_parse / 1000000000).toFixed(0)}B ₫`;
      } else if (currency_parse >= 1000000) {
        return `${(currency_parse / 1000000).toFixed(0)}M ₫`;
      } else {
        return currencyFormatter.format(currency_parse);
      }
    }
  }
};

// #region Number to Words Conversion Function in English

const numberToWords = (num: number): string => {
  const units = ["", "thousand", "million", "billion"];
  const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "ten",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num === 0) return ones[0];

  let words = "";

  const getTriplet = (num: number): string => {
    let tripletWords = "";
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const unit = num % 10;

    if (hundred > 0) {
      tripletWords += `${ones[hundred]} hundred `;
    }
    if (ten > 1) {
      tripletWords += `${tens[ten]} `;
      if (unit > 0) {
        tripletWords += `${ones[unit]} `;
      }
    } else if (ten === 1) {
      if (unit > 0) {
        tripletWords += `${teens[unit - 1]} `;
      } else {
        tripletWords += `${tens[ten]} `;
      }
    } else if (unit > 0) {
      tripletWords += `${ones[unit]} `;
    }

    return tripletWords.trim();
  };

  let unitIndex = 0;
  while (num > 0) {
    const triplet = num % 1000;
    if (triplet > 0) {
      words = `${getTriplet(triplet)} ${units[unitIndex]} ${words}`.trim();
    }
    unitIndex++;
    num = Math.floor(num / 1000);
  }

  return words.trim();
};

// #endregion

export const FormattedCurrencyWithWords = (currency: any): string => {
  if (currency !== null && currency !== undefined) {
    let currencyParse = parseInt(currency);
    if (currencyParse >= 0) {
      if (currencyParse >= 1000000000) {
        const value = (currencyParse / 1000000000).toFixed(0);
        return `${value} billion (${numberToWords(currencyParse)}) ₫`;
      } else if (currencyParse >= 1000000) {
        const value = (currencyParse / 1000000).toFixed(0);
        return `${value} million (${numberToWords(currencyParse)}) ₫`;
      } else if (currencyParse >= 1000) {
        const value = (currencyParse / 1000).toFixed(0);
        return `${value} thousand (${numberToWords(currencyParse)}) ₫`;
      } else {
        return `${numberToWords(currencyParse)} ₫`;
      }
    }
  }
  return "";
};

export const ClearCurrencyDotFormat = (formattedCurrency: string): number => {
  if (formattedCurrency) {
    const cleanedCurrency = formattedCurrency.replace(/[^\d]/g, "");
    return parseInt(cleanedCurrency, 10);
  }
  return 0;
};
