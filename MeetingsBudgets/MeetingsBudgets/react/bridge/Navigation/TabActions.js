// @flow

export class TabActions {
  tabName: string;
  sObjectName: string;
  recordID: string;
  isModal: boolean = false;

  // $FlowIgnore
  get action(): string {
    // $FlowIgnore
    return this._action;
  }

  // $FlowIgnore
  set action(val: string) {
    // $FlowIgnore
    this._quickAction = '';
    // $FlowIgnore
    this._action = val;
  }

  // $FlowIgnore
  get quickAction(): string {
    // $FlowIgnore
    return this._quickAction;
  }

  // $FlowIgnore
  set quickAction(val: string) {
    // $FlowIgnore
    this._action = '';
    // $FlowIgnore
    this._quickAction = val;
  }
}

export class QueryParameters {
  uid: string;
  productIDs: Array<string> = [];
}
