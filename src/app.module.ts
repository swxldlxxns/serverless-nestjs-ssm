import { SSM } from '@aws-sdk/client-ssm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { AppService } from '/opt/src/app.service';
import config from '/opt/src/config';
import { SSMService } from '/opt/src/libs/services/ssm.service';
import { SYSTEM_MANAGER } from '/opt/src/libs/shared/injectables';

const apiVersion = 'latest';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  providers: [
    AppService,
    SSMService,
    {
      provide: SYSTEM_MANAGER,
      inject: [config.KEY],
      useFactory: ({ region }: ConfigType<typeof config>) =>
        new SSM({
          apiVersion,
          region,
        }),
    },
  ],
})
export class AppModule {}
