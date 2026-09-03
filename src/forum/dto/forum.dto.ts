import { ForumCategory } from '@prisma/client';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/pagination.dto';

export class ForumPostQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ForumCategory)
  category?: ForumCategory;
}

export class CreateForumPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsEnum(ForumCategory)
  category?: ForumCategory;
}

export class UpdateForumPostDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(ForumCategory)
  category?: ForumCategory;
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
