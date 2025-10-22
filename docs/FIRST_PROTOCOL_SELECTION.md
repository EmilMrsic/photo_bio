# FIRST Protocol Selection Strategy

## Change Summary

**Date:** January 22, 2025

**Problem:** Brain maps often list multiple protocol numbers (e.g., 4 and 18), and the AI was randomly picking one. This resulted in getting Protocol 10 (only FRONT/BACK) when Protocol 12 (ALL + RIGHT AND LEFT) was available.

**Solution:** Always extract the FIRST protocol number from the "Eyes Open Brain Map" section on page 10.

## How It Works Now

### Before:
```
Brain Map shows: Protocol 4, Protocol 18
AI randomly picks: 18
ANXIETY + Index 18 → Protocol 10 (only FRONT/BACK) ✗
```

### After:
```
Brain Map shows: Protocol 4, Protocol 18
AI ALWAYS picks: 4 (the FIRST one)
ANXIETY + Index 4 → Protocol 12 (ALL + RIGHT AND LEFT) ✓✓✓
```

## Example: Your Brain Map

Your brain map from 1/21/2025 shows:

**Eyes Open Brain Map - Possible Two Channel Protocols:**
- Protocol # 4 ← **Will now always pick this one**
- Protocol # 18

**Result:**
- **Condition:** ANXIETY
- **Index:** 4 (first protocol)
- **Maps to:** Protocol 12
- **Quadrants:** ALL (Step 1), FRONT (Step 2), RIGHT AND LEFT (Step 3), BACK (Step 4)
- **Frequency:** 1Hz
- **Cycles:** 1

## Complete Protocol 12 Details

```
Protocol 12 (1Hz, 1 cycle):
  Step 1: ALL          - 1Hz, 40%, 4min ✅
  Step 2: FRONT        - 1Hz, 50%, 2min
  Step 3: RIGHT AND LEFT - 1Hz, 50%, 4min ✅
  Step 4: BACK         - 1Hz, 50%, 2min
```

## Why This Works

1. **Consistent:** Always picks the same protocol from a given brain map
2. **Predictable:** Providers know which protocol will be selected
3. **Better Coverage:** First protocols often provide more comprehensive coverage
4. **Simple:** No complex logic needed

## Technical Implementation

**File:** `pages/api/extract-protocol.ts`

**Change:** Updated OpenAI prompt with instruction:
```
CRITICAL: Extract the FIRST protocol number listed in the "Possible Two Channel Protocols" 
table under "Protocols from Eyes Open Brain Map"

If multiple protocols are listed (e.g., 4 and 18), ALWAYS choose the first one (4)
```

## Testing Your Brain Map

With your specific brain map (1/21/2025) and ANXIETY condition:

| Old Behavior | New Behavior |
|--------------|--------------|
| Picked Index 18 | Picks Index 4 |
| Got Protocol 10 | Gets Protocol 12 |
| Only FRONT/BACK | ALL + RIGHT AND LEFT ✓ |

## Impact on Other Conditions

Your brain map has 4 protocol options:
- **Index 4** (Eyes Open, first) - Now selected
- Index 18 (Eyes Open, second)
- Index 8 (Eyes Closed, first)
- Index 12 (Eyes Closed, second)

### With ANXIETY Condition:

| Index | Protocol Assigned | Quadrants |
|-------|-------------------|-----------|
| **4** (selected) | **Protocol 12** | **ALL + RIGHT AND LEFT** ✅ |
| 18 (not used) | Protocol 10 | Only FRONT/BACK |
| 8 (alternate) | Protocol 12 | ALL + RIGHT AND LEFT ✅ |
| 12 (not used) | Protocol 10 | Only FRONT/BACK |

**Result:** You'll now get Protocol 12 with all quadrant types! 🎉

## Future Considerations

### If Eyes Closed is Preferred:
The system currently uses "Eyes Open" section. If a provider prefers "Eyes Closed" protocols, we could:
- Add a toggle in the UI
- Make it configurable per client
- Add it as a condition selection option

### If Second Protocol is Preferred:
Similar logic could be added to select second, third, etc. protocol if needed.

### Multiple Protocol Display:
Could show all available protocols and let the provider choose which one to use for this session.

## Verification

After deploying this change, upload your brain map again with ANXIETY condition and verify:

1. Console log shows: `index: 4` (not 18)
2. Console log shows: `protocol_id: 12` (not 10)
3. Modal displays: ALL, FRONT, RIGHT AND LEFT, BACK quadrants
4. All 4 steps are visible in correct order

## Related Files

- `pages/api/extract-protocol.ts` - OpenAI prompt updated
- `protocol-logic/protocol_router.json` - Routing logic (unchanged)
- `protocol-logic/neuroradiant_definitions.json` - Protocol definitions (unchanged)

## Rollback

If this change causes issues, the old prompt can be restored by removing the "FIRST" instruction and changing step 3 back to:
```
Parse a single integer 1 through 24 from the "Protocol #" column
```

