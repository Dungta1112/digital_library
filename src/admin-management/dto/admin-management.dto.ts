import { IsArray, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/pagination.dto';

export class SearchUsersDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'LOCKED', 'DISABLED'])
  status?: 'ACTIVE' | 'LOCKED' | 'DISABLED';
}

export class UpdateAccountStatusDto {
  @IsIn(['ACTIVE', 'LOCKED', 'DISABLED'])
  status!: 'ACTIVE' | 'LOCKED' | 'DISABLED';
}

export class AssignRolesDto {
  @IsArray()
  @IsUUID('all', { each: true })
  roleIds!: string[];
}
