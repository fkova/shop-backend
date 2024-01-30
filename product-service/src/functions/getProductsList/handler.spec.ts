import { main } from "./handler";
import mockEvent from './mock.json';
import mockProducts from '../../products.json';

describe('getProductsList test', () => {
    it('should return function', async () => {
        expect(true).toBeTruthy();
        expect(typeof main).toBe('function');
    });

    it('should return products', async () => {
        const res = await main(mockEvent as any, undefined, undefined);

        expect(res.body).toEqual(JSON.stringify(mockProducts))
    });
})