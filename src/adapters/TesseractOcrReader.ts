import type { OcrProgress, OcrReader } from '@/application/ports/OcrReader.ts';

type TesseractModule = typeof import('tesseract.js');

// Adaptador de salida: traduce Tesseract.js al puerto OcrReader
export class TesseractOcrReader implements OcrReader {
  async readImage(image: Blob, onProgress?: (progress: OcrProgress) => void): Promise<string> {
    const Tesseract = await loadTesseract();

    const { data } = await Tesseract.recognize(image, 'spa', {
      logger: (message) => {
        onProgress?.({
          progress: message.progress ?? 0,
          status: message.status,
        });
      },
    });

    return data.text;
  }
}

// Carga diferida: tesseract.js solo se descarga al usar la pestaña de foto
async function loadTesseract(): Promise<TesseractModule> {
  const loaded = (await import('tesseract.js')) as TesseractModule & {
    default?: TesseractModule;
  };
  return loaded.default ?? loaded;
}
