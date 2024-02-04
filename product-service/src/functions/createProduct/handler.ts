import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { middyfy } from '@libs/lambda';
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { databaseService } from 'src/dependencies';
import { IDatabaseService } from 'src/services/database-service';
import { Product } from 'src/types';
import { createdResponse, errorResponse } from 'src/response-factory';

const createProduct = (databaseService: IDatabaseService): ValidatedEventAPIGatewayProxyEvent<APIGatewayProxyResult> => async (event) => {
  console.log(event);

  try {
    const res = await databaseService.createProduct(event.body as Product);    
    console.log(res);

  } catch (error) {
    console.log(error);
    
    return errorResponse('Unable to create product');
  }

  return createdResponse();
};

export const main = middyfy(createProduct(databaseService));