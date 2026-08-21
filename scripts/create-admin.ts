import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_EMAIL || 'admin@example.edu';
  const password = args[1] || process.env.ADMIN_PASSWORD || 'Admin123!';
  const fullName = args[2] || process.env.ADMIN_NAME || 'Quản trị viên Hệ thống';

  console.log(`\n⏳ Đang tạo/cập nhật tài khoản ADMIN: ${email}...`);

  // 1. Tìm role ADMIN
  const adminRole = await prisma.role.findUnique({
    where: { code: 'ADMIN' },
  });

  if (!adminRole) {
    console.error('❌ Lỗi: Role ADMIN chưa được khởi tạo trong Database. Hãy chạy `npm run seed` trước!');
    process.exit(1);
  }

  // 2. Hash password
  const saltRounds = Number(process.env.BCRYPT_ROUNDS ?? 12);
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 3. Tạo hoặc cập nhật User
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      passwordHash,
      status: 'ACTIVE',
    },
    create: {
      email,
      fullName,
      passwordHash,
      status: 'ACTIVE',
    },
  });

  // 4. Gán quyền ADMIN vào UserRole
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: adminRole.id,
    },
  });

  console.log('✅ Tạo tài khoản ADMIN thành công!\n');
  console.log('--------------------------------------------------');
  console.log(`📧 Email:    ${email}`);
  console.log(`🔑 Mật khẩu: ${password}`);
  console.log(`👤 Họ tên:   ${fullName}`);
  console.log(`🛡️ Vai trò:   ADMIN (Toàn quyền quản trị)`);
  console.log('--------------------------------------------------\n');
}

main()
  .catch((err) => {
    console.error('❌ Lỗi:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
