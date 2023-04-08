import { SSM } from '@aws-sdk/client-ssm';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GetParameterResult } from 'aws-sdk/clients/ssm';

import { SSMService } from '/opt/src/libs/services/ssm.service';
import { SYSTEM_MANAGER } from '/opt/src/libs/shared/injectables';

describe('SSMService', () => {
  const ssmResult: GetParameterResult = { Parameter: { Value: 'test' } };
  let ssm: SSM;
  let service: SSMService;

  beforeEach(async () => {
    global.console = require('console');
    const MODULE: TestingModule = await Test.createTestingModule({
      providers: [
        SSMService,
        SSM,
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

    service = MODULE.get<SSMService>(SSMService);
    ssm = MODULE.get<SSM>(SYSTEM_MANAGER);
  });

  it('should return ssm parameter', async () => {
    ssm.getParameter = jest.fn().mockResolvedValue(ssmResult);
    expect(await service.get('test', false)).toEqual(ssmResult);
  });
});
