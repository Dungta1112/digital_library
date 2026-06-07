import { BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('formats thrown http exceptions', () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const host: any = {
      switchToHttp: () => ({ getResponse: () => ({ status }) })
    };
    new HttpExceptionFilter().catch(new BadRequestException('Bad input'), host);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });
});
