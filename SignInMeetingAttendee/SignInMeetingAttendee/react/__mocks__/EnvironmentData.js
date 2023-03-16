jest.mock('oce-apps-bridges/lib/EnvironmentData/EnvironmentData', () => ({
  environment: {
    locale: () => 'en_US',
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
    profileId: () => '2',
    organizationId: () => '3',
    timeZone: () => 'America/Los_Angeles',
  },
}));
