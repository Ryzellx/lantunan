export default function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      className={className}
      src="/brand/lantunan-icon-96.webp"
      alt=""
      width={28}
      height={28}
      aria-hidden="true"
      decoding="async"
    />
  );
}
