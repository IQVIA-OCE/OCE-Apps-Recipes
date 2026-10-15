import {Dimensions, Platform, Text, View} from 'react-native';
import { act, render } from '@testing-library/react-native';
import { isMobilePhone } from './constants';

describe('isMobilePhone', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('is android phone', async () => {
    Platform.OS ="android";

    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 700 });

    const { isMobilePhone } = require('./constants');

    const TestAndroidComponent = () => (
      <View testID="testAndroidComponent" style={{ width: isMobilePhone ? 300 : 700 }}>
        <Text>Test</Text>
      </View>
    );

    const { getByTestId } = render(<TestAndroidComponent />);
    await act( async () => {
      jest.runAllTimers();
    });
    expect(getByTestId('testAndroidComponent').props.style.width).toBe(300);
  });

  it('is android tablet', async () => {
    Platform.OS === 'android';

    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 1400, height: 900 });

    const { isMobilePhone } = require('./constants');

    const TestAndroidComponent = () => (
      <View testID="testAndroidComponent" style={{ width: isMobilePhone ? 300 : 700 }}>
        <Text>Test</Text>
      </View>
    );

    const { getByTestId } = render(<TestAndroidComponent />);
    await act( async ()=> {
      jest.runAllTimers();
    });
    // expect(getByTestId('testAndroidComponent').props.style.width).toBe(700);
  });
});
