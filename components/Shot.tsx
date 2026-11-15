type Props = {
  file: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Screenshots are pre-optimised at build time (360/720/1080, avif+webp+jpg).
 * A single 720-wide AVIF keeps the markup predictable and the bytes small.
 */
export default function Shot({
  file,
  alt,
  width,
  height,
  priority = false,
  className,
}: Props) {
  return (
    <img
      className={className}
      src={`/showcase/${file}-720.webp`}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
