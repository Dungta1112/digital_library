import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { copyFileSync, mkdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const prisma = new PrismaClient();

const SOURCE_FILE = resolve(__dirname, '../ai_service/test_docs/KỸ THUẬT LẬP TRÌNH CƠ SỞ 2.docx');
const ORIGINAL_NAME = 'KỸ THUẬT LẬP TRÌNH CƠ SỞ 2.docx';
const TITLE = 'Kỹ thuật lập trình cơ sở 2 (DOCX test AI)';

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.edu';
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: adminEmail } });

  const existing = await prisma.document.findFirst({
    where: { title: TITLE, deletedAt: null },
    include: { files: true }
  });
  if (existing) {
    console.log(`Document test đã tồn tại — documentId: ${existing.id}`);
    console.log(`objectKey: ${existing.files[0]?.objectKey}`);
    return;
  }

  const storageRoot = process.env.LOCAL_STORAGE_PATH ?? './storage';
  mkdirSync(storageRoot, { recursive: true });
  const objectKey = `${Date.now()}-${ORIGINAL_NAME}`;
  copyFileSync(SOURCE_FILE, join(storageRoot, objectKey));
  const sizeBytes = statSync(SOURCE_FILE).size;

  const document = await prisma.document.create({
    data: {
      ownerId: admin.id,
      title: TITLE,
      description: 'Bản ghi test cho luồng hỏi–đáp DOCX (Document RAG)',
      status: 'APPROVED',
      visibility: 'PUBLIC',
      approvedById: admin.id,
      approvedAt: new Date(),
      files: {
        create: {
          storageProvider: 'LOCAL',
          objectKey,
          originalName: ORIGINAL_NAME,
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          sizeBytes
        }
      }
    }
  });

  console.log(`Đã tạo Document test — documentId: ${document.id}`);
  console.log(`File copy vào: ${join(storageRoot, objectKey)}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
