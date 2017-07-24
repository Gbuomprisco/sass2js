import camelcase = require('camelcase');
import { SELECTOR_REGEX, PROP_REGEX } from './regexes';

export const isTruthy = <T>(val: T): boolean => Boolean(val);
export const split = (source: string): string[] => source.split('\n').filter(isTruthy);
export const cleanValue = (prop: string): string => prop.replace(';', '');
export const cleanDefault = (prop: string): string => prop.replace('!default', '');

export const mapToProp = (line: string): object | undefined => {
    const selector = line.match(SELECTOR_REGEX);
    const prop = line.match(PROP_REGEX);
    const name = selector ? selector[1] : undefined;
    const value = prop ? cleanValue(prop[1]) : undefined;

    if (!name || !value) {
        return;
    }

    return {[camelcase(name)]: value};
};

export const reducePropObject = (acc: object, value: object): object => ({...acc, ...value});
export const transformSassToObject = (source: string): object | undefined =>
    split(source)
        .map(mapToProp)
        .filter(isTruthy)
        .reduce(reducePropObject);