import * as v8 from 'v8';
import { loader } from "webpack";
import * as camelcase from 'camelcase';

import { compileToSass } from './compile';
import { SELECTOR_REGEX, PROP_REGEX } from './regexes';
import { cleanValue, isTruthy, split } from './helpers';
import extract from './extractor';

/**
 * @name loader
 * @param source
 */
export = function loader(this: loader.LoaderContext, source: string) : void {
    this.cacheable && this.cacheable();

    const callback = this.async();

    compile(source, (value: object) => {
        const result = getExportString.call(this, value);

        callback(null, result);
    });
}

/**
 * @name compile
 * @param source 
 * @param callback 
 */
function compile(source: string, callback: (value: object) => void): void {
    const extracted = extract(source);

    compileToSass(extracted, (result: {text: string, status: number, formatted: string}) => {
        if (result.status === 1) {
            throw new Error(result.formatted);
        }
        
        const value = split(result.text)
            .map(line => {
                const name = line.match(SELECTOR_REGEX)[1];
                const value = cleanValue(line.match(PROP_REGEX)[1]);

                return {[camelcase(name)]: value};
            })
            .reduce((acc, value) => ({...acc, ...value}));

        callback(value);
    });
}

/**
 * @name getExportString
 * @param result 
 */
function getExportString(this: loader.LoaderContext, result: object): string {
    const version = +this.version;
    const value = JSON.stringify(result);

    return version >= 2 ? `export default ${value};` : `module.exports = ${value};`;
}