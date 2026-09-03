import { describe, it, expect, vi } from 'vitest';
import { AdminService, parseConfigValue } from '../services/admin.service';
import { apiClient } from '../services/api-client';

describe('AdminService System Config & Single Role Updates', () => {
  describe('parseConfigValue Schema Preservation', () => {
    it('should parse boolean values properly based on config key schema', () => {
      expect(parseConfigValue('AUTH_ALLOW_REGISTRATION', 'true')).toBe(true);
      expect(parseConfigValue('AUTH_ALLOW_REGISTRATION', 'false')).toBe(false);
      expect(parseConfigValue('MAINTENANCE_MODE', 'true')).toBe(true);
    });

    it('should parse number values properly based on key schema', () => {
      expect(parseConfigValue('MAX_UPLOAD_SIZE_MB', '50')).toBe(50);
      expect(parseConfigValue('AUTH_MAX_FAILED_LOGINS', '5')).toBe(5);
    });

    it('should parse array/json values properly based on key schema', () => {
      expect(parseConfigValue('ALLOWED_FILE_EXTENSIONS', '["pdf", "docx"]')).toEqual(['pdf', 'docx']);
      expect(parseConfigValue('ALLOWED_FILE_EXTENSIONS', 'pdf, docx')).toEqual(['pdf', 'docx']);
    });

    it('should keep strings as strings for text keys even if content looks numeric', () => {
      expect(parseConfigValue('SYSTEM_NAME', '12345')).toBe('12345');
      expect(parseConfigValue('CONTACT_EMAIL', 'admin@dhtr質gvuong.edu.vn')).toBe('admin@dhtr質gvuong.edu.vn');
    });
  });

  describe('updateUserRole single-role array format', () => {
    it('updateUserRole() should send roleId inside a single-element array to enforce single-role backend contract', async () => {
      const putSpy = vi.spyOn(apiClient, 'put').mockResolvedValueOnce({} as unknown as never);

      await AdminService.updateUserRole('user-123', 'role-uuid-456');

      expect(putSpy).toHaveBeenCalledWith('/admin/users/user-123/roles', {
        roleIds: ['role-uuid-456'],
      });
    });
  });
});
