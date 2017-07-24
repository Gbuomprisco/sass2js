import compile from './compile';
import extract from './extract';
import { transformSassToObject } from './helpers';

export = async function(source: string): Promise<object | undefined> {
    try {
        const compiled = await compile(extract(source));

        return transformSassToObject(compiled);
    } catch(e) {
        throw new Error(e);
    }
}