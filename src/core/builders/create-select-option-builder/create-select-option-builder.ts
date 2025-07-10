import { ISelectOption } from '@/ui/selector';

interface SelectOptionBuilder {
  setKey(key: string): this;
  setValue(value: string): this;
  setLabel(label: string): this;
  build(): ISelectOption;
}

export const createSelectOptionBuilder = (): SelectOptionBuilder => {
  const config: ISelectOption = { key: '', value: '', label: '' };

  return {
    setKey(key) {
      config.key = key;

      return this;
    },
    setValue(value) {
      config.value = value;

      return this;
    },
    setLabel(label) {
      config.label = label;

      return this;
    },
    build() {
      return config;
    },
  };
};
