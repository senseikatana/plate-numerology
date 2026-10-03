import type { SumStrategy } from './SumStrategy.ts';

// Decorator: aplica la regla de los 9 sobre cualquier estrategia de suma.
// Si hay más de un 9 entre los dígitos se excluyen todos; con un solo 9 se suma.
export class NineExclusionSumDecorator implements SumStrategy {
  constructor(private readonly inner: SumStrategy) {}

  sum(digits: readonly string[]): number {
    const nineCount = digits.filter((digit) => digit === '9').length;
    const source = nineCount > 1 ? digits.filter((digit) => digit !== '9') : digits;
    return this.inner.sum(source);
  }
}
