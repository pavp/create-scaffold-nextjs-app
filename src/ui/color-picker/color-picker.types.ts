import { ColorChangeHandler } from 'react-color';

export interface ColorPickerProps {
  color: string;
  onChange: ColorChangeHandler;
  onChangeComplete?: ColorChangeHandler;
  visible: boolean;
  onClose: () => void;
}

export interface ColorPickerType {
  hex: string;
  hsl: { h: number; s: number; l: number; a: number };
  hsv: { h: number; s: number; v: number; a: number };
  oldHue: number;
  rgb: { r: number; g: number; b: number; a: number };
  source: string;
}
