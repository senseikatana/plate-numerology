export interface OcrProgress {
  readonly progress: number;
  readonly status: string;
}

// Puerto de salida: el dominio no conoce Tesseract ni el DOM
export interface OcrReader {
  readImage(image: Blob, onProgress?: (progress: OcrProgress) => void): Promise<string>;
}
