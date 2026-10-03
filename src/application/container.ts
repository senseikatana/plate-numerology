import { TesseractOcrReader } from '@/adapters/TesseractOcrReader.ts';
import { CalculatePlateUseCase } from './CalculatePlateUseCase.ts';
import { ScanPlateUseCase } from './ScanPlateUseCase.ts';
import type { OcrReader } from './ports/OcrReader.ts';
import { DigitalRootReduction } from '@/domain/calculation/ReductionStrategy.ts';
import { NumerologyFacade } from '@/domain/calculation/NumerologyFacade.ts';
import { NineExclusionSumDecorator } from '@/domain/calculation/NineExclusionSumDecorator.ts';
import { DirectSumStrategy } from '@/domain/calculation/SumStrategy.ts';
import { ResultBroadcaster } from '@/domain/events/ResultBroadcaster.ts';

// Composition root (Singleton): una única instancia de cada servicio por aplicación
const facade = new NumerologyFacade(new NineExclusionSumDecorator(new DirectSumStrategy()), new DigitalRootReduction());
const broadcaster = new ResultBroadcaster();
const ocrReader: OcrReader = new TesseractOcrReader();

export const resultEvents = broadcaster;
export const calculatePlate = new CalculatePlateUseCase(facade, broadcaster);
export const scanPlate = new ScanPlateUseCase(ocrReader, calculatePlate, broadcaster);
