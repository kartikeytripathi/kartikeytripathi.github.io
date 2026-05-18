"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-10 mb-4 text-white">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mt-10 mb-3 text-white border-b border-gray-800 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold mt-8 mb-2 text-gray-100">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-300 leading-relaxed mb-5">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <code
          className="block bg-gray-900 border border-gray-800 rounded-md px-4 py-3 text-sm font-mono text-green-300 overflow-x-auto whitespace-pre"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="bg-gray-900 border border-gray-800 rounded px-1.5 py-0.5 text-sm font-mono text-orange-300"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-5 rounded-md overflow-hidden">{children}</pre>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-gray-300 mb-5 space-y-1.5 pl-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-gray-300 mb-5 space-y-1.5 pl-2">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-indigo-500 pl-4 text-gray-400 italic my-5">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-gray-800 my-8" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm text-left border border-gray-800 rounded-md overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-900 text-gray-300 font-mono text-xs uppercase">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-800">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-gray-900/50">{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-2 border-b border-gray-800">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 text-gray-300">{children}</td>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
};

export default function ArticleBody({ content }: { content: string }) {
  return (
    <article className="mt-2">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
