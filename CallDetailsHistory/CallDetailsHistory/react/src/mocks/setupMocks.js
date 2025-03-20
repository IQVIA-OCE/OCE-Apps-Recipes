jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => 'OCE__',
  },
  layoutBridge: {
    setHeight: jest.fn(),
  },
  sfNetAPI: {
    query: jest.fn(),
  },
}));
