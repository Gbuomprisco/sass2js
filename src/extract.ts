import { cleanDefault, isTruthy, split } from './helpers';
import { REGEX, MAP_REGEX, MAP_LINE_REGEX, IMPORTS_REGEX } from './regexes';
import resolver = require('sass-import-resolve');
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

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
export default async function(source: string): Promise<string> {
    const imports = resolveImports(source);
    const styles = split(imports)
        .map(mapToType)
        .filter(isTruthy)
        .reduce(transformMaps, [])
        .reduce(reduceSelectors, '');

    return styles;
}

/**
 * @name transformMaps
 * @param acc
 * @param variable 
 */
function transformMaps(acc: VariableType[], variable: VariableType): VariableType[] {
    const defaulted = [...acc, variable];

    const maps = acc.filter(v => {
        return v.type === MAP;
    }) as VariableType[];

    const map = maps[maps.length - 1];

    if (variable.type === VARIABLE || !maps.length || !map) {
        return defaulted;
    }
    
    const concatenate = map.matches.value.trim().endsWith(');');
    const value = concatenate === false ?
        map.matches.value + '\n' + variable.matches.value : variable.matches.value;

    const newMap = {
        type: MAP,
        matches: {
            name: value,
            value
        }
    } as VariableType;

    return concatenate ? [...acc, newMap] : 
        acc.map(value => value === map ? newMap : value);
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

    const initial = match.matches.value;
    const map = extracted[2];
    const clean = (name: string): string => name.slice(1, Infinity);
    const mapName = clean(extracted[1]);

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
}

/**
 * @name mapToType
 * @param line 
 */
function mapToType(line: string): VariableType | undefined {
    if (line.match(IMPORTS_REGEX)) {
        return;
    }

    const matches = line.match(REGEX);

    return matches ? createVariableType(matches) : createMapType(line.trim());
}

function createMapType(line: string): VariableType {
    if (line[0] !== ')' && line[0] !== '$') {
        line = '\t' + line;
    } else {
        line = line + '\n';
    }

    return {
        type: MAP,
        matches: {
            name: line,
            value: line
        }
    };
}

function createVariableType(matches: RegExpMatchArray): VariableType {
    return {
        type: VARIABLE,
        matches: {
            name: matches[1],
            value: cleanDefault(matches[2])
        }
    };
}

/**
 * @name resolveImports
 * @param source
 */
function resolveImports(source: string): string {
    return resolver('file.scss', source)
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
    return `${prefix}${name}: ${value};\n.${name}-selector {\n\tprop:${value.trim()}\n}\n\n`;
}

/**
 * @name openFile
 * @param file
 */
function openFile(file: string): string {
    return existsSync(file) ? readFileSync(file, {encoding : 'utf8'}) : '';
}