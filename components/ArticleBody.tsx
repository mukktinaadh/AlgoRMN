"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import type { Components } from "react-markdown";

const components: Components = {
  h2: ({ children }) => (
    <h2 className="font-display text-2xl text-text-primary mt-12 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-xl text-text-primary mt-8 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="font-body text-sm text-text-secondary leading-relaxed mb-6">
      {children}
    </p>
  ),
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  code: ({ className, children, ...props }) => {
    // If inside a <pre> (code block), render plain
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <code className="font-body text-xs text-[#F0EDE6]" {...props}>
          {children}
        </code>
      );
    }
    // Inline code
    return (
      <code className="bg-code-bg text-accent font-body text-xs px-1.5 py-0.5 rounded-sm">
        {children}
      </code>
    );
  },
  ul: ({ children }) => (
    <ul className="font-body text-sm text-text-secondary mb-6 pl-6 space-y-2 list-disc">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="font-body text-sm text-text-secondary mb-6 pl-6 space-y-2 list-decimal">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="text-text-primary font-semibold">{children}</strong>
  ),
  hr: () => <hr className="border-border my-10" />,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent pl-6 my-6 font-body text-sm text-text-secondary italic">
      {children}
    </blockquote>
  ),
};

export default function ArticleBody({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
