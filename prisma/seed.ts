import { PrismaClient, RoleCode } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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

  // --- Seed Data cho Forum và Study Group ---

  // 1. Tạo user Student
  const studentRole = await prisma.role.findUniqueOrThrow({ where: { code: 'STUDENT' } });
  const student = await prisma.user.upsert({
    where: { email: 'student@example.edu' },
    update: {},
    create: {
      email: 'student@example.edu',
      passwordHash,
      fullName: 'Demo Student'
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: student.id, roleId: studentRole.id } },
    update: {},
    create: { userId: student.id, roleId: studentRole.id }
  });

  // 2. Tạo Forum Posts
  const seedForumPost = async (id: string, title: string, content: string, authorId: string) => {
    return prisma.forumPost.upsert({
      where: { id },
      update: {},
      create: { id, title, content, authorId }
    });
  };

  const post1 = await seedForumPost('11111111-1111-1111-1111-111111111111', 'Làm sao để học tốt môn Cấu trúc dữ liệu?', 'Mình đang gặp khó khăn với môn Cấu trúc dữ liệu và giải thuật. Mọi người có tài liệu hay kinh nghiệm gì chia sẻ giúp mình với ạ!', student.id);
  const post2 = await seedForumPost('22222222-2222-2222-2222-222222222222', 'Thảo luận về ứng dụng của AI trong Y tế', 'Chào các bạn, mình muốn mở một topic để thảo luận về tiềm năng của AI trong việc chuẩn đoán bệnh. Mời mọi người vào trao đổi nhé.', lecturer.id);

  // 3. Tạo Forum Comments
  const seedForumComment = async (id: string, postId: string, content: string, authorId: string) => {
    return prisma.forumComment.upsert({
      where: { id },
      update: {},
      create: { id, postId, content, authorId }
    });
  };

  await seedForumComment('33333333-3333-3333-3333-333333333333', post1.id, 'Bạn thử lên mạng tìm khoá học của MIT xem, cực kỳ hữu ích đó!', lecturer.id);
  await seedForumComment('44444444-4444-4444-4444-444444444444', post2.id, 'Chủ đề này rất thú vị. Theo mình thì AI có thể hỗ trợ bác sĩ giảm thiểu sai sót đáng kể.', student.id);

  // 4. Tạo Study Groups
  const seedGroup = async (id: string, name: string, description: string, ownerId: string) => {
    return prisma.studyGroup.upsert({
      where: { id },
      update: {},
      create: { id, name, description, ownerId, visibility: 'PUBLIC' }
    });
  };

  const group1 = await seedGroup('55555555-5555-5555-5555-555555555555', 'Nhóm luyện code C++', 'Nhóm dành cho các bạn muốn cải thiện kỹ năng lập trình C++', lecturer.id);
  const group2 = await seedGroup('66666666-6666-6666-6666-666666666666', 'Nghiên cứu Machine Learning', 'Tập trung vào các thuật toán Machine Learning cơ bản và nâng cao.', student.id);

  // 5. Thêm Members vào Study Groups
  await prisma.studyGroupMember.upsert({
    where: { groupId_userId: { groupId: group1.id, userId: student.id } },
    update: {},
    create: { groupId: group1.id, userId: student.id, status: 'APPROVED', role: 'MEMBER' }
  });

  await prisma.studyGroupMember.upsert({
    where: { groupId_userId: { groupId: group2.id, userId: lecturer.id } },
    update: {},
    create: { groupId: group2.id, userId: lecturer.id, status: 'APPROVED', role: 'MEMBER' }
  });

  // 6. Tạo Study Group Posts (Messages/Discussions)
  const seedGroupPost = async (id: string, groupId: string, title: string, content: string, authorId: string) => {
    return prisma.studyGroupPost.upsert({
      where: { id },
      update: {},
      create: { id, groupId, title, content, authorId }
    });
  };

  await seedGroupPost('77777777-7777-7777-7777-777777777777', group1.id, 'Chào mừng các bạn', 'Chào mừng các bạn đã tham gia nhóm! Hãy giới thiệu bản thân nhé.', lecturer.id);
  await seedGroupPost('88888888-8888-8888-8888-888888888888', group1.id, 'Bài tập tuần 1', 'Mọi người đã làm xong bài tập chưa nhỉ?', student.id);
  await seedGroupPost('99999999-9999-9999-9999-999999999999', group2.id, 'Tài liệu tham khảo', 'Mình vừa tìm được một cuốn sách hay về ML, các bạn xem nhé.', student.id);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
