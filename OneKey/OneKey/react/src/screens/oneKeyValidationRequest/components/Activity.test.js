import React from 'react';
import renderer from 'react-test-renderer';
import Activity from './Activity';

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

describe('Activity', () => {
  it('Should render Activity component', () => {
    const tree = renderer
      .create(
        <Activity
          formData={{ activity: {}, individual: {} }}
          handleChange={() => jest.fn}
          handleBlur={() => {}}
          requiredFields={[]}
          picklists={picklists}
        />
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
