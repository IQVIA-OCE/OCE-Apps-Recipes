import React from 'react';
import * as redux from 'react-redux';
import { render } from '@testing-library/react-native';
import App from './App';
jest.mock('./src/constants/namespacePrefix', () => ({ NAMESPACE: 'OCE__' }));

describe('App', () => {
  it('should render correctly', () => {
    const tree = render(
      <App />
    )
  })
})
