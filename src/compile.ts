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

export function compileToSass(scss: string, callback): CompiledSassResult {
    return Sass.compile(scss, callback);
};