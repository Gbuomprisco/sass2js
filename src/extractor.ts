import { cleanDefault, isTruthy, split } from './helpers';
import { REGEX } from './regexes';
import * as resolve from 'sass-import-resolve';
import { readFileSync, existsSync } from 'fs';

function resolveImports(source: string): string {
    const imports = resolve('file.scss', source) as string[];
    
    return imports
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
    const content = resolveImports(source);

    return split(content)
        .map(line => line.match(REGEX))
        .filter(isTruthy)
        .reduce((acc: string, match: string[]) => {
            const name = match[1];
            const value = cleanDefault(match[2]);
            
            return acc + createSelector(name, value);
        }, '');
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
 */
function openFile(fileName: string): string {
    if (existsSync(fileName)) {
        return readFileSync(fileName, {encoding : 'utf8'});
    }
}