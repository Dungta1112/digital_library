import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateForumPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class UpdateForumPostDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class CreateForumReportDto {
  @IsIn(['POST', 'COMMENT'])
  targetType!: 'POST' | 'COMMENT';

  @IsUUID()
  targetId!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
