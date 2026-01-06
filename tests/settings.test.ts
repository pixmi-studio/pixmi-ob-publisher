import { describe, it, expect } from 'vitest';
import { DEFAULT_SETTINGS } from '../settings';

describe('Settings', () => {
  it('should have default settings', () => {
    expect(DEFAULT_SETTINGS).toBeDefined();
    expect(DEFAULT_SETTINGS.appId).toBe('');
    expect(DEFAULT_SETTINGS.appSecret).toBe('');
  });
});
