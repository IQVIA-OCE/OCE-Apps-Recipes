jest.mock('./node_modules/oce-apps-bridges/lib/hooks/useAppInit', () => {
  return {
    useAppInit: jest.fn()
  }
});
