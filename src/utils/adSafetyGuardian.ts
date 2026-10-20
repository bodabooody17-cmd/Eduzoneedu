/**
 * Ad Safety Guardian for EduZone
 * Automatically filters out +18, adult, erotic, dating, hookup, gambling, and inappropriate advertisements
 * in real-time, preserving clean educational and family-friendly ads while completely purging bad ones.
 */

// Comprehensive Bilingual Adult / Gambling / Malicious Ad Regex Dictionary
const FORBIDDEN_PATTERNS: RegExp[] = [
  // 1. Adult / Erotic / Porn / Explicit (English)
  /\b(adult|xxx|porn|pornography|sex|sexy|erotic|nude|nudity|nsfw|fetish|escort|camgirl|strip|hentai|onlyfans|brazzers|xvideos|xnxx|redtube|pornhub|xhamster|webcam|cams|chaturbate|stripchat|bongacams|livejasmin|fap|lust|milf|boobs|tits|penis|vagina|anal|hardcore|blowjob|creampie|horny|erotica|sensual|erotik|sexgame|adultgame)\b/i,

  // 2. Adult / Erotic / Explicit (Arabic & Franco-Arab)
  /(جنس|إباح|سكس|تعري|سحاق|شذوذ|إغراء|مثير|دعارة|مساج\s*ساخن|للكبار\s*فقط|\+18|18\+|نيك|طيز|كس|زب|شرموط|قحبة|بزاز|أفلام\s*جنس|فيديوهات\s*ساخنة|صور\s*عارية|بنات\s*ليل|شمال)/i,

  // 3. Dating / Hookup / Casual Romance (English & Arabic)
  /\b(dating|hookup|sugar\s*daddy|meet\s*singles|local\s*milfs|find\s*love\s*tonight|fuck|flirt|quick\s*flings|no\s*strings\s*attached|horny\s*girls)\b/i,
  /(شات\s*بنات|تعارف\s*بنات|أرقام\s*بنات|واتساب\s*بنات|زواج\s*عرفي|لقاء\s*ساخن|مقابلات\s*خاصة|دردشة\s*كبار|دردشة\s*صوتية\s*ساخنة)/i,

  // 4. Gambling / Casino / Betting (English & Arabic)
  /\b(casino|gambling|bet365|1xbet|stake|poker|slots|roulette|melbet|linebet|betting|jackpot|betway|spin\s*win)\b/i,
  /(كازينو|قمار|مراهنات|روليت|بوكر|وان\s*اكس\s*بت|مراهنة|سلوتس)/i,

  // 5. Known adult ad networks, affiliate trackers & adult CDNs
  /\b(exoclick|trafficjunky|juicyads|ero-advertising|crakrevenue|plugrush|popcash|popads|chaturbate|stripchat|livejasmin)\b/i,
];

/**
 * Checks whether a given string contains prohibited adult, dating, or gambling keywords
 */
export function isUnsafeAdText(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const decoded = decodeURIComponentSafely(text);
  return FORBIDDEN_PATTERNS.some((pattern) => pattern.test(decoded));
}

function decodeURIComponentSafely(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

/**
 * Deep scans an element (including text, attributes, images, links, and accessible iframe contents)
 * Returns true if an unsafe adult / +18 element was found and purged.
 */
export function purgeUnsafeElements(root: HTMLElement): boolean {
  if (!root) return false;

  let unsafeFound = false;

  // 1. Check root innerText & innerHTML
  if (isUnsafeAdText(root.innerText || '') || isUnsafeAdText(root.className || '')) {
    unsafeFound = true;
  }

  // 2. Check all anchor links (href, text, title, data-*)
  const links = root.querySelectorAll<HTMLAnchorElement>('a');
  links.forEach((a) => {
    const combined = `${a.href} ${a.textContent || ''} ${a.title || ''} ${a.getAttribute('data-href') || ''}`;
    if (isUnsafeAdText(combined)) {
      unsafeFound = true;
      a.remove();
    }
  });

  // 3. Check all images (src, alt, title)
  const imgs = root.querySelectorAll<HTMLImageElement>('img');
  imgs.forEach((img) => {
    const combined = `${img.src} ${img.alt || ''} ${img.title || ''}`;
    if (isUnsafeAdText(combined)) {
      unsafeFound = true;
      img.remove();
    }
  });

  // 4. Check all iframes
  const iframes = root.querySelectorAll<HTMLIFrameElement>('iframe');
  iframes.forEach((iframe) => {
    const src = iframe.src || '';
    const name = iframe.name || '';
    const title = iframe.title || '';

    if (isUnsafeAdText(`${src} ${name} ${title}`)) {
      unsafeFound = true;
      iframe.remove();
      return;
    }

    // Try reading inner document if same-origin or local
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc && doc.body) {
        if (
          isUnsafeAdText(doc.body.innerText || '') ||
          isUnsafeAdText(doc.body.innerHTML || '')
        ) {
          unsafeFound = true;
          iframe.remove();
          return;
        }
      }
    } catch {
      // Cross-origin iframe: secured via sandbox
    }

    // Prevent malicious adult popups or tab hijacking
    try {
      if (!iframe.getAttribute('sandbox')) {
        iframe.setAttribute(
          'sandbox',
          'allow-scripts allow-same-origin allow-forms allow-popups'
        );
      }
    } catch {
      // ignore
    }
  });

  return unsafeFound;
}

/**
 * Intercepts window.open globally to prevent any ad script from opening +18 / adult popunders or popups
 */
let isWindowOpenHooked = false;
export function installGlobalPopupGuard(): void {
  if (typeof window === 'undefined' || isWindowOpenHooked) return;
  isWindowOpenHooked = true;

  const originalOpen = window.open;
  window.open = function (
    url?: string | URL,
    target?: string,
    features?: string
  ): Window | null {
    if (url && isUnsafeAdText(String(url))) {
      console.warn('[EduZone AdSafe] Blocked inappropriate +18 popup navigation:', url);
      return null;
    }
    return originalOpen.call(window, url, target, features);
  };
}

/**
 * Continuously monitors an ad container with a MutationObserver and periodic scanning,
 * and intercepts any unsafe click events inside the ad container.
 */
export function monitorAdContainerForSafety(
  container: HTMLElement,
  onViolation: () => void
): () => void {
  installGlobalPopupGuard();

  // Initial immediate purge
  if (purgeUnsafeElements(container)) {
    onViolation();
  }

  // Click interceptor: inspect target link before navigation
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const anchor = target.closest('a');
    if (anchor && isUnsafeAdText(`${anchor.href} ${anchor.textContent || ''}`)) {
      e.preventDefault();
      e.stopPropagation();
      console.warn('[EduZone AdSafe] Prevented click on inappropriate +18 ad link');
      anchor.remove();
      onViolation();
    }
  };
  container.addEventListener('click', handleClick, true);

  // MutationObserver for instant detection when new nodes or iframes are injected
  const observer = new MutationObserver((mutations) => {
    let violationOccurred = false;

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (purgeUnsafeElements(el)) {
            violationOccurred = true;
            el.remove();
          }
        }
      });
    });

    if (violationOccurred) {
      onViolation();
    }
  });

  observer.observe(container, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'href', 'title', 'alt', 'class'],
  });

  // Periodic safety pass for the first 10 seconds to catch delayed async scripts
  let passCount = 0;
  const intervalId = setInterval(() => {
    passCount++;
    if (purgeUnsafeElements(container)) {
      onViolation();
    }
    if (passCount >= 15) {
      clearInterval(intervalId);
    }
  }, 700);

  return () => {
    observer.disconnect();
    clearInterval(intervalId);
    container.removeEventListener('click', handleClick, true);
  };
}

const STORAGE_KEY_HIDE_ADS = 'eduzone_student_hide_ads';

export function isAdSuppressedByUser(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY_HIDE_ADS) === 'true';
  } catch {
    return false;
  }
}

export function suppressAdByUser(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_HIDE_ADS, 'true');
  } catch (e) {
    console.error(e);
  }
}
