import { loader } from "webpack";
import * as camelcase from 'camelcase';

import { compileToSass, CompiledSassResult } from './compile';
import { SELECTOR_REGEX, PROP_REGEX } from './regexes';
import { cleanValue, isTruthy, split } from './helpers';
import extract from './extractor';

/**
 * @name sass2js
 * @param source 
 * @param callback 
 */
export default function sass2js(source: string, callback: (value: object) => void): void {
    const extracted = extract(source);

    compileToSass(extracted, (compiled: CompiledSassResult) => {
        if (compiled.status === 1) {
            throw new Error(compiled.formatted);
        }

        const mapper = (line: string): object => {
            const name = line.match(SELECTOR_REGEX)[1];
            const value = cleanValue(line.match(PROP_REGEX)[1]);

            return {[camelcase(name)]: value};
        };

        const reducer = (acc, value): object => ({...acc, ...value});
        const result = split(compiled.text).map(mapper).reduce(reducer);

        callback(result);
    });
}
