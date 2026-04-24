// lib/web-audio-tone.ts — Low-level Web Audio tone scheduling for cue playback.

import type { TonePattern } from "@/lib/audio-patterns";

const MASTER_GAIN = 1.45;
const DEFAULT_FREQUENCY = 440;
const DEFAULT_OSCILLATOR_TYPE: OscillatorType = "triangle";

export type CancelScheduledTone = () => void;

export function scheduleTone(
  context: AudioContext,
  pattern: TonePattern,
  startDelaySec = 0,
): CancelScheduledTone {
  const startTime = context.currentTime + Math.max(0.01, startDelaySec);
  const gainNode = context.createGain();
  gainNode.gain.value = MASTER_GAIN;
  gainNode.connect(context.destination);

  const oscillators: OscillatorNode[] = [];
  const heldNodes: AudioNode[] = [gainNode];
  let disconnected = false;
  const disconnectTone = () => {
    if (disconnected) {
      return;
    }
    disconnected = true;
    gainNode.disconnect();
  };

  const segments = pattern.segments ?? [
    {
      durationMs: pattern.durationMs,
      frequency: pattern.frequency,
      gain: 1,
      partials: pattern.partials,
      type: pattern.type,
    },
  ];
  let offsetMs = 0;
  let endTime = startTime;

  segments.forEach((segment) => {
    const segmentStartTime = startTime + offsetMs / 1000;
    const segmentEndTime = segmentStartTime + segment.durationMs / 1000;
    const segmentGain = context.createGain();
    heldNodes.push(segmentGain);
    segmentGain.connect(gainNode);

    const peakGain = Math.max(0.0001, pattern.gain * (segment.gain ?? 1));
    segmentGain.gain.setValueAtTime(0.0001, segmentStartTime);
    segmentGain.gain.linearRampToValueAtTime(peakGain, segmentStartTime + 0.008);
    segmentGain.gain.setValueAtTime(peakGain, segmentEndTime - 0.025);
    segmentGain.gain.exponentialRampToValueAtTime(0.0001, segmentEndTime);

    const partials = segment.partials ??
      pattern.partials ?? [
        { frequency: segment.frequency ?? pattern.frequency ?? DEFAULT_FREQUENCY, gain: 1 },
      ];
    partials.forEach((partial) => {
      const oscillator = context.createOscillator();
      const partialGain = context.createGain();
      heldNodes.push(oscillator, partialGain);
      oscillator.connect(partialGain).connect(segmentGain);
      oscillator.frequency.value = partial.frequency;
      oscillator.type = segment.type ?? pattern.type ?? DEFAULT_OSCILLATOR_TYPE;
      partialGain.gain.setValueAtTime(partial.gain, segmentStartTime);
      oscillators.push(oscillator);
      oscillator.start(segmentStartTime);
      oscillator.stop(segmentEndTime + 0.02);
    });

    endTime = Math.max(endTime, segmentEndTime);
    offsetMs += segment.durationMs + (segment.gapMs ?? 0);
  });

  const cleanupTimeoutId = window.setTimeout(
    disconnectTone,
    Math.max(0, (endTime - context.currentTime) * 1000) + 80,
  );

  return () => {
    window.clearTimeout(cleanupTimeoutId);
    oscillators.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // The oscillator may have already stopped naturally.
      }
    });
    disconnectTone();
    heldNodes.length = 0;
  };
}
