const Mixpanel = {
  track: jest.fn(),
  init: jest.fn(),
  register: jest.fn(),
  identify: jest.fn(),
  reset: jest.fn(),
  people: {
    set: jest.fn(),
  },
};

module.exports = Mixpanel;
