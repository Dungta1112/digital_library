/**
 * Tạo 1 bản ghi Document + DocumentFile test trỏ tới file PDF có sẵn, phục vụ
 * test luồng AI ingest/ask qua backend (Backend → Storage → ai_service).
 *
 * Chạy: npx ts-node scripts/create-test-document.ts
 * Idempotent: chạy lại sẽ in ra documentId đã tồn tại thay vì tạo bản ghi mới.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { copyFileSync, mkdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const prisma = new PrismaClient();

const SOURCE_PDF = resolve(__dirname, '../ai_service/test_docs/gt_co_so_du_lieu_1p2.pdf');
const ORIGINAL_NAME = 'gt_co_so_du_lieu_1p2.pdf';
const TITLE = 'Giáo trình Cơ sở dữ liệu (bản test AI)';

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
  copyFileSync(SOURCE_PDF, join(storageRoot, objectKey));
  const sizeBytes = statSync(SOURCE_PDF).size;

  const document = await prisma.document.create({
    data: {
      ownerId: admin.id,
      title: TITLE,
      description: 'Bản ghi test cho luồng hỏi–đáp theo nội dung tài liệu (Document RAG)',
      status: 'APPROVED',
      visibility: 'PUBLIC',
      approvedById: admin.id,
      approvedAt: new Date(),
      files: {
        create: {
          storageProvider: 'LOCAL',
          objectKey,
          originalName: ORIGINAL_NAME,
          mimeType: 'application/pdf',
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
