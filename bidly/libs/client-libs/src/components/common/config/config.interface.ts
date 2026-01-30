import { Color, Rounded, Size, Variant } from '../types';

export interface ComponentGlobalConfig {
  theme?: Theme;
  button?: {
    size?: Size;
    rounded?: Rounded | 'full';
    color?: Color;
  };
  input?: {
    size?: Size;
    rounded?: Rounded | 'full';
    color?: Color;
    label?: {
      position?: 'in' | 'out';
    };
  };
  label?: {
    size?: Size;
    color?: Color;
  };
  badge?: {
    size?: Size;
    color?: Color;
    variant?: Variant;
    rounded?: Rounded;
  };
  toggle?: {
    size?: Size;
  };
  checkbox?: {
    size?: Size;
  };
}

export type Theme = 'light' | 'dark';
export type ComponentKey = keyof ComponentGlobalConfig;
