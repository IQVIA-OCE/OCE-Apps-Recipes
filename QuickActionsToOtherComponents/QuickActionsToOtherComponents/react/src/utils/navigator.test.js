import { navigator } from '@oce-apps/oce-apps-bridges';
import {
  openNativeCreateScreen,
  openNativeViewScreen,
  openWEBCreateScreen,
} from './navigator';

describe('navigator', () => {
  beforeEach(() => {
    navigator.navigate.mockReset();
  });

  test('openNativeViewScreen() should call method navigate() of navigator bridge with some params', async () => {
    await openNativeViewScreen('TestEntity', '111');

    expect(navigator.navigate).toHaveBeenCalled();
    expect(navigator.navigate).toHaveBeenCalledWith(
      {},
      'TestEntity',
      '111',
      'present',
      'view'
    );
  });

  test('openNativeViewScreen() should throw error', async () => {
    navigator.navigate.mockRejectedValueOnce('Test error');
    try {
      await openNativeViewScreen('TestEntity', '111');
    } catch (error) {
      expect(error).toStrictEqual('Test error');
    }
  });

  test('openNativeCreateScreen() should call method navigate() of navigator bridge with some params', async () => {
    await openNativeCreateScreen({ recordId: '111' }, 'TestEntity');

    expect(navigator.navigate).toHaveBeenCalled();
    expect(navigator.navigate).toHaveBeenCalledWith(
      { recordId: '111' },
      'TestEntity',
      null,
      'present',
      'new'
    );
  });

  test('openNativeCreateScreen() should throw error', async () => {
    navigator.navigate.mockRejectedValueOnce('Test error');
    try {
      await openNativeCreateScreen('TestEntity', '111');
    } catch (error) {
      expect(error).toStrictEqual('Test error');
    }
  });

  test('openWEBCreateScreen() should open new browser tab', () => {
    window.open = jest.fn();

    openWEBCreateScreen(
      { recordId: '111', dateTime: 1673620144996 },
      'TestEntity'
    );

    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(
      'https://test.salesforce.com/lightning/o/TestEntity/new?recordId=111&dateTime=1673620144996',
      '_blank'
    );
  });

  test('openWEBCreateScreen() should throw error', () => {
    window.open = jest.fn();
    window.open.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    try {
      openWEBCreateScreen(
        { recordId: '111', dateTime: 1673620144996 },
        'TestEntity'
      );
    } catch (error) {
      expect(error.message).toStrictEqual('Test error');
    }
  });
});
