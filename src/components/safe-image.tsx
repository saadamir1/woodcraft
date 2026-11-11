"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackSrc?: string;
};

/** Avoids broken-image icons when a remote/local asset 404s. */
export function SafeImage({
  src,
  fallbackSrc = "/products/hero-home.svg",
  alt,
  className,
  fill,
  ...rest
}: Props) {
  const [current, setCurrent] = useState(src);
  const isSvg = current.endsWith(".svg");

  if (isSvg && fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={current}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        onError={() => {
          if (current !== fallbackSrc) setCurrent(fallbackSrc);
        }}
      />
    );
  }

  return (
    <Image
      {...rest}
      fill={fill}
      alt={alt}
      src={current}
      unoptimized={isSvg}
      className={className}
      onError={() => {
        if (current !== fallbackSrc) setCurrent(fallbackSrc);
      }}
    />
  );
}
