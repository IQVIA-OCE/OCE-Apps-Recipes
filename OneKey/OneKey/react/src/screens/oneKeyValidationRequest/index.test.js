import React from 'react';
import OneKeyValidationRequest from './index';
import { databaseManager, environment, sfNetAPI } from "oce-apps-bridges";
import { Provider, DarkTheme, DefaultTheme, Select, Button } from 'apollo-react-native';
import { Formik } from 'formik';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import * as utils from "./utils/utils";

jest.useFakeTimers()

jest.mock('react-native-keyboard-aware-scroll-view', () => {
    return {
        KeyboardAwareScrollView: jest.fn().mockImplementation(({ children }) => children)
    }
});

utils.mapCountries = jest.fn().mockImplementation(() => [{ label: 'country', value: 'country' }])
utils.submitOneKeyRequest = jest.fn().mockImplementationOnce(() => new Promise.resolve({ ok: true }))


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

const createTestProps = props => ({
    navigation: {
      navigate: jest.fn(),
    },
    route: {
      params: {
          itemData: initialData
      },
    },
    ...props
});

describe('OneKeyValidationRequest', () => {
    beforeEach(() => {
        jest.useFakeTimers();

        environment.userID = jest.fn().mockReturnValue("1");
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.spyOn(sfNetAPI, "describe").mockResolvedValueOnce({
          fields: [
            {
              name: "QIDC__OK_Available_Countries_ims__c",
              picklistValues: [{}],
            },
          ],
        });

        jest
          .spyOn(sfNetAPI, "query")
          .mockResolvedValueOnce({ records: mockWorkplacesRecords })
          .mockResolvedValueOnce({ records: [] });

        jest.spyOn(databaseManager, "fetch").mockResolvedValueOnce({
          records: [{ QIDC__OK_Available_Countries_ims__c: "US;FR" }],
        });

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

        const promise = Promise.resolve();
        await act(() => promise);

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

        const promise = Promise.resolve();
        await act(() => promise);

        expect(tree).toBeTruthy();
    });

    it('Should render OneKeyValidationRequest component in dark theme', async () => {
        const props = createTestProps({});

        const tree = render(
            <Provider theme={DarkTheme}>
                <OneKeyValidationRequest {...props}/>
            </Provider>
        );

        const promise = Promise.resolve();
        await act(() => promise);

        expect(tree).toBeTruthy();
    });

    it('should call handleSubmit as component method with entityType Workplace', async () => {
        const props = createTestProps({});
        render(<OneKeyValidationRequest {...props}/>);

        const instance = screen.UNSAFE_getByType(Formik)._fiber.stateNode;

        act(() => {
            screen.UNSAFE_getAllByType(Select)[0].props.onChange({ value: 'Workplace', label: 'Workplace' });
        });

        instance.setValues({
            entityType: { value: 'Workplace', label: 'Workplace' },
            workplace: {
                telephone: '000000000000',
                activityLocationCode: '0000',
                usualName: 'Test',
                parentUsualName: 'Test',
                typeCode: { value: 'test type code' },
                category: { value: 'test category' },
            },
            address: {
                longLabel: 'Address',
                city: 'TEST',
                longPostalCode: '0000',
                country: { value: 'test country' },
            }
        });

        const buttonSubmit = screen.UNSAFE_getByType(Button);
        fireEvent.press(buttonSubmit);

        expect(instance.state.isSubmitting).toBe(true);

        act(() => {
            jest.runAllTimers();
        });
    });

    it('should call handleSubmit as component method with entityType Activity', async () => {
        const props = createTestProps({});
        render(<OneKeyValidationRequest {...props}/>);

        const instance = screen.UNSAFE_getByType(Formik)._fiber.stateNode;

        act(() => {
            screen.UNSAFE_getAllByType(Select)[0].props.onChange({ value: 'Activity', label: 'Activity' });
        });

        instance.setValues({
            entityType: { value: 'Activity', label: 'Activity' },
            workplace: {
                telephone: '000000000000',
                activityLocationCode: '0000',
                usualName: 'Test',
                parentUsualName: 'Test',
                typeCode: { value: 'test type code' },
                category: { value: 'test category' },
                workplaceEid: 'test workplaceEid',
                statusCode: 'test statusCode',
                speciality1: 'test speciality1',
            },
            address: {
                longLabel: 'Address',
                city: 'TEST',
                longPostalCode: '0000',
                country: { value: 'test country' },
            },
            individual: {
                firstName: 'test firstName',
                lastName: 'test lastName',
                middleName: 'test middleName',
                individualEid: 'test individualEid',
                statusCode: 'test statusCode',
                typeCode: { value: 'test typecode' },
                genderCode: { value: 'test genderCode' },
                prefixNameCode: { value: 'test prefixNameCode' },
                titleCode: { value: 'test titleCode' },
                speciality1: { value: 'test speciality1' },
                speciality2: { value: 'test speciality2' },
                speciality3: { value: 'test speciality3' },
            },
            activity: {
                role: { value: 'test role' }
            }
        });

        const buttonSubmit = screen.UNSAFE_getByType(Button);
        fireEvent.press(buttonSubmit);

        expect(instance.state.isSubmitting).toBe(true);

        act(() => {
            jest.runAllTimers();
        });
    });

    it("should handle errors:", async () => {
        jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
            return Promise.resolve({
                ok: false,
                json: () => null,
            })
        })

        render(<OneKeyValidationRequest route={{ params: { itemData: null } }} />);

        const promise = Promise.resolve();
        await act(() => promise);
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

        const promise = Promise.resolve();
        await act(() => promise);

        const instance = screen.UNSAFE_getByType(Formik)._fiber.stateNode;
        const setSubmitting = jest.fn();
        await instance.handleSubmit({}, { setSubmitting }, '1');
        screen.UNSAFE_getAllByType(Select)[0].props.onChange({label: 'Activity', value: 'Activity'});
        const buttonSubmit = screen.UNSAFE_getByType(Button);
        fireEvent.press(buttonSubmit);
        expect(instance.state.isSubmitting).toBe(true);
    });

    it("should call global fetch 2:", async () => {
        const fakeUserResponse = {token: 'fake_user_token'}
        jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(fakeUserResponse),
            })
        })

        const props = createTestProps({});
        render(<OneKeyValidationRequest {...props}/>);
        const form = screen.UNSAFE_getByType(Formik)._fiber.stateNode;
        form.setValues({
            ...form.state.values,
            address: {
                country: {
                    value: "US"
                }
            },
            entityType: { label: 'Workplace', value: 'Workplace' }
        })
        screen.UNSAFE_getAllByType(Select)[0].props.onChange({label: 'Workplace', value: 'Workplace'});
        screen.UNSAFE_getAllByType(Select)[1].props.onChange({label: 'Country', value: 'Country'})
        expect(form.state.values.address.country.value).toEqual('Country');
    });

    it("should call global fetch 3:", async () => {
        const fakeUserResponse = {token: 'fake_user_token'}
        jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(fakeUserResponse),
            })
        })

        const props = createTestProps({});
        render(<OneKeyValidationRequest {...props}/>);
        const form = screen.UNSAFE_getByType(Formik)._fiber.stateNode;
        form.setValues({
            ...form.state.values,
            address: {
                country: "US"
            },
            entityType: { label: 'Activity', value: 'Activity' }
        })
        screen.UNSAFE_getAllByType(Select)[0].props.onChange({label: 'Activity', value: 'Activity'});
        screen.UNSAFE_getAllByType(Select)[1].props.onChange({label: 'Country', value: 'Country'})
        expect(form.state.values.address.country.value).toEqual('Country');

    });
});
