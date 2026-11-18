import { CalendarClock, Files, Image, ListChecks, NotebookPen, ScanText, Shrink, type LucideIcon } from 'lucide-react';
import type { TranslationKey } from '@/i18n';
import type { PageId } from '@/lib/routes';

export type ToolId = Exclude<PageId, 'home'>;

export interface ToolDefinition {
  id: ToolId;
  icon: LucideIcon;
  nameKey: TranslationKey;
  descKey: TranslationKey;
  altKey: TranslationKey;
  image: string;
}

export const TOOL_IDS: ToolId[] = ['merge', 'tasks', 'exams', 'notes', 'compress', 'images', 'ocr'];

export const TOOLS: Record<ToolId, ToolDefinition> = {
  merge: {
    id: 'merge',
    icon: Files,
    nameKey: 'tool.merge.name',
    descKey: 'tool.merge.desc',
    altKey: 'tool.merge.alt',
    image: 'https://images.pexels.com/photos/7054757/pexels-photo-7054757.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  tasks: {
    id: 'tasks',
    icon: ListChecks,
    nameKey: 'tool.tasks.name',
    descKey: 'tool.tasks.desc',
    altKey: 'tool.tasks.alt',
    image: 'https://images.pexels.com/photos/5861183/pexels-photo-5861183.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  exams: {
    id: 'exams',
    icon: CalendarClock,
    nameKey: 'tool.exams.name',
    descKey: 'tool.exams.desc',
    altKey: 'tool.exams.alt',
    image: 'https://images.pexels.com/photos/1179490/pexels-photo-1179490.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  notes: {
    id: 'notes',
    icon: NotebookPen,
    nameKey: 'tool.notes.name',
    descKey: 'tool.notes.desc',
    altKey: 'tool.notes.alt',
    image: 'https://images.pexels.com/photos/7213436/pexels-photo-7213436.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  compress: {
    id: 'compress',
    icon: Shrink,
    nameKey: 'tool.compress.name',
    descKey: 'tool.compress.desc',
    altKey: 'tool.compress.alt',
    image: 'https://images.pexels.com/photos/17018372/pexels-photo-17018372.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  images: {
    id: 'images',
    icon: Image,
    nameKey: 'tool.images.name',
    descKey: 'tool.images.desc',
    altKey: 'tool.images.alt',
    image: 'https://images.pexels.com/photos/9219057/pexels-photo-9219057.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  ocr: {
    id: 'ocr',
    icon: ScanText,
    nameKey: 'tool.ocr.name',
    descKey: 'tool.ocr.desc',
    altKey: 'tool.ocr.alt',
    image: 'https://images.pexels.com/photos/6334780/pexels-photo-6334780.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
};

export const HERO_IMAGE =
  'https://images.pexels.com/photos/5185082/pexels-photo-5185082.jpeg?auto=compress&cs=tinysrgb&w=1400';
