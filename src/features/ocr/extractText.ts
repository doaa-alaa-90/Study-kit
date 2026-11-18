import { createWorker, type Worker } from 'tesseract.js';

export type OcrLanguage = 'ara' | 'eng' | 'ara+eng';

export function isImageFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  return (
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg' ||
    file.type === 'image/png' ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png')
  );
}

export interface OcrProgress {
  status: string;
  progress: number;
}

export async function extractText(
  file: File,
  language: OcrLanguage,
  onProgress: (progress: OcrProgress) => void
): Promise<string> {
  let worker: Worker | null = null;
  try {
    worker = await createWorker(language, 1, {
      logger: (m: { status: string; progress: number }) => {
        onProgress({ status: m.status, progress: m.progress });
      },
    });
    const { data } = await worker.recognize(file);
    return data.text;
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}
