import DynamoDB from "aws-sdk/clients/dynamodb";
import { Document, Product, ProductDocument, StockDocument, Table } from "src/types";
import { v4 as uuid } from 'uuid';

export interface IDatabaseService {
    put(table: string, document: Document): Promise<unknown>;
    scanProducts(): Promise<ProductDocument[]>;
    scanStocks(): Promise<StockDocument[]>;
    getProductById(id: string): Promise<ProductDocument>;
    getStockById(id: string): Promise<StockDocument>;
    createProduct(product: Product): Promise<unknown>;
}

export const databaseServiceFactory = (dynamoClient: DynamoDB.DocumentClient): IDatabaseService => {
    const saveDocument = (table, document) => {
        return dynamoClient.put({
            TableName: table,
            Item: document
        }).promise();
    };

    const getById = async <T extends Document>(table, id: string) => {
        let key = table === 'products' ? 'id' : 'product_id';

        return (await dynamoClient.get({
            TableName: table,
            Key: {
                [key]: id
            }
        }).promise()).Item as T
    }

    const createProduct = async ({ title, description, price, count }: Product) => {
        const id = uuid();

        return dynamoClient.transactWrite({
            TransactItems: [{
                Put: {
                    TableName: Table.PRODUCTS,
                    Item: {
                        id, title, description, price
                    }
                }
            }, {
                Put: {
                    TableName: Table.STOCKS,
                    Item: {
                        product_id: id, count
                    }
                }
            }]
        }).promise();
    }

    const scan = async <T extends Document>(table) => (
        await dynamoClient.scan({ TableName: table }).promise()
    ).Items as T[];

    return {
        put: (table, document) => saveDocument(table, document),
        scanProducts: () => scan('products'),
        scanStocks: () => scan('stocks'),
        getProductById: (id) => getById('products', id),
        getStockById: (id) => getById('stocks', id),
        createProduct: (product) => createProduct(product)
    }
}