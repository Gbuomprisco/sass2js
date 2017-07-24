import Sass = require('sass.js');

Sass.options({
    indentedSyntax: true,
    style: Sass.style.compact
});

/**
 * @param content
 */
export default function(content: string): Promise<string> {
    const promise = (resolve: (param: string) => void, reject: (param: string) => void) => {
        Sass.compile(content, (result: CompiledSassResult) => {
            if (result.status === 1) {
                reject(result.formatted);
            } else {
                resolve(result.text);
            }
        });
    };

    return new Promise(promise);
}