import undefined from './extract';
import { cleanDefault, isTruthy, split } from './helpers';
import { REGEX, MAP_REGEX, MAP_LINE_REGEX } from './regexes';
import resolve = require('sass-import-resolve');
import { readFileSync, existsSync } from 'fs';

const MAP = 'MAP';
const VARIABLE = 'VARIABLE';

declare type MatchType = 'MAP' | 'VARIABLE';

interface VariableType {
    type: MatchType;
    matches: {
        name: string;
        value: string;
    }
}

/**
 * @param source 
 */
export default function(source: string): string {
    return split(resolveImports(source))
        .map(mapToVariableType)
        .reduce(transformMaps, [])
        .reduce(reduceSelectors, '');
}

/**
 * @name transformMaps
 * @param acc
 * @param variable 
 */
function transformMaps(acc: VariableType[], variable: VariableType): VariableType[] {
    const defaulted = [...acc, variable];

    const maps = acc.filter(v => {
        return v.type === MAP && v.matches.name !== ');';
    }) as VariableType[];

    if (variable.type === VARIABLE || !maps.length) {
        return defaulted;
    }

    const map = maps[maps.length - 1];
    const value = map.matches.name + '\n' + variable.matches.name;

    const concatenated = {
        ...map,
        matches: {
            name: value,
            value
        }
    };

    return acc.map(value => value === map ? concatenated : value);
}

/**
 * @name variableReducer
 */
function variableReducer(acc: string, match: VariableType): string {
    const { name, value } = match.matches;
        
    return acc + createSelector(name, value);
}

/**
 * @name mapReducer
 * @param acc 
 * @param match 
 */
function mapReducer(acc: string, match: VariableType): string {
    const extracted = match.matches.value.match(MAP_REGEX);

    if (!extracted) {
        return acc;
    }

    const initial = match.matches.value.replace(/\n/g, '') + '\n';
    const map = extracted[2];
    const mapName = extracted[1].slice(1, Infinity);

    const values = map ? map
        .trim()
        .split('\n')
        .map(line => line.match(MAP_LINE_REGEX))
        .filter(isTruthy)
        .map(match => match ? ({name: match[1], value: match[2]}) : undefined)
        .filter(isTruthy)
        .reduce((acc, match: any) => {
            const name = 'map--' + mapName + '--' + match.name;

            return acc + createSelector(name, match.value);
        }, initial) : undefined;

    return values ? acc + values : acc;
}

/**
 * @name reduceSelectors
 * @param acc 
 * @param match 
 */
function reduceSelectors(acc: string, match: VariableType): string {
    switch (match.type) {
        case VARIABLE: return variableReducer(acc, match);
        case MAP: return mapReducer(acc, match);
        default: return acc;
    }
};

/**
 * @name mapToVariableType
 * @param line 
 */
function mapToVariableType(line: string): VariableType {
    const matches = line.match(REGEX);
    const type: MatchType = matches ? VARIABLE : MAP;

    return matches ? {
        type,
        matches: {
            name: matches[1],
            value: cleanDefault(matches[2])
        }
    } : {
        type,
        matches: {
            name: line,
            value: line
        }
    };
}

/**
 * @name resolveImports
 * @param source
 */
function resolveImports(source: string): string {
    return resolve('file.scss', source)
        .map((path: string) => path.replace(/\\/g, ''))
        .map(openFile)
        .filter(isTruthy)
        .map(resolveImports)
        .reduce((acc: string, curr: string) => `${curr}\n${acc}`, source);
}

/**
 * @name createSelector
 * @param name 
 * @param value 
 */
function createSelector(name: string, value: string, prefix = '$'): string {
    return `${prefix}${name}: ${value};\n.${name}-selector {prop: ${value}}\n`;
}

/**
 * @name openFile
 * @param path
 */
function openFile(path: string): string {
    return existsSync(path) ? readFileSync(path, {encoding : 'utf8'}) : '';
}