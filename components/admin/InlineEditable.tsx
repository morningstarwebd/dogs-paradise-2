'use client';

import React from 'react';
import { Edit2, Image as ImageIcon, Palette } from 'lucide-react';

export type EditType = 'text' | 'textarea' | 'button' | 'image' | 'number';

interface InlineEditableProps {
  isEditorMode?: boolean;
  sectionId?: string;
  propKey: string;
  value?: unknown;
  editType?: EditType;
  colorKey?: string;
  colorValue?: string;
  blockId?: string;       // NEW: Shopify-style block ID
  blockIndex?: number;    // NEW: Index in the blocks array
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  containerMode?: boolean;
}

export function InlineEditable({
  isEditorMode = false,
  sectionId,
  propKey,
  editType = 'text',
  blockId,
  blockIndex,
  children,
  as: Component = 'span',
  className = '',
  style,
  containerMode = false,
}: InlineEditableProps) {
  
  if (!isEditorMode) {
    return <Component className={className} style={style}>{children}</Component>;
  }

  // Which icon helps users identify the editable region?
  let Icon = Edit2;
  if (editType === 'image') Icon = ImageIcon;
  else if (editType === 'button') Icon = Palette;
  else if (editType === 'textarea') Icon = Edit2;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof window !== 'undefined' && window.parent !== window && sectionId) {
      // If this is a block-level element, send FOCUS_BLOCK instead of FOCUS_FIELD
      if (blockId) {
        window.parent.postMessage({
          type: 'FOCUS_BLOCK',
          sectionId,
          blockId,
          blockIndex: blockIndex ?? 0,
          fieldKey: propKey
        }, window.location.origin);
      } else {
        window.parent.postMessage({
          type: 'FOCUS_FIELD',
          sectionId,
          fieldKey: propKey
        }, window.location.origin);
      }
    }
  };

  return (
    <div 
      className={
        containerMode
          ? `relative group flex w-full h-full ${className}`
          : `relative group inline-flex ${editType === 'button' || editType === 'image' ? 'w-fit' : 'inline-block'} ${className}`
      }
      style={{ margin: 0, padding: 0 }}
      onClick={handleClick}
    >
      <div className={`relative cursor-pointer transition-all duration-300 rounded outline outline-4 outline-transparent hover:outline-pink-500/80 hover:bg-pink-400/10 ${containerMode ? 'w-full h-full' : editType === 'image' ? 'w-full h-full' : 'px-2 py-1 -mx-2 -my-1'}`}>
        <Component className={className} style={style}>{children}</Component>
        
        <div className={`absolute ${editType === 'image' ? 'top-4 right-4 scale-150' : '-top-3 -right-3'} opacity-0 group-hover:opacity-100 transition-opacity bg-pink-500 text-white p-1.5 rounded-full shadow-lg z-10 pointer-events-none`}>
          <Icon size={12} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
