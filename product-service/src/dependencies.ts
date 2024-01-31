import AWS from 'aws-sdk';
import { databaseServiceFactory } from './services/database-service';
const region = process.env.AWS_REGION || 'us-east-1';
const dynamo = new AWS.DynamoDB.DocumentClient({ region });

export const databaseService = databaseServiceFactory(dynamo);