# Protocol Routing Issue - Why You Keep Getting Protocol 10

## Problem Summary

**User reports:** "I keep getting protocol 10 like 99% of the time and never see ALL or RIGHT AND LEFT quadrants"

**Root Cause:** Protocol 10 only has FRONT and BACK quadrants. The `protocol_router.json` maps most brain map indices to Protocol 10, especially for common conditions like ANXIETY, DEPRESSION, and SLEEP.

## Protocol 10 Structure

```
Protocol 10 (1Hz, 1 cycle):
  Step 1: FRONT - 1Hz, 40%, 4min
  Step 2: BACK - 1Hz, 40%, 4min
  Step 3: FRONT - 1Hz, 50%, 2min
  Step 4: BACK - 1Hz, 50%, 2min
```

**No ALL or RIGHT AND LEFT quadrants in Protocol 10!**

## How Protocol Routing Works

1. Brain map PDF is analyzed → extracts **Index** (1-24) and **Condition**
2. `protocol_router.json` maps: `Condition + Index → Protocol ID`
3. Protocol ID determines which of the 12 protocols is used

## Why Protocol 10 Appears So Often

For **ANXIETY, DEPRESSION, and SLEEP** (common conditions):

**Indices that give Protocol 10 (only FRONT/BACK):**
- 3, 5, 6, 10, 12, 13, 17, 18, 19, 20, 21 (11 out of 24 indices = 46%)

**Indices that give Protocol 11 (has ALL):**
- 1, 2, 7, 9, 15, 22, 24 (7 out of 24 indices = 29%)

**Indices that give Protocol 12 (has ALL + RIGHT AND LEFT):**
- 4, 8, 11, 14, 16, 23 (6 out of 24 indices = 25%)

## How to See ALL and RIGHT AND LEFT Quadrants

### Quick Test - Use These Combinations:

#### For ANXIETY/DEPRESSION/SLEEP Conditions:

✅ **To see ALL + RIGHT AND LEFT quadrants:**
- Upload brain map with indices: **4, 8, 11, 14, 16, or 23** → Gets Protocol 12

✅ **To see ALL quadrant only:**
- Upload brain map with indices: **1, 2, 7, 9, 15, 22, or 24** → Gets Protocol 11

#### For OCD/CHRONIC PAIN/SPECTRUM/HEADACHE/STROKE/ADDICTIONS:

✅ **To see ALL + RIGHT AND LEFT quadrants:**
- Upload brain map with indices: **2, 4, 5, 7, 9, 11, or 24** → Gets Protocol 6

✅ **To see ALL quadrant only:**
- Upload brain map with indices: **1, 6, 8, 12, 14, or 23** → Gets Protocol 5

#### For HEAD INJURY/PEAK PERFORMANCE/CHRONIC FATIGUE:

✅ **To see ALL + RIGHT AND LEFT quadrants:**
- Upload brain map with indices: **2, 4, 5, 9, 11, or 24** → Gets Protocol 9

✅ **To see ALL quadrant only:**
- Upload brain map with indices: **1, 6, 7, 8, 12, 14, or 23** → Gets Protocol 8

#### For MEMORY/FOCUS:

✅ **To see ALL + RIGHT AND LEFT quadrants:**
- Upload brain map with indices: **1, 8, 11, 12, or 23** → Gets Protocol 3

✅ **To see ALL quadrant only:**
- Upload brain map with indices: **2, 4, 7, 9, 14, or 24** → Gets Protocol 2

## Testing Strategy

### Option 1: Use Console Logs (Already Implemented)
When you upload a brain map and view the protocol, check the console:

```javascript
📋 handleViewProtocol called with:
  nr_protocol_id: 10  // ← This tells you which protocol was assigned
```

If you see protocol_id 10 (or 1, 4, 7) → Only FRONT/BACK quadrants
If you see protocol_id 12, 11, 9, 8, 6, 5, 3, or 2 → Has ALL and/or RIGHT AND LEFT

### Option 2: Manually Select Condition + Know Your Brain Map Index

1. When uploading brain map, select a condition
2. Check what index was extracted from the PDF (shown in console logs)
3. Refer to the chart above to see which protocol you'll get

### Option 3: Test with Sample Brain Maps

Create test brain maps with specific indices that will route to protocols containing ALL and RIGHT AND LEFT:

**Best Test Cases:**
- ANXIETY + Index 4 → Protocol 12 (has ALL + RIGHT AND LEFT)
- ANXIETY + Index 8 → Protocol 12 (has ALL + RIGHT AND LEFT)
- OCD + Index 2 → Protocol 6 (has ALL + RIGHT AND LEFT)
- MEMORY + Index 1 → Protocol 3 (has ALL + RIGHT AND LEFT)

## Complete Protocol Quadrant Reference

### Protocols with BOTH ALL and RIGHT AND LEFT:
- **Protocol 3** (40Hz, 1 cycle) - MEMORY/FOCUS indices: 1, 8, 11, 12, 23
- **Protocol 6** (10Hz, 1 cycle) - OCD/PAIN/SPECTRUM/etc indices: 2, 4, 5, 7, 9, 11, 24
- **Protocol 9** (20Hz, 1 cycle) - HEAD INJURY/PERFORMANCE indices: 2, 4, 5, 9, 11, 24
- **Protocol 12** (1Hz, 1 cycle) - ANXIETY/DEPRESSION/SLEEP indices: 4, 8, 11, 14, 16, 23

### Protocols with ALL only:
- **Protocol 2** (40Hz, 2 cycles) - MEMORY/FOCUS indices: 2, 4, 7, 9, 14, 24
- **Protocol 5** (10Hz, 2 cycles) - OCD/PAIN/SPECTRUM/etc indices: 1, 6, 8, 12, 14, 23
- **Protocol 8** (20Hz, 2 cycles) - HEAD INJURY/PERFORMANCE indices: 1, 6, 7, 8, 12, 14, 23
- **Protocol 11** (1Hz, 2 cycles) - ANXIETY/DEPRESSION/SLEEP indices: 1, 2, 7, 9, 15, 22, 24

### Protocols with ONLY FRONT/BACK:
- **Protocol 1** (40Hz, 1 cycle) - Most MEMORY/FOCUS indices
- **Protocol 4** (10Hz, 1 cycle) - Most OCD/PAIN/SPECTRUM/etc indices
- **Protocol 7** (20Hz, 1 cycle) - Most HEAD INJURY/PERFORMANCE indices
- **Protocol 10** (1Hz, 1 cycle) - Most ANXIETY/DEPRESSION/SLEEP indices ← **This is why!**

## Recommendations

1. **Short-term:** Use the console logs to identify which protocol is being assigned
2. **Testing:** Upload brain maps that will route to Protocols 3, 6, 9, or 12 to verify ALL and RIGHT AND LEFT display correctly
3. **Long-term consideration:** If Protocol 10 is being used too frequently and clients need more varied quadrant stimulation, consider adjusting the `protocol_router.json` mapping

## Files Involved

- `protocol-logic/protocol_router.json` - Maps condition + index → protocol ID
- `protocol-logic/neuroradiant_definitions.json` - Defines the 12 protocols with their steps
- `pages/api/extract-protocol.ts` - Extracts index from brain map and routes to protocol
- `components/ProtocolModal1070.tsx` - Displays the protocol steps

## Conclusion

**The system is working correctly!** You're getting Protocol 10 because:
1. Your brain maps have indices that route to Protocol 10 (like 3, 5, 6, 10, 12, 13, 17-21)
2. Protocol 10 only has FRONT and BACK quadrants by design
3. To see ALL and RIGHT AND LEFT, you need brain maps with different indices

The debug logging we added will help you track exactly which protocol and indices are being used.

