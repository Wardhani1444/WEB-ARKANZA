/**
 * Haptic feedback utility for mobile web interactions
 * Uses the Web Vibration API (navigator.vibrate) with safe feature detection
 * and fallback handling for mobile browsers.
 */

export type HapticPattern = 'light' | 'medium' | 'success' | 'warning' | number | number[];

/**
 * Triggers a subtle tactile vibration on supported mobile devices.
 * - 'light': Quick gentle tap (~25ms), ideal for button clicks
 * - 'medium': Slightly firmer tap (~45ms)
 * - 'success': Cheerful double-tap sequence [25ms, 40ms pause, 30ms]
 * - 'warning': Alert double-tap [40ms, 60ms pause, 40ms]
 * - Or custom duration (number) / pattern array (number[])
 */
export const triggerHapticFeedback = (pattern: HapticPattern = 'light'): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      if (typeof pattern === 'number' || Array.isArray(pattern)) {
        return navigator.vibrate(pattern);
      }

      switch (pattern) {
        case 'light':
          // Subtle gentle tap for button clicks
          return navigator.vibrate(25);
        case 'medium':
          return navigator.vibrate(45);
        case 'success':
          // Satisfying double-pulse pattern upon successful voucher claim
          return navigator.vibrate([25, 40, 30]);
        case 'warning':
          return navigator.vibrate([40, 60, 40]);
        default:
          return navigator.vibrate(25);
      }
    }
  } catch (e) {
    // Browsers may throw if user interaction is not detected or permission denied
    // Silently continue without disrupting user flow
  }

  return false;
};
