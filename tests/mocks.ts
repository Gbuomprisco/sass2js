import { readFileSync } from 'fs';
import { resolve } from 'path';

function open(path: string): string {
    return readFileSync(resolve(path), {encoding: 'utf-8'});
}

export const basic = open('./mocks/basic.scss');
export const maps = open('./mocks/maps.scss');
export const imports = open('./mocks/imports.scss');