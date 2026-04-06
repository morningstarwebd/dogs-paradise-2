'use client';

import { BarChart3, CircleHelp, Image as ImageIcon, ListChecks, MousePointerClick, ShieldCheck } from 'lucide-react';

export const blockIconMap: Record<string, React.ReactNode> = {
  Image: <ImageIcon size={14} />,
  MousePointerClick: <MousePointerClick size={14} />,
  BarChart3: <BarChart3 size={14} />,
  ShieldCheck: <ShieldCheck size={14} />,
  CircleHelp: <CircleHelp size={14} />,
  ListChecks: <ListChecks size={14} />,
};
