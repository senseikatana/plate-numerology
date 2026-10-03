// Strategy: reducción del total a un único dígito (raíz digital)
export interface ReductionStrategy {
  reduce(value: number): number;
}

export class DigitalRootReduction implements ReductionStrategy {
  reduce(value: number): number {
    let current = value;

    while (current >= 10) {
      current = [...String(current)].reduce((total, digit) => total + Number(digit), 0);
    }

    return current;
  }
}
