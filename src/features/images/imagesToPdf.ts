import { PDFDocument } from 'pdf-lib';

export type PageSize = 'a4' | 'original';
export type Orientation = 'portrait' | 'landscape';

export const A4_WIDTH = 595.28;
export const A4_HEIGHT = 841.89;

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

export async function imagesToPdf(
  files: File[],
  pageSize: PageSize,
  orientation: Orientation
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    const lower = file.name.toLowerCase();
    const isPng = lower.endsWith('.png') || file.type === 'image/png';
    const image = isPng
      ? await doc.embedPng(new Uint8Array(imageBytes))
      : await doc.embedJpg(new Uint8Array(imageBytes));

    let pageWidth: number;
    let pageHeight: number;

    if (pageSize === 'a4') {
      if (orientation === 'landscape') {
        pageWidth = A4_HEIGHT;
        pageHeight = A4_WIDTH;
      } else {
        pageWidth = A4_WIDTH;
        pageHeight = A4_HEIGHT;
      }
    } else {
      pageWidth = image.width;
      pageHeight = image.height;
    }

    const page = doc.addPage([pageWidth, pageHeight]);

    const margin = pageSize === 'a4' ? 24 : 0;
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;
    const scale = Math.min(maxW / image.width, maxH / image.height, 1);
    const drawW = image.width * scale;
    const drawH = image.height * scale;
    const x = (pageWidth - drawW) / 2;
    const y = (pageHeight - drawH) / 2;

    page.drawImage(image, { x, y, width: drawW, height: drawH });
  }

  return doc.save();
}
