jest.mock('oce-apps-bridges/lib/Layout/LayoutBridge', () => ({
  layoutBridge: {
    setHeight: jest.fn(),
  },
}));
