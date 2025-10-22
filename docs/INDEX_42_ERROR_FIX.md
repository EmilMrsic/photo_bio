# Index 42 Error Fix

## Issue

When testing the "always pick first protocol" feature, OpenAI extracted **Index 42** instead of **Index 4** from the brain map.

**Error:** `Index must be between 1 and 24, got: 42`

## Root Cause

The AI was reading numbers from other parts of the PDF instead of the protocol table:
- Page numbers (e.g., "42")
- Timestamps (e.g., "638888137424539034")
- Other document metadata

The brain map actually shows Protocol #4 and #18, but the AI picked up "42" from somewhere else in the document.

## Solution

Enhanced the OpenAI prompt to be much more specific about:

1. **WHERE to look:** "Protocols from Eyes Open Brain Map" section, "Possible Two Channel Protocols" table
2. **WHAT to extract:** Only numbers from the "Protocol #" column
3. **VALIDATION:** Protocol index MUST be between 1-24
4. **WHAT to ignore:** Page numbers, dates, timestamps, large numbers
5. **EXAMPLE table format:** Showed exact table structure to guide the AI

## Updated Prompt Key Points

```
CRITICAL: Protocol index MUST be between 1 and 24 inclusive
IGNORE page numbers, dates, and any numbers outside the protocol table

PDF extraction steps:
1. Find the section titled "Protocols from Eyes Open Brain Map"
2. Look for the table with header "Possible Two Channel Protocols"
3. Find the "Protocol #" column in this table
4. Extract ONLY the FIRST number from the "Protocol #" column
5. This number MUST be a single or double digit between 1-24
6. If you see numbers like 42, 638, etc., those are NOT protocol numbers - keep looking
```

## Example Given to AI

```
Example protocol table format:
Protocol #    Left Protocol         Right Protocol        Sites
4             2-7d 15-18u          2-7d 13-15u          F3/F4
18            9-11d 15-20u         15-20d 9-11u         P3/P4

In this example: Extract "4" (the FIRST protocol number)
```

## Testing

After this fix, upload the brain map again and verify:
- ✅ Console shows: `index: 4` (not 42)
- ✅ Console shows: `protocol_id: 12` (for ANXIETY condition)
- ✅ No "Index must be between 1 and 24" error
- ✅ Protocol displays with ALL and RIGHT AND LEFT quadrants

## Why This Happened

PDFs contain lots of numbers:
- Brain map date: "1/21/2025"
- Page numbers: "10", "42", etc.
- Timestamps in filenames: "638888137424539034"
- Site coordinates: "F3/F4", "P3/P4"
- Frequency values: "2-7d 15-18u"

The AI needs explicit instructions to focus ONLY on the "Protocol #" column in the specific table.

## Related Files

- `pages/api/extract-protocol.ts` - Updated prompt with stricter validation
- `docs/FIRST_PROTOCOL_SELECTION.md` - Original feature documentation
- `docs/SOLUTION_SUMMARY.md` - Overall solution summary

## Lessons Learned

When extracting structured data from PDFs:
1. Be very specific about the exact location (section, table, column)
2. Provide clear validation rules (1-24 range)
3. Show example of correct format
4. Explicitly list what to IGNORE
5. Use temperature 0 for deterministic results

## Next Test

Upload your brain map (1/21/2025) again and it should now correctly extract:
- **Condition:** ANXIETY
- **Index:** 4 (not 42!)
- **Protocol:** 12
- **Quadrants:** ALL, FRONT, RIGHT AND LEFT, BACK

