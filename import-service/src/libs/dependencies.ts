import AWS from 'aws-sdk';

export const s3Client = new AWS.S3();
export const sqsClient = new AWS.SQS();
