import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';
import React from 'react';

const TestHook = ({ callback }) => {
  callback();
  return null;
};

export const testHook = callback =>
  renderer.create(<TestHook callback={callback} />);

const TestRenderHook = ({ callback }) => {
  return callback();
};

export const testRenderHook = callback =>
  render(<TestRenderHook callback={callback} />);
