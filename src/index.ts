import { compileToSass, CompiledSassResult } from './compile';
import { mapToProp, reducePropObject, split } from './helpers';
import extract from './extractor';

/**
 * @param source 
 * @param callback 
 */
export default async function(source: string): Promise<object> {
    try {
        const styles = await compileToSass(extract(source));

        return split(styles)
            .map(mapToProp)
            .reduce(reducePropObject);

    } catch(e) {
        throw new Error(e);
    }
}