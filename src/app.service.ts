import { GetParameterCommandOutput } from '@aws-sdk/client-ssm/dist-types/commands/GetParameterCommand';
import { Injectable } from '@nestjs/common';
import { APIGatewayProxyResult } from 'aws-lambda';

import { GetRequestsDto } from '/opt/src/libs/dtos/requests/get-requests.dto';
import { GetResponseInterface } from '/opt/src/libs/interfaces/responses.interface';
import { SSMService } from '/opt/src/libs/services/ssm.service';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';

@Injectable()
export class AppService {
  constructor(private readonly _ssmService: SSMService) {}

  async get({ name }: GetRequestsDto): Promise<APIGatewayProxyResult> {
    try {
      const result: GetParameterCommandOutput = await this._ssmService.get(
        name,
      );
      const value = result.Parameter?.Value;

      return formatResponse<GetResponseInterface>(
        { name, value },
        SERVICE_NAME,
      );
    } catch (e) {
      return errorResponse(e, SERVICE_NAME);
    }
  }
}
