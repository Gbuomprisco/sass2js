import compile from './compile';
import extract from './extract';
import { transformSassToObject } from './helpers';

export = async function(source: string): Promise<object | undefined> {
    try {
        const styles = await extract(source);
        const compiled = await compile(styles);

        return transformSassToObject(compiled);
    } catch(e) {
        throw new Error(e);
    }
}