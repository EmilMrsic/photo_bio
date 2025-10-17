// Lightweight analytics event dispatcher. Replace implementation later if needed.
export type AnalyticsEventPayload = Record<string, any> | undefined;

export function trackEvent(name: string, payload?: AnalyticsEventPayload): void {
  try {
    // Dispatch a browser event that other scripts/tools could listen for
    if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
      const evt = new CustomEvent('nlp-analytics', {
        detail: { name, payload, ts: Date.now() },
      } as any);
      window.dispatchEvent(evt);
    }
    // Log in dev for visibility
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info('[analytics]', name, payload || {});
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[analytics] failed to dispatch event', name, err);
  }
}


