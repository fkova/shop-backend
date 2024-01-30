import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { middyfy } from '@libs/lambda';
import products from '../../products.json';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { notFoundResponse } from '../../responses';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<APIGatewayProxyResult> = async (event) => {
  const productId = event?.pathParameters?.id;
  const product = products.find(product => product.id === productId);

  if(!product){
    return notFoundResponse('Product not found');
  }
  
  return {
    headers: { 
      'Access-Control-Allow-Origin': '*' 
    },
    statusCode: 200,
    body: JSON.stringify(product),
  }
};

export const main = middyfy(getProductsById)