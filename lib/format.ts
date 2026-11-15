const ID = 'id-ID';
const TZ = 'Asia/Jakarta';

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '-';
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1).replace('.', ',')} KB`;
  return `${(bytes / 1_000_000).toFixed(1).replace('.', ',')} MB`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(ID, {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(ID, {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: TZ, timeZoneName: 'short',
  }).format(new Date(iso));
}

export function formatRelative(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(diffMs / 60000));
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return formatDate(iso);
}
