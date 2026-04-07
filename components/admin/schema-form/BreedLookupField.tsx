'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, Sparkles, Database, Loader2, X } from 'lucide-react';

type BreedResult = {
  title: string;
  image: string;
  url: string;
  source: 'database' | 'ai';
};

type BreedLookupFieldProps = {
  onSelect: (result: BreedResult) => void;
  placeholder?: string;
};

export function BreedLookupField({ onSelect, placeholder = 'Search breed name...' }: BreedLookupFieldProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BreedResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [correctedQuery, setCorrectedQuery] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchBreeds = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setCorrectedQuery(null);

    try {
      const response = await fetch('/api/breed-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      setResults(data.results || []);
      setCorrectedQuery(data.correctedQuery || null);
      setIsOpen((data.results || []).length > 0);
    } catch {
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedTitle(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      searchBreeds(value);
    }, 300);
  };

  const handleSelect = (result: BreedResult) => {
    setSelectedTitle(result.title);
    setQuery('');
    setIsOpen(false);
    setResults([]);
    onSelect(result);
  };

  const clearSelection = () => {
    setSelectedTitle(null);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Selected breed chip */}
      {selectedTitle ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2">
          <Sparkles size={14} className="text-green-400" />
          <span className="flex-1 text-sm font-medium text-green-300">
            Filled: {selectedTitle}
          </span>
          <button
            type="button"
            onClick={clearSelection}
            className="rounded p-0.5 text-green-400/60 transition-colors hover:text-green-300"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Search input */
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {isLoading ? (
              <Loader2 size={15} className="animate-spin text-[#ea728c]" />
            ) : (
              <Search size={15} className="text-gray-500" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-[#ea728c]/30 bg-[#1b1836] py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-gray-600 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ea728c]"
          />
        </div>
      )}

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-[#ea728c]/30 bg-[#24204b] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {/* AI correction label */}
          {correctedQuery && (
            <div className="flex items-center gap-2 border-b border-[#ea728c]/15 bg-[#ea728c]/5 px-3 py-2">
              <Sparkles size={12} className="text-[#ea728c]" />
              <span className="text-[11px] text-[#ea728c]">
                Did you mean: <strong>{correctedQuery}</strong>?
              </span>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto py-1">
            {results.map((result, i) => (
              <button
                key={`${result.title}-${i}`}
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#ea728c]/15"
              >
                {/* Thumbnail */}
                {result.image ? (
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#ea728c]/20 bg-black/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.image}
                      alt={result.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-600 bg-black/20 text-[10px] text-gray-500">
                    N/A
                  </div>
                )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white">
                    {result.title}
                  </div>
                  <div className="truncate text-[11px] text-gray-400">
                    {result.url}
                  </div>
                </div>

                {/* Source badge */}
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    result.source === 'ai'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {result.source === 'ai' ? (
                    <span className="flex items-center gap-1">
                      <Sparkles size={8} /> AI
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Database size={8} /> DB
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results state */}
      {isOpen && results.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-[#ea728c]/20 bg-[#24204b] px-4 py-3 text-center shadow-lg">
          <p className="text-xs text-gray-400">No matching breeds found</p>
        </div>
      )}
    </div>
  );
}
