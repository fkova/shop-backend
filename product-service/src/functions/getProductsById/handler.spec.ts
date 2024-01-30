import { main } from "./handler";
import event from './mock.json';
import mockProducts from '../../products.json';

describe('getProductsById test', () => {
    it('should return function', async () => {
        expect(true).toBeTruthy();
        expect(typeof main).toBe('function');
    });

    it('should return a product if Id exists', async () => {
        const mockEvent = { ...event };
        const res = await main(mockEvent as any, undefined, undefined);

        expect(res.body).toEqual(JSON.stringify(mockProducts[0]))
    });

    it('should throw 404 if product with id not found', async () => {
        const mockEvent = {
            ...event,
            pathParameters: {
                id: 'notExistingId'
            }
        };
        const res = await main(mockEvent as any, undefined, undefined);

        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res.body).message).toBe('Product not found');
    })
})