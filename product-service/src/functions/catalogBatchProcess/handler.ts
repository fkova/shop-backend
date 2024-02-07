import { databaseService, sns } from '../../dependencies';
import { IDatabaseService } from 'src/services/database-service';
import { Handler, SQSEvent } from 'aws-lambda';
import { Product } from 'src/types';

export const catalogBatchProcess = (dbService: IDatabaseService, snsClient: AWS.SNS): Handler<SQSEvent> => async (event) => {
    const productNames: string[] = [];

    await Promise.all(event.Records.map(sqsMessage => {
      const product: Product = JSON.parse(sqsMessage.body);
      productNames.push(product.title);

      return dbService.createProduct(product);
    }));

    await snsClient.publish({
      Subject: 'New Products published!',
      TopicArn: process.env.TOPIC_ARN,
      Message: JSON.stringify(productNames)
    }).promise();

    return 'finished';
};

export const main = catalogBatchProcess(databaseService, sns);