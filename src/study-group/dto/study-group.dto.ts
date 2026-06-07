import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateStudyGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['PUBLIC', 'REQUEST_TO_JOIN', 'PRIVATE'])
  visibility!: 'PUBLIC' | 'REQUEST_TO_JOIN' | 'PRIVATE';
}

export class CreateGroupPostDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class CreateGroupCommentDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class ShareGroupDocumentDto {
  @IsUUID()
  documentId!: string;
}
