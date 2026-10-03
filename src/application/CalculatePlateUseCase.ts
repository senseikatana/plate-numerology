import type { NumerologyFacade, PlateReading } from '@/domain/calculation/NumerologyFacade.ts';
import type { ResultBroadcaster } from '@/domain/events/ResultBroadcaster.ts';

// Caso de uso: calcular el número de una matrícula y difundir el resultado
export class CalculatePlateUseCase {
  constructor(
    private readonly facade: NumerologyFacade,
    private readonly broadcaster: ResultBroadcaster,
  ) {}

  execute(rawPlate: string): PlateReading | null {
    try {
      const reading = this.facade.calculate(rawPlate);
      this.broadcaster.broadcast({ type: 'calculated', reading });
      return reading;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido.';
      this.broadcaster.broadcast({ type: 'failed', message });
      return null;
    }
  }
}
