import { forwardRef, memo } from 'react';
import { IMaskInput } from 'react-imask';

interface ForwardedInputMaskProps {
  name: string;
  mask: string;
  value: string;
  onChangeInput: (value: string) => void;
}

const ForwardedInputMask = forwardRef<HTMLInputElement, ForwardedInputMaskProps>(function TextMaskCustom(props, ref) {
  const { onChangeInput, mask, value, ...other } = props;

  return (
    <IMaskInput
      {...other}
      unmask
      inputRef={ref}
      mask={mask}
      overwrite={true}
      value={value}
      onAccept={(value: string) => onChangeInput(value)}
    />
  );
});

const MemoizedComponent = memo(ForwardedInputMask) as typeof ForwardedInputMask;

export { MemoizedComponent as ForwardedInputMask };
