export const FormattedNumberWithUnit = (num: any) => {
  if (num !== null && num !== undefined) {
    let num_parse = parseInt(num);
    if (num_parse >= 0) {
      if (num_parse >= 1000000000) {
        return `${(num_parse / 1000000000).toFixed(0)}B`;
      } else if (num_parse >= 1000000) {
        return `${(num_parse / 1000000).toFixed(0)}M`;
      } else {
        return num_parse;
      }
    }
  }
};
