
import { sfNetAPI, metadataBridge } from '@oce-apps/oce-apps-bridges';
import { Platform } from 'react-native';
import { fetchOrderPickListValues, fetchDeliveryPickListValues } from './picklistStatusApi';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    sfNetAPI: {
      describe: jest.fn(),
      metadata: jest.fn(),
      enablePromises: jest.fn()
    },
    environment: {
        namespace: () => 'OCE__',
    },
    metadataBridge: {
        describe: jest.fn(),
    }
}));

jest.mock('react-native/Libraries/Utilities/Platform', () => {
    let platform = {
      OS: 'ios',
    }
  
    const select = jest.fn().mockImplementation((obj) => {
      const value = obj[platform.OS]
      return !value ? obj.default : value
    })
  
    platform.select = select
  
    return platform
  });

  describe('picklists', () => {
    describe('fetchOrderPickListValues', () => {
        it('should get picklist values on web', async () => {
            Platform.OS = 'web'
            sfNetAPI.describe.mockImplementation(() => Promise.resolve({fields: [
                {
                    name: `OCE__Status__c`,
                    picklistValues: [{ label: 1, value: 1 }]
                }
            ]}));
            expect(await fetchOrderPickListValues()).toEqual([{ label: 1, value: 1 }]);
        });
        it('should get picklist values on ios', async () => {
            Platform.OS = 'ios'
            metadataBridge.describe.mockImplementation(() => Promise.resolve({fields: [
                {
                    name: `OCE__Status__c`,
                    picklistValues: [{ label: 1, value: 1 }]
                }
            ]}));
            expect(await fetchOrderPickListValues()).toEqual([{ label: 1, value: 1 }]);
        });
    });

    describe('fetchDeliveryPickListValues', () => {
        it('should get picklist values on web', async () => {
            Platform.OS = 'web'
            sfNetAPI.describe.mockImplementation(() => Promise.resolve({fields: [
                {
                    name: `OCE__Status__c`,
                    picklistValues: [{ label: 1, value: 1 }]
                }
            ]}));
            expect(await fetchDeliveryPickListValues()).toEqual([{ label: 1, value: 1 }]);
        });
        it('should get picklist values on ios', async () => {
            Platform.OS = 'ios'
            metadataBridge.describe.mockImplementation(() => Promise.resolve({fields: [
                {
                    name: `OCE__Status__c`,
                    picklistValues: [{ label: 1, value: 1 }]
                }
            ]}));
            expect(await fetchDeliveryPickListValues()).toEqual([{ label: 1, value: 1 }]);
        });
    });
})
