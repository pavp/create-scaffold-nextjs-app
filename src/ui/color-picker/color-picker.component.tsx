'use client';

import { memo } from 'react';
import { SketchPicker } from 'react-color';

import { Box } from '@/ui';

import { ColorPickerProps } from './color-picker.types';

import styles from './styles.module.scss';

const { colorPickerContainer, colorPickerCover } = styles;

const ColorPicker = ({ color, onChange, onChangeComplete, visible, onClose }: ColorPickerProps) => {
  if (!visible) return;

  return (
    <Box className={colorPickerContainer}>
      <Box className={colorPickerCover} onClick={onClose} />
      <SketchPicker
        disableAlpha
        color={color}
        presetColors={[]}
        onChange={onChange}
        onChangeComplete={onChangeComplete}
      />
    </Box>
  );
};

const MemoizedComponent = memo(ColorPicker);

export { MemoizedComponent as ColorPicker };
