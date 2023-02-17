import { NavigationActions } from './NavigationActions';

describe('NavigationActions', () => {
  it('tab', () => {
    const tabData = NavigationActions.tab({ entity: 'entity' });
    expect(tabData).toEqual({ entity: 'entity', mode: 'tab' });
  });
  it('new', () => {
    const newData = NavigationActions.new({
      entity: 'entity',
      componentName: null,
      params: null,
      parentID: 'parentID',
      presentationMode: null,
    });
    expect(newData).toEqual({
      entity: 'entity',
      componentName: null,
      id: undefined,
      params: null,
      parentID: 'parentID',
      presentationMode: null,
      mode: 'new',
    });
  });
  it('details', () => {
    const detailsData = NavigationActions.details({
      id: 'id',
      mode: 'view',
      params: null,
      presentationMode: null,
    });
    expect(detailsData).toEqual({
      id: 'id',
      mode: 'view',
      params: null,
      presentationMode: null,
    });
  });
  it('details no mode', () => {
    const detailsData = NavigationActions.details({
      id: 'id',
      mode: null,
      params: null,
      presentationMode: null,
    });
    expect(detailsData).toEqual({
      id: 'id',
      mode: 'view',
      params: null,
      presentationMode: null,
    });
  });
});
