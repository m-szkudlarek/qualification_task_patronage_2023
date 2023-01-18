export function wordToCamelcase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
export function returnStringInLang(lang, stringPl, stringEn) {
  return lang === "PL" ? stringPl : stringEn;
}
