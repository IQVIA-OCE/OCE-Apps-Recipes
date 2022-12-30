import React from 'react';
import renderer from 'react-test-renderer';
import OneKeyValidationRequest from './index';
import { databaseManager, environment, sfNetAPI } from "oce-apps-bridges";
import Workplace from "./components/Workplace";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from 'apollo-react-native';

jest.useFakeTimers()

const initialData = {
  'Name': 'TEST',
  'Phone': '0000000000',
  'FirstName': 'TEST',
  'MiddleName': 'TEST',
  'LastName': 'TEST',
  'OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c': 'TEST',
  'OCE__PrimaryAccountAddress__r.OCE__City__c': 'TEST',
  'OCE__PrimaryAccountAddress__r.OCE__ZipCode__c': 'TEST',
};

let theme = {
  dark: false,
  roundness: 4,
  typography: {
    body1: {
      fontSize: 14,
      lineHeight: 20,
      marginVertical: 2,
      letterSpacing: 0.25
    },
    body2: {
      fontSize: 12,
      lineHeight: 18,
      marginVertical: 2,
      letterSpacing: 0.25
    },
    body3: {
      fontSize: 10,
      lineHeight: 15,
      marginVertical: 2,
      letterSpacing: 0.25
    },
    title1: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: 'bold',
      marginVertical: 2,
      letterSpacing: 0
    },
    title2: {
      fontSize: 20,
      lineHeight: 30,
      fontWeight: 'bold',
      marginVertical: 2,
      letterSpacing: 0.15
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: 'bold',
      marginVertical: 2,
      letterSpacing: 0.5
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 24,
      fontWeight: 'bold',
      marginVertical: 2,
      letterSpacing: 0.5
    },
    caption: {
      fontSize: 12,
      lineHeight: 20,
      marginVertical: 2,
      letterSpacing: 0.4
    },
    placeholder: { fontSize: 14, letterSpacing: 0.25 },
    link: {
      fontSize: 14,
      lineHeight: 20,
      marginVertical: 2,
      letterSpacing: 0.25,
      textDecorationLine: 'underline'
    }
  },
  colors: {
    primary: '#0768FD',
    secondary: '#0076AE',
    tertiary: '#595959',
    accent: '#03dac4',
    background: '#F6F6F6',
    surface: '#ffffff',
    error: '#E20000',
    text: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    success: '#00C221',
    warning: '#FF9300',
    buttonTertiary: '#F2F2F2',
    disabled: 'rgba(0, 0, 0, 0.26)',
    placeholder: 'rgba(0, 0, 0, 0.54)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#DF216D'
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    light: { fontFamily: 'System', fontWeight: '300' },
    thin: { fontFamily: 'System', fontWeight: '100' }
  },
  animation: { scale: 1 },
  tagPalette: {
    variant: {
      default: '#0768FD',
      blue: '#0768FD',
      purple: '#9E54B0',
      orange: '#FF9300',
      green: '#00C221',
      fuchsia: '#DF216D',
      blueDark: '#10558A',
      red: '#E20000',
      grey: '#595959',
      black: '#000000'
    }
  },
  avatarPalette: {
    light: { color: '#444444', backgroundColor: '#ffffff' },
    dark: { color: '#444444', backgroundColor: '#d9d9d9' }
  },
  textInput: {
    small: { borderColor: '#D9D9D9', defaultHeight: 32, fontSize: 14 },
    medium: { borderColor: '#D9D9D9', defaultHeight: 40, fontSize: 16 }
  }
};

describe('OneKeyValidationRequest', () => {
  beforeAll(() => {
    environment.userID = jest.fn()
      .mockReturnValue('1');

    sfNetAPI.describe = jest.fn()
      .mockImplementationOnce((objectType, data, err) => {
        data({
          fields: [
            {
              name: 'QIDC__OK_Available_Countries_ims__c',
              picklistValues: [{}]
            }
          ],
        });
      })
      .mockImplementationOnce((objectType, data, err) => {
        err({ message: 'Error' })
      })

    databaseManager.fetch = jest.fn()
      .mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
          resolve({ records: [] })
        })
      })
      .mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
          resolve({ records: [] })
        })
      })
      .mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
          resolve({ records: [{}] })
        })
      })
      .mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
          reject({ message: 'Error' })
        })
      })
  });

  it('Should render OneKeyValidationRequest component', async () => {
    const tree = renderer
      .create(
        <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme}/>
      );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  // it('Should render OneKeyValidationRequest component with initial data', async () => {
  //   const tree = renderer
  //     .create(
  //       <OneKeyValidationRequest navigation={{ getParam: jest.fn().mockReturnValue(initialData) }} theme={theme}/>
  //     );

  //   expect(tree.toJSON()).toMatchSnapshot();
  // });

  it('should call handleSubmit', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} theme={theme}/> );

    tree.root.findByType(Formik).props.onSubmit();

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getWorkplaces', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme}/> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    instance.state.mappings = [
      {
        oneKeyObjectName: 'Workplace'
      }
    ];

    await instance.getWorkplaces();

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getWorkplaces with data', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );
    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    instance.state.mappings = [
      {
        oneKeyObjectName: 'Workplace'
      }
    ];

    await instance.getWorkplaces();

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchWorkplaces', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    try {
      await instance.fetchWorkplaces(null, 'queryString');

    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchCountriesLabels', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    sfNetAPI.describe = jest.fn()
      .mockImplementationOnce((field, data, err) => {
        data({})
      });

    try {
      await instance.fetchCountriesLabels();

    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchCountriesLabels with no data', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    sfNetAPI.describe = jest.fn()
      .mockImplementationOnce((field, data, err) => {
        data(null)
      });

    try {
      await instance.fetchCountriesLabels();

    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchCountriesLabels with wrong data', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    sfNetAPI.describe.mockReset();
    sfNetAPI.describe = jest.fn()
      .mockImplementationOnce((field, data, err) => {
        data({
          fields: [
            {
              name: 'TEST'
            }
          ]
        })
      });

    try {
      await instance.fetchCountriesLabels();

    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getWorkplaces with error', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    instance.state.mappings = [
      {
        oneKeyObjectName: 'Workplace'
      }
    ];

    await instance.getWorkplaces();

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getORByField', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    const result = instance.getORByField('TEST', ['TEST, TEST']);

    expect(result).toBe("TEST = 'TEST, TEST'");
  });

  it('should call getPicklistValues', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({ records: [] });
      });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    await instance.getPicklistValues('us');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getPicklistValues with error', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        err({});
      });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    try {
      await instance.getPicklistValues('us');
    } catch (e) {
      expect(e).toEqual([])
    }

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getWorkplaceCategories', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({
          records: [{ QIDC__Label_ims__c: '', Name: '' }]
        })
      });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    await instance.getWorkplaceCategories('us');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getWorkplaceCategories', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        err({})
      });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    try {
      await instance.getWorkplaceCategories();
    } catch (e) {
      expect(e).toEqual({});
    }

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getRequiredFields', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({
          records: [{ QIDC__Workplace_Required_Fields_ims__c: 'TEST;TEST;TEST' }]
        })
      });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    await instance.getRequiredFields('Workplace', 'us');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getRequiredFields with empty data', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({
          records: []
        })
      });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    await instance.getRequiredFields('Workplace', 'us');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getRequiredFields with error', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        err({})
      });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    try {
      await instance.getRequiredFields('TEST', 'us');
    } catch (e) {
      expect(e).toEqual({});
    }

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getFormData', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    function FormDataMock() {
      this.append = jest.fn();
    }

    global.FormData = FormDataMock;

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    instance.getFormData({test: 'test', test2: 'test2'});

  });

  it('should call handleSubmit as component method', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => {
        return {}
      }
    }));

    const setSubmitting = jest.fn();

    await instance.handleSubmit(
      {
        entityType: 'Workplace',
        workplace: {
          telephone: '000000000000',
          activityLocationCode: '0000',
          usualName: 'Test',
          parentUsualName: 'Test'
        },
        address: {
          longLabel: 'Address',
          city: 'TEST',
          longPostalCode: '0000',
          countryCode: '0000'
        }
      },
      { setSubmitting },
      '1'
    );

    global.fetch.mockClear();

    delete global.fetch;

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleSubmit as component method with no entityType', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => {
        return {}
      }
    }));

    const setSubmitting = jest.fn();

    await instance.handleSubmit(
      {
        entityType: undefined,
      },
      { setSubmitting },
      '1'
    );

    global.fetch.mockClear();

    delete global.fetch;

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleSubmit as component method with response.ok false', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      ok: false,
      json: () => {
        return {}
      }
    }));

    const setSubmitting = jest.fn();

    await instance.handleSubmit(
      {
        entityType: 'Workplace',
        workplace: {
          telephone: '000000000000',
          activityLocationCode: '0000',
          usualName: 'Test',
          parentUsualName: 'Test'
        },
        address: {
          longLabel: 'Address',
          city: 'TEST',
          longPostalCode: '0000',
          countryCode: '0000'
        }
      },
      { setSubmitting },
      '1'
    );

    global.fetch.mockClear();

    delete global.fetch;

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleSubmit as component method with error', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    global.fetch = jest.fn().mockImplementationOnce(() => Promise.reject({
      ok: false,
    }));

    const setSubmitting = jest.fn();

    try {
      await instance.handleSubmit(
        {
          entityType: 'Activity',
          workplace: {
            telephone: '000000000000',
            activityLocationCode: '0000',
            usualName: 'Test',
            parentUsualName: 'Test'
          },
          individual: {
            firstName: 'TEST',
            lastName: 'TEST',
            typeCode: 'TEST',
            speciality1: 'TEST',
          },
          address: {
            longLabel: 'Address',
            city: 'TEST',
            longPostalCode: '0000',
            countryCode: '0000'
          },
          activity: {
            activityEid: 'TEST',
            statusCode: '000',
            telephone: '0000000000',
            role: 'TEST',
          }
        },
        { setSubmitting },
        '1'
      );
    } catch (e) {
      expect(e).ok.toBeFalsy();
    }

    global.fetch.mockClear();

    delete global.fetch;

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleCountryClose', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} theme={theme} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({});
      });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    try {
      await instance.handleCountryClose({
        entityType: 'TEST',
        address: {
          country: ''
        }
      })
    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleCountryClose with no entityType', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} theme={theme} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({});
      });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    await instance.handleCountryClose({
      address: {
        country: 'us'
      }
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleCountryClose with error', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} theme={theme} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        err({});
      });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    try {
      await instance.handleCountryClose({
        entityType: 'TEST',
        address: {
          country: 'TEST'
        }
      })
    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render OneKeyValidationRequest component with showRequestErrorMessage', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    instance.setState({
      showRequestErrorMessage: true
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render OneKeyValidationRequest component with workplace entityType', async () => {
    let tree;

    renderer.act(() => {
      tree = renderer.create(
        <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} />
      );
    });

    renderer.act(() => {
      const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

      instance.getInitialValues = jest.fn()
        .mockReturnValueOnce({
          entityType: 'Workplace',
          address: {
            country: '',
            longLabel: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c'] : '',
            city: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__City__c'] : '',
            longPostalCode: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__ZipCode__c'] : '',
            countyCode: '',
          },
          workplace: {
            workplaceEid: '',
            usualName: initialData ? initialData.Name : '',
            parentUsualName: '',
            telephone: initialData ? initialData.Phone : '',
            typeCode: '',
            requestComments: '',
            category: '', //?
            statusCode: '', // ?
            activityLocationCode: '', //
          },
          activity: {
            activityEid: '',
            statusCode: '', //?
            telephone: '',
            role: '',
          },
          individual: {
            individualEid: '',
            firstName: initialData ? initialData.FirstName : '',
            middleName: initialData ? initialData.MiddleName : '',
            lastName: initialData ? initialData.LastName : '',
            typeCode: '',
            specialty1: '',
            specialty2: '',
            specialty3: '',
            statusCode: '',
            genderCode: '',
            prefixNameCode: '',
            titleCode: '',
          },
        });

      instance.forceUpdate();
    })


    const formikComponent = tree.root.findByType(Formik);

    console.log(formikComponent.props);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleEntityTypeClose', async () => {
    let tree;

    renderer.act(() => {
      tree = renderer.create(
        <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} />
      );
    });

    renderer.act(() => {
      const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

      instance.getInitialValues = jest.fn()
        .mockReturnValueOnce({
          entityType: 'Activity',
          address: {
            country: '',
            longLabel: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c'] : '',
            city: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__City__c'] : '',
            longPostalCode: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__ZipCode__c'] : '',
            countyCode: '',
          },
          workplace: {
            workplaceEid: '',
            usualName: initialData ? initialData.Name : '',
            parentUsualName: '',
            telephone: initialData ? initialData.Phone : '',
            typeCode: '',
            requestComments: '',
            category: '', //?
            statusCode: '', // ?
            activityLocationCode: '', //
          },
          activity: {
            activityEid: '',
            statusCode: '', //?
            telephone: '',
            role: '',
          },
          individual: {
            individualEid: '',
            firstName: initialData ? initialData.FirstName : '',
            middleName: initialData ? initialData.MiddleName : '',
            lastName: initialData ? initialData.LastName : '',
            typeCode: '',
            specialty1: '',
            specialty2: '',
            specialty3: '',
            statusCode: '',
            genderCode: '',
            prefixNameCode: '',
            titleCode: '',
          },
        });

      instance.forceUpdate();
    })


    const formikComponent = tree.root.findByType(Formik);

    console.log(formikComponent.props);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleEntityTypeClose with no entityType', async () => {
    let tree;
    
    renderer.act(() => {
      tree = renderer.create(
        <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme}/>
      );
    });

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    await instance.handleEntityTypeClose({
      address: {
        country: '',
        longLabel: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c'] : '',
        city: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__City__c'] : '',
        longPostalCode: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__ZipCode__c'] : '',
        countyCode: '',
      },
      workplace: {
        workplaceEid: '',
        usualName: initialData ? initialData.Name : '',
        parentUsualName: '',
        telephone: initialData ? initialData.Phone : '',
        typeCode: '',
        requestComments: '',
        category: '', //?
        statusCode: '', // ?
        activityLocationCode: '', //
      },
      activity: {
        activityEid: '',
        statusCode: '', //?
        telephone: '',
        role: '',
      },
      individual: {
        individualEid: '',
        firstName: initialData ? initialData.FirstName : '',
        middleName: initialData ? initialData.MiddleName : '',
        lastName: initialData ? initialData.LastName : '',
        typeCode: '',
        specialty1: '',
        specialty2: '',
        specialty3: '',
        statusCode: '',
        genderCode: '',
        prefixNameCode: '',
        titleCode: '',
      },
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getValidationSchema', async() => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    await instance.handleEntityTypeClose({
      address: {
        country: ''
      }
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getValidationSchema with entityType', async() => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} theme={theme} /> );

    const instance = tree.root.children[0].children[0]._fiber.child.stateNode;

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({ records: [] });
      });

    try {
      await instance.handleEntityTypeClose({
        entityType: 'TEST',
        address: {
          country: {value: 'US'}
        }
      });
    } catch (e) {
      console.log(e);
    }


    expect(tree.toJSON()).toMatchSnapshot();
  });
});
