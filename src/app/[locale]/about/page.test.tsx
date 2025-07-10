import { render, screen } from '@test/utils/test-utils';

import About from './page';

describe('About Page', () => {
  it('should render title', () => {
    render(<About />);

    const title = screen.getByTestId('about-page');

    expect(title).toBeInTheDocument();
  });
});
