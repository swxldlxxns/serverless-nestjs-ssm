import { Test, TestingModule } from '@nestjs/testing';
import * as AWS from 'aws-sdk';
import { GetParameterResult } from 'aws-sdk/clients/ssm';

import { SSMService } from '/opt/src/libs/services/ssm.service';

describe('SSMService', () => {
  const ssm = Object.getPrototypeOf(new AWS.SSM());
  const ssmResult: GetParameterResult = { Parameter: { Value: 'test' } };
  let service: SSMService;

  beforeEach(async () => {
    global.console = require('console');
    const MODULE: TestingModule = await Test.createTestingModule({
      providers: [SSMService],
    }).compile();
    service = MODULE.get<SSMService>(SSMService);
  });

  it('should return ssm parameter', async () => {
    jest.spyOn(ssm, 'getParameter').mockReturnValue({
      promise: () => Promise.resolve(ssmResult),
    });
    expect(await service.get('test', false)).toEqual(ssmResult);
  });
});
