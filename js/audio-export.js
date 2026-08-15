/**
 * StoryBuddy Audio Export – generates downloadable MP3/WAV cartoon voice
 */
window.StoryAudioExport = (function () {
  'use strict';

  const SAMPLE_RATE = 22050;
  const GAP_MS = 450;

  function floatTo16BitPCM(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Int16Array(buffer);
  }

  function encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      view.setInt16(offset, samples[i], true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  function encodeMP3(samples, sampleRate) {
    if (typeof lamejs === 'undefined') return null;

    const mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
    const mp3Data = [];
    const blockSize = 1152;

    for (let i = 0; i < samples.length; i += blockSize) {
      const chunk = samples.subarray(i, i + blockSize);
      const mp3buf = mp3encoder.encodeBuffer(chunk);
      if (mp3buf.length > 0) mp3Data.push(mp3buf);
    }

    const end = mp3encoder.flush();
    if (end.length > 0) mp3Data.push(end);

    return new Blob(mp3Data, { type: 'audio/mp3' });
  }

  function createSilence(durationMs, sampleRate) {
    const length = Math.floor((durationMs / 1000) * sampleRate);
    return new Float32Array(length);
  }

  function resampleToFloat32(audioData, fromRate, toRate) {
    if (fromRate === toRate) {
      const out = new Float32Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        out[i] = (audioData[i] - 128) / 128;
      }
      return out;
    }

    const ratio = fromRate / toRate;
    const newLength = Math.floor(audioData.length / ratio);
    const out = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const idx = Math.floor(srcIndex);
      const frac = srcIndex - idx;
      const s1 = (audioData[idx] - 128) / 128;
      const s2 = idx + 1 < audioData.length ? (audioData[idx + 1] - 128) / 128 : s1;
      out[i] = s1 + (s2 - s1) * frac;
    }
    return out;
  }

  function speakToSamples(text, pitch, speed) {
    return new Promise((resolve, reject) => {
      if (typeof meSpeak === 'undefined') {
        reject(new Error('Audio engine not loaded'));
        return;
      }

      try {
        const result = meSpeak.speak(text, {
          raw: 'array',
          pitch: Math.round(pitch * 40),
          speed: Math.round(speed * 175),
          amplitude: 100,
          wordgap: 2
        });

        if (!result || !result.length) {
          reject(new Error('No audio generated'));
          return;
        }

        const float32 = resampleToFloat32(result, 22050, SAMPLE_RATE);
        resolve(float32);
      } catch (err) {
        reject(err);
      }
    });
  }

  function mergeFloat32Arrays(arrays) {
    const totalLength = arrays.reduce((sum, a) => sum + a.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
      merged.set(arr, offset);
      offset += arr.length;
    }
    return merged;
  }

  async function exportStory(sentences, options = {}, onProgress) {
    const { pitch = 1.7, speed = 0.85, format = 'mp3' } = options;
    const chunks = [];

    for (let i = 0; i < sentences.length; i++) {
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: sentences.length,
          text: sentences[i]
        });
      }

      const samples = await speakToSamples(sentences[i], pitch, speed);
      chunks.push(samples);

      if (i < sentences.length - 1) {
        chunks.push(createSilence(GAP_MS, SAMPLE_RATE));
      }
    }

    const merged = mergeFloat32Arrays(chunks);
    const pcm16 = floatTo16BitPCM(merged);

    if (format === 'wav') {
      return {
        blob: encodeWAV(pcm16, SAMPLE_RATE),
        filename: 'my-story-cartoon-voice.wav',
        mime: 'audio/wav'
      };
    }

    const mp3Blob = encodeMP3(pcm16, SAMPLE_RATE);
    if (mp3Blob) {
      return {
        blob: mp3Blob,
        filename: 'my-story-cartoon-voice.mp3',
        mime: 'audio/mp3'
      };
    }

    return {
      blob: encodeWAV(pcm16, SAMPLE_RATE),
      filename: 'my-story-cartoon-voice.wav',
      mime: 'audio/wav'
    };
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function isReady() {
    return typeof meSpeak !== 'undefined';
  }

  return {
    exportStory,
    downloadBlob,
    isReady
  };
})();
