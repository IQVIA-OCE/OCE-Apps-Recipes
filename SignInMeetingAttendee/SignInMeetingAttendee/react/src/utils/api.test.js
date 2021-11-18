import api from './api';
import { sfNetAPI } from '../../bridge/sf/sfnetapi';
import { NAMESPACE } from '../constants';
import { meetingMemberLayout } from '../constants/mockData'

jest.mock('../../bridge/EnvironmentData/EnvironmentData.native', () => ({
    environment: {
        namespace: () => 'OCE__',
        sfApiVersion: () => '1',
        userID: () => '1',
        profileId: () => '2',
        organizationId: () => '3'
    },
}));

describe('api utility', () => {
    beforeAll(() => {
        sfNetAPI.query = jest.fn();
        sfNetAPI.describe = jest.fn();
        sfNetAPI.describeLayout = jest.fn();
        sfNetAPI.retrieve = jest.fn();
    });
    it('query should return value', async () => {
        sfNetAPI.query.mockImplementation((soql, callback) =>
            callback({ records: [1, 2], page: 1 })
        );
        const result = await api.query('');
        expect(result).toStrictEqual([[1, 2], { page: 1 }]);
    });

    it('query should return empty value', async () => {
        sfNetAPI.query.mockImplementation((soql, callback) => callback(null));
        const result = await api.query();
        expect(result).toStrictEqual(null);
    });

    it('query should return error', async () => {
        sfNetAPI.query.mockImplementation((soql, callback, error) =>
            error('Error')
        );
        try {
            await api.query('');
        } catch (e) {
            expect(e).toStrictEqual('Error');
        }
    });
    it('describe should return layout', async () => {
        sfNetAPI.describe.mockImplementation((soql, callback, error) =>
            callback({ page: 1 })
        );
        const result = await api.describe(`${NAMESPACE}MeetingMember__c`);
        expect(result).toStrictEqual([{ page: 1 }]);
    });

    it('describe layout should return layout', async () => {
        sfNetAPI.describeLayout.mockImplementation((memob, recordtype, callback) =>
            callback({ page: 1 })
        );
        const result = await api.describeLayout(`${NAMESPACE}MeetingMember__c`, '0129D000000vAQNQA2');
        expect(result).toStrictEqual([{ page: 1 }]);
    });
    it('retrive  should return field values for a record of given type', async () => {
        sfNetAPI.retrieve.mockImplementation((memob, param, fields, callback) =>
            callback({ page: 1 })
        );
        const result = await api.retrieve(`${NAMESPACE}Meeting__c`, `describe/compactLayouts/0129D000000vAQNQA2`);
        expect(result).toStrictEqual([{ page: 1 }]);
    });
});
