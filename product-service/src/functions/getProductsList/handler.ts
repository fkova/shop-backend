import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { middyfy } from '@libs/lambda';
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { databaseService } from '../../dependencies';
import { IDatabaseService } from 'src/services/database-service';

const getProductsList = (databaseService: IDatabaseService): ValidatedEventAPIGatewayProxyEvent<APIGatewayProxyResult> => async () => {
  const productDocuments = await databaseService.scanProducts();

  const products = productDocuments.map(async (product) => {
    const stockDocument = await databaseService.getStockById(product.id);

    return {
      ...product,
      count: stockDocument.count
    }
  })


  return {
    headers: { 
      'Access-Control-Allow-Origin': '*' 
    },
    statusCode: 200,
    body: JSON.stringify(products)
  };
};

export const main = middyfy(getProductsList(databaseService));