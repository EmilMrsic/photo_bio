// Centralized list of valid conditions from protocol_router.json
export const CONDITIONS = [
  'MEMORY',
  'FOCUS',
  'ANXIETY',
  'DEPRESSION',
  'SLEEP',
  'HEAD INJURY',
  'PEAK PERFORMANCE',
  'OCD',
  'CHRONIC PAIN',
  'SPECTRUM',
  'HEADACHE',
  'STROKE',
  'CHRONIC FATIGUE',
  'ADDICTIONS',
] as const;

export type Condition = typeof CONDITIONS[number];

// User-friendly display names (Title Case)
export const CONDITION_DISPLAY_NAMES: Record<string, string> = {
  'MEMORY': 'Memory',
  'FOCUS': 'Focus',
  'ANXIETY': 'Anxiety',
  'DEPRESSION': 'Depression',
  'SLEEP': 'Sleep',
  'HEAD INJURY': 'Head injury',
  'PEAK PERFORMANCE': 'Peak performance',
  'OCD': 'OCD',
  'CHRONIC PAIN': 'Chronic pain',
  'SPECTRUM': 'Spectrum',
  'HEADACHE': 'Headaches',
  'STROKE': 'Stroke recovery',
  'CHRONIC FATIGUE': 'Chronic fatigue',
  'ADDICTIONS': 'Addictions',
};
