import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { databaseService } from 'src/dependencies';
import { IDatabaseService } from 'src/services/database-service';

const getProductsById = (databaseService: IDatabaseService): ValidatedEventAPIGatewayProxyEvent<APIGatewayProxyResult> => async (event) => {
  const productId = event?.pathParameters?.id;
  const productDocument = await databaseService.getProductById(productId);
  const stockDocument = await databaseService.getStockById(productId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      ...productDocument,
      count: stockDocument.count
    }),
  }
};

export const main = middyfy(getProductsById(databaseService))