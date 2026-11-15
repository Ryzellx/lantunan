export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" width="28" height="28" aria-hidden="true" focusable="false">
      <rect width="28" height="28" rx="8" fill="#CD5CFF" />
      <g fill="#14091A">
        <rect x="7" y="11" width="3" height="6" rx="1.5" />
        <rect x="12.5" y="7" width="3" height="14" rx="1.5" />
        <rect x="18" y="12.5" width="3" height="3" rx="1.5" />
      </g>
    </svg>
  );
}
