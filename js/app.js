/**
 * StoryBuddy – Animated storytelling with cartoon voice
 */

(function () {
  'use strict';

  // DOM elements
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const storyInput = document.getElementById('storyInput');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const speechBubble = document.getElementById('speechBubble');
  const bubbleText = document.getElementById('bubbleText');
  const bubbleDots = document.getElementById('bubbleDots');
  const character = document.getElementById('character');
  const characterWrapper = document.getElementById('characterWrapper');
  const sparkleRing = document.getElementById('sparkleRing');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const voiceSpeed = document.getElementById('voiceSpeed');
  const voicePitch = document.getElementById('voicePitch');
  const charBtns = document.querySelectorAll('.char-btn');
  const starsContainer = document.getElementById('stars');
  const butterfliesContainer = document.getElementById('butterflies');

  // State
  let sentences = [];
  let currentIndex = 0;
  let isPlaying = false;
  let isPaused = false;
  let selectedVoice = null;
  let voicesReady = false;
  let currentChar = 'bear';
  let mouthAnimInterval = null;
  let visualTimer = null;

  const CHAR_NAMES = {
    bear: 'Buddy Bear',
    bunny: 'Bouncy Bunny',
    fox: 'Foxy Fox',
    owl: 'Wise Owl'
  };

  const SAMPLE_STORY = `Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.
Twinkle, twinkle, little star,
How I wonder what you are!`;

  // ===== Initialize background decorations =====
  function initBackground() {
    const starEmojis = ['✨', '⭐', '🌟', '💫'];
    for (let i = 0; i < 20; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 55}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      starsContainer.appendChild(star);
    }

    const butterflyEmojis = ['🦋', '🐝', '🌸'];
    for (let i = 0; i < 5; i++) {
      const bf = document.createElement('span');
      bf.className = 'butterfly';
      bf.textContent = butterflyEmojis[i % butterflyEmojis.length];
      bf.style.left = `${10 + Math.random() * 80}%`;
      bf.style.top = `${30 + Math.random() * 40}%`;
      bf.style.animationDelay = `${Math.random() * 8}s`;
      bf.style.animationDuration = `${10 + Math.random() * 8}s`;
      butterfliesContainer.appendChild(bf);
    }
  }

  // ===== Speech synthesis – cartoon voice =====
  function loadVoices() {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return false;

    voicesReady = true;

    // Prefer child-friendly / higher-pitched voices
    const preferred = [
      'Samantha', 'Karen', 'Victoria', 'Fiona', 'Tessa',
      'Google UK English Female', 'Microsoft Zira', 'Microsoft Aria',
      'Google US English', 'en-US', 'en-GB'
    ];

    for (const name of preferred) {
      const match = voices.find(v =>
        v.name.includes(name) || v.lang.includes(name)
      );
      if (match) {
        selectedVoice = match;
        return true;
      }
    }

    selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    return true;
  }

  function waitForVoices(timeout = 3000) {
    return new Promise((resolve) => {
      if (loadVoices()) {
        resolve(true);
        return;
      }

      const start = Date.now();
      const check = () => {
        if (loadVoices() || Date.now() - start > timeout) {
          resolve(voicesReady);
        } else {
          setTimeout(check, 100);
        }
      };

      speechSynthesis.onvoiceschanged = () => {
        loadVoices();
        resolve(voicesReady);
      };

      check();
    });
  }

  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    // Chrome needs a nudge to load voices
    setTimeout(loadVoices, 250);
  }

  function estimateReadTime(text) {
    const words = text.split(/\s+/).length;
    const rate = parseFloat(voiceSpeed.value);
    return Math.max(1500, (words / (rate * 2.2)) * 1000);
  }

  function speakSentenceVisual(text) {
    return new Promise((resolve) => {
      startSpeakingAnimation();
      showBubbleText(text);
      updateProgress();
      visualTimer = setTimeout(() => {
        stopSpeakingAnimation();
        resolve();
      }, estimateReadTime(text));
    });
  }

  function speakSentence(text) {
    return new Promise(async (resolve, reject) => {
      if (!('speechSynthesis' in window) || !voicesReady) {
        await speakSentenceVisual(text);
        resolve();
        return;
      }

      speechSynthesis.cancel();
      await delay(50);

      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = parseFloat(voiceSpeed.value);
      utterance.pitch = parseFloat(voicePitch.value);
      utterance.volume = 1;

      let started = false;

      utterance.onstart = () => {
        started = true;
        startSpeakingAnimation();
        showBubbleText(text);
        updateProgress();
      };

      utterance.onend = () => {
        stopSpeakingAnimation();
        resolve();
      };

      utterance.onerror = (e) => {
        stopSpeakingAnimation();
        if (e.error === 'interrupted') {
          resolve();
          return;
        }
        // Fallback to visual narration if TTS fails
        speakSentenceVisual(text).then(resolve);
      };

      speechSynthesis.speak(utterance);

      // Safety: if onstart never fires, use visual mode
      setTimeout(() => {
        if (!started && speechSynthesis.speaking === false) {
          speechSynthesis.cancel();
          speakSentenceVisual(text).then(resolve);
        }
      }, 800);
    });
  }

  // ===== Parse story into speakable sentences =====
  function parseStory(text) {
    if (!text || !text.trim()) return [];

    return text
      .split(/\n+/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .flatMap(line => {
        // Split long lines by sentence endings, but keep rhymes as lines
        if (line.length < 80) return [line];
        return line.match(/[^.!?]+[.!?]+/g) || [line];
      })
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  function updatePlayButton() {
    const hasContent = storyInput.value.trim().length > 0;
    playBtn.disabled = !hasContent;
  }

  // ===== Story playback =====
  async function playStory() {
    sentences = parseStory(storyInput.value);
    if (!sentences.length) return;

    if ('speechSynthesis' in window) {
      await waitForVoices();
    }

    isPlaying = true;
    isPaused = false;
    currentIndex = 0;

    playBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    progressBar.hidden = false;

    character.classList.add('excited');
    setTimeout(() => character.classList.remove('excited'), 600);

    await tellStory();
  }

  async function tellStory() {
    while (currentIndex < sentences.length && isPlaying && !isPaused) {
      try {
        await speakSentence(sentences[currentIndex]);
        if (!isPlaying || isPaused) break;
        currentIndex++;
        // Small pause between lines for dramatic effect
        await delay(400);
      } catch (err) {
        console.error('Speech error:', err);
        break;
      }
    }

    if (currentIndex >= sentences.length && isPlaying) {
      onStoryComplete();
    }
  }

  function onStoryComplete() {
    isPlaying = false;
    showBubbleText(`🎉 The end! Great story, friend! — ${CHAR_NAMES[currentChar]}`);
    character.classList.add('excited');
    launchConfetti();
    resetControls();

    setTimeout(() => {
      character.classList.remove('excited');
      sparkleRing.classList.remove('active');
      sparkleRing.innerHTML = '';
    }, 3000);
  }

  function pauseStory() {
    if (!isPlaying) return;
    isPaused = true;
    if (visualTimer) {
      clearTimeout(visualTimer);
      visualTimer = null;
    }
    if ('speechSynthesis' in window) speechSynthesis.pause();
    pauseBtn.innerHTML = '<span class="btn-icon">▶</span> Resume';
    showBubbleText('(paused...)');
    stopSpeakingAnimation();
  }

  function resumeStory() {
    if (!isPaused) return;
    isPaused = false;
    speechSynthesis.resume();
    pauseBtn.innerHTML = '<span class="btn-icon">⏸</span> Pause';
    startSpeakingAnimation();
    if (sentences[currentIndex]) {
      showBubbleText(sentences[currentIndex]);
    }
  }

  function stopStory() {
    isPlaying = false;
    isPaused = false;
    currentIndex = 0;
    if (visualTimer) {
      clearTimeout(visualTimer);
      visualTimer = null;
    }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    stopSpeakingAnimation();
    resetControls();
    progressBar.hidden = true;
    progressFill.style.width = '0%';
    showBubbleText(`Ready for another story! — ${CHAR_NAMES[currentChar]} 🌈`);
  }

  function resetControls() {
    playBtn.disabled = !storyInput.value.trim();
    pauseBtn.disabled = true;
    pauseBtn.innerHTML = '<span class="btn-icon">⏸</span> Pause';
    stopBtn.disabled = true;
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===== UI animations =====
  function showBubbleText(text) {
    bubbleText.hidden = false;
    bubbleDots.hidden = true;
    bubbleText.textContent = text;
    speechBubble.style.animation = 'none';
    speechBubble.offsetHeight; // reflow
    speechBubble.style.animation = 'bubblePop 0.4s ease';
  }

  function startSpeakingAnimation() {
    character.classList.add('speaking');
    speechBubble.classList.add('speaking');
    activateSparkles();
    animateMouth();
  }

  function stopSpeakingAnimation() {
    character.classList.remove('speaking');
    speechBubble.classList.remove('speaking');
    if (mouthAnimInterval) {
      clearInterval(mouthAnimInterval);
      mouthAnimInterval = null;
    }
  }

  function animateMouth() {
    const mouth = character.querySelector('.char-svg:not(.hidden) .mouth');
    if (!mouth) return;

    const paths = {
      closed: mouth.getAttribute('d'),
      open: mouth.getAttribute('d').replace(/Q\s*(\d+)\s*(\d+)/, (_, x, y) => {
        return `Q ${x} ${parseInt(y) + 15}`;
      })
    };

    let open = false;
    if (mouthAnimInterval) clearInterval(mouthAnimInterval);
    mouthAnimInterval = setInterval(() => {
      if (!character.classList.contains('speaking')) {
        clearInterval(mouthAnimInterval);
        return;
      }
      open = !open;
      // Toggle mouth via scale on snout area
      const snout = character.querySelector('.char-svg:not(.hidden) .snout, .char-svg:not(.hidden) .face-white');
      if (snout) {
        snout.style.transform = open ? 'scaleY(1.05)' : 'scaleY(1)';
        snout.style.transformOrigin = 'center';
      }
    }, 180);
  }

  function activateSparkles() {
    sparkleRing.classList.add('active');
    sparkleRing.innerHTML = '';
    const emojis = ['✨', '⭐', '💫', '🌟'];
    for (let i = 0; i < 8; i++) {
      const sp = document.createElement('span');
      sp.className = 'sparkle-item';
      sp.textContent = emojis[i % emojis.length];
      const angle = (i / 8) * Math.PI * 2;
      const dist = 80 + Math.random() * 40;
      sp.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      sp.style.setProperty('--ty', `${Math.sin(angle) * dist - 40}px`);
      sp.style.left = '50%';
      sp.style.top = '50%';
      sp.style.animationDelay = `${i * 0.15}s`;
      sparkleRing.appendChild(sp);
    }
  }

  function updateProgress() {
    const total = sentences.length;
    const current = currentIndex + 1;
    const pct = (currentIndex / total) * 100;
    progressFill.style.width = `${pct}%`;
    progressLabel.textContent = `Line ${current} of ${total}`;
  }

  function launchConfetti() {
    const colors = ['#FF6B9D', '#A855F7', '#3B82F6', '#FBBF24', '#6BCB77', '#FF9F43'];
    for (let i = 0; i < 50; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti';
      conf.style.left = `${Math.random() * 100}vw`;
      conf.style.background = colors[Math.floor(Math.random() * colors.length)];
      conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      conf.style.width = `${6 + Math.random() * 8}px`;
      conf.style.height = conf.style.width;
      conf.style.animationDelay = `${Math.random() * 1.5}s`;
      conf.style.animationDuration = `${2 + Math.random() * 2}s`;
      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 5000);
    }
  }

  // ===== Character switching =====
  function switchCharacter(char) {
    currentChar = char;
    charBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.char === char);
    });

    document.querySelectorAll('.char-svg').forEach(svg => {
      svg.classList.add('hidden');
    });
    const activeSvg = document.querySelector(`.char-${char}`);
    if (activeSvg) activeSvg.classList.remove('hidden');

    character.className = `character character-${char}`;
    showBubbleText(`Hi! I'm ${CHAR_NAMES[char]}! Ready to tell your story! 🎤`);
  }

  // ===== File upload =====
  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      storyInput.value = e.target.result;
      updatePlayButton();
      showBubbleText(`Ooh, "${file.name}"! Click "Tell My Story!" when you're ready! 📖`);
      character.classList.add('excited');
      setTimeout(() => character.classList.remove('excited'), 800);
    };
    reader.readAsText(file);
  }

  // ===== Event listeners =====
  uploadZone.addEventListener('click', () => fileInput.click());

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
      handleFile(file);
    } else {
      showBubbleText('Please upload a text file (.txt) with your story! 📄');
    }
  });

  fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
  });

  storyInput.addEventListener('input', updatePlayButton);

  playBtn.addEventListener('click', playStory);

  pauseBtn.addEventListener('click', () => {
    if (isPaused) resumeStory();
    else pauseStory();
  });

  stopBtn.addEventListener('click', stopStory);

  charBtns.forEach(btn => {
    btn.addEventListener('click', () => switchCharacter(btn.dataset.char));
  });

  // ===== Boot =====
  initBackground();
  storyInput.value = SAMPLE_STORY;
  updatePlayButton();
  switchCharacter('bear');

  if (!('speechSynthesis' in window)) {
    showBubbleText('📖 Visual story mode — upload a story and press play! (Voice works best in Chrome)');
  }
})();
