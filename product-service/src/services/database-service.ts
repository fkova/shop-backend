import DynamoDB from "aws-sdk/clients/dynamodb";
import { Document, ProductDocument, StockDocument, TableName } from "src/types";

export interface IDatabaseService {
    put(table: string, document: Document): Promise<unknown>;
    scanProducts(): Promise<ProductDocument[]>;
    scanStocks(): Promise<StockDocument[]>;
    getProductById(id: string): Promise<ProductDocument>;
    getStockById(id: string): Promise<StockDocument>;
}

export const databaseServiceFactory = (dynamoClient: DynamoDB.DocumentClient): IDatabaseService => {
    const saveDocument = (table, document) => {
        return dynamoClient.put({
            TableName: table,
            Item: document
        }).promise();
    };

    const getById = async <T extends Document>(table: TableName, id: string) => {
        let doc;
        console.log('test', table, id)
        if (table === 'products') {
            doc = await dynamoClient.get({
                TableName: table,
                Key: {
                    'id': id
                }
            }).promise();
        }

        if (table === 'stocks') {
            doc = await dynamoClient.get({
                TableName: table,
                Key: {
                    'product_id': id
                }
            }).promise();
        }

        return doc.Item as T
    }

    const scan = async <T extends Document>(table: TableName) => (await dynamoClient.scan({ TableName: table }).promise()).Items as T[];

    return {
        put: (table, document) => saveDocument(table, document),
        scanProducts: () => scan('products'),
        scanStocks: () => scan('stocks'),
        getProductById: (id) => getById('products', id),
        getStockById: (id) => getById('stocks', id)
    }
}