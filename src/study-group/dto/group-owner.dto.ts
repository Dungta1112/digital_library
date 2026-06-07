import { IsIn, IsUUID } from 'class-validator';

export class UpdateMemberStatusDto {
  @IsIn(['APPROVED', 'REJECTED', 'REMOVED'])
  status!: 'APPROVED' | 'REJECTED' | 'REMOVED';
}

export class MemberParamDto {
  @IsUUID()
  userId!: string;
}
