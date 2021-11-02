import api from '../utils/api';
import { changeLotStatus, fetchLots, fetchLotsOffset } from './ManageLots';

describe('ManageLots', () => {
  it('fetchLots', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchLots();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchLotsOffset', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchLotsOffset();
    expect(spy).toHaveBeenCalled();
  });

  it('changeLotStatus', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    changeLotStatus();
    expect(spy).toHaveBeenCalled();
  });
});
