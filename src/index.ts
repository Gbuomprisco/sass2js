import { compileToSass } from './compile';
import { processSass } from './helpers';
import extract from './extractor';

/**
 * @param source
 */
export default async function(source: string): Promise<object | undefined> {
    const sass = await compileToSass(extract(source));

    try {
        return processSass(sass);
    } catch(e) {
        throw new Error(e);
    }
}