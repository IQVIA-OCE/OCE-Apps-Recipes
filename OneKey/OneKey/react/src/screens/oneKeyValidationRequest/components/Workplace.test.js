import React from 'react';
import renderer from 'react-test-renderer';
import Workplace from './Workplace';
import { TextInput } from 'apollo-react-native';

jest.useFakeTimers()

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

const requiredFields = [
  {
    w_form_map: {
      workplace: {
        parentUsualName: {
          oneKeyField: ''
        }
      }
    }
  }
];

describe('Workplace', () => {
  it('Should render Workplace component', () => {
    const tree = renderer
      .create(
        <Workplace
          formData={{ workplace: {}, address: {} }}
          handleChange={() => jest.fn}
          handleBlur={() => {}}
          requiredFields={requiredFields}
          picklists={picklists}
        />
      );

    const inputs = tree.root.findAllByType(TextInput);
    inputs.forEach(el => {
      console.log(el.props)
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
