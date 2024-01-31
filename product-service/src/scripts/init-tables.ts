import { databaseService } from 'src/dependencies';
import products from '../products.json';
import dotenv from 'dotenv';
dotenv.config();

const productsTable = process.env.TABLE_PRODUCT;
const stocksTable = process.env.TABLE_STOCK;

const initTables = async () => {
    products.forEach(async ({ id, title, description, price, count }) => {
        await databaseService.put(productsTable, { id, title, description, price });
        await databaseService.put(stocksTable, { product_id: id, count });
    })
}

initTables()
