export const extractDatePart = (dateTimeString: string): string => {
  return dateTimeString.split("T")[0];
};

export const compareDatesByDay = (
  dateTimeString1: string,
  dateTimeString2: string
): boolean => {
  const datePart1 = extractDatePart(dateTimeString1);
  const datePart2 = extractDatePart(dateTimeString2);
  return datePart1 === datePart2;
};

export const getCurrentDateISO = (): string => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addMonthsToCurrentDate = (months: number): string => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + months);
  return currentDate.toISOString();
};

export const DateToISODate = (date: string) => {
  if (date) {
    // return new Date(date).toISOString().split("T")[0]; // remove time
    return new Date(date).toISOString(); //get full time and date
  }
  return "";
};

export const DateISOToYYYYMMDD = (dateString: string): string => {
  return dateString.split("T")[0];
};

// export const DateISOToYYYYMMDD = (dateString: string): string => {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };
