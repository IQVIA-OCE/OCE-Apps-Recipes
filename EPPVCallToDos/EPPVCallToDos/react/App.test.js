import React from 'react';
import RN from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import * as callToDoApi from './src/api/callToDoApi';
import { App } from './App';
import { COMPLIANCE_TYPES } from './src/__mocks__/complianceMocks';
import { CALL_RAW_IOS } from './src/__mocks__/callMocks';
import { CALL_TODOS_RAW_IOS } from './src/__mocks__/callToDosMocks';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('oce-apps-bridges', () => ({
  ...jest.requireActual('oce-apps-bridges'),
  layout: {
    setHeight: jest.fn(),
  },
}));

jest.mock('./src/api/callToDoApi', () => ({
  fetchCall: jest.fn(),
  fetchComplianceTypes: jest.fn(),
  fetchCallToDos: jest.fn(),
  fetchCallToDosCount: jest.fn(),
}));

describe('Application', () => {
  beforeEach(() => {
    callToDoApi.fetchCall.mockResolvedValue({ records: [CALL_RAW_IOS] });
    callToDoApi.fetchComplianceTypes.mockResolvedValue(COMPLIANCE_TYPES);
    callToDoApi.fetchCallToDos.mockResolvedValue({ records: CALL_TODOS_RAW_IOS });
    callToDoApi.fetchCallToDosCount.mockResolvedValue(1);
  });

  it('should render properly', async () => {
    const { findByText } = await waitFor(() => render(<App instanceId={'1'} />));

    const title = await findByText('EPPV/MID');

    expect(title).toBeTruthy();
  });

  it('should render properly in dark mode', async () => {
    jest.spyOn(RN, 'useColorScheme').mockReturnValue('dark');
    const { findByText } = await waitFor(() => render(<App instanceId={'1'} />));

    const title = await findByText('EPPV/MID');

    expect(title).toBeTruthy();
  });
});
