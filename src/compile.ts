import * as Sass from 'sass.js';

export declare interface CompiledSassResult {
    text: string;
    status: number;
    formatted: string;
}

Sass.options({
    indentedSyntax: true,
    style: Sass.style.compact
});

/**
 * @name compileToSass
 * @param scss
 */
export function compileToSass(scss: string): Promise<string> {
    const promise = (resolve, reject) => {
        Sass.compile(scss, (result: CompiledSassResult) => {
             if (result.status === 1) {
                reject(result.formatted);
            }

            resolve(result.text);
        });
    };

    return new Promise(promise);
};