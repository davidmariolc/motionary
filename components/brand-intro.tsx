"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { BrandArtwork } from "@/components/brand-artwork";
import { mountBrandIntro } from "@/lib/brand-intro-player";

export const BrandIntro = () => {
  const overlayReference = useRef<HTMLDivElement>(null);
  const lifecycle = useRef({ generation: 0 });
  const pathname = usePathname();

  useLayoutEffect(() => {
    const instance = lifecycle.current;
    instance.generation += 1;
    const { generation } = instance;
    return mountBrandIntro(
      overlayReference.current,
      pathname,
      () => instance.generation === generation
    );
  }, [pathname]);

  return (
    <div className="brand-intro" ref={overlayReference} aria-hidden="true">
      <div className="intro-backdrop" />
      <div className="intro-surface" />
      <span className="brand intro-logo">
        <BrandArtwork />
      </span>
    </div>
  );
};
