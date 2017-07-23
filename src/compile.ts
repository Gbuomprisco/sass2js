import * as Sass from 'sass.js';

Sass.options({
    indentedSyntax: true,
    style: Sass.style.compact
});

export function compileToSass(scss: string, callback) {
    return Sass.compile(scss, callback);
};