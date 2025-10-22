import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { trackEvent } from '../lib/analytics';

type ChosenHelmet = 'v1' | 'v2' | null;

interface PurchaseState {
  chosenHelmet: ChosenHelmet;
  step1Completed: boolean;
  step2Completed: boolean;
  lastStep: 'helmet' | 'subscription';
  timestamp: string; // ISO
}

const STORAGE_KEY = 'purchaseFlowState';
const DISCOUNT_CODE = 'BRAINCORE';
const EXPIRY_DAYS = 60;

function getDefaultState(): PurchaseState {
  return {
    chosenHelmet: null,
    step1Completed: false,
    step2Completed: false,
    lastStep: 'helmet',
    timestamp: new Date().toISOString(),
  };
}

function isExpired(timestampIso: string): boolean {
  const then = new Date(timestampIso).getTime();
  const now = Date.now();
  const ms = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return now - then > ms;
}

function loadState(): PurchaseState {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as PurchaseState;
    if (!parsed?.timestamp || isExpired(parsed.timestamp)) {
      localStorage.removeItem(STORAGE_KEY);
      return getDefaultState();
    }
    return parsed;
  } catch {
    return getDefaultState();
  }
}

function saveState(next: PurchaseState): void {
  if (typeof window === 'undefined') return;
  const withTs: PurchaseState = { ...next, timestamp: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(withTs));
}

interface PurchaseFlowProps {
  variant?: 'helmet-v1' | 'helmet-v2' | 'subscription' | 'full';
  defaultOpen?: boolean;
  id?: string;
}

export default function PurchaseFlow({ variant = 'full', defaultOpen, id }: PurchaseFlowProps) {
  const [state, setState] = useState<PurchaseState>(() => loadState());
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState<'A' | 'B' | 'C'>(() => {
    const s = loadState();
    if (!s.step1Completed) return s.chosenHelmet === 'v2' ? 'B' : 'A';
    if (!s.step2Completed) return 'C';
    return 'A'; // collapsed by default, UI will keep closed
  });
  const liveRef = useRef<HTMLDivElement>(null);
  const subscriptionOpenSent = useRef(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if ((opened === 'C') && !subscriptionOpenSent.current) {
      trackEvent('subscription_open');
      subscriptionOpenSent.current = true;
    }
  }, [opened, mounted]);

  const headerCheck = useCallback((done: boolean) => (
    <span
      aria-hidden
      className={`mr-4 inline-flex h-8 w-8 items-center justify-center rounded-md border ${
        done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300'
      }`}
    >
      {done ? (
        <CheckIcon className="h-5 w-5" />
      ) : (
        <span className="block h-3 w-3 rounded-sm bg-transparent" />
      )}
    </span>
  ), []);

  const completeStep1 = useCallback((model: 'v1' | 'v2') => {
    setState((prev) => ({
      ...prev,
      chosenHelmet: model,
      step1Completed: true,
      lastStep: 'helmet',
    }));
    setOpened('C');
  }, []);

  const markSubActive = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step2Completed: true,
      lastStep: 'subscription',
    }));
  }, []);

  const canInteractA = useMemo(() => !(state.step1Completed && state.chosenHelmet === 'v2'), [state]);
  const canInteractB = useMemo(() => !(state.step1Completed && state.chosenHelmet === 'v1'), [state]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      if (liveRef.current) liveRef.current.focus();
    } catch {
      // silently ignore for now
    }
  };

  const launchHelmet = (url: string, model: 'v1' | 'v2') => {
    trackEvent('outbound_helmet_click', { model });
    window.open(url, '_blank', 'noopener');
    completeStep1(model);
  };

  const launchSubscription = (url: string, planType: 'monthly' | 'annual') => {
    trackEvent('subscription_activate_click', { planType });
    window.open(url, '_blank', 'noopener');
  };

  // URLs
  const V1_URL = 'https://www.neuronic.online/products/neuronic-light-1070nm-photobiomodulation-helmet-with-app-connectivity';
  const V2_URL = 'https://www.neuronic.online/products/neuradiant-1070-non-invasive-photobiomodulation-helmet';
  const SUB_MONTHLY_URL = 'https://buy.stripe.com/4gMaEX0fI7oReCU1bke3e03';
  const SUB_ANNUAL_URL = 'https://buy.stripe.com/9B63cv0fI24x0M4g6ee3e04';

  const sectionBase = 'rounded-2xl bg-white shadow-md ring-1 ring-gray-200';
  const headerBase = 'w-full text-left flex items-center px-6 py-5';
  const titleBase = 'text-xl sm:text-2xl font-bold text-gray-900';
  const subTitle = 'mt-2 text-base text-gray-600';

  const isClient = mounted;

  // Handle external request to open a specific helmet accordion
  useEffect(() => {
    if (!mounted) return;
    const handler = (e: any) => {
      const m = e?.detail?.model as 'v1' | 'v2' | undefined;
      if (m === 'v1') setOpened('A');
      if (m === 'v2') setOpened('B');
    };
    window.addEventListener('open-helmet-flow', handler as any);
    return () => window.removeEventListener('open-helmet-flow', handler as any);
  }, [mounted]);

  return (
    <div id={id || "purchase-flow"} className="space-y-6">
      <div className="sr-only" aria-live="polite" aria-atomic="true" tabIndex={-1} ref={liveRef}>
        {copied ? 'Code copied!' : ''}
      </div>

      {/* Accordion A */}
      {(variant === 'full' || variant === 'helmet-v1') && (
      <Disclosure
        key={`A-${isClient ? ((variant === 'helmet-v1' ? (defaultOpen ?? (!state.step1Completed)) : (opened === 'A' && !state.step1Completed)) ? 'open' : 'closed') : 'closed'}`}
        defaultOpen={isClient ? (variant === 'helmet-v1' ? (defaultOpen ?? (!state.step1Completed)) : (!state.step1Completed && opened === 'A')) : false}
      >
        {({ open }) => (
          <div className={`${sectionBase} ${!canInteractA ? 'opacity-60 pointer-events-none' : ''}`}>
            <DisclosureButton className={headerBase} onClick={() => setOpened('A')} aria-label="Toggle Step 1 — Buy Portable 1070 nm Helmet">
              {headerCheck(isClient && (state.step1Completed && state.chosenHelmet === 'v1'))}
              <div>
                <div className={titleBase}>Step 1 — Buy Portable 1070 nm Helmet</div>
                <p className={subTitle}>Copy your discount code and purchase your helmet.</p>
              </div>
            </DisclosureButton>
            <DisclosurePanel className="px-6 pb-6 pt-2">
              {/* Sub-step A */}
              <div className="pl-8">
                <div className="text-sm font-semibold text-gray-900">A. Copy Discount Code</div>
                <div className="mt-2 flex gap-3 max-w-xl">
                  <input
                    type="text"
                    readOnly
                    value={DISCOUNT_CODE}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border text-lg font-mono tracking-widest"
                    aria-label="Discount code"
                  />
                  <button
                    onClick={onCopy}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Copy Code
                  </button>
                </div>
                {copied && <div className="mt-2 text-sm text-green-700">Code copied!</div>}
              </div>

              {/* Sub-step B */}
              <div className="pl-8 mt-6">
                <div className="text-sm font-semibold text-gray-900">B. Purchase Helmet</div>
                <p className="mt-1 text-sm text-gray-600">
                  Step 1B: Purchase your Portable 1070 nm Helmet. Use the discount code above — it applies to as many helmets as you’d like to purchase.
                </p>
                <button
                  onClick={() => launchHelmet(V1_URL, 'v1')}
                  className="mt-4 w-full sm:w-auto rounded-md bg-indigo-600 px-5 py-3 text-white text-base font-semibold shadow-sm hover:bg-indigo-500"
                >
                  Purchase your Portable 1070 nm Helmet
                </button>
              </div>
            </DisclosurePanel>
          </div>
        )}
      </Disclosure>
      )}

      {/* Accordion B */}
      {(variant === 'full' || variant === 'helmet-v2') && (
      <Disclosure
        key={`B-${isClient ? ((variant === 'helmet-v2' ? (defaultOpen ?? (!state.step1Completed)) : (opened === 'B' && !state.step1Completed)) ? 'open' : 'closed') : 'closed'}`}
        defaultOpen={isClient ? (variant === 'helmet-v2' ? (defaultOpen ?? (!state.step1Completed)) : (!state.step1Completed && opened === 'B')) : false}
      >
        {() => (
          <div className={`${sectionBase} ${!canInteractB ? 'opacity-60 pointer-events-none' : ''}`}>
            <DisclosureButton className={headerBase} onClick={() => setOpened('B')} aria-label="Toggle Step 1 — Buy Neuradiant 1070 nm Helmet">
              {headerCheck(isClient && (state.step1Completed && state.chosenHelmet === 'v2'))}
              <div>
                <div className={titleBase}>Step 1 — Buy Neuradiant 1070 nm Helmet</div>
                <p className={subTitle}>Copy your discount code and purchase your helmet.</p>
              </div>
            </DisclosureButton>
            <DisclosurePanel className="px-6 pb-6 pt-2">
              {/* Sub-step A */}
              <div className="pl-8">
                <div className="text-sm font-semibold text-gray-900">A. Copy Discount Code</div>
                <div className="mt-2 flex gap-3 max-w-xl">
                  <input
                    type="text"
                    readOnly
                    value={DISCOUNT_CODE}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border text-lg font-mono tracking-widest"
                    aria-label="Discount code"
                  />
                  <button
                    onClick={onCopy}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Copy Code
                  </button>
                </div>
                {copied && <div className="mt-2 text-sm text-green-700">Code copied!</div>}
              </div>

              {/* Sub-step B */}
              <div className="pl-8 mt-6">
                <div className="text-sm font-semibold text-gray-900">B. Purchase Helmet</div>
                <p className="mt-1 text-sm text-gray-600">
                  Step 1B: Purchase your Neuradiant 1070 nm Helmet. Use the discount code above — it applies to as many helmets as you’d like to purchase.
                </p>
                <button
                  onClick={() => launchHelmet(V2_URL, 'v2')}
                  className="mt-4 w-full sm:w-auto rounded-md bg-indigo-600 px-5 py-3 text-white text-base font-semibold shadow-sm hover:bg-indigo-500"
                >
                  Purchase your Neuradiant 1070 nm Helmet
                </button>
              </div>
            </DisclosurePanel>
          </div>
        )}
      </Disclosure>
      )}

  {/* Accordion C */}
  {(variant === 'full' || variant === 'subscription') && (
  <Disclosure
        defaultOpen={variant === 'subscription' ? true : (isClient ? (state.step1Completed && !state.step2Completed && opened === 'C') : false)}
      >
        {() => (
          <div className={`${sectionBase} ${variant !== 'subscription' && !state.step1Completed ? 'opacity-60 pointer-events-none' : ''}`}>
            <DisclosureButton className={headerBase} onClick={() => setOpened('C')} aria-label="Toggle Step 2 — Activate Your Plan">
              {headerCheck(isClient && state.step2Completed)}
              <div>
                <div className={titleBase}>Step 2 — Activate Your Plan</div>
                <p className={subTitle}>Activate your annual plan to unlock protocols and updates.</p>
              </div>
            </DisclosureButton>
            <DisclosurePanel className="px-6 pb-6 pt-2">
              <div className="pl-8">
                <div className="text-sm font-semibold text-gray-900">A. Activate Subscription</div>
                <p className="mt-1 text-sm text-gray-600">
                  Choose monthly or annual subscription for unlimited QEEG uploads to generate fully personalized tPBM protocols. Unlimited clients and continuous protocol updates.
                </p>
                <div className="mt-4 space-y-3">
                  {/* Monthly Option */}
                  <div className="rounded-lg border border-gray-300 bg-white p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Monthly Plan</p>
                        <p className="text-xs text-gray-500">Pay as you go</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">$40<span className="text-sm font-normal text-gray-500">/mo</span></p>
                    </div>
                    <button
                      onClick={() => launchSubscription(SUB_MONTHLY_URL, 'monthly')}
                      className="w-full rounded-md bg-white border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      Subscribe Monthly
                    </button>
                  </div>
                  
                  {/* Annual Option */}
                  <div className="rounded-lg border border-gray-300 bg-white p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Annual Plan <span className="text-xs text-indigo-600 font-semibold">• Save $80</span></p>
                        <p className="text-xs text-gray-500">Save 2 months</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">$400<span className="text-sm font-normal text-gray-500">/yr</span></p>
                    </div>
                    <button
                      onClick={() => launchSubscription(SUB_ANNUAL_URL, 'annual')}
                      className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                      Subscribe Annually
                    </button>
                  </div>
                </div>
              </div>
            </DisclosurePanel>
          </div>
        )}
      </Disclosure>
      )}
    </div>
  );
}


