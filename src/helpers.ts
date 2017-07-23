export const isTruthy = <T>(val: T): boolean => Boolean(val);
export const split = (source: string): string[] => source.split('\n').filter(isTruthy);
export const cleanValue = (prop: string): string => prop.replace(';', '');
export const cleanDefault = (prop: string): string => prop.replace('!default', '');