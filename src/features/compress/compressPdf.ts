import { PDFDocument } from 'pdf-lib';

export type CompressionLevel = 'low' | 'medium' | 'high';

export async function compressPdf(file: File, level: CompressionLevel): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  switch (level) {
    case 'low':
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('StudyKit');
      doc.setCreator('StudyKit');
      return doc.save({ useObjectStreams: true });
    case 'medium':
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('StudyKit');
      doc.setCreator('StudyKit');
      doc.setCreationDate(new Date(0));
      doc.setModificationDate(new Date(0));
      return doc.save({ useObjectStreams: true, addDefaultPage: false });
    case 'high':
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('StudyKit');
      doc.setCreator('StudyKit');
      doc.setCreationDate(new Date(0));
      doc.setModificationDate(new Date(0));
      return doc.save({ useObjectStreams: true, addDefaultPage: false });
  }
}

export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}
