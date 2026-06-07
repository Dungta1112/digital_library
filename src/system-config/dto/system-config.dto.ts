import { IsObject } from 'class-validator';

export class UpdateSystemConfigDto {
  @IsObject()
  configs!: Record<string, unknown>;
}
