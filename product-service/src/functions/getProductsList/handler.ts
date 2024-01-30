import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { middyfy } from '@libs/lambda';
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import products from '../../products.json';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<APIGatewayProxyResult> = async () => {
  return {
    headers: { 
      'Access-Control-Allow-Origin': '*' 
    },
    statusCode: 200,
    body: JSON.stringify(products)
  };
};

export const main = middyfy(getProductsList);