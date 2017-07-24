import compile from './compile';
import extract from './extractor';

import { processSass } from './helpers';

export = async function(source: string): Promise<object | undefined> {
    const sass = await compile(extract(source));

    try {
        return processSass(sass);
    } catch(e) {
        throw new Error(e);
    }
}