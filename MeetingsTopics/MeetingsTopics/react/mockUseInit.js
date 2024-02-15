jest.mock('./node_modules/@oce-apps/oce-apps-bridges/lib/hooks/useAppInit', () => {
  return {
    useAppInit: jest.fn()
  }
});
