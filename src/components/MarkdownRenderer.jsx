import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ md }) {
  return (
    <div className="doc">
      <ReactMarkdown>{md}</ReactMarkdown>
    </div>
  );
}
