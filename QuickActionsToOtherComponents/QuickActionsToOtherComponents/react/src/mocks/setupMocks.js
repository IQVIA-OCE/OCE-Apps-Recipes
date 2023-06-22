jest.mock('oce-apps-bridges', () => ({
  environment: {
    namespace: () => '',
    userId: () => '1',
    locale: () => 'en_US',
    sfInstanceURL: () => 'https://test.salesforce.com',
  },
  databaseManager: {
    fetch: jest.fn(),
    fetchWithParams: jest.fn(),
    upsert: jest.fn(),
  },
  navigator: {
    navigate: jest.fn(),
  },
  dataUpdatesBridge: {
    addDataChangesForSoqlListener: (cb) => cb(),
    removeDataChangesForSoqlListener: jest.fn(),
    startObservingDataChangeForSoql: jest.fn(),
    stopObservingDataChangeForSoql: jest.fn(),
  },
  sfNetAPI: {
    describe: jest.fn(),
    enablePromises: jest.fn(),
    metadata: jest.fn(),
  },
  metadataBridge: {
    describe: jest.fn(),
  },
  layoutBridge: {
    setHeight: jest.fn(),
  },
}));
