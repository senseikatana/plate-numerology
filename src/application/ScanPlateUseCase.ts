import type { PlateReading } from '@/domain/calculation/NumerologyFacade.ts';
import type { ResultBroadcaster } from '@/domain/events/ResultBroadcaster.ts';
import type { CalculatePlateUseCase } from './CalculatePlateUseCase.ts';
import type { OcrReader } from './ports/OcrReader.ts';

const PLATE_CANDIDATE_PATTERN = /\d{4}[A-Z]{3}/;

const OCR_DETECTION_ERROR =
  'No se pudo detectar una matrícula válida (4 números y 3 letras). Intenta hacer una foto más nítida.';
const OCR_RUNTIME_ERROR = 'Error al procesar la imagen.';

// Caso de uso: leer una matrícula desde una imagen (OCR) y calcular su número
export class ScanPlateUseCase {
  constructor(
    private readonly ocrReader: OcrReader,
    private readonly calculatePlate: CalculatePlateUseCase,
    private readonly broadcaster: ResultBroadcaster,
  ) {}

  async execute(image: Blob): Promise<PlateReading | null> {
    try {
      const text = await this.ocrReader.readImage(image, (progress) => {
        this.broadcaster.broadcast({ type: 'ocr-progress', ...progress });
      });

      const candidate = extractPlateCandidate(text);

      if (candidate === null) {
        this.broadcaster.broadcast({ type: 'failed', message: OCR_DETECTION_ERROR });
        return null;
      }

      return this.calculatePlate.execute(candidate);
    } catch {
      this.broadcaster.broadcast({ type: 'failed', message: OCR_RUNTIME_ERROR });
      return null;
    }
  }
}

export function extractPlateCandidate(rawText: string): string | null {
  const compactText = rawText.replace(/\s/g, '').toUpperCase();
  return compactText.match(PLATE_CANDIDATE_PATTERN)?.[0] ?? null;
}
