import AWS from 'aws-sdk';
import { databaseServiceFactory } from './services/database-service';

const dynamo = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });

export const databaseService = databaseServiceFactory(dynamo)