import { Test, TestingModule } from '@nestjs/testing';
import { GetParameterResult } from 'aws-sdk/clients/ssm';

import { AppService } from '/opt/src/app.service';
import { GetRequestsDto } from '/opt/src/libs/interfaces/request/get-requests.dto';
import { SSMService } from '/opt/src/libs/services/ssm.service';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';

describe('AppService', () => {
  const ssmResult: GetParameterResult = { Parameter: { Value: 'test' } };
  const getDto: GetRequestsDto = { name: 'test' };
  let service: AppService;
  let ssmService: SSMService;

  beforeEach(async () => {
    global.console = require('console');
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, SSMService],
    }).compile();
    service = module.get<AppService>(AppService);
    ssmService = module.get<SSMService>(SSMService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should return value', async () => {
    jest
      .spyOn(ssmService, 'get')
      .mockImplementation(
        async (): Promise<GetParameterResult> => Promise.resolve(ssmResult),
      );
    expect(await service.get(getDto)).toEqual(
      formatResponse(
        { name: getDto.name, value: ssmResult.Parameter.Value },
        SERVICE_NAME,
      ),
    );
  });

  it('should return error', async () => {
    jest.spyOn(ssmService, 'get').mockRejectedValue(new Error('Test Error'));
    expect(await service.get(getDto)).toEqual(
      errorResponse(
        {
          message: 'Test Error',
        },
        SERVICE_NAME,
      ),
    );
  });
});
