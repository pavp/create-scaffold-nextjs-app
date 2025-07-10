export const toCamelCaseColor = (str) => {
  return str
    .replace(/^Color/, '')
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => (index === 0 ? match.toLowerCase() : match.toUpperCase()))
    .replace(/\s+/g, '');
};

export const toCamelCaseBreakpoint = (str) => {
  return str
    .replace(/^Breakpoint/, '')
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => (index === 0 ? match.toLowerCase() : match.toUpperCase()))
    .replace(/\s+/g, '');
};

export const toLowerCamelCaseColor = (str) => {
  return str
    .replace(/^color/, '')
    .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
    .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
    .replace(/^[A-Z]/, (match) => match.toLowerCase());
};
