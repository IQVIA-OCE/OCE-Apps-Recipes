import { Dimensions, Text, View } from 'react-native'
import { render } from '@testing-library/react-native';
import { isMobilePhone } from './constants';

const mockPlatform = OS => {
  jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
    OS,
    select: config => config[OS],
  }));
};

describe('isMobilePhone', () => {
  it('is android phone', () => {
    mockPlatform('android')
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 700 })
    const { isMobilePhone  } = require('./constants');

    const TestAndroidComponent = () => {
      return (
        <View testID="testAndroidComponent" style={{ width: isMobilePhone ? 300 : 700 }}>
          <Text>Test</Text>
        </View>
      )
    }

    const { getByTestId } = render(<TestAndroidComponent />)
    expect(getByTestId('testAndroidComponent').props.style.width).toBe(300)
  })

  it('is android tablet', () => {
    jest.resetModules();
    mockPlatform('android')
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 1400, height: 900 })
    const { isMobilePhone  } = require('./constants');


    const TestAndroidComponent = () => {
      return (
        <View testID="testAndroidComponent" style={{ width: isMobilePhone ? 300 : 700 }}>
          <Text>Test</Text>
        </View>
      )
    }

    const { getByTestId } = render(<TestAndroidComponent />)
    expect(getByTestId('testAndroidComponent').props.style.width).toBe(700)
  })
});
