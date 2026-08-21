import { PrismaClient, RoleCode } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

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

// Minimal valid PDF Buffer for storage
function createSamplePdfBuffer(title: string): Buffer {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 120 >>
stream
BT
/F1 18 Tf
50 720 Td
(TRUONG DAI HOC TRUNG VUONG) Tj
/F1 14 Tf
50 680 Td
(${title.replace(/[()]/g, '')}) Tj
/F1 11 Tf
50 640 Td
(Tai lieu so hoa chinh thuc phuc vu hoc tap va nghien cuu.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000438 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
515
%%EOF`;
  return Buffer.from(content, 'utf-8');
}

async function main() {
  console.log('🌱 Bắt đầu nạp dữ liệu (Database Seeding)...');

  // Ensure storage folder exists
  const storagePath = path.resolve(process.env.LOCAL_STORAGE_PATH || './storage');
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }

  // 1. Permissions
  const permissionRecords = new Map<string, string>();
  for (const code of permissions) {
    const permission = await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { code, name: code }
    });
    permissionRecords.set(code, permission.id);
  }

  // 2. Roles & RolePermissions
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

  // 3. Admin & Lecturer & Student Users
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { code: 'ADMIN' } });
  const lecturerRole = await prisma.role.findUniqueOrThrow({ where: { code: 'LECTURER' } });
  const studentRole = await prisma.role.findUniqueOrThrow({ where: { code: 'STUDENT' } });

  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!', Number(process.env.BCRYPT_ROUNDS ?? 12));

  const admin = await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL ?? 'admin@example.edu' },
    update: {},
    create: {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@example.edu',
      passwordHash,
      fullName: 'Quản trị viên Hệ thống'
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id }
  });

  const lecturer = await prisma.user.upsert({
    where: { email: 'lecturer@example.edu' },
    update: {},
    create: {
      email: 'lecturer@example.edu',
      passwordHash,
      fullName: 'TS. Nguyễn Văn Minh'
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: lecturer.id, roleId: lecturerRole.id } },
    update: {},
    create: { userId: lecturer.id, roleId: lecturerRole.id }
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@example.edu' },
    update: {},
    create: {
      email: 'student@example.edu',
      passwordHash,
      fullName: 'Nguyễn Tiến Dũng'
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: student.id, roleId: studentRole.id } },
    update: {},
    create: { userId: student.id, roleId: studentRole.id }
  });

  // 4. System Configs
  const configs = [
    { key: 'upload.allowed_file_types', value: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], description: 'Allowed upload MIME types' },
    { key: 'upload.max_file_size_bytes', value: 20971520, description: 'Maximum upload size (20MB)' },
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

  // 5. Document Categories
  const categoriesData = [
    { name: 'Khoa học Máy tính', slug: 'khoa-hoc-may-tinh' },
    { name: 'Kinh tế & Tài chính', slug: 'kinh-te-tai-chinh' },
    { name: 'Toán học & Thống kê', slug: 'toan-hoc' },
    { name: 'Quản trị Kinh doanh', slug: 'quan-tri-kinh-doanh' },
    { name: 'Vật lý & Kỹ thuật', slug: 'vat-ly' },
    { name: 'Ngoại ngữ & Ngôn ngữ Anh', slug: 'ngoai-ngu' }
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const createdCat = await prisma.documentCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat
    });
    categoryMap.set(cat.slug, createdCat.id);
  }

  // 6. Seed Academic Documents & Files
  const documentsSeed = [
    {
      id: 'doc-csdl-2026',
      title: 'Giáo trình Cơ sở Dữ liệu & Hệ Quản trị Dữ liệu Nâng cao',
      description: 'Hệ thống hóa kiến thức về đại số quan hệ, thiết kế chuẩn hóa 1NF-BCNF, tối ưu hóa truy vấn và kiến trúc cơ sở dữ liệu phân tán.',
      categoryId: categoryMap.get('khoa-hoc-may-tinh'),
      fileName: 'Giao_trinh_Co_so_Du_lieu_2026.pdf',
      viewCount: 3840,
      downloadCount: 920,
      metadata: {
        authors: ['TS. Nguyễn Văn Minh', 'ThS. Lê Hoàng Nam'],
        publicationYear: 2026,
        keywords: ['Cơ sở dữ liệu', 'SQL', 'BCNF', 'Indexing'],
        abstract: 'Hệ thống hóa kiến thức về đại số quan hệ, thiết kế chuẩn hóa 1NF-BCNF, tối ưu hóa truy vấn và kiến trúc cơ sở dữ liệu phân tán.'
      }
    },
    {
      id: 'doc-kinhte-vimo',
      title: 'Kinh tế học Vĩ mô: Lý thuyết & Thực tiễn Ứng dụng',
      description: 'Phân tích tổng cầu, tổng cung, lạm phát, thất nghiệp và các mô hình điều hành chính sách tiền tệ tài khóa tại Việt Nam.',
      categoryId: categoryMap.get('kinh-te-tai-chinh'),
      fileName: 'Kinh_te_hoc_Vi_mo_Dai_hoc_Trung_Vuong.pdf',
      viewCount: 2950,
      downloadCount: 710,
      metadata: {
        authors: ['PGS.TS. Trần Thị Mai', 'Khoa Kinh tế'],
        publicationYear: 2025,
        keywords: ['Vĩ mô', 'Lạm phát', 'Chính sách tài khóa', 'IS-LM'],
        abstract: 'Phân tích tổng cầu, tổng cung, lạm phát, thất nghiệp và các mô hình điều hành chính sách tiền tệ tài khóa tại Việt Nam.'
      }
    },
    {
      id: 'doc-toan-caocap',
      title: 'Toán Cao cấp & Giải tích Ứng dụng trong Kỹ thuật Số',
      description: 'Cung cấp nền tảng vi tích phân hàm nhiều biến, phương trình vi phân và các phép biến đổi ma trận phục vụ mô hình hóa.',
      categoryId: categoryMap.get('toan-hoc'),
      fileName: 'Toan_Cao_cap_Giai_tich_Ky_thuat.pdf',
      viewCount: 2410,
      downloadCount: 560,
      metadata: {
        authors: ['TS. Phạm Đức Tuấn'],
        publicationYear: 2026,
        keywords: ['Giải tích', 'Đại số tuyến tính', 'Toán kỹ thuật'],
        abstract: 'Cung cấp nền tảng vi tích phân hàm nhiều biến, phương trình vi phân và các phép biến đổi ma trận phục vụ mô hình hóa.'
      }
    },
    {
      id: 'doc-ai-nlp',
      title: 'Nhập môn Trí tuệ Nhân tạo: Từ Học máy đến Mô hình RAG',
      description: 'Khám phá các thuật toán học máy kinh điển, mạng nơ-ron sâu, mô hình ngôn ngữ lớn (LLMs) và kỹ thuật RAG trong học thuật.',
      categoryId: categoryMap.get('khoa-hoc-may-tinh'),
      fileName: 'Nhap_mon_Tri_tue_Nhan_tao_RAG.pdf',
      viewCount: 4200,
      downloadCount: 1350,
      metadata: {
        authors: ['TS. Hoàng Quốc Bảo', 'Lab AI Trưng Vương'],
        publicationYear: 2026,
        keywords: ['AI', 'Machine Learning', 'RAG', 'Vector DB'],
        abstract: 'Khám phá các thuật toán học máy kinh điển, mạng nơ-ron sâu, mô hình ngôn ngữ lớn (LLMs) và kỹ thuật RAG trong học thuật.'
      }
    },
    {
      id: 'doc-vatly-daicuong',
      title: 'Vật lý Đại cương & Khoa học Ứng dụng',
      description: 'Giáo trình chuẩn hóa về cơ học lượng tử, quang học và điện từ trường ứng dụng trong công nghệ cao.',
      categoryId: categoryMap.get('vat-ly'),
      fileName: 'Vat_ly_Dai_cuong_Ung_dung.pdf',
      viewCount: 1890,
      downloadCount: 430,
      metadata: {
        authors: ['TS. Đỗ Hải Nam'],
        publicationYear: 2025,
        keywords: ['Vật lý', 'Cơ học', 'Quang học', 'Điện từ'],
        abstract: 'Giáo trình chuẩn hóa về cơ học lượng tử, quang học và điện từ trường ứng dụng trong công nghệ cao.'
      }
    }
  ];

  for (const docData of documentsSeed) {
    const objectKey = `seed-${docData.fileName}`;
    const filePath = path.join(storagePath, objectKey);
    const pdfBuffer = createSamplePdfBuffer(docData.title);
    fs.writeFileSync(filePath, pdfBuffer);

    const doc = await prisma.document.upsert({
      where: { id: docData.id },
      update: {
        title: docData.title,
        description: docData.description,
        categoryId: docData.categoryId,
        status: 'APPROVED',
        visibility: 'PUBLIC',
        approvedById: admin.id,
        approvedAt: new Date(),
        viewCount: docData.viewCount,
        downloadCount: docData.downloadCount,
        metadata: docData.metadata
      },
      create: {
        id: docData.id,
        ownerId: lecturer.id,
        title: docData.title,
        description: docData.description,
        categoryId: docData.categoryId,
        status: 'APPROVED',
        visibility: 'PUBLIC',
        approvedById: admin.id,
        approvedAt: new Date(),
        viewCount: docData.viewCount,
        downloadCount: docData.downloadCount,
        metadata: docData.metadata
      }
    });

    // Create file record
    await prisma.documentFile.deleteMany({ where: { documentId: doc.id } });
    await prisma.documentFile.create({
      data: {
        documentId: doc.id,
        storageProvider: 'LOCAL',
        objectKey,
        originalName: docData.fileName,
        mimeType: 'application/pdf',
        sizeBytes: pdfBuffer.length
      }
    });
  }

  // 7. Seed Real Forum Posts & Comments
  const seedForumPost = async (id: string, title: string, content: string, authorId: string) => {
    return prisma.forumPost.upsert({
      where: { id },
      update: { title, content },
      create: { id, title, content, authorId }
    });
  };

  const seedForumComment = async (id: string, postId: string, content: string, authorId: string) => {
    return prisma.forumComment.upsert({
      where: { id },
      update: { content },
      create: { id, postId, content, authorId }
    });
  };

  const post1 = await seedForumPost(
    '11111111-1111-1111-1111-111111111111',
    'Giải đáp thuật toán Dijkstra và ứng dụng tìm đường đi ngắn nhất trong đồ thị có trọng số',
    'Mình đang gặp khó khăn khi cài đặt thuật toán Dijkstra trong bài tập lớn môn Cấu trúc dữ liệu và giải thuật. Mọi người và thầy cô có thể chia sẻ kinh nghiệm xử lý đồ thị có trọng số lớn được không ạ?',
    student.id
  );

  const post2 = await seedForumPost(
    '22222222-2222-2222-2222-222222222222',
    'Phân tích xu hướng biến động tỷ giá USD/VND tác động đến cán cân thương mại Việt Nam 2026',
    'Chào các bạn và quý thầy cô, nhóm nghiên cứu sinh viên chúng mình muốn mở một chủ đề thảo luận về các nhân tố vĩ mô ảnh hưởng đến tỷ giá và cán cân xuất nhập khẩu năm 2026.',
    student.id
  );

  const post3 = await seedForumPost(
    '33333333-3333-3333-3333-333333333333',
    'Cách tiếp cận và giải phương trình vi phân cấp 2 hệ số hằng bằng phương pháp biến thiên hằng số',
    'Em xin hỏi phương pháp biến thiên hằng số Lagrange khi vế phải f(x) không ở dạng đặc biệt thì các bước tìm nghiệm riêng thế nào để tránh tính tích phân quá phức tạp ạ?',
    student.id
  );

  await seedForumComment(
    '44444444-4444-4444-4444-444444444444',
    post1.id,
    'Chào em, với thuật toán Dijkstra em nên kết hợp sử dụng Min-Heap (Priority Queue) để giảm độ phức tạp xuống O((V + E) log V). Em có thể tham khảo thêm mục 4.2 trong Giáo trình Cấu trúc dữ liệu nhé!',
    lecturer.id
  );

  await seedForumComment(
    '55555555-5555-5555-5555-555555555555',
    post2.id,
    'Chủ đề nghiên cứu rất hay. Thầy lưu ý các em cần thu thập thêm số liệu thực nghiệm từ Tổng cục Hải quan và Ngân hàng Nhà nước để bài phân tích có tính thuyết phục cao.',
    lecturer.id
  );

  await seedForumComment(
    '66666666-6666-6666-6666-666666666666',
    post3.id,
    'Em lập hệ phương trình vi phân cho c1\'(x) và c2\'(x) theo định thức Wronskian W(x). Khi tính tích phân hãy chú ý rút gọn biểu thức trước nhé.',
    lecturer.id
  );

  // 8. Study Groups
  const group1 = await prisma.studyGroup.upsert({
    where: { id: '55555555-5555-5555-5555-555555555555' },
    update: {},
    create: {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'Nhóm Luyện Code & Thuật toán C++',
      description: 'Nhóm học tập chuyên sâu dành cho sinh viên Đại học Trưng Vương rèn luyện kỹ năng lập trình và cấu trúc dữ liệu.',
      ownerId: lecturer.id,
      visibility: 'PUBLIC'
    }
  });

  const group2 = await prisma.studyGroup.upsert({
    where: { id: '66666666-6666-6666-6666-666666666666' },
    update: {},
    create: {
      id: '66666666-6666-6666-6666-666666666666',
      name: 'Nghiên cứu Trí tuệ Nhân tạo & Machine Learning',
      description: 'Trao đổi về các mô hình RAG, xử lý ngôn ngữ tự nhiên và ứng dụng AI vào thực tiễn.',
      ownerId: student.id,
      visibility: 'PUBLIC'
    }
  });

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

  console.log('✅ Nạp dữ liệu Seeding thành công 100%!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
