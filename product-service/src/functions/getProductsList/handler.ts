import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { middyfy } from '@libs/lambda';
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { databaseService } from '../../dependencies';
import { IDatabaseService } from 'src/services/database-service';
import { okResponse } from 'src/response-factory';

const getProductsList = (databaseService: IDatabaseService): ValidatedEventAPIGatewayProxyEvent<APIGatewayProxyResult> => async (event) => {
  console.log(event);
  const productDocuments = await databaseService.scanProducts();

  const products = await Promise.all(productDocuments.map(async (product) => {
    const stockDocument = await databaseService.getStockById(product.id);

    return {
      ...product,
      count: stockDocument.count
    }
  }));

  return okResponse(products);
};

export const main = middyfy(getProductsList(databaseService));