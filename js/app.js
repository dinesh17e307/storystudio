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
  const exportBtn = document.getElementById('exportBtn');
  const exportStatus = document.getElementById('exportStatus');
  const exportStatusText = document.getElementById('exportStatusText');
  const voiceSpeed = document.getElementById('voiceSpeed');
  const voicePitch = document.getElementById('voicePitch');
  const charBtns = document.querySelectorAll('.char-btn');
  const themeBtns = document.querySelectorAll('.theme-btn');
  const floatingDecor = document.getElementById('floatingDecor');
  const forestTrees = document.getElementById('forestTrees');
  const fireflies = document.getElementById('fireflies');
  const spaceStars = document.getElementById('spaceStars');
  const shootingStars = document.getElementById('shootingStars');
  const bubbles = document.getElementById('bubbles');
  const mushrooms = document.getElementById('mushrooms');
  const rocketWrap = document.getElementById('rocketWrap');
  const coralWrap = document.getElementById('coralWrap');
  const logoIcon = document.getElementById('logoIcon');
  const uploadIcon = document.getElementById('uploadIcon');

  // State
  let sentences = [];
  let currentIndex = 0;
  let isPlaying = false;
  let isPaused = false;
  let selectedVoice = null;
  let voicesReady = false;
  let currentChar = 'bear';
  let currentTheme = 'meadow';
  let mouthAnimInterval = null;
  let visualTimer = null;
  let isExporting = false;

  const CHAR_NAMES = {
    bear: 'Buddy Bear',
    bunny: 'Bouncy Bunny',
    fox: 'Foxy Fox',
    owl: 'Wise Owl',
    penguin: 'Pippin Penguin',
    dragon: 'Dazzle Dragon',
    cat: 'Whiskers Cat',
    unicorn: 'Sparkle Unicorn'
  };

  const SAMPLE_STORY = `Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.
Twinkle, twinkle, little star,
How I wonder what you are!`;

  // ===== Initialize background decorations =====
  function initBackground() {
    buildForestTrees();
    buildFireflies();
    buildMushrooms();
    buildSpaceStars();
    buildRocket();
    buildBubbles();
    buildFish();
    buildCoral();
    if (logoIcon) logoIcon.appendChild(StorySVG.clone(StorySVG.logo()));
    if (uploadIcon) uploadIcon.appendChild(StorySVG.clone(StorySVG.book()));
    StorySVG.initCharButtons();
    StorySVG.initThemeButtons();
    switchTheme('meadow');
  }

  function clearContainer(el) {
    if (el) el.innerHTML = '';
  }

  function buildForestTrees() {
    clearContainer(forestTrees);
    for (let i = 0; i < 12; i++) {
      const wrap = document.createElement('div');
      wrap.className = 'tree';
      wrap.style.left = `${i * 9 - 2}%`;
      wrap.style.animationDelay = `${Math.random() * 2}s`;
      wrap.appendChild(StorySVG.el(StorySVG.tree(i)));
      forestTrees.appendChild(wrap);
    }
  }

  function buildMushrooms() {
    clearContainer(mushrooms);
    const positions = [
      { left: '10%', bottom: '8%', delay: '0s', scale: 1 },
      { left: '75%', bottom: '6%', delay: '1s', scale: 0.8 },
      { left: '45%', bottom: '10%', delay: '0.5s', scale: 1.2 }
    ];
    positions.forEach((pos, i) => {
      const m = document.createElement('div');
      m.className = 'mushroom';
      m.style.left = pos.left;
      m.style.bottom = pos.bottom;
      m.style.animationDelay = pos.delay;
      m.style.transform = `scale(${pos.scale})`;
      m.appendChild(StorySVG.el(StorySVG.mushroom(i)));
      mushrooms.appendChild(m);
    });
  }

  function buildRocket() {
    clearContainer(rocketWrap);
    const rocket = document.createElement('div');
    rocket.className = 'rocket';
    rocket.appendChild(StorySVG.el(StorySVG.rocket()));
    rocketWrap.appendChild(rocket);
  }

  function buildCoral() {
    clearContainer(coralWrap);
    const coral = document.createElement('div');
    coral.className = 'coral';
    coral.appendChild(StorySVG.el(StorySVG.coral()));
    coralWrap.appendChild(coral);
  }

  function buildFireflies() {
    clearContainer(fireflies);
    for (let i = 0; i < 15; i++) {
      const fly = document.createElement('span');
      fly.className = 'firefly';
      fly.style.left = `${Math.random() * 100}%`;
      fly.style.top = `${20 + Math.random() * 60}%`;
      fly.style.animationDelay = `${Math.random() * 4}s`;
      fly.style.animationDuration = `${2 + Math.random() * 3}s`;
      fireflies.appendChild(fly);
    }
  }

  function buildSpaceStars() {
    clearContainer(spaceStars);
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('span');
      star.className = 'space-star';
      const size = 2 + Math.random() * 4;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      spaceStars.appendChild(star);
    }

    clearContainer(shootingStars);
    for (let i = 0; i < 3; i++) {
      const ss = document.createElement('span');
      ss.className = 'shooting-star';
      ss.style.top = `${10 + Math.random() * 40}%`;
      ss.style.left = `${Math.random() * 60}%`;
      ss.style.animationDelay = `${i * 4 + Math.random() * 3}s`;
      shootingStars.appendChild(ss);
    }
  }

  function buildBubbles() {
    clearContainer(bubbles);
    for (let i = 0; i < 20; i++) {
      const bubble = document.createElement('span');
      bubble.className = 'bubble';
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.width = bubble.style.height = `${8 + Math.random() * 24}px`;
      bubble.style.animationDelay = `${Math.random() * 6}s`;
      bubble.style.animationDuration = `${4 + Math.random() * 6}s`;
      bubbles.appendChild(bubble);
    }
  }

  function buildFish() {
    clearContainer(fishSchool);
    for (let i = 0; i < 6; i++) {
      const fish = document.createElement('div');
      fish.className = 'fish';
      fish.style.top = `${30 + Math.random() * 50}%`;
      fish.style.animationDelay = `${Math.random() * 8}s`;
      fish.style.animationDuration = `${8 + Math.random() * 10}s`;
      fish.appendChild(StorySVG.el(StorySVG.fish(i)));
      fishSchool.appendChild(fish);
    }
  }

  function buildFloatingDecor(theme) {
    clearContainer(floatingDecor);
    const count = theme === 'space' ? 20 : 15;

    for (let i = 0; i < count; i++) {
      const wrap = document.createElement('div');
      wrap.className = 'float-item';
      wrap.style.left = `${Math.random() * 100}%`;
      wrap.style.top = `${Math.random() * 70}%`;
      wrap.style.animationDelay = `${Math.random() * 5}s`;
      wrap.style.animationDuration = `${3 + Math.random() * 5}s`;
      const size = 24 + Math.random() * 20;
      wrap.style.width = `${size}px`;
      wrap.appendChild(StorySVG.el(StorySVG.buildDecor(theme, i)));
      floatingDecor.appendChild(wrap);
    }
  }

  function switchTheme(theme) {
    currentTheme = theme;
    document.body.className = `theme-${theme}`;

    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    buildFloatingDecor(theme);

    const themeNames = {
      meadow: 'Sunny Meadow',
      forest: 'Enchanted Forest',
      space: 'Outer Space',
      underwater: 'Under the Sea'
    };

    if (!isPlaying && !isExporting) {
      showBubbleText(`Wow! We're in the ${themeNames[theme]}! 🎉`);
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
    playBtn.disabled = !hasContent || isExporting;
    exportBtn.disabled = !hasContent || isPlaying || isExporting;
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
    playBtn.disabled = !storyInput.value.trim() || isExporting;
    exportBtn.disabled = !storyInput.value.trim() || isExporting;
    pauseBtn.disabled = true;
    pauseBtn.innerHTML = '<span class="btn-icon">⏸</span> Pause';
    stopBtn.disabled = true;
  }

  // ===== MP3 Export =====
  async function exportStoryAudio() {
    const lines = parseStory(storyInput.value);
    if (!lines.length || isExporting || isPlaying) return;

    isExporting = true;
    updatePlayButton();
    exportBtn.disabled = true;
    exportStatus.hidden = false;
    exportStatusText.textContent = 'Loading audio engine...';

    try {
      if (typeof meSpeak !== 'undefined' && !meSpeak.isConfigLoaded()) {
        await new Promise((resolve, reject) => {
          meSpeak.loadConfig('https://www.masswerk.at/mespeak/mespeak_config.json', resolve, reject);
        });
        await new Promise((resolve, reject) => {
          meSpeak.loadVoice('https://www.masswerk.at/mespeak/voices/en.json', resolve, reject);
        });
      }

      const result = await StoryAudioExport.exportStory(
        lines,
        {
          pitch: parseFloat(voicePitch.value),
          speed: parseFloat(voiceSpeed.value),
          format: 'mp3'
        },
        (progress) => {
          exportStatusText.textContent = `Recording line ${progress.current} of ${progress.total}...`;
          showBubbleText(`🎵 "${progress.text}"`);
        }
      );

      StoryAudioExport.downloadBlob(result.blob, result.filename);
      showBubbleText(`🎉 Your cartoon ${result.mime.includes('mp3') ? 'MP3' : 'audio'} is ready! Check your downloads!`);
      character.classList.add('excited');
      launchConfetti();
      setTimeout(() => character.classList.remove('excited'), 2000);
    } catch (err) {
      console.error('Export error:', err);
      showBubbleText('Oops! Could not create audio. Try again or use Chrome browser! 😅');
    } finally {
      isExporting = false;
      exportStatus.hidden = true;
      updatePlayButton();
    }
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
    for (let i = 0; i < 8; i++) {
      const sp = document.createElement('div');
      sp.className = 'sparkle-item';
      sp.appendChild(StorySVG.el(StorySVG.sparkle()));
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

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTheme(btn.dataset.theme));
  });

  exportBtn.addEventListener('click', exportStoryAudio);

  // ===== Boot =====
  initBackground();
  storyInput.value = SAMPLE_STORY;
  updatePlayButton();
  switchCharacter('bear');

  if (!('speechSynthesis' in window)) {
    showBubbleText('📖 Visual story mode — upload a story and press play! (Voice works best in Chrome)');
  }
})();
