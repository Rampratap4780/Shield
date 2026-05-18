import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';

let recognizer = null;
let isRunning = false;

// Yeh words detect karenge
const TARGET_WORDS = ['stop', 'go', 'yes', 'no', 'up', 'down', 'left', 'right'];

// Custom distress mapping
// "stop" sunne par = help jaisa treat karo
const DISTRESS_MAP = {
  'stop': true,
  'no': true,
  'go': true,
};

export async function loadModel(onKeyword, onError) {
  try {
    recognizer = speechCommands.create('BROWSER_FFT');
    await recognizer.ensureModelLoaded();
    console.log('✅ Speech model loaded');
    console.log('Words:', recognizer.wordLabels());
    return recognizer;
  } catch (err) {
    console.error('Model load failed:', err);
    if (onError) onError(err.message);
    return null;
  }
}

export async function startDetection(onKeyword, onScore) {
  if (!recognizer || isRunning) return;
  isRunning = true;

  await recognizer.listen(
    (result) => {
      const scores = result.scores;
      const labels = recognizer.wordLabels();
      
      // Highest score word
      const maxIndex = scores.indexOf(Math.max(...scores));
      const word = labels[maxIndex];
      const score = scores[maxIndex];

      if (onScore) onScore({ word, score: (score * 100).toFixed(0) });

      // 85% confidence se zyada hone par trigger
      if (score > 0.85 && DISTRESS_MAP[word]) {
        console.log('🚨 Distress word detected:', word, score);
        if (onKeyword) onKeyword(word);
      }
    },
    {
      includeSpectrogram: false,
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: false,
      overlapFactor: 0.5,
    }
  );
}

export function stopDetection() {
  if (recognizer && isRunning) {
    recognizer.stopListening();
    isRunning = false;
  }
}