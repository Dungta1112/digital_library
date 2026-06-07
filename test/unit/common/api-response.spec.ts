import { created, fail, ok } from '../../../src/common/response/api-response';

describe('api response helpers', () => {
  it('creates success responses', () => {
    expect(ok({ id: '1' })).toEqual({ success: true, message: 'OK', data: { id: '1' } });
    expect(created({ id: '1' }).message).toBe('Created');
  });

  it('creates failure responses', () => {
    expect(fail('Invalid', ['email'])).toEqual({ success: false, message: 'Invalid', errors: ['email'] });
  });
});
