export {
  CheckToken,
  CreateLocalStorage,
  RemoveOneLocalStorage,
  UpdateLocalStorage,
  GetLocalStorage,
} from "./util/localStorage";
export {
  FormattedCurrencyWithDot,
  FormattedCurrencyWithUnit,
  FormattedCurrencyWithWords,
  ClearCurrencyDotFormat,
} from "./util/currencyFormat";
export {
  extractDatePart,
  compareDatesByDay,
  getCurrentDateISO,
  addMonthsToCurrentDate,
  DateISOToYYYYMMDD,
} from "./util/dateUtils";
export {formatRemoveAccents} from "./util/formatAccent";
export {formatDate2} from "./util/formatDateTime";
export {FormattedNumberWithUnit} from "./util/formatNumber";
export {convertToSlug} from "./util/convertToSlug";
export {getParams} from "./util/getParams";
export {encryptData, decryptData} from "./util/encodeAndDecode";
export {FilterSlashN} from "./util/filterSlashN";
export {
  capitalizeEachWord,
  capitalizeFirstLetter,
  capitalizeAllLetter,
} from "./util/capitalizeString";
export {truncateText} from "./util/truncateString";
export {GetLastStringFromUrl} from "./util/getLastStringFromURL";
export {RenameFile} from "./util/renameImages";
export {
  buildHierarchy,
  GetLevel1Categories,
  GetLevel2Categories,
  GetLevel3Categories,
} from "./util/categoryHiechieryBuilder";
export {GetStatusColor} from "./util/statusColor";
export {TotalPageOfPaginations} from "./util/paginations";
export {ToValueLabel} from "./util/formatDataToValueLabel";
export {GenerateApiFilterProduct} from "./util/generateApiFilterString";
export {
  GetBgColorFromFirstVowel,
  AdjustColorBrightness,
} from "./util/textToColor";
