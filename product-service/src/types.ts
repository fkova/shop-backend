export interface Product {
    count: number;
    description: string;
    id: string;
    price: number;
    title: string;
}

export interface ProductNotFoundResponseBody {
    message: 'Product not found'
}

export type Products = Product[];