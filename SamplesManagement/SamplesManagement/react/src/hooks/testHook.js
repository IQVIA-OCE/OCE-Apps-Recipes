import renderer from 'react-test-renderer';
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
  renderer.create(<TestRenderHook callback={callback} />);
