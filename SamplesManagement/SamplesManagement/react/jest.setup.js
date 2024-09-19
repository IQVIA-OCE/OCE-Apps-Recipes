global.Promise = jest.requireActual('promise');
delete global.MessageChannel;

beforeEach(() => {
  jest.useFakeTimers({ advanceTimers: true })
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('./src/constants/constants', () => ({
  NAMESPACE: 'OCE__',
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn(),
    query: jest.fn(),
    describe: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    del: jest.fn(),
    apexRest: jest.fn(),
  },
  environment: {
    locale: () => 'en_US',
    namespace: () => 'OCE__',
    territory: () => '',
    userId: () => '1',
    userID: () => '1',
  },
  layoutBridge: {
    setHeight: jest.fn()
  },
  externalNavigator: {
    open: jest.fn(),
  },
  customSettings: {
    getCustomSetting: jest.fn().mockResolvedValue({})
  }
}));

jest.mock('./src/utils/api');
jest.mock('./src/api/AppContext');
jest.mock('./src/api/Disbursements');
jest.mock('./src/api/Inventories');
jest.mock('./src/api/ManageLots');
jest.mock('./src/api/ReceivedSamples');
jest.mock('./src/api/SampleOrder');
jest.mock('./src/api/SamplesTimeline');
jest.mock('./src/api/SampleTransaction');
jest.mock('./src/api/StorageLocation');
