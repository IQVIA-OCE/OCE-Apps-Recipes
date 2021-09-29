import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
import InventoryScreenContainer from './InventoryScreenContainer';

describe('InventoryScreenContainer', () => {
  it('should render properly', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<InventoryScreenContainer />);
    const tree = renderer.getRenderOutput();

    expect(tree).toMatchSnapshot();
  });
});
