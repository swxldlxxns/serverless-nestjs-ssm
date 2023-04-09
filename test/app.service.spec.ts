import { SSM } from '@aws-sdk/client-ssm';
import { GetParameterCommandOutput } from '@aws-sdk/client-ssm/dist-types/commands/GetParameterCommand';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '/opt/src/app.service';
import { GetRequestsDto } from '/opt/src/libs/dtos/requests/get-requests.dto';
import { SSMService } from '/opt/src/libs/services/ssm.service';
import { SYSTEM_MANAGER } from '/opt/src/libs/shared/injectables';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';

describe('AppService', () => {
  const ssmResult: GetParameterCommandOutput = {
    Parameter: { Value: 'test' },
    $metadata: {},
  };
  const getDto: GetRequestsDto = { name: 'test' };
  let service: AppService;
  let ssmService: SSMService;

  beforeEach(async () => {
    global.console = require('console');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        SSMService,
        {
          provide: ConfigService,
          useFactory: () => ({
            get: () => ({
              accountId: process.env.ACCOUNT_ID,
              stage: process.env.STAGE,
              region: process.env.REGION,
              ssmPath: process.env.SSM_PATH,
            }),
          }),
        },
        {
          provide: SYSTEM_MANAGER,
          useValue: SSM,
        },
      ],
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
        async (): Promise<GetParameterCommandOutput> =>
          Promise.resolve(ssmResult),
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
