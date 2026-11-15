import { describe, expect, it } from 'vitest';
import { renderNotes } from '../lib/markdown';

describe('renderNotes', () => {
  it('escapes raw HTML', () => {
    expect(renderNotes('<img src=x onerror=alert(1)>')).not.toContain('<img');
    expect(renderNotes('<img src=x>')).toContain('&lt;img');
  });

  it('renders list items and bold', () => {
    const html = renderNotes('* Fix: link website\n* **Ganti** domain');
    expect(html).toContain('<ul>');
    expect(html).toContain('<strong>Ganti</strong>');
    expect(html.match(/<li>/g)).toHaveLength(2);
  });

  it('drops javascript: links', () => {
    expect(renderNotes('[x](javascript:alert(1))')).not.toContain('javascript:');
  });

  it('keeps normal links', () => {
    expect(renderNotes('[repo](https://github.com/Ryzellx)')).toContain(
      'href="https://github.com/Ryzellx"',
    );
  });
});
