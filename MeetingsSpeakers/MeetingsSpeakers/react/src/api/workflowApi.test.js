import { api } from '../utils';
import {
  fetchContext,
  fetchContextConditions,
  fetchContextType,
  fetchWorkflowConfiguration,
  fetchWorkflowNode,
} from './workflowApi';

describe('workflowApi', () => {
  it('fetchContextType', () => {
    const spy = jest.spyOn(api, 'queryOffline').mockImplementation();
    fetchContextType();

    expect(spy).toHaveBeenCalled();
  });

  it('fetchWorkflowConfiguration', () => {
    const spy = jest.spyOn(api, 'queryOffline').mockImplementation();
    fetchWorkflowConfiguration();

    expect(spy).toHaveBeenCalled();
  });

  it('fetchWorkflowNode', () => {
    const spy = jest.spyOn(api, 'queryOffline').mockImplementation();
    fetchWorkflowNode();

    expect(spy).toHaveBeenCalled();
  });

  it('fetchContext', () => {
    const spy = jest.spyOn(api, 'queryOffline').mockImplementation();
    fetchContext();

    expect(spy).toHaveBeenCalled();
  });

  it('fetchContextConditions', () => {
    const spy = jest.spyOn(api, 'queryOffline').mockImplementation();
    fetchContextConditions();

    expect(spy).toHaveBeenCalled();
  });
});
