import { configureStore } from '@reduxjs/toolkit';
import outstandingSampleRequestsReducer, {
  fetchOutstandingSampleRequestsList,
  setOutstandingSampleRequestsCount,
} from './outstandingSampleRequestsSlice';
import attendeesReducer from '../attendeesSlice/attendeesSlice';
import * as outstandingSampleRequestsApi from '../../api/outstandingSampleRequestsApi';

jest.mock('../../api/outstandingSampleRequestsApi', () => ({
  fetchOutstandingSampleRequests: jest.fn(),
}));

jest.mock('../../constants/namespacePrefix', () => ({ NAMESPACE: '' }));

const samples = [
  {
    Account__c: '001O000001keIaMIAU',
    'Account__r.AccountFullName__c': 'AARON MORITA',
    Call__c: 'a2KO000000I6bvLMAR',
    Id: 'a6cO0000000GMMHIA4',
    Quantity__c: 0,
    'Sample__r.Id': 'a4sO00000000sXCIAY',
    'Sample__r.Name': 'QA Market',
    attributes: {
      type: 'CallSampleRequest__c',
      url: '/services/data/v50.0/sobjects/CallSampleRequest__c/a6cO0000000GMMHIA4',
    },
  },
];

const makeStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      outstandingSampleRequests: outstandingSampleRequestsReducer,
      attendees: attendeesReducer,
    },
    preloadedState: {
      outstandingSampleRequests: initialState,
      attendees: {
        list: {
          pending: [
            {
              customerId: '001O000001keIaMIAU',
              email: null,
              id: 'a3pO0000001BSlhIAG',
              isCurrentUser: false,
              meetingMemberRecordTypeName: 'Rep_Presentation',
              name: 'AARON H MORITA',
              recordTypeName: 'Attendee',
              status: 'Nominated',
              type: null,
            },
          ],
        },
      },
    },
  });
};

describe('outstandingSampleRequestsSlice', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  describe('async thunks', () => {
    describe('fetchOutstandingSampleRequestsList', () => {
      it('should call api', async () => {
        const store = makeStore();

        outstandingSampleRequestsApi.fetchOutstandingSampleRequests.mockResolvedValueOnce([samples]);

        await store.dispatch(fetchOutstandingSampleRequestsList(1));

        expect(outstandingSampleRequestsApi.fetchOutstandingSampleRequests).toHaveBeenCalled();
      });

      it('should return a success action with meeting in payload', async () => {
        const store = makeStore();
        outstandingSampleRequestsApi.fetchOutstandingSampleRequests.mockResolvedValueOnce([samples]);

        const successAction = await store.dispatch(fetchOutstandingSampleRequestsList(1));

        expect(successAction.payload).toStrictEqual([
          {
            accountId: '001O000001keIaMIAU',
            Name: 'AARON MORITA',
            callId: 'a2KO000000I6bvLMAR',
            Id: 'a6cO0000000GMMHIA4',
            samples: [
              {
                quantity: 0,
                name: 'QA Market',
                Id: 'a4sO00000000sXCIAY',
              },
            ],
          },
        ]);
      });

      it('should return a fail action with error', async () => {
        const store = makeStore();
        outstandingSampleRequestsApi.fetchOutstandingSampleRequests.mockRejectedValueOnce(
          'Expected error in fetchSampleRequsts'
        );
        const failAction = await store.dispatch(fetchOutstandingSampleRequestsList(1));

        expect(failAction.payload).toBe('Expected error in fetchSampleRequsts');
      });
    });
  });

  describe('reducers', () => {
    it('setOutstandingSampleRequestsCount', () => {
      const initialState = {
        count: null,
        list: [],
      };
      const newState = outstandingSampleRequestsReducer(initialState, setOutstandingSampleRequestsCount(1));
      expect(newState.count).toBe(1);
    });
  });
});
