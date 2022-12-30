// @flow

import * as NavigationModes from './NavigationModes';

export class NavigationActions {
  entity: string;
  id: ?string;
  mode: string;
  parentID: ?string;
  componentName: ?string;
  presentationMode: ?string;
  params: ?any;

  // $FlowIgnore
  static tab({ entity }): NavigationActions {
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
  }): NavigationActions {
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
  static details({ id, mode, presentationMode, params }): NavigationActions {
    let actions = new NavigationActions();

    actions.id = id;
    actions.mode = mode ? mode : NavigationModes.VIEW_MODE;
    actions.presentationMode = presentationMode;
    actions.params = params;

    return actions;
  }
}
