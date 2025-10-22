export type HelmetType = 'light' | 'neuroradiant1070';

export const HELMET_DISPLAY_NAMES: Record<HelmetType, string> = {
  light: 'Neuronics Light Package',
  neuroradiant1070: 'Neuronics Neuroradiant 1070',
};

export const isNeuroradiant = (helmet?: string | null) => helmet === 'neuroradiant1070';


