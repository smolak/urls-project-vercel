export const getUsersLocale = () =>
  navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
