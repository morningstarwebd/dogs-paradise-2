'use client';

import { Loader2, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { STORAGE_BUCKET } from '@/lib/storage';

type ImageFieldProps = {
  fieldKey: string;
  onChange: (value: string) => void;
  setUploading: (uploading: boolean) => void;
  uploading: boolean;
  value: unknown;
};

export function ImageField({ fieldKey, onChange, setUploading, uploading, value }: ImageFieldProps) {
  const imageValue = typeof value === 'string' ? value : '';

  return (
    <div className="space-y-3">
      {imageValue ? (
        <div className="relative h-32 w-full overflow-hidden rounded-lg border border-[#ea728c]/30 bg-black/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageValue} alt="Preview" className="h-full w-full object-contain" />
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        <input type="text" value={imageValue} onChange={(event) => onChange(event.target.value)} placeholder="URL of the image" className="min-w-0 flex-1 rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-xs text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#ea728c]" />
        <input
          type="file"
          id={`file-${fieldKey}`}
          className="hidden"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setUploading(true);
            try {
              const supabase = createClient();
              const ext = file.name.split('.').pop();
              const fileName = `${fieldKey}_${Date.now()}.${ext}`;
              const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(`legacy/${fileName}`, file, { cacheControl: '3600', upsert: false });
              if (error) throw error;
              const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
              onChange(urlData.publicUrl);
            } catch (error) {
              console.error(error);
              alert('Image upload failed');
            } finally {
              setUploading(false);
            }
          }}
        />
        <button type="button" onClick={() => document.getElementById(`file-${fieldKey}`)?.click()} disabled={uploading} className="flex h-[34px] shrink-0 items-center gap-1.5 rounded-lg bg-[#ea728c] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-pink-600 disabled:opacity-50">
          {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
          Upload
        </button>
      </div>
    </div>
  );
}
