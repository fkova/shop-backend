import { IDatabaseService } from "src/services/database-service";
import { main, catalogBatchProcess } from "./handler";
import event from './mock.json';
import { Mock, createMockService } from "src/types";
import { Handler, SQSEvent } from "aws-lambda";

describe('catalogBatchProcess test', () => {
  let mockDBService: Mock<IDatabaseService>;
  let mockSNSClient: Mock<AWS.SNS>;
  let handler: Handler<SQSEvent>;

  beforeEach(() => {
    mockDBService = createMockService('createProduct');
    mockSNSClient = createMockService('publish');
    handler = catalogBatchProcess(mockDBService.service, mockSNSClient.service);
  });

  it('should return function', async () => {
    expect(true).toBeTruthy();
    expect(typeof main).toBe('function');
  });

  it('should finish creating db item and publish message', async () => {
    const mockEvent = { ...event };

    mockDBService.functions.createProduct.mockResolvedValue({})
    mockSNSClient.functions.publish.mockReturnValue({
      promise() {
        return Promise.resolve(undefined);
      }
    } as any);

    const result = await handler(mockEvent as SQSEvent, undefined, undefined);

    expect(result).toBe('finished');

    expect(mockDBService.functions.createProduct).toHaveBeenCalledTimes(2);
    expect(mockDBService.functions.createProduct).toHaveBeenNthCalledWith(1, JSON.parse(mockEvent.Records[0].body));
    expect(mockDBService.functions.createProduct).toHaveBeenNthCalledWith(2, JSON.parse(mockEvent.Records[1].body));

    expect(mockSNSClient.functions.publish).toHaveBeenCalledWith({
      Subject: 'New Products published!',
      TopicArn: undefined,
      Message: JSON.stringify(['t2', 't3'])
    });
  });

  it('should throw error if createProduct failed', async () => {
    const mockEvent = { ...event };
    const mockError = 'dbError';

    mockDBService.functions.createProduct.mockRejectedValue(mockError)

    let result

    try {
      result = await handler(mockEvent as SQSEvent, undefined, undefined);
    } catch (err) {
      expect(err).toBe(mockError);
    }

    expect(result).toBeUndefined();

    expect(mockDBService.functions.createProduct).toHaveBeenCalledTimes(2);
    expect(mockDBService.functions.createProduct).toHaveBeenNthCalledWith(1, JSON.parse(mockEvent.Records[0].body));
    expect(mockDBService.functions.createProduct).toHaveBeenNthCalledWith(2, JSON.parse(mockEvent.Records[1].body));

    expect(mockSNSClient.functions.publish).not.toHaveBeenCalled();
  });

  it('should throw error if sending message failed', async () => {
    const mockEvent = { ...event };
    const mockError = 'snsError';

    mockDBService.functions.createProduct.mockResolvedValue({})
    mockSNSClient.functions.publish.mockReturnValue({
      promise() {
        return Promise.reject(mockError);
      }
    } as any)

    let result

    try {
      result = await handler(mockEvent as SQSEvent, undefined, undefined);
    } catch (err) {
      expect(err).toBe(mockError);
    }

    expect(result).toBeUndefined();

    expect(mockDBService.functions.createProduct).toHaveBeenCalledTimes(2);
    expect(mockDBService.functions.createProduct).toHaveBeenNthCalledWith(1, JSON.parse(mockEvent.Records[0].body));
    expect(mockDBService.functions.createProduct).toHaveBeenNthCalledWith(2, JSON.parse(mockEvent.Records[1].body));

    expect(mockSNSClient.functions.publish).toHaveBeenCalledWith({
      Subject: 'New Products published!',
      TopicArn: undefined,
      Message: JSON.stringify(['t2', 't3'])
    });
  });
});