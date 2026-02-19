import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useSelector } from "react-redux";
import { navigator, sfNetAPI, metadataBridge } from '@oce-apps/oce-apps-bridges';
import { Platform } from 'react-native';
import { isIphone, arraysDiff, countFilledValues, definePageType, mappingBrands, sortDates, sortStrings } from './';
import { PAGE_TYPE } from './constants';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    sfNetAPI: {
      describe: jest.fn(),
      metadata: jest.fn(),
      enablePromises: jest.fn()
    },
    environment: {
        namespace: () => 'OCE__',
        locale: () => 'en_US',
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

describe('Utils', () => {
    it('should make array diff', () => {
        const arr1 = [
            {
                label: 'text1',
                value: 'text1'
            }
        ]
        const arr2 = [
            {
                label: 'text1',
                value: 'text1'
            },
            {
                label: 'text2',
                value: 'text2'
            }
        ]
        expect(arraysDiff(arr1, arr2)).toEqual([ { label: 'text2', value: 'text2' } ]);
    });

    it('should count filled values', () => {
        const values = {
            value1: '',
            value2: '1',
            value3: '2'
        }
        expect(countFilledValues(values)).toEqual(2);
    });

    describe('definePageType', () => {
        it('should definePageType on web', async () => {
            Platform.OS = 'web'
            sfNetAPI.metadata.mockImplementation(() => Promise.resolve({
                objectDescribe: {
                    keyPrefix: '01'
                }
            }));
            expect(await definePageType('0125')).toEqual(PAGE_TYPE.ACCOUNT);
        });
        it('should definePageType on ios', async () => {
            Platform.OS = 'ios'
            metadataBridge.describe.mockImplementation(() => Promise.resolve({
                keyPrefix: '02'
            }));
            expect(await definePageType('0125')).toEqual(PAGE_TYPE.ORDER);
        });
    })

    it('should mapBrands', async () => {
        expect(mappingBrands([{
            Name: 'Name',
            Id: 'Id'
        }])).toEqual([{ label: 'Name', value: 'Id'}]);
    });

    describe('sort dates', () => {
        it('should sortDates ascending', async () => {
            let a = {
                Id: "a3s6g000000E8OXAA0",
                Order_Date: "2021-12-29",
            }
            let b = {
                Id: "a3s6t000000Kza8AAC",
                Order_Date: "2022-10-03",
            }
            const sorted = sortDates('Order_Date', 'ascending', a, b)
            expect(sorted).toBeLessThan(0)
        });
        it('should sortDates descending', async () => {
            let a = {
                Id: "a3s6g000000E8OXAA0",
                Order_Date: "2021-12-29",
            }
            let b = {
                Id: "a3s6t000000Kza8AAC",
                Order_Date: "2022-10-03",
            }
            const sorted = sortDates('Order_Date', 'descending', b, a)
            expect(sorted).toBeLessThan(0)
        });
    })

    describe('sort strings', () => {
        it('should sortStrings ascending', async () => {
            let a = {
                Id: "a3s6g000000E8OXAA0",
                Order_Name: "abc",
            }
            let b = {
                Id: "a3s6t000000Kza8AAC",
                Order_Name: "zxc",
            }
            const sorted = sortStrings('Order_Name', 'ascending', a, b)
            expect(sorted).toBeLessThan(0)
        });
        it('should sortStrings descending', async () => {
            let a = {
                Id: "a3s6g000000E8OXAA0",
                Order_Name: "O-2472",
            }
            let b = {
                Id: "a3s6t000000Kza8AAC",
                Order_Name: "O-5678",
            }
            const sorted = sortDates('Order_Name', 'descending', a, b)
            expect(sorted).toBeGreaterThan(0)
        });
    })
});
