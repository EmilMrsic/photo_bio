# Quick Reference: How to See ALL and RIGHT AND LEFT Quadrants

## 🎯 The Problem
You keep getting Protocol 10, which only has FRONT and BACK quadrants.

## ✅ The Solution
You need brain maps with specific indices that route to different protocols.

---

## 📊 Quick Lookup Chart

### For ANXIETY, DEPRESSION, or SLEEP Conditions:

| Brain Map Index | Protocol Assigned | Quadrants You'll See |
|-----------------|-------------------|---------------------|
| **4, 8, 11, 14, 16, 23** | **Protocol 12** | ✓ ALL + RIGHT AND LEFT |
| 1, 2, 7, 9, 15, 22, 24 | Protocol 11 | ✓ ALL only |
| 3, 5, 6, 10, 12, 13, 17-21 | Protocol 10 | ✗ Only FRONT/BACK |

### For OCD, CHRONIC PAIN, SPECTRUM, HEADACHE, STROKE, or ADDICTIONS:

| Brain Map Index | Protocol Assigned | Quadrants You'll See |
|-----------------|-------------------|---------------------|
| **2, 4, 5, 7, 9, 11, 24** | **Protocol 6** | ✓ ALL + RIGHT AND LEFT |
| 1, 6, 8, 12, 14, 23 | Protocol 5 | ✓ ALL only |
| 3, 10, 13, 15-22 | Protocol 4 | ✗ Only FRONT/BACK |

### For HEAD INJURY, PEAK PERFORMANCE, or CHRONIC FATIGUE:

| Brain Map Index | Protocol Assigned | Quadrants You'll See |
|-----------------|-------------------|---------------------|
| **2, 4, 5, 9, 11, 24** | **Protocol 9** | ✓ ALL + RIGHT AND LEFT |
| 1, 6, 7, 8, 12, 14, 23 | Protocol 8 | ✓ ALL only |
| 3, 10, 13, 15-22 | Protocol 7 | ✗ Only FRONT/BACK |

### For MEMORY or FOCUS:

| Brain Map Index | Protocol Assigned | Quadrants You'll See |
|-----------------|-------------------|---------------------|
| **1, 8, 11, 12, 23** | **Protocol 3** | ✓ ALL + RIGHT AND LEFT |
| 2, 4, 7, 9, 14, 24 | Protocol 2 | ✓ ALL only |
| 3, 5, 6, 10, 13, 15-22 | Protocol 1 | ✗ Only FRONT/BACK |

---

## 🔍 How to Check Your Current Brain Map

1. Open browser console (F12 or right-click → Inspect)
2. Upload your brain map and analyze it
3. Look for these console messages:

```
📋 handleViewProtocol called with:
  nr_protocol_id: 10  ← Your protocol number
  
🔍 ProtocolModal1070 - Steps received:
  steps: [
    { step: 1, quadrant: "FRONT", ... }  ← Quadrant types
    { step: 2, quadrant: "BACK", ... }
    ...
  ]
```

---

## 💡 Testing Recommendations

### Best Test Cases (Most Likely to Show ALL + RIGHT AND LEFT):

1. **ANXIETY + Index 4** → Protocol 12
2. **DEPRESSION + Index 8** → Protocol 12  
3. **OCD + Index 2** → Protocol 6
4. **MEMORY + Index 1** → Protocol 3
5. **HEAD INJURY + Index 4** → Protocol 9

### If You Don't Have These Brain Maps:

Check your existing brain maps' indices using the console logs, then reference this chart to see what quadrants that protocol should have.

---

## 📝 All 12 Protocols - Quadrant Summary

| Protocol | Frequency | Cycles | Has ALL? | Has RIGHT AND LEFT? |
|----------|-----------|--------|----------|-------------------|
| Protocol 1 | 40Hz | 1 | ✗ | ✗ |
| Protocol 2 | 40Hz | 2 | ✓ | ✗ |
| Protocol 3 | 40Hz | 1 | ✓ | ✓ |
| Protocol 4 | 10Hz | 1 | ✗ | ✗ |
| Protocol 5 | 10Hz | 2 | ✓ | ✗ |
| Protocol 6 | 10Hz | 1 | ✓ | ✓ |
| Protocol 7 | 20Hz | 1 | ✗ | ✗ |
| Protocol 8 | 20Hz | 2 | ✓ | ✗ |
| Protocol 9 | 20Hz | 1 | ✓ | ✓ |
| Protocol 10 | 1Hz | 1 | ✗ | ✗ |
| Protocol 11 | 1Hz | 2 | ✓ | ✗ |
| Protocol 12 | 1Hz | 1 | ✓ | ✓ |

**Protocols with only FRONT/BACK:** 1, 4, 7, 10
**Protocols with ALL:** 2, 3, 5, 6, 8, 9, 11, 12
**Protocols with RIGHT AND LEFT:** 3, 6, 9, 12

---

## ⚡ Quick Action

**To see ALL and RIGHT AND LEFT quadrants right now:**

1. Find a brain map with one of these indices: **1, 2, 4, 8, 11, or 23**
2. Select condition: **ANXIETY** or **DEPRESSION** or **SLEEP**
3. Upload and analyze
4. You should get Protocol 11 or 12 (both have ALL, Protocol 12 also has RIGHT AND LEFT)

---

## 📞 Still Not Seeing Them?

Check console logs:
- If `nr_protocol_id` shows 10, 7, 4, or 1 → These protocols don't have ALL/RIGHT AND LEFT
- If `nr_protocol_id` shows 12, 11, 9, 8, 6, 5, 3, or 2 → Should have special quadrants
- If console shows correct protocol but modal doesn't → File a bug report

---

**Last Updated:** After implementing debug logging and protocol routing analysis
**Related Docs:** 
- `PROTOCOL_ROUTING_ISSUE.md` - Detailed explanation
- `neuroradiant-1070-protocol-reference.md` - Complete protocol specifications

