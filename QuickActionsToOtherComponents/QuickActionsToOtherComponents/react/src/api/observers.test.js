import { dataUpdatesBridge } from '@oce-apps/oce-apps-bridges';
import { ENTITY } from '../constants';
import { startObservingDB, stopObservingDB } from './observers';

describe('observers', () => {
  test('startObservingDB() functions should create listener and start observing', async () => {
    const addDataChangesForSoqlListenerSpy = jest.spyOn(
      dataUpdatesBridge,
      'addDataChangesForSoqlListener'
    );
    const startObservingDataChangeForSoqlSpy = jest.spyOn(
      dataUpdatesBridge,
      'startObservingDataChangeForSoql'
    );
    const someCBMock = jest.fn();
    const listener = await startObservingDB([ENTITY.ORDER], (entity) => {
      if (entity === ENTITY.ORDER) {
        someCBMock();
      }
    });

    expect(addDataChangesForSoqlListenerSpy).toHaveBeenCalled();
    expect(startObservingDataChangeForSoqlSpy).toHaveBeenCalled();
  });

  test('startObservingDB() functions should write error in console if dataUpdatesBridge throw error', async () => {
    const addDataChangesForSoqlListenerSpy = jest
      .spyOn(dataUpdatesBridge, 'addDataChangesForSoqlListener')
      .mockRejectedValueOnce('Test error');
    const callbackMock = jest.fn();
    const callbackErrorMock = jest.fn();
    const listener = await startObservingDB(
      [ENTITY.ORDER],
      (entity) => {
        if (entity === ENTITY.ORDER) {
          callbackMock();
        }
      },
      (error) => callbackErrorMock(error)
    );

    expect(addDataChangesForSoqlListenerSpy).toHaveBeenCalled();
    expect(callbackErrorMock).toHaveBeenCalled();
    expect(callbackErrorMock).toHaveBeenCalledWith('Test error');
  });

  test('stopObservingDB() functions should stop observing and remove listener', async () => {
    const stopObservingDataChangeForSoqlSpy = jest.spyOn(
      dataUpdatesBridge,
      'stopObservingDataChangeForSoql'
    );
    const removeDataChangesForSoqlListenerSpy = jest.spyOn(
      dataUpdatesBridge,
      'removeDataChangesForSoqlListener'
    );
    await stopObservingDB([ENTITY.ORDER], 1);

    expect(stopObservingDataChangeForSoqlSpy).toHaveBeenCalled();
    expect(removeDataChangesForSoqlListenerSpy).toHaveBeenCalled();
  });

  test('stopObservingDB() functions should write error in console if dataUpdatesBridge throw error', async () => {
    const stopObservingDataChangeForSoqlSpy = jest
      .spyOn(dataUpdatesBridge, 'stopObservingDataChangeForSoql')
      .mockRejectedValueOnce('Test error');
    const callbackErrorMock = jest.fn();
    const listener = await stopObservingDB([ENTITY.ORDER], 1, (error) =>
      callbackErrorMock(error)
    );

    expect(stopObservingDataChangeForSoqlSpy).toHaveBeenCalled();
    expect(callbackErrorMock).toHaveBeenCalled();
    expect(callbackErrorMock).toHaveBeenCalledWith('Test error');
  });
});
