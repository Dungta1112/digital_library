import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AdminManagementService } from '../../src/admin-management/admin-management.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuditLogService } from '../../src/common/audit/audit-log.service';

describe('AdminManagementService Unit Tests', () => {
  let service: AdminManagementService;
  let prisma: Partial<PrismaService>;
  let audit: Partial<AuditLogService>;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        count: jest.fn(),
      } as any,
      role: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      } as any,
      userRole: {
        count: jest.fn(),
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      } as any,
      $transaction: jest.fn(async (cb: any) => {
        return cb(prisma);
      }) as any,
    };

    audit = {
      record: jest.fn().mockResolvedValue({} as any),
    };

    service = new AdminManagementService(prisma as PrismaService, audit as AuditLogService);
  });

  describe('assignRoles (Single-Role & Last Admin Guard)', () => {
    it('should throw NotFoundException if target user does not exist', async () => {
      (prisma.user!.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.assignRoles('actor-1', 'user-unknown', { roleIds: ['role-1'] })).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if assigned roleId does not exist in database', async () => {
      (prisma.user!.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'user-1',
        roles: [],
      });
      (prisma.role!.findMany as jest.Mock).mockResolvedValueOnce([]); // no matching role

      await expect(service.assignRoles('actor-1', 'user-1', { roleIds: ['non-existent-role'] })).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when demoting the last active ADMIN', async () => {
      const adminRole = { id: 'role-admin-id', code: 'ADMIN' };
      (prisma.user!.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'admin-1',
        roles: [{ roleId: 'role-admin-id', role: adminRole }],
      });
      (prisma.role!.findMany as jest.Mock).mockResolvedValueOnce([
        { id: 'role-student-id', code: 'STUDENT' },
      ]);
      (prisma.role!.findUnique as jest.Mock).mockResolvedValueOnce(adminRole);
      // Only 1 admin in system
      (prisma.userRole!.count as jest.Mock).mockResolvedValueOnce(1);

      await expect(service.assignRoles('actor-1', 'admin-1', { roleIds: ['role-student-id'] })).rejects.toThrow(ForbiddenException);
    });

    it('should atomically replace role inside $transaction when valid', async () => {
      const adminRole = { id: 'role-admin-id', code: 'ADMIN' };
      const lecturerRole = { id: 'role-lecturer-id', code: 'LECTURER' };
      const mockUser = {
        id: 'user-1',
        roles: [{ roleId: 'role-student-id', role: { code: 'STUDENT' } }],
      };
      (prisma.user!.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockUser) // check user in detail()
        .mockResolvedValueOnce({ ...mockUser, roles: [{ roleId: 'role-lecturer-id', role: lecturerRole }] }); // final return
      (prisma.role!.findMany as jest.Mock).mockResolvedValueOnce([lecturerRole]);
      (prisma.role!.findUnique as jest.Mock).mockResolvedValueOnce(adminRole);

      const result = await service.assignRoles('actor-1', 'user-1', { roleIds: ['role-lecturer-id'] });

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.userRole!.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
      expect(prisma.userRole!.createMany).toHaveBeenCalledWith({
        data: [{ userId: 'user-1', roleId: 'role-lecturer-id', assignedById: 'actor-1' }],
      });
      expect(result).toBeDefined();
    });
  });
});
