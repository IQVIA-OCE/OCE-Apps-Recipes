import React from 'react';
import Workplace from './Workplace';
import {DarkTheme, Provider, TextInput} from 'apollo-react-native';
import { render, screen } from "@testing-library/react-native";

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
    const tree = render(
        <Workplace
            formData={{ workplace: {}, address: {} }}
            handleChange={() => jest.fn}
            handleBlur={() => {}}
            requiredFields={requiredFields}
            picklists={picklists}
        />
    );

    const inputs = screen.UNSAFE_getAllByType(TextInput);
    inputs.forEach(el => {
      console.log(el.props)
    });

    expect(tree).toBeTruthy();
  });

  it('Should render Workplace component in dark mode', () => {
    const tree = render(
        <Provider theme={DarkTheme}>
          <Workplace
              formData={{ workplace: {}, address: {} }}
              handleChange={() => jest.fn}
              handleBlur={() => {}}
              requiredFields={requiredFields}
              picklists={picklists}
          />
        </Provider>
    );

    const inputs = screen.UNSAFE_getAllByType(TextInput);
    inputs.forEach(el => {
      console.log(el.props)
    });

    expect(tree).toBeTruthy();
  });
});
