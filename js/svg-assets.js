/**
 * StoryBuddy – SVG asset library (animated illustrations, no emojis)
 */
window.StorySVG = (function () {
  'use strict';

  function el(svgString) {
    const wrap = document.createElement('div');
    wrap.innerHTML = svgString.trim();
    return wrap.firstElementChild;
  }

  function clone(svgString) {
    return el(svgString).cloneNode(true);
  }

  /* ─── Character mini previews (picker buttons) ─── */
  const charPreviews = {
    bear: `<svg class="char-preview" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="22" cy="22" rx="10" ry="11" fill="#C4956A"/><ellipse cx="58" cy="22" rx="10" ry="11" fill="#C4956A"/>
      <ellipse cx="40" cy="42" rx="28" ry="26" fill="#D4A574"/>
      <ellipse cx="40" cy="48" rx="14" ry="11" fill="#E8C9A0"/>
      <ellipse cx="40" cy="45" rx="5" ry="4" fill="#5C3D2E"/>
      <ellipse cx="30" cy="38" rx="6" ry="7" fill="white"/><ellipse cx="50" cy="38" rx="6" ry="7" fill="white"/>
      <circle cx="31" cy="39" r="3" fill="#2D1810"/><circle cx="51" cy="39" r="3" fill="#2D1810"/>
      <ellipse cx="40" cy="68" rx="20" ry="14" fill="#D4A574"/>
    </svg>`,

    bunny: `<svg class="char-preview" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="28" cy="14" rx="7" ry="20" fill="#F5F0E8" transform="rotate(-6 28 14)"/>
      <ellipse cx="52" cy="14" rx="7" ry="20" fill="#F5F0E8" transform="rotate(6 52 14)"/>
      <ellipse cx="28" cy="15" rx="3.5" ry="14" fill="#FFB6C1" transform="rotate(-6 28 15)"/>
      <ellipse cx="52" cy="15" rx="3.5" ry="14" fill="#FFB6C1" transform="rotate(6 52 15)"/>
      <circle cx="40" cy="48" r="24" fill="#F5F0E8"/>
      <ellipse cx="40" cy="52" rx="9" ry="7" fill="white"/>
      <ellipse cx="40" cy="50" rx="3" ry="2.5" fill="#FFB6C1"/>
      <ellipse cx="32" cy="44" rx="5" ry="6" fill="white"/><ellipse cx="48" cy="44" rx="5" ry="6" fill="white"/>
      <circle cx="33" cy="45" r="2.5" fill="#333"/><circle cx="49" cy="45" r="2.5" fill="#333"/>
    </svg>`,

    fox: `<svg class="char-preview" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,28 12,8 30,22" fill="#E8751A"/><polygon points="60,28 68,8 50,22" fill="#E8751A"/>
      <ellipse cx="40" cy="42" rx="26" ry="24" fill="#E8751A"/>
      <ellipse cx="40" cy="48" rx="15" ry="13" fill="#FFE4C4"/>
      <ellipse cx="40" cy="45" rx="4" ry="3.5" fill="#333"/>
      <ellipse cx="30" cy="38" rx="5.5" ry="6.5" fill="white"/><ellipse cx="50" cy="38" rx="5.5" ry="6.5" fill="white"/>
      <circle cx="31" cy="39" r="2.5" fill="#2D1810"/><circle cx="51" cy="39" r="2.5" fill="#2D1810"/>
      <ellipse cx="40" cy="68" rx="18" ry="12" fill="#E8751A"/>
    </svg>`,

    owl: `<svg class="char-preview" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="44" rx="28" ry="26" fill="#C4A35A"/>
      <ellipse cx="29" cy="40" rx="12" ry="13" fill="white"/><ellipse cx="51" cy="40" rx="12" ry="13" fill="white"/>
      <circle cx="30" cy="41" r="6" fill="#2D1810"/><circle cx="52" cy="41" r="6" fill="#2D1810"/>
      <circle cx="32" cy="39" r="2" fill="white"/><circle cx="54" cy="39" r="2" fill="white"/>
      <polygon points="40,50 34,58 46,58" fill="#E8A020"/>
      <ellipse cx="40" cy="68" rx="20" ry="12" fill="#C4A35A"/>
    </svg>`,

    penguin: `<svg class="char-preview" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="48" rx="24" ry="26" fill="#2D3748"/>
      <ellipse cx="40" cy="50" rx="16" ry="18" fill="white"/>
      <ellipse cx="40" cy="30" rx="22" ry="20" fill="#2D3748"/>
      <ellipse cx="40" cy="34" rx="15" ry="13" fill="white"/>
      <ellipse cx="32" cy="28" rx="5" ry="6" fill="white"/><ellipse cx="48" cy="28" rx="5" ry="6" fill="white"/>
      <circle cx="33" cy="29" r="2.5" fill="#1A202C"/><circle cx="49" cy="29" r="2.5" fill="#1A202C"/>
      <ellipse cx="40" cy="36" rx="4" ry="3" fill="#F6AD55"/>
      <ellipse cx="28" cy="58" rx="7" ry="12" fill="#2D3748" transform="rotate(15 28 58)"/>
      <ellipse cx="52" cy="58" rx="7" ry="12" fill="#2D3748" transform="rotate(-15 52 58)"/>
    </svg>`,

    dragon: `<svg class="char-preview" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <polygon points="24,22 18,6 32,18" fill="#6BCB77"/><polygon points="56,22 62,6 48,18" fill="#6BCB77"/>
      <ellipse cx="40" cy="44" rx="26" ry="24" fill="#6BCB77"/>
      <ellipse cx="40" cy="50" rx="15" ry="12" fill="#A8E6CF"/>
      <ellipse cx="32" cy="38" rx="5.5" ry="6.5" fill="white"/><ellipse cx="48" cy="38" rx="5.5" ry="6.5" fill="white"/>
      <ellipse cx="33" cy="39" rx="3" ry="4" fill="#2D5016"/><ellipse cx="49" cy="39" rx="3" ry="4" fill="#2D5016"/>
      <path d="M18 50 Q8 38 12 28 Q20 40 24 48 Z" fill="#5ABF6A" opacity=".8"/>
      <path d="M62 50 Q72 38 68 28 Q60 40 56 48 Z" fill="#5ABF6A" opacity=".8"/>
      <ellipse cx="40" cy="68" rx="18" ry="10" fill="#6BCB77"/>
    </svg>`,

    cat: `<svg class="char-preview" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <polygon points="22,30 14,10 32,24" fill="#F6AD55"/><polygon points="58,30 66,10 48,24" fill="#F6AD55"/>
      <ellipse cx="40" cy="44" rx="25" ry="23" fill="#F6AD55"/>
      <ellipse cx="40" cy="48" rx="8" ry="7" fill="#FEF3C7"/>
      <ellipse cx="40" cy="46" rx="3" ry="2.5" fill="#FFB6C1"/>
      <ellipse cx="31" cy="38" rx="5.5" ry="6.5" fill="white"/><ellipse cx="49" cy="38" rx="5.5" ry="6.5" fill="white"/>
      <ellipse cx="32" cy="39" rx="2" ry="5" fill="#2D3748"/><ellipse cx="50" cy="39" rx="2" ry="5" fill="#2D3748"/>
      <ellipse cx="40" cy="68" rx="18" ry="10" fill="#F6AD55"/>
    </svg>`,

    unicorn: `<svg class="char-preview" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <polygon points="40,6 36,24 44,24" fill="#FFD93D"/>
      <ellipse cx="30" cy="28" rx="10" ry="8" fill="#FF6B9D" opacity=".7"/>
      <ellipse cx="50" cy="28" rx="10" ry="8" fill="#A855F7" opacity=".7"/>
      <ellipse cx="40" cy="44" rx="24" ry="22" fill="white"/>
      <ellipse cx="40" cy="48" rx="8" ry="7" fill="#F8F0FF"/>
      <ellipse cx="40" cy="46" rx="3" ry="2.5" fill="#FFB6C1"/>
      <ellipse cx="32" cy="40" rx="5" ry="6" fill="white"/><ellipse cx="48" cy="40" rx="5" ry="6" fill="white"/>
      <circle cx="33" cy="41" r="2.5" fill="#7C3AED"/><circle cx="49" cy="41" r="2.5" fill="#7C3AED"/>
      <ellipse cx="32" cy="68" rx="6" ry="10" fill="white"/><ellipse cx="48" cy="68" rx="6" ry="10" fill="white"/>
    </svg>`
  };

  /* ─── Theme mini previews ─── */
  const themePreviews = {
    meadow: `<svg class="theme-preview" viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#7EC850"/></linearGradient></defs>
      <rect width="80" height="50" fill="url(#mg)" rx="6"/>
      <circle cx="65" cy="12" r="8" fill="#FFD93D"/>
      <path d="M5 30 Q20 18 35 30 Q50 42 65 30 Q75 22 80 28 L80 50 L0 50 Z" fill="#5AAD3A"/>
      <ellipse cx="20" cy="14" rx="14" ry="6" fill="white" opacity=".9"/>
      <ellipse cx="55" cy="10" rx="10" ry="4" fill="white" opacity=".8"/>
    </svg>`,
    forest: `<svg class="theme-preview" viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="50" fill="#1a3a2a" rx="6"/>
      <polygon points="12,42 20,18 28,42" fill="#2d6a4f"/><rect x="18" y="42" width="4" height="6" fill="#5c4033"/>
      <polygon points="35,42 44,12 53,42" fill="#40916c"/><rect x="42" y="42" width="4" height="6" fill="#5c4033"/>
      <polygon points="58,42 66,22 74,42" fill="#2d6a4f"/><rect x="64" y="42" width="4" height="6" fill="#5c4033"/>
      <circle cx="25" cy="28" r="1.5" fill="#FFD93D" class="preview-glow"/>
      <circle cx="60" cy="20" r="1.5" fill="#FFD93D" class="preview-glow"/>
    </svg>`,
    space: `<svg class="theme-preview" viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="50" fill="#0a0a2e" rx="6"/>
      <circle cx="15" cy="12" r="1" fill="white"/><circle cx="40" cy="8" r="1.2" fill="white"/><circle cx="65" cy="15" r=".8" fill="white"/>
      <circle cx="55" cy="18" r="10" fill="#9B59B6"/><circle cx="20" cy="30" r="6" fill="#FBBF24"/>
      <g transform="translate(38,22) rotate(-30)">
        <rect x="0" y="4" width="16" height="6" rx="2" fill="#E2E8F0"/>
        <polygon points="16,7 24,7 20,2" fill="#FF6B6B"/>
        <circle cx="4" cy="7" r="3" fill="#CBD5E0"/>
      </g>
    </svg>`,
    underwater: `<svg class="theme-preview" viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0077B6"/><stop offset="100%" stop-color="#023E8A"/></linearGradient></defs>
      <rect width="80" height="50" fill="url(#ug)" rx="6"/>
      <circle cx="15" cy="35" r="3" fill="rgba(255,255,255,.3)" stroke="rgba(255,255,255,.5)" stroke-width=".5"/>
      <circle cx="45" cy="25" r="5" fill="rgba(255,255,255,.25)" stroke="rgba(255,255,255,.4)" stroke-width=".5"/>
      <ellipse cx="60" cy="30" rx="10" ry="6" fill="#FF9F43" transform="rotate(-10 60 30)"/>
      <polygon points="60,30 52,26 52,34" fill="#FF9F43"/>
      <rect x="10" y="42" width="3" height="8" rx="1.5" fill="#2D6A4F"/>
      <rect x="70" y="38" width="3" height="12" rx="1.5" fill="#40916C"/>
    </svg>`
  };

  /* ─── Scene decorations ─── */
  const tree = (variant) => {
    const greens = ['#2d6a4f', '#40916c', '#1b4332'];
    const c = greens[variant % 3];
    const h = 80 + (variant % 4) * 20;
    return `<svg class="scene-tree" viewBox="0 0 60 ${h + 20}" xmlns="http://www.w3.org/2000/svg" style="height:${h}px">
      <rect x="26" y="${h - 10}" width="8" height="20" fill="#5c4033" rx="1"/>
      <polygon points="30,8 8,${h - 5} 52,${h - 5}" fill="${c}"/>
      <polygon points="30,20 14,${h - 15} 46,${h - 15}" fill="${c}" opacity=".85"/>
    </svg>`;
  };

  const fish = (variant) => {
    const colors = ['#FF9F43', '#4D96FF', '#FF6B9D', '#6BCB77'];
    const c = colors[variant % 4];
    return `<svg class="scene-fish" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="28" cy="15" rx="18" ry="10" fill="${c}"/>
      <polygon points="46,15 58,5 58,25" fill="${c}"/>
      <circle cx="18" cy="13" r="3" fill="white"/><circle cx="19" cy="13" r="1.5" fill="#1A202C"/>
      <path d="M22 18 Q28 22 34 18" fill="none" stroke="${c}" stroke-width="2" opacity=".6"/>
    </svg>`;
  };

  const butterfly = (variant) => {
    const colors = [['#FF6B9D','#A855F7'], ['#FBBF24','#FF9F43'], ['#3B82F6','#6BCB77']];
    const [c1, c2] = colors[variant % 3];
    return `<svg class="scene-butterfly" viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="10" ry="8" fill="${c1}" opacity=".8" transform="rotate(-20 12 12)"/>
      <ellipse cx="28" cy="12" rx="10" ry="8" fill="${c2}" opacity=".8" transform="rotate(20 28 12)"/>
      <ellipse cx="10" cy="18" rx="7" ry="6" fill="${c2}" opacity=".7" transform="rotate(-15 10 18)"/>
      <ellipse cx="30" cy="18" rx="7" ry="6" fill="${c1}" opacity=".7" transform="rotate(15 30 18)"/>
      <ellipse cx="20" cy="15" rx="2" ry="8" fill="#2D3748"/>
    </svg>`;
  };

  const flower = (variant) => {
    const petals = ['#FF6B9D', '#FBBF24', '#A855F7', '#FF9F43'][variant % 4];
    return `<svg class="scene-flower" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="20" x2="15" y2="38" stroke="#2D6A4F" stroke-width="2"/>
      <ellipse cx="15" cy="8" rx="5" ry="7" fill="${petals}"/><ellipse cx="8" cy="14" rx="5" ry="7" fill="${petals}"/>
      <ellipse cx="22" cy="14" rx="5" ry="7" fill="${petals}"/><ellipse cx="10" cy="20" rx="5" ry="7" fill="${petals}"/>
      <ellipse cx="20" cy="20" rx="5" ry="7" fill="${petals}"/>
      <circle cx="15" cy="14" r="4" fill="#FFD93D"/>
    </svg>`;
  };

  const bee = () => `<svg class="scene-bee" viewBox="0 0 30 24" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="15" cy="14" rx="8" ry="6" fill="#FBBF24"/>
    <rect x="10" y="10" width="10" height="2" fill="#2D3748"/><rect x="10" y="14" width="10" height="2" fill="#2D3748"/>
    <circle cx="15" cy="8" r="5" fill="#FBBF24"/>
    <ellipse cx="8" cy="10" rx="6" ry="3" fill="white" opacity=".6" transform="rotate(-20 8 10)"/>
    <ellipse cx="22" cy="10" rx="6" ry="3" fill="white" opacity=".6" transform="rotate(20 22 10)"/>
  </svg>`;

  const leaf = (variant) => {
    const greens = ['#40916C', '#2D6A4F', '#52B788'];
    return `<svg class="scene-leaf" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 C4 8 4 18 12 22 C20 18 20 8 12 2Z" fill="${greens[variant % 3]}"/>
      <line x1="12" y1="6" x2="12" y2="20" stroke="#1B4332" stroke-width="1" opacity=".5"/>
    </svg>`;
  };

  const star = (size) => `<svg class="scene-star" width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" fill="#FFD93D"/>
  </svg>`;

  const sparkle = () => `<svg class="scene-sparkle" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#FFD93D"/>
  </svg>`;

  const ufo = () => `<svg class="scene-ufo" viewBox="0 0 50 30" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="25" cy="18" rx="22" ry="8" fill="#CBD5E0"/>
    <ellipse cx="25" cy="14" rx="10" ry="8" fill="#A855F7" opacity=".7"/>
    <circle cx="15" cy="20" r="2" fill="#FFD93D"/><circle cx="25" cy="22" r="2" fill="#FFD93D"/><circle cx="35" cy="20" r="2" fill="#FFD93D"/>
    <ellipse cx="25" cy="26" rx="12" ry="3" fill="#A855F7" opacity=".3"/>
  </svg>`;

  const jellyfish = (variant) => {
    const colors = ['#FF6B9D', '#A855F7', '#4D96FF'];
    const c = colors[variant % 3];
    return `<svg class="scene-jellyfish" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="14" rx="16" ry="12" fill="${c}" opacity=".7"/>
      <path d="M8 18 Q6 35 10 45" fill="none" stroke="${c}" stroke-width="2" opacity=".6"/>
      <path d="M16 18 Q14 38 18 48" fill="none" stroke="${c}" stroke-width="2" opacity=".6"/>
      <path d="M24 18 Q26 38 22 48" fill="none" stroke="${c}" stroke-width="2" opacity=".6"/>
      <path d="M32 18 Q34 35 30 45" fill="none" stroke="${c}" stroke-width="2" opacity=".6"/>
    </svg>`;
  };

  const mushroom = (variant) => {
    const caps = ['#FF6B6B', '#A855F7', '#FBBF24'];
    const c = caps[variant % 3];
    return `<svg class="scene-mushroom" viewBox="0 0 30 35" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="20" width="6" height="12" fill="#F5E6C8" rx="1"/>
      <ellipse cx="15" cy="16" rx="14" ry="10" fill="${c}"/>
      <circle cx="10" cy="12" r="2" fill="white" opacity=".6"/><circle cx="18" cy="10" r="1.5" fill="white" opacity=".6"/>
    </svg>`;
  };

  const rocket = () => `<svg class="scene-rocket" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="10" width="12" height="30" rx="4" fill="#E2E8F0"/>
    <polygon points="20,2 12,14 28,14" fill="#FF6B6B"/>
    <polygon points="14,40 8,52 14,44" fill="#FF9F43"/>
    <polygon points="26,40 32,52 26,44" fill="#FF9F43"/>
    <circle cx="20" cy="24" r="5" fill="#4D96FF" opacity=".6"/>
    <ellipse cx="20" cy="48" rx="6" ry="8" fill="#FF6B6B" opacity=".8" class="rocket-flame"/>
    <ellipse cx="20" cy="52" rx="4" ry="6" fill="#FBBF24" opacity=".9" class="rocket-flame"/>
  </svg>`;

  const coral = () => `<svg class="scene-coral" viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 45 Q8 25 15 20 Q12 35 18 45" fill="#FF6B9D" opacity=".8"/>
    <path d="M25 45 Q20 15 30 10 Q28 30 32 45" fill="#FF9F43" opacity=".8"/>
    <path d="M40 45 Q38 28 45 22 Q42 38 48 45" fill="#A855F7" opacity=".8"/>
    <path d="M52 45 Q50 32 55 28 Q53 40 56 45" fill="#FF6B6B" opacity=".7"/>
    <ellipse cx="30" cy="46" rx="28" ry="4" fill="#023E8A"/>
  </svg>`;

  const logo = () => `<svg class="logo-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="36" height="32" rx="4" fill="#A855F7"/>
    <rect x="10" y="12" width="28" height="24" rx="2" fill="white"/>
    <line x1="14" y1="18" x2="34" y2="18" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round"/>
    <line x1="14" y1="24" x2="30" y2="24" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
    <line x1="14" y1="30" x2="26" y2="30" stroke="#6BCB77" stroke-width="2" stroke-linecap="round"/>
    <circle cx="38" cy="10" r="6" fill="#FFD93D"/>
    <text x="38" y="13" text-anchor="middle" font-size="8" fill="#E8751A">★</text>
  </svg>`;

  const book = () => `<svg class="upload-book" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="8" width="44" height="48" rx="4" fill="#A855F7"/>
    <rect x="14" y="12" width="36" height="40" rx="2" fill="white"/>
    <path d="M32 12 L32 52" stroke="#E2E8F0" stroke-width="1"/>
    <line x1="20" y1="22" x2="28" y2="22" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round"/>
    <line x1="20" y1="30" x2="28" y2="30" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
    <line x1="36" y1="22" x2="44" y2="22" stroke="#6BCB77" stroke-width="2" stroke-linecap="round"/>
    <line x1="36" y1="30" x2="44" y2="30" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/>
    <path d="M28 48 Q32 52 36 48" fill="none" stroke="#A855F7" stroke-width="2" class="book-smile"/>
  </svg>`;

  const THEME_DECOR_BUILDERS = {
    meadow: [butterfly, flower, bee, sparkle, star],
    forest: [leaf, butterfly, flower, mushroom],
    space: [star, sparkle, ufo],
    underwater: [fish, jellyfish, sparkle]
  };

  function buildDecor(theme, index) {
    const builders = THEME_DECOR_BUILDERS[theme] || THEME_DECOR_BUILDERS.meadow;
    const builder = builders[index % builders.length];
    return typeof builder === 'function' ? builder(index) : builder;
  }

  function initCharButtons() {
    document.querySelectorAll('.char-btn').forEach(btn => {
      const char = btn.dataset.char;
      if (charPreviews[char]) {
        btn.innerHTML = charPreviews[char];
      }
    });
  }

  function initThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      const theme = btn.dataset.theme;
      if (themePreviews[theme]) {
        btn.innerHTML = themePreviews[theme];
      }
    });
  }

  return {
    el, clone, charPreviews, themePreviews,
    tree, fish, butterfly, flower, bee, leaf, star, sparkle,
    ufo, jellyfish, mushroom, rocket, coral, logo, book,
    buildDecor, initCharButtons, initThemeButtons
  };
})();
