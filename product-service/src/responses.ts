import { APIGatewayProxyResult } from "aws-lambda";

export const errorResponse = (message: string, statusCode: number): APIGatewayProxyResult => ({
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    statusCode: statusCode ?? 500,
    body: JSON.stringify({ message })
});

export const notFoundResponse = (message: string) => errorResponse(message, 404);
