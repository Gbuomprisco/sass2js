import sass2js = require('../src');
import { basic, maps, imports } from "./mocks";

describe('sass2js', () => {
    it('compiles a basic style', async (done) => {
        const expected = { a: '2', b: '3', c: '5' };
        const result = await sass2js(basic);

        expect(result).toEqual(expected);
        done();
    });

    it('compiles styles with maps', async (done) => {
        const expected = { i: '3px', map: { b: '3px'}, f: '3px' };
        const result = await sass2js(maps);
        
        expect(result).toEqual(expected);
        done();
    });

    it('compiles styles with imports', async (done) => {
        const expected = { 
            f: '3px',
            i: '3px',
            map: {
                b: '3px'
            },
            mappa: {
                 value: '3px', 
                value2: '3px'
            },
            a: '2',
            c: '5',
            b: '3'
        };
        
        const result = await sass2js(imports);
        
        expect(result).toEqual(expected);
        done();
    });
});