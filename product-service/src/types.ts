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
