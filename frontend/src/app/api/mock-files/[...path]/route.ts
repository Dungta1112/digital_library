import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const MIME_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: filePathParts } = await params;
  const baseDir = path.join(process.cwd(), 'src', 'mocks');
  const filePath = path.normalize(path.join(baseDir, ...filePathParts));

  if (!filePath.startsWith(baseDir)) {
    return NextResponse.json({ message: 'Invalid file path' }, { status: 400 });
  }

  try {
    const file = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();

    return new NextResponse(file, {
      headers: {
        'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(path.basename(filePath))}`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }
}
