/**
 * Loại bỏ tất cả các ký tự xuống dòng (\n) khỏi một chuỗi.
 * @param input - Chuỗi đầu vào cần xử lý.
 * @returns Chuỗi đã được loại bỏ ký tự xuống dòng.
 */
export const FilterSlashN = (input: string): string => {
  return input.replace(/\n/g, '');
}