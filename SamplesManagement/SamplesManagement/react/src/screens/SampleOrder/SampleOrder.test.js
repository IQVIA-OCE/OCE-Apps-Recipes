import React from 'react';
import SampleOrder from './SampleOrder';
import { AppContext } from '../../AppContext';
import { useBanner } from '../../hooks';
import { Button } from '@oce-apps/apollo-react-native';
import { Formik } from 'formik';
import { saveSampleOrder } from '../../api/SampleOrder';
import { render, act, fireEvent } from '@testing-library/react-native';
import FormPanel from './FormPanel/FormPanel';
import { useNavigation, useRoute } from '@react-navigation/native';

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});
jest.mock('@react-navigation/native');
jest.mock('../../hooks/useBanner');

const mockedNavigate = jest.fn();
const setBanner = jest.fn();
const useBannerValue = [
  { variant: '', message: '', visible: false, icon: '' },
  setBanner,
];
useBanner.mockReturnValue(useBannerValue);

describe('SampleOrder', () => {
  beforeEach(() => {
    useRoute.mockReset();
    mockedNavigate.mockClear();
    setBanner.mockClear();

    useNavigation.mockImplementation(() => ({
      navigate: mockedNavigate,
    }));
  });

  it('should render component', () => {
    useRoute.mockReturnValue({
      params: {
        readonly: false,
        id: null,
      },
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder />
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[0]);
    act(() => jest.runAllTimers());

    expect(mockedNavigate).toBeCalledWith('Dashboard', {
      refreshReceivedTimelineWidget: true,
      refreshSamplesTimelineWidget: true,
    });
  });

  it('should render component in view mode', () => {
    useRoute.mockReturnValue({
      params: {
        readonly: true,
        id: 'id',
      },
    });

    const { UNSAFE_root, findByText } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder />
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    expect(findByText(/name/i)).toBeTruthy();
    expect(UNSAFE_root.findByType(FormPanel).props.readonly).toBeTruthy();
  });

  it('should render component in edit mode', () => {
    useRoute.mockReturnValue({
      params: {
        readonly: false,
        id: 'id',
      },
    });

    const { findByText } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder />
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    expect(findByText(/name/i)).toBeTruthy();
  });

  it('should show error on save/submit', () => {
    useRoute.mockReturnValue({
      params: {
        readonly: false,
        id: '',
      },
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder />
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[2]);
    act(() => jest.runAllTimers());
    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit');
    act(() => jest.runAllTimers());

    expect(setBanner).toBeCalledWith({
      icon: 'alert-circle',
      message: expect.stringMatching(/Cannot read/),
      variant: 'error',
      visible: true,
    });
  });

  it('should save component', () => {
    useRoute.mockReturnValue({
      params: {
        readonly: false,
        id: '',
      },
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder />
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[1]);
    act(() => jest.runAllTimers());

    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {
      fields: {
        isUrgent: false,
        comments: '',
        status: 'In Progress',
        territory: 'Territory',
        shipTo: { id: 'id', lable: 'label' },
        user: { id: 'id' },
        transactionRep: { id: 'id' },
      },
      products: [
        { id: 'id', quantity: 3, OCE__MaxOrder__c: 5, OCE__MinOrder__c: 0 },
      ],
      orderCheck: true,
    });
    act(() => jest.runAllTimers());


    expect(mockedNavigate).toBeCalledWith('Dashboard', {
      refreshReceivedTimelineWidget: true,
      refreshSamplesTimelineWidget: true,
    });

    expect(saveSampleOrder).toHaveBeenCalled();
  });

  it('should submit component', () => {
    useRoute.mockReturnValue({
      params: {
        readonly: false,
        id: '',
      },
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder />
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[2]);
    act(() => jest.runAllTimers());
    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {
      fields: {
        isUrgent: false,
        comments: '',
        status: 'In Progress',
        territory: 'Territory',
        shipTo: { id: 'id', lable: 'label' },
        user: { id: 'id' },
        transactionRep: { id: 'id' },
      },
      products: [{ quantity: 1, comments: 'comment' }],
      orderCheck: true,
    });
    act(() => jest.runAllTimers());

    expect(mockedNavigate).toBeCalledWith('Dashboard', {
      refreshReceivedTimelineWidget: true,
      refreshSamplesTimelineWidget: true,
    });

    expect(saveSampleOrder).toHaveBeenCalled();
  });

  it('should save component with enabled product allocation', () => {
    useRoute.mockReturnValue({
      params: {
        readonly: false,
        id: '',
      },
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder />
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[1]);
    act(() => jest.runAllTimers());
    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {
      fields: {
        isUrgent: false,
        comments: '',
        status: 'In Progress',
        territory: 'Territory',
        shipTo: { id: 'id', lable: 'label' },
        user: { id: 'id' },
        transactionRep: { id: 'id' },
      },
      products: [
        { id: 'id', quantity: 3, OCE__MaxOrder__c: 5, OCE__MinOrder__c: 0 },
      ],
      orderCheck: true,
    });
    act(() => jest.runAllTimers());

    expect(mockedNavigate).toBeCalledWith('Dashboard', {
      refreshReceivedTimelineWidget: true,
      refreshSamplesTimelineWidget: true,
    });

    expect(saveSampleOrder).toHaveBeenCalled();
  });

  it('should submit component with enabled product allocation', () => {
    useRoute.mockReturnValue({
      params: {
        readonly: false,
        id: '',
      },
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder />
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[2]);
    act(() => jest.runAllTimers());
    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {
      fields: {
        isUrgent: false,
        comments: '',
        status: 'In Progress',
        territory: 'Territory',
        shipTo: { id: 'id', lable: 'label' },
        user: { id: 'id' },
        transactionRep: { id: 'id' },
      },
      products: [{ quantity: 1, comments: 'comment' }],
      orderCheck: true,
    });
    act(() => jest.runAllTimers());

    expect(mockedNavigate).toBeCalledWith('Dashboard', {
      refreshReceivedTimelineWidget: true,
      refreshSamplesTimelineWidget: true,
    });

    expect(saveSampleOrder).toHaveBeenCalled();
  });

  it('should delete sample order', () => {
    useRoute.mockReturnValue({
      params: {
        readonly: true,
        id: 'id',
      },
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder />
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[3]);
    act(() => jest.runAllTimers());

    expect(setBanner).toBeCalledWith({
      icon: 'checkbox-marked-circle',
      message: 'Successfully deleted.',
      variant: 'success',
      visible: true,
    });
  });
});
