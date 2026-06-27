import { readFileSync } from 'fs';
import { join } from 'path';

describe('US1 contract', () => {
  it('defines auth and public document routes', () => {
    const yaml = readFileSync(join(__dirname, '../../specs/001-digital-library-forum/contracts/openapi.yaml'), 'utf8');
    expect(yaml).toContain('/auth/register');
    expect(yaml).toContain('/auth/login');
    expect(yaml).toContain('/documents');
    expect(yaml).toContain('/documents/{documentId}');
  });
});
