import { IAutocompleteOption } from '@/ui/autocomplete-selector';

interface AutocompleteOptionBuilder {
  setId(id: string): this;
  setLabel(label: string): this;
  build(): IAutocompleteOption;
}

export const createAutocompleteOptionBuilder = (): AutocompleteOptionBuilder => {
  const config: IAutocompleteOption = { id: '', label: '' };

  return {
    setId(id) {
      config.id = id;

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
