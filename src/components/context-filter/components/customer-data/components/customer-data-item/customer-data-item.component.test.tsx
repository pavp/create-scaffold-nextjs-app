import PersonIcon from '@mui/icons-material/Person';
import { renderWithProviders } from '@test/utils';

import colors from '@/styles/exported-colors.module.scss';

import { CustomerDataItem } from './customer-data-item.component';

const ICON = { label: 'PersonIcon', icon: PersonIcon };
const BG_COLOR = colors.customerDataBlue;
const LABEL = 'LABEL';
const VALUE = 'VALUE';
const setup = () => {
  const context = renderWithProviders(
    <CustomerDataItem Icon={ICON.icon} bgcolor={BG_COLOR} label={LABEL} value={VALUE} />,
  );

  return { context };
};

describe('CustomerDataItem Component', () => {
  it('should render elements', () => {
    const { context } = setup();

    expect(context.getByTestId('cd-item-container')).toBeInTheDocument();

    const icon = context.getByTestId('cd-item-icon');

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle({ backgroundColor: BG_COLOR });
    expect(context.getByTestId(ICON.label)).toBeInTheDocument();

    const label = context.getByTestId('cd-item-label');

    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent(LABEL);

    const value = context.getByTestId('cd-item-value');

    expect(value).toBeInTheDocument();
    expect(value).toHaveTextContent(VALUE);
  });
});
