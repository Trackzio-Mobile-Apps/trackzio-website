import type { StaticImageData } from "next/image";

export function imageSrc(src: string | StaticImageData): string {
  return typeof src === "string" ? src : src.src;
}
