jest.mock('@oce-apps/oce-apps-bridges/lib/EnvironmentData/EnvironmentData', () => ({
  environment: {
    locale: () => 'en_US',
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
  },
}));
