export const REGEX = /\$([\S]+):\s([\S\s]+);/;
export const SELECTOR_REGEX = /\b([\S.]+)-selector/;
export const PROP_REGEX = /prop:\s([\S\s]+);/;
export const MAP_REGEX = /(\$\S+):\s*\(\n([\s\S]+)\);/;
export const MAP_LINE_REGEX = /(\$\S+):\s*\(\n\s(\S+):\s(.+)(?:,)/;