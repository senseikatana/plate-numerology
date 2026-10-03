// Strategy: algoritmo de suma de los dígitos de la matrícula
export interface SumStrategy {
  sum(digits: readonly string[]): number;
}

export class DirectSumStrategy implements SumStrategy {
  sum(digits: readonly string[]): number {
    return digits.reduce((total, digit) => total + Number.parseInt(digit, 10), 0);
  }
}
