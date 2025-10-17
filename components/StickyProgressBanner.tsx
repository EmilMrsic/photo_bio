import React, { useEffect, useState } from 'react';

interface PurchaseState {
  chosenHelmet: 'v1' | 'v2' | null;
  step1Completed: boolean;
  step2Completed: boolean;
  lastStep: 'helmet' | 'subscription';
  timestamp: string;
}

const STORAGE_KEY = 'purchaseFlowState';

function loadState(): PurchaseState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PurchaseState;
  } catch {
    return null;
  }
}

export default function StickyProgressBanner() {
  const [state, setState] = useState<PurchaseState | null>(null);

  useEffect(() => {
    setState(loadState());
    const onStorage = () => setState(loadState());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!state) return null;
  if (state.step1Completed && state.step2Completed) return null;

  const message = !state.step1Completed
    ? 'You still need Step 1 to purchase your helmet.'
    : 'You still need Step 2 to activate your helmet.';

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-indigo-600 text-white shadow-lg ring-1 ring-white/10">
          <div className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
            <p className="text-sm sm:text-base font-medium">{message}</p>
            <a
              href="#pricing"
              className="ml-4 shrink-0 rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50"
            >
              Continue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


