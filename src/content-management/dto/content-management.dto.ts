import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RejectDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  reason!: string;
}

export class HandleReportDto {
  @IsIn(['RESOLVED', 'REJECTED'])
  status!: 'RESOLVED' | 'REJECTED';

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  resolutionNote!: string;
}
