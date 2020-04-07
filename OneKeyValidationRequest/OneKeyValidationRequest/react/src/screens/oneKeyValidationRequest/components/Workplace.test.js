import React from 'react';
import renderer from 'react-test-renderer';
import Workplace from './Workplace';

const picklists = {
  workplaceTypes: [{label: '', value: ''}],
  workplaceCategories: [{label: '', value: ''}],
  individualList: [],
  courtesyTitles: [],
  individualTitles: [],
  genderList: [],
  professionalTypes: [],
  roles: [],
  specialties: [],
  individualTypeCodes: []
};

describe('Workplace', () => {
  it('Should render Workplace component', () => {
    const tree = renderer
      .create(
        <Workplace
          formData={{ workplace: {}, address: {} }}
          handleChange={() => jest.fn}
          handleBlur={() => {}}
          requiredFields={[]}
          picklists={picklists}
        />
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
