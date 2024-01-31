import { APIGatewayProxyResult } from "aws-lambda";
import { STATUS_CODES } from 'http';

export const errorResponse = (message: string, statusCode?: number): APIGatewayProxyResult => ({
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  statusCode: statusCode ?? 500,
  body: JSON.stringify({ message })
});

const successResponse = (statusCode: number, data?: any): APIGatewayProxyResult => ({
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  statusCode,
  body: JSON.stringify(data) || STATUS_CODES[statusCode]
});

export const notFoundResponse = (message: string) => errorResponse(message, 404);
export const okResponse = (data?: any) => successResponse(200, data);
export const createdResponse = (data?: any) => successResponse(201, data);
