jest.mock('@oce-apps/oce-apps-bridges/lib/Layout/LayoutBridge', () => ({
  layoutBridge: {
    setHeight: jest.fn(),
  },
}));
