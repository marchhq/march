import type React from "react"
import ReactMarkdown from "react-markdown"

import remarkGfm from "remark-gfm"

interface MarkdownRendererProps {
  content: string | undefined
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }) {
          return (
            <pre className="rounded-md bg-gray-100 p-2 dark:bg-gray-800">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          )
        },
        // Add custom styling for list items
        ul({ node, ...props }) {
          return <ul className="my-4 list-inside list-disc" {...props} />
        },
        ol({ node, ...props }) {
          return <ol className="my-4 list-inside list-decimal" {...props} />
        },
        li({ node, ...props }) {
          return <li className="my-2" {...props} />
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
