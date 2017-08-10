declare interface CompiledSassResult {
    text: string;
    status: number;
    formatted: string;
}

declare interface ISass {
    options: (options: object) => void;
    compile: (content: string, callback: (content: CompiledSassResult) => void) => void;
    style: {
        compact?: boolean;
        expanded?: boolean;
    }
    importer: (callback: (request: any) => any) => void;
}

declare const Sass: ISass;
declare function camelcase(param: string): string;
declare function resolve(file: string, content: string): string[];

declare module 'sass.js' {
    export = Sass;
}

declare module 'camelcase' {
    export = camelcase;
}

declare module 'sass-import-resolve' {
    export = resolve;
}