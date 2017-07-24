import { cleanDefault, isTruthy, split } from './helpers';
import { REGEX } from './regexes';
import resolve = require('sass-import-resolve');
import { readFileSync, existsSync } from 'fs';

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
 * @param source 
 */
export default function(source: string): string {
    const reducer = (acc: string, match: string[]): string => {
        const name = match[1];
        const value = cleanDefault(match[2]);
        
        return acc + createSelector(name, value);
    };

    const mapper = (line: string): string[] | null => line.match(REGEX);

    return split(resolveImports(source))
        .map(mapper)
        .filter(isTruthy)
        .reduce(reducer, '');
}

/**
 * @name createSelector
 * @param name 
 * @param value 
 */
function createSelector(name: string, value: string): string {
    return `$${name}: ${value};\n.${name}-selector {prop: ${value}}\n`;
}

/**
 * @name openFile
 * @param path
 */
function openFile(path: string): string | undefined {
    return existsSync(path) ? readFileSync(path, {encoding : 'utf8'}) : undefined;
}