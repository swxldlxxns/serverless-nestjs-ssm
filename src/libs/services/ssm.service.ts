import { SSM } from '@aws-sdk/client-ssm';
import { GetParameterCommandOutput } from '@aws-sdk/client-ssm/dist-types/commands/GetParameterCommand';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentInterface } from '/opt/src/libs/interfaces/environment.interface';
import { SYSTEM_MANAGER } from '/opt/src/libs/shared/injectables';
import { log } from '/opt/src/libs/utils';

const SERVICE_NAME = 'SsmService';

@Injectable()
export class SSMService {
  private readonly _ssmPath: string;

  constructor(
    @Inject(SYSTEM_MANAGER) private readonly _ssm: SSM,
    private readonly _configService: ConfigService,
  ) {
    const { ssmPath }: EnvironmentInterface =
      this._configService.get<EnvironmentInterface>('config');

    this._ssmPath = ssmPath;
  }

  async get(
    Name: string,
    WithDecryption?: boolean,
  ): Promise<GetParameterCommandOutput> {
    log('INFO', {
      SERVICE_NAME,
      params: {
        Name,
        WithDecryption,
        ssmPath: this._ssmPath,
      },
    });

    return await this._ssm.getParameter({
      Name: `${this._ssmPath}/${Name}`,
      WithDecryption,
    });
  }
}
