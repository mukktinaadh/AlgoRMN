"use client";

import { useState, useRef } from "react";

export default function CodeBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silent fail
    }
  };

  return (
    <div className="relative mb-6 group">
      <pre
        ref={preRef}
        className="bg-code-bg border border-border rounded-sm p-6 overflow-x-auto"
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 font-ui text-xs bg-elevated border border-border text-text-muted px-2 py-1 hover:text-accent hover:border-accent transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
