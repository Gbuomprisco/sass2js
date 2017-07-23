import * as camelcase from 'camelcase';
import { SELECTOR_REGEX, PROP_REGEX } from './regexes';

export const isTruthy = <T>(val: T): boolean => Boolean(val);
export const split = (source: string): string[] => source.split('\n').filter(isTruthy);
export const cleanValue = (prop: string): string => prop.replace(';', '');
export const cleanDefault = (prop: string): string => prop.replace('!default', '');

export const mapToProp = (line: string): object => {
    const name = line.match(SELECTOR_REGEX)[1];
    const value = cleanValue(line.match(PROP_REGEX)[1]);

    return {[camelcase(name)]: value};
};

export const reducePropObject = (acc, value): object => ({...acc, ...value});