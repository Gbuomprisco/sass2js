import compile from './compile';
import extract from './extractor';
import { processSass } from './helpers';

export = async function(source: string): Promise<object | undefined> {
    const compiled = await compile(extract(source));

    try {
        return processSass(compiled);
    } catch(e) {
        throw new Error(e);
    }
}