import React from 'react';
import renderer from 'react-test-renderer';
import OneKeyValidationRequest from './index'
import { environment } from "../../../bridge/EnvironmentData/EnvironmentData.native"
import { sfNetAPI } from "../../../bridge/sf/sfnetapi";
import { databaseManager as dbManager } from "../../../bridge/Database/DatabaseManager.native";
import Workplace from "./components/Workplace";
import { Formik } from 'formik';
import * as Yup from 'yup';

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

    dbManager.fetch = jest.fn()
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
        <OneKeyValidationRequest navigation={{ getParam: jest.fn() }}/>
      );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should render OneKeyValidationRequest component with initial data', async () => {
    const tree = renderer
      .create(
        <OneKeyValidationRequest navigation={{ getParam: jest.fn().mockReturnValue(initialData) }}/>
      );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleSubmit', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} /> );

    tree.root.findByType(Formik).props.onSubmit();

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getWorkplaces', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    const instance = tree.getInstance();

    try {
      await instance.fetchWorkplaces(null, 'queryString');

    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchCountriesLabels', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    const instance = tree.getInstance();

    const result = instance.getORByField('TEST', ['TEST, TEST']);

    expect(result).toBe("TEST = 'TEST, TEST'");
  });

  it('should call getPicklistValues', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({ records: [] });
      });

    const instance = tree.getInstance();

    await instance.getPicklistValues('us');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getPicklistValues with error', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        err({});
      });

    const instance = tree.getInstance();

    try {
      await instance.getPicklistValues('us');
    } catch (e) {
      expect(e).toEqual([])
    }

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getWorkplaceCategories', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({
          records: [{ QIDC__Label_ims__c: '', Name: '' }]
        })
      });

    const instance = tree.getInstance();

    await instance.getWorkplaceCategories('us');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getWorkplaceCategories', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        err({})
      });

    const instance = tree.getInstance();

    try {
      await instance.getWorkplaceCategories();
    } catch (e) {
      expect(e).toEqual({});
    }

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getRequiredFields', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({
          records: [{ QIDC__Workplace_Required_Fields_ims__c: 'TEST;TEST;TEST' }]
        })
      });

    const instance = tree.getInstance();

    await instance.getRequiredFields('Workplace', 'us');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getRequiredFields with empty data', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({
          records: []
        })
      });

    const instance = tree.getInstance();

    await instance.getRequiredFields('Workplace', 'us');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getRequiredFields with error', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        err({})
      });

    const instance = tree.getInstance();

    try {
      await instance.getRequiredFields('TEST', 'us');
    } catch (e) {
      expect(e).toEqual({});
    }

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getFormData', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    function FormDataMock() {
      this.append = jest.fn();
    }

    global.FormData = FormDataMock;

    const instance = tree.getInstance();

    instance.getFormData({test: 'test', test2: 'test2'});

  });

  it('should call handleSubmit as component method', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} /> );

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} /> );

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} /> );

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} /> );

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({});
      });

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({});
      });

    const instance = tree.getInstance();

    await instance.handleCountryClose({
      address: {
        country: 'us'
      }
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleCountryClose with error', async () => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} /> );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        err({});
      });

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn(), navigate: jest.fn() }} /> );

    const instance = tree.getInstance();

    instance.setState({
      showRequestErrorMessage: true
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render OneKeyValidationRequest component with workplace entityType', async () => {
    let tree;

    renderer.act(() => {
      tree = renderer.create(
        <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} />
      );
    });

    renderer.act(() => {
      const instance = tree.getInstance();

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
        <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} />
      );
    });

    renderer.act(() => {
      const instance = tree.getInstance();

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
        <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} />
      );
    });

    const instance = tree.getInstance();

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
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    const instance = tree.getInstance();

    await instance.handleEntityTypeClose({
      address: {
        country: ''
      }
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call getValidationSchema with entityType', async() => {
    const tree = renderer
      .create( <OneKeyValidationRequest navigation={{ getParam: jest.fn() }} /> );

    const instance = tree.getInstance();

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((queryString, data, err) => {
        data({ records: [] });
      });

    try {
      await instance.handleEntityTypeClose({
        entityType: 'TEST',
        address: {
          country: 'US'
        }
      });
    } catch (e) {
      console.log(e);
    }


    expect(tree.toJSON()).toMatchSnapshot();
  });
});
