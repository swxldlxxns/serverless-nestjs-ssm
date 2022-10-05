import { Injectable } from '@nestjs/common';
import { APIGatewayProxyResult } from 'aws-lambda';
import { GetParameterResult } from 'aws-sdk/clients/ssm';
import { get } from 'lodash';

import { GetRequestsDto } from '/opt/src/libs/interfaces/request/get-requests.dto';
import { GetResponseInterface } from '/opt/src/libs/interfaces/response/get-response.interface';
import { SSMService } from '/opt/src/libs/services/ssm.service';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';

@Injectable()
export class AppService {
  constructor(private readonly _ssmService: SSMService) {}
  async get({ name }: GetRequestsDto): Promise<APIGatewayProxyResult> {
    try {
      const result: GetParameterResult = await this._ssmService.get(name);
      const value = get(result, 'Parameter.Value');
      return formatResponse<GetResponseInterface>(
        { name, value },
        SERVICE_NAME,
      );
    } catch (e) {
      return errorResponse(e, SERVICE_NAME);
    }
  }
}
