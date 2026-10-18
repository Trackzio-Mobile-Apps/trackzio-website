import Image, { type StaticImageData } from "next/image";

type SiteImageProps = {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /** First-screen images. Everything else lazy-loads. */
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  quality?: number;
  /** Cover an absolutely positioned parent. Parent must be `relative`. */
  fill?: boolean;
};

function isSvgSrc(src: string | StaticImageData): boolean {
  const value = typeof src === "string" ? src : src.src;
  return value.split("?")[0].endsWith(".svg");
}

export default function SiteImage({
  src,
  alt,
  className,
  priority = false,
  sizes,
  width,
  height,
  style,
  quality = 60,
  fill = false,
}: SiteImageProps) {
  const imageProps = {
    src,
    alt,
    className,
    style,
    quality,
    sizes: sizes ?? (fill ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 800px"),
    ...(priority ? { priority: true as const } : { loading: "lazy" as const }),
    ...(isSvgSrc(src) ? { unoptimized: true as const } : {}),
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  const resolvedWidth = typeof src === "string" ? width : src.width;
  const resolvedHeight = typeof src === "string" ? height : src.height;
  if (!resolvedWidth || !resolvedHeight) {
    return null;
  }

  return <Image {...imageProps} width={resolvedWidth} height={resolvedHeight} />;
}
