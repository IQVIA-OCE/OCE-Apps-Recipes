import '@testing-library/jest-native/extend-expect';
global.alert = jest.fn();
global.Promise = jest.requireActual('promise');
