import React from 'react';
import OneKeyValidationRequest from './index';
import { databaseManager, environment, sfNetAPI } from "oce-apps-bridges";
import { Provider, DarkTheme, DefaultTheme, Select, Button } from 'apollo-react-native';
import { Formik } from 'formik';
import { render, screen, fireEvent } from '@testing-library/react-native';

jest.useFakeTimers()

jest.mock('react-native-keyboard-aware-scroll-view', () => {
    return {
        KeyboardAwareScrollView: jest.fn().mockImplementation(({ children }) => children)
    }
})

const initialData = {
    "Id": "0015g00000OXFfpAAH",
    'Name': 'TEST data',
    'Phone': '0000000000',
    'FirstName': 'TEST data',
    'MiddleName': 'TEST data',
    'LastName': 'TEST data',
    'OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c': 'TEST data',
    'OCE__PrimaryAccountAddress__r.OCE__City__c': 'TEST data',
    'OCE__PrimaryAccountAddress__r.OCE__ZipCode__c': 'TEST data',
};

const mockWorkplacesRecords = [
    {
        Id: '1',
        OCE__AccountFullName__c: 'Name 1',
    },
    {
        Id: '2',
        OCE__AccountFullName__c: 'Name 2',
    },
    {
        Id: '3',
        OCE__AccountFullName__c: 'Name 3',
    }
];

const mockPicklistRecords = [
    {
        Id: 'a0SO000000E55cQMAR',
        Name: '00:15',
        QIDC__Label_ims__c: '00:15',
        QIDC__LIS_Code_ims__c: '24TIME'
    },
    {
        Id: 'a0SO000000E55cPMAR',
        Name: '00:00',
        QIDC__Label_ims__c: '00:00',
        QIDC__LIS_Code_ims__c: '24TIME'
    },
    {
        Id: 'a0SO000000E55cUMAR',
        Name: '01:15',
        QIDC__Label_ims__c: '01:15',
        QIDC__LIS_Code_ims__c: '24TIME'
    },
];

const createTestProps = props => ({
    navigation: {
        getParam: jest.fn(() => initialData),
        navigate: jest.fn(),
    },
    ...props
});

describe('OneKeyValidationRequest', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        environment.userID = jest.fn()
            .mockReturnValue('1');

        jest
            .spyOn(sfNetAPI, "describe")
            .mockImplementationOnce((objectType, data, err) => {
                data({
                    fields: [
                        {
                            name: 'QIDC__OK_Available_Countries_ims__c',
                            picklistValues: [{}]
                        }
                    ],
                });
            });

        jest
            .spyOn(sfNetAPI, "query")
            .mockImplementationOnce((objectType, data, err) => {
                data({ records: mockPicklistRecords });
            })
            .mockImplementationOnce((objectType, data, err) => {
                data({ records: mockWorkplacesRecords });
            })
            .mockImplementationOnce((objectType, data, err) => {
                data({ records: [] });
            });

        jest
            .spyOn(databaseManager, "fetch")
            .mockResolvedValueOnce(  () => {
                return new Promise((resolve, reject) => {
                    resolve({ records: [{ QIDC__OK_Available_Countries_ims__c: 'US;FR' }] })
                })
            })

        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => {
                return {}
            }
        }));
    });

    it('should render properly', async () => {
        const props = createTestProps({});
        const { UNSAFE_getAllByType } = render(<OneKeyValidationRequest {...props}/>);

        UNSAFE_getAllByType(Select)[0].props.onChange();
        UNSAFE_getAllByType(Select)[1].props.onChange();
    });

    it('Should render OneKeyValidationRequest component', async () => {
        const props = createTestProps({});

        const tree = render(
            <Provider theme={DefaultTheme}>
                <OneKeyValidationRequest {...props}/>
            </Provider>
        );

        expect(tree).toBeTruthy();
    });

    it('Should render OneKeyValidationRequest component in dark theme', async () => {
        const props = createTestProps({});

        const tree = render(
            <Provider theme={DarkTheme}>
                <OneKeyValidationRequest {...props}/>
            </Provider>
        );

        expect(tree).toBeTruthy();
    });

    it('should call handleSubmit as component method with entityType Workplace', async () => {
        const props = createTestProps({});
        render(<OneKeyValidationRequest {...props}/>);

        const instance = screen.UNSAFE_getByType(Formik)._fiber.stateNode;
        const setSubmitting = jest.fn();
        await instance.handleSubmit(
            {
                entityType: 'Workplace',
                workplace: {
                    telephone: '000000000000',
                    activityLocationCode: '0000',
                    usualName: 'Test',
                    parentUsualName: 'Test'
                },
                address: {
                    longLabel: 'Address',
                    city: 'TEST',
                    longPostalCode: '0000',
                    countryCode: '0000'
                }
            },
            { setSubmitting },
            '1'
        );

        screen.UNSAFE_getAllByType(Select)[0].props.onChange('Activity');

        const buttonSubmit = screen.UNSAFE_getByType(Button);
        fireEvent.press(buttonSubmit);

        expect(instance.state.isSubmitting).toBe(true);
        expect(screen.getByText("Fetching countries...")).toBeTruthy();
    });

    it('should call handleSubmit as component method with entityType Activity', async () => {
        const props = createTestProps({});
        render(<OneKeyValidationRequest {...props}/>);

        const instance = screen.UNSAFE_getByType(Formik)._fiber.stateNode;
        const setSubmitting = jest.fn();
        await instance.handleSubmit(
            {
                entityType: 'Activity',
                workplace: {
                    telephone: '000000000000',
                    activityLocationCode: '0000',
                    usualName: 'Test',
                    parentUsualName: 'Test'
                },
                address: {
                    longLabel: 'Address',
                    city: 'TEST',
                    longPostalCode: '0000',
                    countryCode: '0000'
                }
            },
            { setSubmitting },
            '1'
        );

        screen.UNSAFE_getAllByType(Select)[0].props.onChange('Workplace');

        const buttonSubmit = screen.UNSAFE_getByType(Button);
        fireEvent.press(buttonSubmit);

        expect(instance.state.isSubmitting).toBe(true);
        expect(screen.getByText("Fetching countries...")).toBeTruthy();
    });

    it("should handle errors:", async () => {
        jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
            return Promise.resolve({
                ok: false,
                json: () => null,
            })
        })

        render(<OneKeyValidationRequest navigation={{ getParam: jest.fn(() => null ) }}/>);
    });

    it("should call global fetch:", async () => {
        const fakeUserResponse = {token: 'fake_user_token'}
        jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(fakeUserResponse),
            })
        })

        const props = createTestProps({});
        render(<OneKeyValidationRequest {...props}/>);

        const instance = screen.UNSAFE_getByType(Formik)._fiber.stateNode;
        const setSubmitting = jest.fn();
        await instance.handleSubmit({}, { setSubmitting }, '1');
        screen.UNSAFE_getAllByType(Select)[0].props.onChange({label: 'Activity', value: 'Activity'});
        const buttonSubmit = screen.UNSAFE_getByType(Button);
        fireEvent.press(buttonSubmit);
        expect(instance.state.isSubmitting).toBe(true);
    });
});

