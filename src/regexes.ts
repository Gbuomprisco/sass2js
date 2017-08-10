export const REGEX = /\$([\S]+):\s([\S\s]+);/;
export const SELECTOR_REGEX = /([\S\s]+)-selector/;
export const MAP_SELECTOR_REGEX = /\.map--(\w+)--(\w+)-selector/;
export const PROP_REGEX = /(?:\s*)prop:([\S\s]+);/;
export const MAP_REGEX = /(\$\S+):\s*\(\n([\s\S]+)\);/;
export const MAP_LINE_REGEX = /(\S+):\s(.+)(?:[,]?)/;
export const IMPORTS_REGEX = /@import\s+"(?:\S+)(?:;?)$/;
