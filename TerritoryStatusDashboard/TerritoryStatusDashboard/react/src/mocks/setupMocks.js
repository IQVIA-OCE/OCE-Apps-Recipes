jest.mock('oce-apps-bridges', () => ({
  environment: {
    namespace: () => '',
    userId: () => '1',
    territory: () => ({ name: 'TEST TERRITORY - 1' }),
  },
  layoutBridge: {
    setHeight: jest.fn(),
  },
  sfNetAPI: {
    enablePromises: jest.fn(),
    query: jest.fn(),
  },
}));
