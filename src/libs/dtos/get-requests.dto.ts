import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRequestsDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly name: string;
}
