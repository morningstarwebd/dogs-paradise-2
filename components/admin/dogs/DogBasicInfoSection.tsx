import { useState } from 'react';
import { Dog, Wand2, Loader2 } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { CATEGORIES, type DogFormSetter, type DogFormState } from './dogs-constants';
import { useEffect } from 'react';
import { listMediaFiles } from '@/app/actions/media';
import { slugify } from './dogs-helpers';

type DogBasicInfoSectionProps = {
  form: DogFormState;
  onTitleChange: (title: string) => void;
  setForm: DogFormSetter;
  setTagsInput: (value: string) => void;
  tagsInput: string;
};

export function DogBasicInfoSection({
  form,
  onTitleChange,
  setForm,
  setTagsInput,
  tagsInput,
}: DogBasicInfoSectionProps) {
  const [generatingShort, setGeneratingShort] = useState(false);
  const [generatingLong, setGeneratingLong] = useState(false);
  const [availableFiles, setAvailableFiles] = useState<{name: string, url: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    async function loadAllFiles() {
      const { files } = await listMediaFiles('');
      if (files) {
        const cleanedFiles = files.map(f => {
          let cleanName = f.name.replace(/\.[^/.]+$/, ""); // remove extension
          cleanName = cleanName.replace(/[-_]/g, " "); // dashes to spaces
          cleanName = cleanName.replace(/\d+/g, "").trim(); // remove numbers
          return { name: cleanName, url: f.publicUrl };
        });
        setAvailableFiles(cleanedFiles);
      }
    }
    loadAllFiles();
  }, []);

  // Compute suggestions on the fly using Intelligent Clustering
  const suggestions = (() => {
    const query = form.title.trim().toLowerCase();
    if (!query) return [];
    
    const matches: Record<string, string[]> = {};
    
    // 1. Discovery: Find all possible common prefixes in the current library
    // that start with our query
    availableFiles.forEach(file => {
      const name = file.name;
      const nameLower = name.toLowerCase();
      
      if (nameLower.includes(query)) {
        const words = name.split(/\s+/).filter(Boolean);
        
        // Generate prefix candidates: Word 1, Word 1+2, Word 1+2+3
        let currentPrefix = "";
        for (let i = 0; i < Math.min(words.length, 3); i++) {
          currentPrefix = currentPrefix ? `${currentPrefix} ${words[i]}` : words[i];
          const pLower = currentPrefix.toLowerCase();
          
          if (pLower.includes(query)) {
            const key = currentPrefix.replace(/\b\w/g, l => l.toUpperCase());
            if (!matches[key]) matches[key] = [];
            if (!matches[key].includes(file.url)) matches[key].push(file.url);
          }
        }
      }
    });

    // 2. Refinement: Filter and Sort
    // We only want to show groups that have at least 1 image
    // and we prefer groups that are "Main" (more images) or exact matches.
    return Object.keys(matches)
      .map(name => ({
        name,
        urls: matches[name]
      }))
      .filter(group => group.urls.length > 0)
      .sort((a, b) => {
        // Boost score if it's an exact start-match for the query
        const aStarts = a.name.toLowerCase().startsWith(query) ? 2000 : 0;
        const bStarts = b.name.toLowerCase().startsWith(query) ? 2000 : 0;
        return (bStarts + b.urls.length) - (aStarts + a.urls.length);
      })
      .slice(0, 5); // Show top 5 most relevant clusters
  })();

  const handleGenerateDescription = async (type: 'short' | 'long') => {
    if (!form.title.trim()) {
      alert("Please enter a Breed Name first to generate a description.");
      return;
    }

    if (type === 'short') setGeneratingShort(true);
    else setGeneratingLong(true);

    try {
      const res = await fetch('/api/ai/breed-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ breedName: form.title, type })
      });
      const data = await res.json();
      
      if (res.ok && data.text) {
        if (type === 'short') {
          setForm((current) => ({ ...current, description: data.text }));
        } else {
          setForm((current) => ({ ...current, long_description: data.text }));
        }
      } else {
        alert(data.error || "Failed to generate description");
      }
    } catch (err) {
      alert("An error occurred while generating description.");
    } finally {
      if (type === 'short') setGeneratingShort(false);
      else setGeneratingLong(false);
    }
  };

  return (
    <CollapsibleSection title="Basic Information" icon={Dog}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Breed Name *</label>
            <input
              value={form.title}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onChange={(event) => {
                onTitleChange(event.target.value);
                setShowSuggestions(true);
              }}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Golden Retriever"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-1">
                <div className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <span>Matches from Media Library</span>
                  <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[9px]">{suggestions.length} Found</span>
                </div>
                {suggestions.map(breed => (
                  <button
                    key={breed.name}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); 
                      const selectedBreedName = breed.name;
                      const newUrls = breed.urls;

                      setForm(curr => {
                        const currentImages = curr.images || [];
                        const imagesToAdd = newUrls.filter(url => !currentImages.includes(url));
                        return { 
                          ...curr, 
                          title: selectedBreedName,
                          slug: slugify(selectedBreedName),
                          images: [...currentImages, ...imagesToAdd]
                        };
                      });
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-4 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border-b border-gray-50 dark:border-gray-800 last:border-0 group"
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {breed.name}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Wand2 size={10} className="text-blue-400" />
                        Auto-fill all matching assets
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                        {breed.urls.length} {breed.urls.length === 1 ? 'Image' : 'Images'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug *</label>
            <input
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="golden-retriever"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Short Description</label>
            <button 
              type="button"
              onClick={() => handleGenerateDescription('short')}
              disabled={generatingShort || !form.title.trim()}
              className="flex items-center gap-1.5 text-xs font-bold text-purple-500 hover:text-purple-600 transition-colors disabled:opacity-50"
              title="Generate with AI"
            >
              {generatingShort ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
              Generate
            </button>
          </div>
          <textarea
            value={form.description || ''}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="min-h-[80px] w-full resize-y rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Brief description for cards and previews"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Description</label>
            <button 
              type="button"
              onClick={() => handleGenerateDescription('long')}
              disabled={generatingLong || !form.title.trim()}
              className="flex items-center gap-1.5 text-xs font-bold text-purple-500 hover:text-purple-600 transition-colors disabled:opacity-50"
              title="Generate with AI"
            >
              {generatingLong ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
              Generate AI
            </button>
          </div>
          <textarea
            value={form.long_description || ''}
            onChange={(event) => setForm((current) => ({ ...current, long_description: event.target.value }))}
            className="min-h-[150px] w-full resize-y rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Detailed description for the dog's page"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
            <select
              value={form.category || ''}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
            <select
              value={form.gender || ''}
              onChange={(event) =>
                setForm((current) => ({ ...current, gender: (event.target.value as 'male' | 'female') || null }))
              }
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
            <input
              value={form.age || ''}
              onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="8 weeks"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags (comma separated)</label>
          <input
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Family Friendly, Gentle, Smart"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}
