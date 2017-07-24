import compile from './compile';
import extract from './extract';
import { processSass } from './helpers';

export = async function(source: string): Promise<object | undefined> {
    try {
        const compiled = await compile(extract(source));

        return processSass(compiled);
    } catch(e) {
        throw new Error(e);
    }
}