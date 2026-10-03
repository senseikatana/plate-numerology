import type { Plate } from '../plate/Plate.ts';
import { PlateFactory } from '../plate/PlateFactory.ts';
import type { ReductionStrategy } from './ReductionStrategy.ts';
import type { SumStrategy } from './SumStrategy.ts';

export interface PlateReading {
  readonly plate: Plate;
  readonly sum: number;
  readonly value: number;
}

// Facade: expone el cálculo numérico completo tras una única llamada
export class NumerologyFacade {
  constructor(
    private readonly sumStrategy: SumStrategy,
    private readonly reductionStrategy: ReductionStrategy,
  ) {}

  calculate(rawPlate: string): PlateReading {
    const plate = PlateFactory.create(rawPlate);
    const sum = this.sumStrategy.sum(plate.digits);
    const value = this.reductionStrategy.reduce(sum);
    return { plate, sum, value };
  }
}
