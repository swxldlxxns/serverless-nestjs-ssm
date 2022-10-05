import { Module } from '@nestjs/common';

import { AppService } from '/opt/src/app.service';
import { SSMService } from '/opt/src/libs/services/ssm.service';

@Module({
  providers: [AppService, SSMService],
})
export class AppModule {}
