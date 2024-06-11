import React from 'react';
import { useSelector } from 'react-redux'
import { render } from '@testing-library/react-native';
import Loader from './Loader';
import { LOADING_STATUS } from '../../constants/loadingStatus';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('Header', () => {
  beforeAll(() => {
    useSelector
      .mockImplementationOnce(() => LOADING_STATUS.PENDING)
      .mockImplementationOnce(() => LOADING_STATUS.SUCCESS)
  });

  it('should render correctly', () => {
    const { queryByTestId } = render(
      <Loader />
    );

    expect(queryByTestId('loader')).toBeTruthy();
  })


  it('should not render Loader', () => {
    const { queryByTestId } = render(
      <Loader />
    );

    expect(queryByTestId('loader')).toBeNull();
  })
})
