import { FileValidationPipe } from '../../../src/common/pipes/file-validation.pipe';

describe('Document upload storage validation', () => {
  it('accepts allowed file type within size limit', () => {
    const pipe = new FileValidationPipe();
    const file = pipe.transform({ mimetype: 'application/pdf', size: 10, originalname: 'doc.pdf' });
    expect(file.originalname).toBe('doc.pdf');
  });
});
