import React from 'react';
import FormPanel from './FormPanel';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Formik } from 'formik';

describe('FormPanel', () => {
  it('asdf', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<FormPanel />);
    let result = renderer.getRenderOutput();

    expect(result).toMatchSnapshot();

    renderer.render(<FormPanel recordType={'Adjustment'} />);
    result = renderer.getRenderOutput();

    expect(result).toMatchSnapshot();

    renderer.render(<FormPanel recordType={'Return'} />);
    result = renderer.getRenderOutput();

    expect(result).toMatchSnapshot();

    renderer.render(<FormPanel recordType={'TransferIn'} />);
    result = renderer.getRenderOutput();

    expect(result).toMatchSnapshot();

    renderer.render(<FormPanel recordType={'TransferOut'} />);
    result = renderer.getRenderOutput();

    expect(result).toMatchSnapshot();
  });
});
