import React from 'react';
import Activity from './Activity';
import {render, screen, fireEvent} from "@testing-library/react-native";
import {DarkTheme, Provider} from "apollo-react-native";

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

describe('Activity', () => {
  it('Should render Activity component', () => {
    const tree = render(
        <Activity
          formData={{ activity: {}, individual: {} }}
          handleChange={() => jest.fn}
          handleBlur={() => {}}
          requiredFields={['Name1','Name2', 'Name3']}
          picklists={picklists}
        />
      );

    expect(tree).toBeTruthy();
  });

  it('Should render Activity component  in dark mode', () => {
    const tree = render(
        <Provider theme={DarkTheme}>
          <Activity
              formData={{ activity: {}, individual: {} }}
              handleChange={() => jest.fn}
              handleBlur={() => {}}
              requiredFields={[]}
              picklists={picklists}
          />
        </Provider>
      );

    expect(tree).toBeTruthy();
  });
});
