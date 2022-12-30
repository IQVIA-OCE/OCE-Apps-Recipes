//      

export const NavigationModes = {
    NEW_MODE: 'new',
    VIEW_MODE: 'view',
    EDIT_MODE: 'edit'
}
export const NEW_MODE = 'new';
export const VIEW_MODE = 'view';
export const EDIT_MODE = 'edit';

export class NavigationActions {
  entity        ;
  id         ;
  mode        ;
  parentID         ;
  componentName         ;
  presentationMode         ;
  params      ;

  // $FlowIgnore
  static tab({ entity })                    {
    let actions = new NavigationActions();

    actions.entity = entity;
    actions.mode = 'tab';

    return actions;
  }

  // $FlowIgnore
  static new({
    entity,
    uid,
    parentID,
    componentName,
    presentationMode,
    params,
  })                    {
    let actions = new NavigationActions();

    actions.mode = NavigationModes.NEW_MODE;
    actions.entity = entity;
    actions.id = uid;
    actions.parentID = parentID;
    actions.componentName = componentName;
    actions.presentationMode = presentationMode;
    actions.params = params;

    return actions;
  }

  // $FlowIgnore
  static details({ id, mode, presentationMode, params })                    {
    let actions = new NavigationActions();

    actions.id = id;
    actions.mode = mode ? mode : NavigationModes.VIEW_MODE;
    actions.presentationMode = presentationMode;
    actions.params = params;

    return actions;
  }
}
