import { PrismaClient, RoleCode } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const permissions = [
  'documents.read',
  'documents.download',
  'documents.upload',
  'documents.manage_own',
  'documents.approve',
  'documents.reject',
  'forum.write',
  'forum.moderate',
  'groups.manage_own',
  'groups.join',
  'reports.handle',
  'admin.users',
  'admin.roles',
  'admin.config',
  'statistics.read'
];

const rolePermissionMap: Record<RoleCode, string[]> = {
  GUEST: ['documents.read'],
  STUDENT: ['documents.read', 'documents.download', 'forum.write', 'groups.join'],
  LECTURER: ['documents.read', 'documents.download', 'documents.upload', 'documents.manage_own', 'forum.write', 'groups.manage_own'],
  CONTENT_MANAGER: ['documents.read', 'documents.approve', 'documents.reject', 'forum.moderate', 'reports.handle'],
  ADMIN: permissions
};

async function main() {
  const permissionRecords = new Map<string, string>();
  for (const code of permissions) {
    const permission = await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { code, name: code }
    });
    permissionRecords.set(code, permission.id);
  }

  for (const code of Object.values(RoleCode)) {
    const role = await prisma.role.upsert({
      where: { code },
      update: {},
      create: { code, name: code }
    });
    for (const permissionCode of rolePermissionMap[code]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permissionRecords.get(permissionCode)! } },
        update: {},
        create: { roleId: role.id, permissionId: permissionRecords.get(permissionCode)! }
      });
    }
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { code: 'ADMIN' } });
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!', Number(process.env.BCRYPT_ROUNDS ?? 12));
  const admin = await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL ?? 'admin@example.edu' },
    update: {},
    create: {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@example.edu',
      passwordHash,
      fullName: 'System Administrator'
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id }
  });

  const lecturerRole = await prisma.role.findUniqueOrThrow({ where: { code: 'LECTURER' } });
  const lecturer = await prisma.user.upsert({
    where: { email: 'lecturer@example.edu' },
    update: {},
    create: {
      email: 'lecturer@example.edu',
      passwordHash,
      fullName: 'Demo Lecturer'
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: lecturer.id, roleId: lecturerRole.id } },
    update: {},
    create: { userId: lecturer.id, roleId: lecturerRole.id }
  });

  const configs = [
    { key: 'upload.allowed_file_types', value: ['application/pdf'], description: 'Allowed upload MIME types' },
    { key: 'upload.max_file_size_bytes', value: 20971520, description: 'Maximum upload size' },
    { key: 'document.review_required', value: true, description: 'Documents require approval before public visibility' },
    { key: 'cache.enabled', value: false, description: 'Enable Redis cache for read-heavy data' }
  ];
  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: { value: config.value, description: config.description },
      create: config
    });
  }

  const categories = [
    { name: 'Khoa học Máy tính', slug: 'khoa-hoc-may-tinh' },
    { name: 'Vật lý', slug: 'vat-ly' },
    { name: 'Toán học', slug: 'toan-hoc' },
    { name: 'Sinh học', slug: 'sinh-hoc' },
    { name: 'Khoa học Môi trường', slug: 'khoa-hoc-moi-truong' },
    { name: 'Văn học', slug: 'van-hoc' }
  ];

  for (const cat of categories) {
    await prisma.documentCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
