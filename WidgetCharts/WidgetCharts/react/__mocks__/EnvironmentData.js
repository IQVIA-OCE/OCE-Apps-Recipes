jest.mock('oce-apps-bridges/lib/EnvironmentData/EnvironmentData', () => ({
  environment: {
    locale: () => 'en_US',
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
    profileId: () => '2',
    organizationId: () => '3',
    timeZone: () => 'America/Los_Angeles',
    territory: jest.fn().mockImplementation(() => ({
      "developerName": "G_DM_Baden_Wurttemberg_20C02",
      "name": "G - DM - Baden-Württemberg - 20C02",
      "nameId": "9358d1c6741ad3ed4060052f1133049b"
    }))
  },
}));
