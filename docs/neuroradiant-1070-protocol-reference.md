# Neuroradiant 1070 Protocol Reference

## Overview
This document provides a reference for all 12 Neuroradiant 1070 protocols, with emphasis on identifying which protocols contain ALL and RIGHT AND LEFT quadrants for testing purposes.

## Protocols with "ALL" Quadrant

### Protocol 2 (40Hz, 2 cycles)
- Step 1: BACK - 40Hz, 50%, 2min
- Step 2: FRONT - 40Hz, 50%, 2min
- **Step 3: ALL - 40Hz, 50%, 1min** ✓
- **Step 4: ALL - 40Hz, 10%, 1min** ✓

### Protocol 3 (40Hz, 1 cycle)
- **Step 1: ALL - 40Hz, 40%, 4min** ✓
- Step 2: FRONT - 40Hz, 50%, 2min
- Step 3: RIGHT AND LEFT - 40Hz, 50%, 4min
- Step 4: BACK - 40Hz, 50%, 2min

### Protocol 5 (10Hz, 2 cycles)
- Step 1: BACK - 10Hz, 50%, 2min
- Step 2: FRONT - 10Hz, 50%, 2min
- **Step 3: ALL - 10Hz, 50%, 1min** ✓
- **Step 4: ALL - 10Hz, 10%, 1min** ✓

### Protocol 6 (10Hz, 1 cycle)
- **Step 1: ALL - 10Hz, 40%, 4min** ✓
- Step 2: FRONT - 10Hz, 50%, 2min
- Step 3: RIGHT AND LEFT - 10Hz, 50%, 4min
- Step 4: BACK - 10Hz, 50%, 2min

### Protocol 8 (20Hz, 2 cycles)
- Step 1: BACK - 20Hz, 50%, 2min
- Step 2: FRONT - 20Hz, 50%, 2min
- **Step 3: ALL - 20Hz, 50%, 1min** ✓
- **Step 4: ALL - 20Hz, 10%, 1min** ✓

### Protocol 9 (20Hz, 1 cycle)
- **Step 1: ALL - 20Hz, 40%, 4min** ✓
- Step 2: FRONT - 20Hz, 50%, 2min
- Step 3: RIGHT AND LEFT - 20Hz, 50%, 4min
- Step 4: BACK - 20Hz, 50%, 2min

### Protocol 11 (1Hz, 2 cycles)
- Step 1: BACK - 1Hz, 50%, 2min
- Step 2: FRONT - 1Hz, 50%, 2min
- **Step 3: ALL - 1Hz, 50%, 1min** ✓
- **Step 4: ALL - 1Hz, 10%, 1min** ✓

### Protocol 12 (1Hz, 1 cycle)
- **Step 1: ALL - 1Hz, 40%, 4min** ✓
- Step 2: FRONT - 1Hz, 50%, 2min
- Step 3: RIGHT AND LEFT - 1Hz, 50%, 4min
- Step 4: BACK - 1Hz, 50%, 2min

## Protocols with "RIGHT AND LEFT" Quadrant

### Protocol 3 (40Hz, 1 cycle)
- Step 1: ALL - 40Hz, 40%, 4min
- Step 2: FRONT - 40Hz, 50%, 2min
- **Step 3: RIGHT AND LEFT - 40Hz, 50%, 4min** ✓
- Step 4: BACK - 40Hz, 50%, 2min

### Protocol 6 (10Hz, 1 cycle)
- Step 1: ALL - 10Hz, 40%, 4min
- Step 2: FRONT - 10Hz, 50%, 2min
- **Step 3: RIGHT AND LEFT - 10Hz, 50%, 4min** ✓
- Step 4: BACK - 10Hz, 50%, 2min

### Protocol 9 (20Hz, 1 cycle)
- Step 1: ALL - 20Hz, 40%, 4min
- Step 2: FRONT - 20Hz, 50%, 2min
- **Step 3: RIGHT AND LEFT - 20Hz, 50%, 4min** ✓
- Step 4: BACK - 20Hz, 50%, 2min

### Protocol 12 (1Hz, 1 cycle)
- Step 1: ALL - 1Hz, 40%, 4min
- Step 2: FRONT - 1Hz, 50%, 2min
- **Step 3: RIGHT AND LEFT - 1Hz, 50%, 4min** ✓
- Step 4: BACK - 1Hz, 50%, 2min

## Protocols with ONLY "FRONT" and "BACK" Quadrants

### Protocol 1 (40Hz, 1 cycle)
- Step 1: FRONT - 40Hz, 40%, 4min
- Step 2: BACK - 40Hz, 40%, 4min
- Step 3: FRONT - 40Hz, 50%, 2min
- Step 4: BACK - 40Hz, 50%, 2min

### Protocol 4 (10Hz, 1 cycle)
- Step 1: FRONT - 10Hz, 40%, 4min
- Step 2: BACK - 10Hz, 40%, 4min
- Step 3: FRONT - 10Hz, 50%, 2min
- Step 4: BACK - 10Hz, 50%, 2min

### Protocol 7 (20Hz, 1 cycle)
- Step 1: FRONT - 20Hz, 40%, 4min
- Step 2: BACK - 20Hz, 40%, 4min
- Step 3: FRONT - 20Hz, 50%, 2min
- Step 4: BACK - 20Hz, 50%, 2min

### Protocol 10 (1Hz, 1 cycle)
- Step 1: FRONT - 1Hz, 40%, 4min
- Step 2: BACK - 1Hz, 40%, 4min
- Step 3: FRONT - 1Hz, 50%, 2min
- Step 4: BACK - 1Hz, 50%, 2min

## Testing Recommendations

To verify that ALL and RIGHT AND LEFT quadrants are displaying correctly:

1. **Test Protocol 3** - Contains both ALL (step 1) and RIGHT AND LEFT (step 3)
2. **Test Protocol 2** - Contains ALL in steps 3-4
3. **Test Protocol 6** - Contains both ALL (step 1) and RIGHT AND LEFT (step 3)
4. **Test Protocol 9** - Contains both ALL (step 1) and RIGHT AND LEFT (step 3)

## Data Flow

The protocols flow through the system as follows:

1. **Source**: `protocol-logic/neuroradiant_definitions.json`
2. **API**: `pages/api/extract-protocol.ts` loads definitions
3. **Client Page**: `pages/clients/[id].tsx` handles protocol display
4. **Modal**: `components/ProtocolModal1070.tsx` renders the 4 steps

All steps are rendered in order using `steps.slice(0, 4).map()` with no filtering or transformation of quadrant values.

