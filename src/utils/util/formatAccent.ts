// export const formatRemoveAccents = (str: string): string => {
//   return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
// }
export const formatRemoveAccents = (str: string): string => {
  let text = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return text.replace(/[^a-zA-Z0-9\s]/g, "");
};
