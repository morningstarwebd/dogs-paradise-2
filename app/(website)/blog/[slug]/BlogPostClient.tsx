'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { fadeUpVariant } from '@/lib/animations';
import BlogCard from '@/components/blog/BlogCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { ArrowLeft, Clock, User } from 'lucide-react';
import type { BlogPost } from '@/types';

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostClient({ post, relatedPosts }: Props) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Simple markdown-like rendering: split by \n\n, handle headers, lists, tables etc.
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Skip the first H1 (title) since we render it separately
      if (line.startsWith('# ') && elements.length === 0) {
        i++;
        continue;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i}>{processInlineMarkdown(line.slice(4))}</h3>);
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i}>{processInlineMarkdown(line.slice(3))}</h2>);
        i++;
        continue;
      }

      // Horizontal rule
      if (line.trim() === '---') {
        elements.push(<hr key={i} />);
        i++;
        continue;
      }

      // Table
      if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('---')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].includes('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        elements.push(renderTable(tableLines, elements.length));
        continue;
      }

      // Unordered list with checkbox
      if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
        const listItems: string[] = [];
        while (i < lines.length && (lines[i].startsWith('- [ ] ') || lines[i].startsWith('- [x] '))) {
          listItems.push(lines[i]);
          i++;
        }
        elements.push(
          <ul key={elements.length} className="space-y-1">
            {listItems.map((item, idx) => {
              const checked = item.startsWith('- [x] ');
              const text = item.replace(/^- \[[ x]\] /, '');
              return (
                <li key={idx} className="flex items-start gap-2">
                  <span className={checked ? 'text-green-400' : 'text-[var(--text-tertiary)]'}>
                    {checked ? '☑' : '☐'}
                  </span>
                  {processInlineMarkdown(text)}
                </li>
              );
            })}
          </ul>
        );
        continue;
      }

      // Unordered list
      if (line.startsWith('- ')) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].startsWith('- ')) {
          listItems.push(lines[i].slice(2));
          i++;
        }
        elements.push(
          <ul key={elements.length}>
            {listItems.map((item, idx) => (
              <li key={idx}>{processInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered list
      if (/^\d+\.\s/.test(line)) {
        const listItems: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          listItems.push(lines[i].replace(/^\d+\.\s/, ''));
          i++;
        }
        elements.push(
          <ol key={elements.length}>
            {listItems.map((item, idx) => (
              <li key={idx}>{processInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Paragraph
      elements.push(<p key={i}>{processInlineMarkdown(line)}</p>);
      i++;
    }

    return elements;
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
        aria-hidden="true"
      />

      <div className="pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </motion.div>

          {/* Cover Image */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8"
          >
            <Image
              src={post.coverImagePath}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="label-badge inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/80">
                {post.category}
              </span>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <h1 className="heading-section text-gradient mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)] mb-10">
              <span className="flex items-center gap-1.5">
                <User size={14} />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readingTime}
              </span>
              <span>{post.publishedAt}</span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="prose-dark"
          >
            {renderContent(post.content)}
          </motion.div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <SectionHeading title="Related Articles" subtitle="Continue reading more from this category." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p, i) => (
                <BlogCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function processInlineMarkdown(text: string): React.ReactNode {
  // Process bold, italic, links, code
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Link: [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    // Inline code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/);

    // Find earliest match
    const matches = [
      linkMatch ? { type: 'link', match: linkMatch, index: linkMatch.index! } : null,
      boldMatch ? { type: 'bold', match: boldMatch, index: boldMatch.index! } : null,
      codeMatch ? { type: 'code', match: codeMatch, index: codeMatch.index! } : null,
    ].filter(Boolean).sort((a, b) => a!.index - b!.index);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const earliest = matches[0]!;
    const before = remaining.slice(0, earliest.index);
    if (before) parts.push(before);

    if (earliest.type === 'link') {
      const href = earliest.match![2];
      const isExternal = href.startsWith('http');
      parts.push(
        <Link key={keyIdx++} href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}>
          {earliest.match![1]}
        </Link>
      );
      remaining = remaining.slice(earliest.index + earliest.match![0].length);
    } else if (earliest.type === 'bold') {
      parts.push(<strong key={keyIdx++}>{earliest.match![1]}</strong>);
      remaining = remaining.slice(earliest.index + earliest.match![0].length);
    } else if (earliest.type === 'code') {
      parts.push(<code key={keyIdx++}>{earliest.match![1]}</code>);
      remaining = remaining.slice(earliest.index + earliest.match![0].length);
    }
  }

  return <>{parts}</>;
}

function renderTable(lines: string[], key: number): React.ReactNode {
  const headerCells = lines[0].split('|').map((c) => c.trim()).filter(Boolean);
  const bodyRows = lines.slice(2).map((line) =>
    line.split('|').map((c) => c.trim()).filter(Boolean)
  );

  return (
    <table key={key}>
      <thead>
        <tr>
          {headerCells.map((cell, i) => (
            <th key={i}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
