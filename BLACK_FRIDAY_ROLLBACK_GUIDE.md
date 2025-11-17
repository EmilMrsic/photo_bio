# Black Friday 2025 - Rollback Guide

**Created:** November 17, 2025  
**Purpose:** Document all Black Friday promotional changes for easy rollback after the sale ends

---

## Overview of Changes

This document tracks all modifications made to add the Black Friday 2025 promotion. Use this guide to restore the site to its pre-Black Friday state.

---

## Files Modified

### 1. `/workspace/pages/index.tsx`

**Total Changes:** 3 sections modified

---

#### Change #1: Top Banner Added (NEW ELEMENT)

**Location:** After navigation `</Disclosure>`, before Hero section  
**Lines:** Approximately 345-367

**TO REMOVE (DELETE THIS ENTIRE SECTION):**
```tsx
{/* Black Friday Banner */}
<a
  href="#pricing"
  className="block bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 hover:from-orange-700 hover:via-red-700 hover:to-orange-700 transition-all cursor-pointer mt-16"
>
  <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl animate-bounce">🎉</span>
        <span className="text-white font-bold text-base sm:text-lg">
          Black Friday: Up to 30% OFF + 10% BrainCore Discount Stacked
        </span>
        <span className="text-2xl animate-bounce">🎉</span>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs sm:text-sm font-semibold text-white border border-white/30">
        Click to View Deals
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  </div>
</a>
```

**ROLLBACK ACTION:** Simply delete the entire Black Friday Banner section (lines ~345-367)

---

#### Change #2: Pricing Section Announcement (NEW ELEMENT)

**Location:** Inside `#pricing` section, after the main heading, before "Neuronics Partnership Section"  
**Lines:** Approximately 824-870

**TO REMOVE (DELETE THIS ENTIRE SECTION):**
```tsx
{/* Black Friday Partner Announcement */}
<div className="mx-auto max-w-4xl mb-8">
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8 shadow-lg ring-2 ring-orange-200">
    {/* Decorative corner accent */}
    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 opacity-20 blur-2xl"></div>
    
    <div className="relative">
      <div className="flex items-center justify-center mb-3">
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-1.5 text-sm font-bold text-white shadow-md">
          🎉 Black Friday Partner Savings
        </span>
      </div>
      
      <h3 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
        Stack Your Savings This Black Friday
      </h3>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
        <p className="text-base sm:text-lg text-gray-800 leading-relaxed text-center mb-4">
          Neuronic is running their <span className="font-bold text-orange-700">biggest sale of the year</span> with up to <span className="font-bold text-orange-700">30% off</span> select tPBM systems.
        </p>
        <p className="text-base sm:text-lg text-gray-800 leading-relaxed text-center mb-4">
          As an <span className="font-semibold text-indigo-700">official BrainCore partner</span>, you receive an <span className="font-bold text-indigo-700">additional 10% provider discount</span> stacked on top of their Black Friday pricing.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-700 bg-indigo-50 rounded-lg py-3 px-4 border border-indigo-200 mb-6">
          <svg className="h-5 w-5 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">No codes needed — your savings are applied automatically when you order through your BrainCore provider link</span>
        </div>
        <div className="flex justify-center">
          <a
            href="https://www.neuronic.online/black-friday-2025-neuronics-biggest-sale-of-the-year-save-up-to-30-percent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:from-orange-700 hover:to-red-700 transition-all hover:scale-105"
          >
            View Black Friday Sale
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
```

**ROLLBACK ACTION:** Delete the entire Black Friday Partner Announcement section (lines ~824-870)

---

#### Change #3: Helmet Buy Buttons (MODIFIED ELEMENTS)

**Location:** Inside helmet product cards in pricing section

##### Neuronics LIGHT Button (First Helmet)

**CURRENT BLACK FRIDAY VERSION:**
```tsx
<a
  href="https://www.neuronic.online/black-friday-2025-neuronics-biggest-sale-of-the-year-save-up-to-30-percent"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-5 inline-block rounded-md bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-orange-700 hover:to-red-700 transition-all"
>
  🎉 View Black Friday Deal
</a>
```

**ORIGINAL PRE-BLACK FRIDAY VERSION (RESTORE THIS):**
```tsx
<button
  onClick={() => {
    setShowV1Flow(true)
    setTimeout(() => {
      const el = document.getElementById('flow-v1')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }}
  className="mt-5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
>
  Buy Neuronics LIGHT
</button>
```

##### Neuroradiant 1070 Button (Second Helmet)

**CURRENT BLACK FRIDAY VERSION:**
```tsx
<a
  href="https://www.neuronic.online/black-friday-2025-neuronics-biggest-sale-of-the-year-save-up-to-30-percent"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="View Black Friday Deal for Neuroradiant 1070 Helmet"
  className="mt-5 inline-block rounded-md bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-orange-700 hover:to-red-700 transition-all"
>
  🎉 View Black Friday Deal
</a>
```

**ORIGINAL PRE-BLACK FRIDAY VERSION (RESTORE THIS):**
```tsx
<button
  aria-label="Buy Neuroradiant 1070 Helmet"
  onClick={() => {
    setShowV2Flow(true)
    setTimeout(() => {
      const el = document.getElementById('flow-v2')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }}
  className="mt-5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
>
  Buy Neuradiant 1070
</button>
```

**ROLLBACK ACTION:** Replace both `<a>` link elements with their original `<button>` elements

---

## Quick Rollback Checklist

- [ ] Remove top Black Friday banner (lines ~345-367)
- [ ] Remove pricing section Black Friday announcement (lines ~824-870)
- [ ] Replace Neuronics LIGHT link with original button
- [ ] Replace Neuroradiant 1070 link with original button
- [ ] Test that purchase flow modals work again
- [ ] Verify navigation and pricing section display correctly

---

## Alternative: Use Git to Rollback

If you prefer a simple git-based rollback:

```bash
# View the commit that added Black Friday changes
git log --oneline

# Find the commit hash BEFORE the Black Friday changes
# Then revert the file to that state
git checkout <commit-hash-before-black-friday> -- pages/index.tsx

# Or revert the entire branch
git revert <black-friday-commit-hash>
```

---

## Testing After Rollback

1. ✅ Top banner is removed
2. ✅ Pricing section shows normal layout (no orange announcement)
3. ✅ "Buy Neuronics LIGHT" button opens modal flow
4. ✅ "Buy Neuradiant 1070" button opens modal flow
5. ✅ All original styling (indigo buttons) is restored
6. ✅ Page navigation works correctly

---

## Notes

- **Total additions:** ~100 lines of promotional code
- **Reversibility:** 100% - All changes are isolated and can be removed without affecting core functionality
- **No database changes:** All changes are frontend-only
- **No breaking changes:** Original purchase flows remain intact in the code

---

**End of Rollback Guide**
