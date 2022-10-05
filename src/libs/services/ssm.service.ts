import { Injectable } from '@nestjs/common';
import { SSM } from 'aws-sdk';
import { GetParameterResult } from 'aws-sdk/clients/ssm';

import { ENV_VARS } from '/opt/src/libs/shared/enviroments';

const SERVICE_NAME = 'SsmService';
const { region, ssmPath } = ENV_VARS;
const ssm = new SSM({
  region,
  apiVersion: 'latest',
});

@Injectable()
export class SSMService {
  async get(
    Name: string,
    WithDecryption?: boolean,
  ): Promise<GetParameterResult> {
    console.info({
      SERVICE_NAME,
      params: {
        Name,
        ssmPath,
        WithDecryption,
      },
    });

    return await ssm
      .getParameter({ Name: `${ssmPath}/${Name}`, WithDecryption })
      .promise();
  }
}
