import camelcase = require('camelcase');
import { SELECTOR_REGEX, PROP_REGEX, MAP_SELECTOR_REGEX } from './regexes';

export const isTruthy = <T>(val: T): boolean => Boolean(val);
export const split = (source: string): string[] => source.split('\n').filter(isTruthy);
export const cleanValue = (prop: string): string => prop.replace(';', '');
export const cleanDefault = (prop: string): string => prop.replace('!default', '');

/**
 * @name mapToProp
 * @param line
 */
export const mapToProp = (line: string): object | undefined => {
    const map = line.match(MAP_SELECTOR_REGEX);
    const variable = line.match(SELECTOR_REGEX);
    const prop = line.match(PROP_REGEX);
    const name = variable ? variable[1] : undefined;
    const value = prop ? cleanValue(prop[1]) : undefined;

    if (!name || !value) {
        return;
    }

    if (map) {
        const object = {[camelcase(map[1])]: {
            [camelcase(map[2])]: value
        }};

        return object;
    }

    return {[camelcase(name)]: value};
};

/**
 * @name merge
 * @param value 
 * @param target 
 */
const merge = (
    value: {[key: string]: string | object},
    target: {[key: string]: string | object}
): object => {
    const keys = Object.keys(value) as string[];

    return keys
        .filter((key: string) => target.hasOwnProperty(key))
        .map((key: string): object => {
            const source = value[key] as object;
            const second = target[key] as object;

            return {[key]: {
                ...source, ...second
            }};
        })[0];
}

/**
 * @name reducePropObject
 * @param acc 
 * @param value 
 */
export const reducePropObject = (
    acc: {[key: string]: string | object}, 
    value: {[key: string]: string | object}
): object => {
    const merged = {...acc, ...merge(acc, value)};

    return {...value, ...merged};   
};

/**
 * @name transformSassToObject
 * @param source 
 */
export const transformSassToObject = (source: string): object | undefined =>
    split(source)
        .map(mapToProp)
        .filter(isTruthy)
        .reduce(reducePropObject);