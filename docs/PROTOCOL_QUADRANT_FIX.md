# Protocol Quadrant Display Fix - Summary

## Issue Identified
User reported never seeing "ALL" or "RIGHT AND LEFT" quadrants in the Neuroradiant 1070 protocol modal - only "FRONT" and "BACK" were visible.

User follow-up: **"I keep getting protocol 10 like 99% of the time"**

## Root Cause - CONFIRMED ✓
The protocol definitions in `neuroradiant_definitions.json` are **correct** and contain all quadrant types. 

**The real issue:** Protocol 10 only has FRONT/BACK quadrants (by design), and the `protocol_router.json` routing logic assigns Protocol 10 for many common brain map indices, especially for ANXIETY, DEPRESSION, and SLEEP conditions.

**Why Protocol 10 appears so often:**
- For ANXIETY/DEPRESSION/SLEEP: 11 out of 24 indices (46%) route to Protocol 10
- Protocol 10 has NO "ALL" or "RIGHT AND LEFT" quadrants
- This is working as designed based on the routing configuration

**To see ALL and RIGHT AND LEFT quadrants:**
- Need brain maps with specific indices that route to Protocols 3, 6, 9, or 12
- For ANXIETY/DEPRESSION/SLEEP: indices 4, 8, 11, 14, 16, or 23 → Protocol 12 (has ALL + RIGHT AND LEFT)

## Changes Made

### 1. Added Debug Logging
**File: `components/ProtocolModal1070.tsx`**
- Added React useEffect hook to log all protocol steps when modal opens
- Logs display: protocol number, label, cycles, step count, and full step details
- Console output format: `🔍 ProtocolModal1070 - Steps received:`

**File: `pages/clients/[id].tsx`**
- Added logging in `handleViewProtocol()` to track protocol data
- Logs when using saved NR1070 protocols from database
- Logs when loading from `neuroradiant_definitions.json` file
- Logs when protocol extraction completes
- Console output format: `📋`, `✅`, `📚` emojis for easy tracking

### 2. Validated Protocol Definitions
**File: `protocol-logic/neuroradiant_definitions.json`**
- Verified all 12 protocols have exactly 4 steps each
- Confirmed correct step ordering as per specification
- Validated all quadrant types are present:
  - Protocols with "ALL": 2, 3, 5, 6, 8, 9, 11, 12
  - Protocols with "RIGHT AND LEFT": 3, 6, 9, 12
  - Protocols with only "FRONT/BACK": 1, 4, 7, 10

### 3. Created Testing Documentation
**File: `docs/neuroradiant-1070-protocol-reference.md`**
- Complete reference guide for all 12 protocols
- Organized by quadrant type for easy lookup
- Testing recommendations included
- Data flow documentation

## How to Test

### Step 1: Check Console Logs
When viewing a protocol, you'll now see detailed console logs:

```
📋 handleViewProtocol called with: { helmet_type, nr_protocol_id, label, ... }
✅ Using saved NR1070 protocol with steps: [...]
🔍 ProtocolModal1070 - Steps received: {
  protocolNumber: 3,
  stepCount: 4,
  steps: [
    { step: 1, quadrant: "ALL", pulse_hz: 40, intensity_percent: 40, duration_min: 4 },
    { step: 2, quadrant: "FRONT", pulse_hz: 40, intensity_percent: 50, duration_min: 2 },
    { step: 3, quadrant: "RIGHT AND LEFT", pulse_hz: 40, intensity_percent: 50, duration_min: 4 },
    { step: 4, quadrant: "BACK", pulse_hz: 40, intensity_percent: 50, duration_min: 2 }
  ]
}
```

### Step 2: Test Protocols with ALL/RIGHT AND LEFT
To verify these quadrants display correctly, create or view these protocols:

**Best Test Protocols:**
- **Protocol 3** (40Hz) - Has ALL (step 1) + RIGHT AND LEFT (step 3)
- **Protocol 6** (10Hz) - Has ALL (step 1) + RIGHT AND LEFT (step 3)
- **Protocol 9** (20Hz) - Has ALL (step 1) + RIGHT AND LEFT (step 3)
- **Protocol 12** (1Hz) - Has ALL (step 1) + RIGHT AND LEFT (step 3)

**Protocols with just ALL:**
- Protocol 2, 5, 8, 11 - Have ALL in steps 3-4

### Step 3: Create New Protocol
1. Upload a brain map for a client with Neuroradiant 1070 helmet selected
2. Ensure the extracted protocol is one that contains ALL or RIGHT AND LEFT
3. View the protocol - all 4 steps should display with correct quadrants
4. Check console logs to verify data flow

## What to Look For

### If Quadrants Display Correctly ✓
- You'll see cards labeled "ALL" and/or "RIGHT AND LEFT"
- Console logs show correct quadrant values
- All 4 steps appear in order
- **Issue is resolved!**

### If Still Only Seeing FRONT/BACK ✗
The console logs will reveal where the issue occurs:

1. **If logs show correct quadrants but display doesn't:**
   - Issue is in the modal rendering (unlikely, but check browser console for React errors)

2. **If logs show incorrect quadrants:**
   - Old protocol data in database needs updating
   - Need to regenerate protocols for that client

3. **If only viewing Protocols 1, 4, 7, or 10:**
   - These protocols legitimately only have FRONT/BACK
   - Try viewing Protocols 2, 3, 5, 6, 8, 9, 11, or 12 instead

## Next Steps if Issue Persists

If you're still not seeing ALL or RIGHT AND LEFT quadrants after these changes:

1. **Check which protocol number you're viewing** - Console logs will show this
2. **Verify the helmet type** - Should be "neuroradiant1070"
3. **Look at the step data in console** - Does it contain ALL/RIGHT AND LEFT?
4. **If step data is wrong** - Old database records need to be regenerated
5. **Create a new protocol** - Will use the correct JSON definitions

## Technical Details

### Data Flow
```
neuroradiant_definitions.json (source of truth)
    ↓
extract-protocol.ts API (loads definitions)
    ↓
pages/clients/[id].tsx (receives and manages state)
    ↓
ProtocolModal1070.tsx (renders 4 steps)
```

### Files Modified
1. `components/ProtocolModal1070.tsx` - Added logging
2. `pages/clients/[id].tsx` - Added logging in 3 locations
3. `docs/neuroradiant-1070-protocol-reference.md` - Created testing guide
4. `docs/PROTOCOL_QUADRANT_FIX.md` - This summary document

### Files Validated (No Changes Needed)
1. `protocol-logic/neuroradiant_definitions.json` - Already correct ✓
2. `pages/api/extract-protocol.ts` - Already correct ✓

## Conclusion

The protocol definitions are correct. The debug logging will help identify:
- If old database records contain corrupted data
- Which protocols are being viewed
- Where in the data flow any issues occur

To see ALL and RIGHT AND LEFT quadrants, make sure to view Protocols 2, 3, 5, 6, 8, 9, 11, or 12 (not just 1, 4, 7, 10).

