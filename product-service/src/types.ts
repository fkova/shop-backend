export interface Product {
    count: number
    description: string;
    id?: string;
    price: number;
    title: string;
}

export type Products = Product[];

export interface ProductDocument {
    id: string;
    title: string;
    description: string;
    price: number;
}

export interface StockDocument {
    product_id: string;
    count: number;
}

export type Document = ProductDocument | StockDocument;

export enum Table {
    PRODUCTS = 'products',
    STOCKS = 'stocks'
};

export interface ProductNotFoundResponseBody {
    message: 'Product not found'
}

export interface CreateProductRequestBody {
    title: string
    description: string
    price: number
    count: number
}


export type Mock<T> = {
    service: T;
    functions: {
        // @ts-ignore works as expected but shows error, re-investigate later
        [P in keyof T]?: jest.Mock<ReturnType<T[P]>, Parameters<T[P]>>;
    };
};

export const createMockService = <T>(...functionsToMock: (keyof T)[]): Mock<T> => {
    const functions = functionsToMock.reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: jest.fn()
    }), {});

    return {
        functions,
        service: jest.fn<Partial<T>, undefined[]>(() => functions)() as T
    };
};