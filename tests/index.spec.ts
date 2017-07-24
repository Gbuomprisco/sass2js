import sass2s = require('../src');
import { basic } from "./mocks";

describe('sass2js', () => {
    it('compiles a basic style', async () => {
        const expected = { a: '2', b: '3', c: '5' };

        expect(await sass2s(basic)).toEqual(expected);
    });
});