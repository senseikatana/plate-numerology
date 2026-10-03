<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { calculatePlate, resultEvents, scanPlate } from '@/application/container.ts';
import type { PlateReading } from '@/domain/calculation/NumerologyFacade.ts';
import type { CalculationEvent } from '@/domain/events/ResultBroadcaster.ts';
import { PlateFactory } from '@/domain/plate/PlateFactory.ts';

type TabId = 'manual' | 'photo';

const ACTIVE_TAB_CLASSES = 'bg-cyan-500 text-white';
const INACTIVE_TAB_CLASSES = 'text-slate-400 hover:text-white';

const activeTab = ref<TabId>('manual');
const plateValue = ref('');
const reading = ref<PlateReading | null>(null);
const resultKey = ref(0);
const previewUrl = ref('');
const ocrLoading = ref(false);
const ocrPercent = ref(0);
const cameraInput = ref<HTMLInputElement | null>(null);

const isManual = computed(() => activeTab.value === 'manual');

const plateInput = computed({
  get: () => plateValue.value,
  set: (value: string) => {
    plateValue.value = value.toUpperCase();
  },
});

let unsubscribe: (() => void) | undefined;

onMounted(() => {
  unsubscribe = resultEvents.subscribe(handleCalculationEvent);
});

onUnmounted(() => {
  unsubscribe?.();
});

function handleCalculationEvent(event: CalculationEvent): void {
  switch (event.type) {
    case 'calculated':
      reading.value = event.reading;
      ocrLoading.value = false;
      resultKey.value += 1;
      break;
    case 'failed':
      ocrLoading.value = false;
      window.alert(event.message);
      break;
    case 'ocr-progress':
      ocrPercent.value = Math.round(event.progress * 100);
      break;
  }
}

function tabClass(active: boolean): string {
  const base = 'flex-1 py-2 rounded-lg text-sm font-medium transition-colors';
  return active ? `${base} ${ACTIVE_TAB_CLASSES}` : `${base} ${INACTIVE_TAB_CLASSES}`;
}

function selectTab(tab: TabId): void {
  activeTab.value = tab;
  resetResult();
}

function resetResult(): void {
  reading.value = null;
  plateValue.value = '';
}

function onCalculate(): void {
  calculatePlate.execute(plateValue.value);
}

function onRandom(): void {
  const plate = PlateFactory.random();
  plateValue.value = plate.value;
  calculatePlate.execute(plate.value);
}

function openCamera(): void {
  cameraInput.value?.click();
}

async function onCameraChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file === undefined) return;

  showPreview(file);
  reading.value = null;
  ocrLoading.value = true;
  ocrPercent.value = 0;

  try {
    await scanPlate.execute(file);
  } finally {
    ocrLoading.value = false;
  }
}

function showPreview(file: File): void {
  const reader = new FileReader();
  reader.onload = (event) => {
    previewUrl.value = String(event.target?.result ?? '');
  };
  reader.readAsDataURL(file);
}
</script>

<template>
  <div class="glass rounded-3xl p-6 shadow-2xl">
    <div class="flex justify-center gap-2 mb-6 bg-slate-800/50 p-1 rounded-xl">
      <button type="button" :class="tabClass(isManual)" @click="selectTab('manual')">
        Manual
      </button>
      <button type="button" :class="tabClass(!isManual)" @click="selectTab('photo')">
        Foto
      </button>
    </div>

    <!-- Entrada Manual -->
    <form v-if="isManual" @submit.prevent="onCalculate">
      <input
        v-model="plateInput"
        type="text"
        maxlength="7"
        placeholder="Ej: 9932AZG"
        autocomplete="off"
        aria-label="Matrícula"
        class="w-full bg-slate-900/70 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none rounded-xl p-4 text-center text-2xl font-mono tracking-[0.3em] text-white uppercase placeholder-slate-600 placeholder:tracking-normal placeholder:font-sans placeholder:text-base"
      />
      <div class="flex gap-2 mt-4">
        <button
          type="submit"
          class="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 rounded-xl transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Calcular</span>
          <span class="text-xs bg-cyan-600/50 px-2 py-1 rounded-md">ENTER ⏎</span>
        </button>
        <button
          type="button"
          aria-label="Generar matrícula aleatoria"
          class="shrink-0 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-4 rounded-xl transition-colors active:scale-[0.98] text-sm"
          @click="onRandom"
        >
          Aleatoria
        </button>
      </div>
    </form>

    <!-- Entrada por Cámara -->
    <div v-else>
      <div class="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-900/40">
        <svg
          class="w-12 h-12 mx-auto mb-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        <p class="text-slate-400 mb-4 text-sm">Toma una foto clara de la matrícula</p>
        <input
          ref="cameraInput"
          type="file"
          accept="image/*"
          capture="environment"
          class="hidden"
          @change="onCameraChange"
        />
        <button
          type="button"
          class="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          @click="openCamera"
        >
          Subir / Hacer Foto
        </button>
      </div>
      <div v-if="ocrLoading" class="flex flex-col items-center mt-6">
        <div class="loader mb-3"></div>
        <p class="text-cyan-400 text-sm animate-pulse">
          Leyendo matrícula...<template v-if="ocrPercent > 0"> {{ ocrPercent }}%</template>
        </p>
      </div>
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="Vista previa de la matrícula"
        class="mt-4 rounded-xl max-h-40 mx-auto border border-slate-700"
      />
    </div>
  </div>

  <!-- Resultado -->
  <div
    v-if="reading"
    :key="resultKey"
    class="fade-in mt-8 text-center glass rounded-3xl p-8 shadow-2xl"
  >
    <p class="text-slate-400 text-xs mb-4 uppercase tracking-[0.3em]">Tu Número Es</p>

    <div class="result-number text-9xl font-black text-cyan-400 my-4 glow-text">
      {{ reading.value }}
    </div>

    <div class="plate-canvas mx-auto mt-4 max-w-xs h-20 flex items-stretch" aria-hidden="true">
      <div class="eu-band">
        <span>★</span>
        <span>E</span>
      </div>
      <div class="flex-1 flex items-center justify-center gap-4">
        <span class="text-slate-900 font-black text-3xl font-mono tracking-[0.2em]">
          {{ reading.plate.digits.join('') }}
        </span>
        <span class="text-slate-900 font-black text-3xl font-mono tracking-[0.1em]">
          {{ reading.plate.letters }}
        </span>
      </div>
    </div>

    <div class="mt-4 border-t border-slate-700/50 pt-4">
      <p class="text-slate-500 text-sm font-mono">Matrícula analizada: {{ reading.plate.value }}</p>
    </div>
  </div>
</template>
