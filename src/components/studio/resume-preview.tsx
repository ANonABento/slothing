"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { TEMPLATES } from "@/lib/resume/template-data";
import type { TailoredResume } from "@/lib/resume/generator";

export interface ResumePreviewProps {
  resume: TailoredResume;
  templateId: string;
  html: string;
}

export function ResumePreview({ resume, templateId, html }: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const template = TEMPLATES.find((t) => t.id === templateId);
  const accentColor = template?.styles.accentColor ?? "#333333";
  const fontFamily =
    template?.styles.fontFamily ?? "'Helvetica Neue', Arial, sans-serif";

  const PAGE_WIDTH_PX = 816; // 8.5in at 96dpi

  const updateScale = useCallback(() => {
    if (!wrapperRef.current) return;
    const availableWidth = wrapperRef.current.clientWidth - 48; // minus padding
    if (availableWidth < PAGE_WIDTH_PX) {
      setScale(availableWidth / PAGE_WIDTH_PX);
    } else {
      setScale(1);
    }
  }, []);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [updateScale]);

  return (
    <div ref={wrapperRef} className="h-full overflow-auto bg-muted/30 p-4">
      <div
        className="mx-auto"
        style={{
          width: `${PAGE_WIDTH_PX}px`,
          transformOrigin: "top center",
          transform: `scale(${scale})`,
        }}
      >
        <article
          ref={containerRef}
          className="min-h-[11in] bg-white px-14 py-12 text-slate-950 shadow-lg"
          style={{
            width: `${PAGE_WIDTH_PX}px`,
            fontFamily,
            borderTop: `4px solid ${accentColor}`,
          }}
        >
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              Select entries and a template to see a preview.
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
