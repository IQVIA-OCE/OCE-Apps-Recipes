// @flow

import { NativeModules } from 'react-native';
import { TabActions, QueryParameters } from './TabActions';

import * as NavigationModes from './NavigationModes';
import { NavigationActions } from './NavigationActions';
import { tabFormatter } from './TabActionsFormatter';

class ScreenNavigator {
  getTabsInfo(): Promise<Array<Object>> {
    return NativeModules.TabItemsFlowHandler.tabItems();
  }

  openTab(name: string): Promise<Object> {
    const tabActions = new TabActions();
    tabActions.tabName = name;

    const path = tabFormatter.navigationPath(tabActions, new QueryParameters());

    return this.openDeeplink(path);
  }

  openDeeplink(path: string): Promise<Object> {
    return NativeModules.TabItemsFlowHandler.navigate(path);
  }

  dispatch(actions: NavigationActions): Promise<Object> {
    switch (actions.mode) {
      case NavigationModes.NEW_MODE:
        return NativeModules.FlowHandler.navigateToNew(
          actions.entity,
          actions.id,
          actions.parentID,
          actions.componentName,
          actions.presentationMode
        );

      case NavigationModes.EDIT_MODE:
      case NavigationModes.VIEW_MODE:
        return NativeModules.FlowHandler.navigateToDetails(
          actions.id,
          actions.presentationMode
        );

      default:
        return new Promise((resolve, reject) => {
          reject(
            'Incorrect mode in navigation actions parameter. Check your code.'
          );
        });
    }
  }
}

export const navigator: ScreenNavigator = new ScreenNavigator();
