import { describe, expect, it } from 'vitest';
import { formatBytes, formatDate, formatRelative } from '../lib/format';

describe('formatBytes', () => {
  it('uses one decimal, Indonesian comma, MB unit', () => {
    expect(formatBytes(26845123)).toBe('26,8 MB');
    expect(formatBytes(28313172)).toBe('28,3 MB');
  });

  it('switches to KB under a megabyte', () => {
    expect(formatBytes(361647)).toBe('361,6 KB');
  });

  it('never renders NaN', () => {
    expect(formatBytes(0)).toBe('-');
    expect(formatBytes(Number.NaN)).toBe('-');
  });
});

describe('formatDate', () => {
  it('renders the WIB date of a UTC morning release', () => {
    expect(formatDate('2026-11-15T04:39:38Z')).toBe('15 Nov 2026');
  });

  it('renders relative minutes against a fixed now', () => {
    expect(formatRelative('2026-11-15T04:39:38Z', new Date('2026-11-15T05:00:00Z'))).toBe('20 menit lalu');
  });

  it('renders relative hours', () => {
    expect(formatRelative('2026-11-15T04:39:38Z', new Date('2026-11-15T09:00:00Z'))).toBe('4 jam lalu');
  });
});
