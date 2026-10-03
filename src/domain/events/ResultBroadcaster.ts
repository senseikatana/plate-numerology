import type { PlateReading } from '../calculation/NumerologyFacade.ts';

export type CalculationEvent =
  | { readonly type: 'calculated'; readonly reading: PlateReading }
  | { readonly type: 'failed'; readonly message: string }
  | {
      readonly type: 'ocr-progress';
      readonly progress: number;
      readonly status: string;
    };

export type CalculationListener = (event: CalculationEvent) => void;
export type Unsubscribe = () => void;

// Observer: mantiene suscriptores interesados en los resultados del cálculo
export class ResultBroadcaster {
  private readonly listeners = new Set<CalculationListener>();

  subscribe(listener: CalculationListener): Unsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  broadcast(event: CalculationEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
