import { PlateFormatError } from '../errors.ts';
import { Plate } from './Plate.ts';

const PLATE_LENGTH = 7;
const DIGIT_POOL = '0123456789';
const LETTER_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SPANISH_PLATE_PATTERN = /^\d{4}[A-Z]{3}$/;

// Factory: único punto de creación de Plate desde una entrada cruda
export class PlateFactory {
  static create(rawPlate: string): Plate {
    const normalized = normalize(rawPlate);

    if (normalized.length !== PLATE_LENGTH) {
      throw new PlateFormatError('La matrícula debe tener exactamente 7 caracteres.');
    }

    if (!SPANISH_PLATE_PATTERN.test(normalized)) {
      throw new PlateFormatError('Formato inválido. Debe ser 4 números y 3 letras (Ej: 9932AZG).');
    }

    return new Plate(normalized.slice(0, 4), normalized.slice(4));
  }

  static random(): Plate {
    return new Plate(randomChars(DIGIT_POOL, 4), randomChars(LETTER_POOL, 3));
  }
}

function normalize(rawPlate: string): string {
  return rawPlate.replace(/\s/g, '').toUpperCase();
}

function randomChars(pool: string, length: number): string {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += pool[Math.floor(Math.random() * pool.length)];
  }
  return result;
}
