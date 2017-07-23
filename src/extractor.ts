import { cleanDefault, isTruthy, split } from './helpers';
import { REGEX } from './regexes';
import * as resolve from 'sass-import-resolve';
import { readFileSync, existsSync } from 'fs';

/**
 * @name resolveImports
 * @param source 
 */
function resolveImports(source: string): string {  
    return resolve('file.scss', source)
        .map(path => path.replace(/\\/g, ''))
        .map(openFile)
        .filter(isTruthy)
        .map(resolveImports)
        .reduce((acc, curr) => `${curr}\n${acc}`, source);
}

/**
 * @name extract
 * @param source 
 */
export default function extract(source: string): string {
    const imports = resolveImports(source);

    const reducer = (acc: string, match: string[]): string => {
        const name = match[1];
        const value = cleanDefault(match[2]);
        
        return acc + createSelector(name, value);
    };

    return split(imports)
        .map(line => line.match(REGEX))
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
function openFile(path: string): string {
    return existsSync(path) ? readFileSync(path, {encoding : 'utf8'}) : undefined;
}