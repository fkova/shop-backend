import { databaseService } from 'src/dependencies';
import products from '../products.json';
import dotenv from 'dotenv';
dotenv.config();

const initTables = async () => {
    products.forEach(async (product) => {
        await databaseService.createProduct(product)
    })
}

initTables()
