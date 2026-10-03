// Value object inmutable: una matrícula española (4 números + 3 letras)
export class Plate {
  constructor(
    private readonly digitsPart: string,
    private readonly lettersPart: string,
  ) {}

  get digits(): readonly string[] {
    return [...this.digitsPart];
  }

  get letters(): string {
    return this.lettersPart;
  }

  get value(): string {
    return `${this.digitsPart}${this.lettersPart}`;
  }
}
