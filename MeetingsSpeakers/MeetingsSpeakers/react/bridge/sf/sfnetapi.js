// @flow

import { NativeModules } from 'react-native';
const SFNetReactBridge = NativeModules.SFNetReactBridge;
import { environment } from '../EnvironmentData/EnvironmentData.native';
import { exec as forceExec } from './react.force.common';

type SuccessCallback = (value: any) => void;
type ErrorCallback = (error: Error | null) => void;

class SFNetAPI {
  apiVersion: string = environment.sfApiVersion();
  usePromises: boolean;

  /**
   * Set apiVersion to be used
   */
  setApiVersion(version: string) {
    this.apiVersion = version;
  }

  /**
   * Return apiVersion used
   */
  getApiVersion(): string {
    return this.apiVersion;
  }

  /**
   * Send arbitray force.com request
   */
  sendRequest(
    endPoint: string,
    path: string,
    successCB: SuccessCallback,
    errorCB: ErrorCallback,
    method: ?string,
    payload: ?any,
    headerParams: ?any,
    fileParams: ?any,
    returnBinary: ?any,
    doesNotRequireAuthentication: ?any
  ): void {
    method = method || 'GET';
    payload = payload || {};
    headerParams = headerParams || {};
    fileParams = fileParams || {}; // File params expected to be of the form: {<fileParamNameInPost>: {fileMimeType:<someMimeType>, fileUrl:<fileUrl>, fileName:<fileNameForPost>}}
    returnBinary = !!returnBinary;
    doesNotRequireAuthentication = !!doesNotRequireAuthentication;
    const args = {
      endPoint,
      path,
      method,
      queryParams: payload,
      headerParams,
      fileParams,
      returnBinary,
      doesNotRequireAuthentication,
    };
    forceExec(
      'SFNetReactBridge',
      SFNetReactBridge,
      successCB,
      errorCB,
      'sendRequest',
      args
    );
  }

  /*
   * Lists summary information about each Salesforce.com version currently
   * available, including the version, label, and a link to each version's
   * root.
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  //export const versions = (callback, error) => sendRequest('/services/data', '/', callback, error);

  /*
   * Lists available resources for the client's API version, including
   * resource name and URI.
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  //export const resources = (callback, error) => sendRequest('/services/data', `/${apiVersion}/`, callback, error);

  /*
   * Lists the available objects and their metadata for your organization's
   * data.
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  describeGlobal(callback: SuccessCallback, error: ErrorCallback) {
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/sobjects/`,
      callback,
      error
    );
  }

  /*
   * Describes the individual metadata for the specified object.
   * @param objtype object type; e.g. "Account"
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  metadata(objtype: string, callback: SuccessCallback, error: ErrorCallback) {
    if (this.usePromises) {
    }
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/sobjects/${objtype}/`,
      callback,
      error
    );
  }

  /*
   * Completely describes the individual metadata at all levels for the
   * specified object.
   * @param objtype object type; e.g. "Account"
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  describe(objtype: string, callback: SuccessCallback, error: ErrorCallback) {
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/sobjects/${objtype}/describe/`,
      callback,
      error
    );
  }

  /*
   * Fetches the layout configuration for a particular sobject type and record type id.
   * @param objtype object type; e.g. "Account"
   * @param (Optional) recordTypeId Id of the layout's associated record type
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  describeLayout(
    objtype: string,
    recordTypeId: string,
    callback: SuccessCallback,
    error: ErrorCallback
  ): void {
    recordTypeId = recordTypeId ? recordTypeId : '';
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/sobjects/${objtype}/describe/layouts/${recordTypeId}`,
      callback,
      error
    );
  }

  /*
   * Creates a new record of the given type.
   * @param objtype object type; e.g. "Account"
   * @param fields an object containing initial field names and values for
   *               the record, e.g. {:Name "salesforce.com", :TickerSymbol
   *               "CRM"}
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  create(
    objtype: string,
    fields: any,
    callback: SuccessCallback,
    error: ErrorCallback
  ): void {
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/sobjects/${objtype}/`,
      callback,
      error,
      'POST',
      fields
    );
  }

  /*
   * Retrieves field values for a record of the given type.
   * @param objtype object type; e.g. "Account"
   * @param id the record's object ID
   * @param [fields=null] optional comma-separated list of fields for which
   *               to return values; e.g. Name,Industry,TickerSymbol
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  retrieve(
    objtype: string,
    id: string,
    fieldlist: any,
    callback: SuccessCallback,
    error: ErrorCallback
  ): void {
    if (arguments.length == 4) {
      error = callback;
      callback = fieldlist;
      fieldlist = null;
    }
    const fields = fieldlist ? { fields: fieldlist } : null;
    return this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/sobjects/${objtype}/${id}`,
      callback,
      error,
      'GET',
      fields
    );
  }

  /*
   * Upsert - creates or updates record of the given type, based on the
   * given external Id.
   * @param objtype object type; e.g. "Account"
   * @param externalIdField external ID field name; e.g. "accountMaster__c"
   * @param externalId the record's external ID value
   * @param fields an object containing field names and values for
   *               the record, e.g. {:Name "salesforce.com", :TickerSymbol
   *               "CRM"}
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  upsert(
    objtype: string,
    externalIdField: string,
    externalId: string,
    fields: any,
    callback: SuccessCallback,
    error: ErrorCallback
  ): void {
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/sobjects/${objtype}/${externalIdField}/${externalId}`,
      callback,
      error,
      externalId ? 'PATCH' : 'POST',
      fields
    );
  }
  /*
   * Updates field values on a record of the given type.
   * @param objtype object type; e.g. "Account"
   * @param id the record's object ID
   * @param fields an object containing initial field names and values for
   *               the record, e.g. {:Name "salesforce.com", :TickerSymbol
   *               "CRM"}
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  update(
    objtype: string,
    id: string,
    fields: any,
    callback: SuccessCallback,
    error: ErrorCallback
  ): void {
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/sobjects/${objtype}/${id}`,
      callback,
      error,
      'PATCH',
      fields
    );
  }

  /*
   * Deletes a record of the given type. Unfortunately, 'delete' is a
   * reserved word in JavaScript.
   * @param objtype object type; e.g. "Account"
   * @param id the record's object ID
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  del(
    objtype: string,
    id: string,
    callback: SuccessCallback,
    error: ErrorCallback
  ): void {
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/sobjects/${objtype}/${id}`,
      callback,
      error,
      'DELETE'
    );
  }

  /*
   * Executes the specified SOQL query.
   * @param soql a string containing the query to execute - e.g. "SELECT Id,
   *             Name from Account ORDER BY Name LIMIT 20"
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  query(soql: string, callback: SuccessCallback, error: ErrorCallback): void {
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/query`,
      callback,
      error,
      'GET',
      { q: soql }
    );
  }

  /*
   * Queries the next set of records based on pagination.
   * <p>This should be used if performing a query that retrieves more than can be returned
   * in accordance with http://www.salesforce.com/us/developer/docs/api_rest/Content/dome_query.htm</p>
   * @param url - the url retrieved from nextRecordsUrl or prevRecordsUrl
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  queryMore(
    url: string,
    callback: SuccessCallback,
    error: ErrorCallback
  ): void {
    // $FlowIgnore
    const pathFromUrl = url.match(/https:\/\/[^/]*(.*)/)[1];
    this.sendRequest('', pathFromUrl, callback, error);
  }

  /*
   * Executes the specified SOSL search.
   * @param sosl a string containing the search to execute - e.g. "FIND
   *             {needle}"
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  search(sosl: string, callback: SuccessCallback, error: ErrorCallback): void {
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/search`,
      callback,
      error,
      'GET',
      { q: sosl }
    );
  }

  /*
   * Merges few requests to one composite request
   * @param requests Array of subrequests to execute.
   * @param refIds Array of reference id for the requests (should have the same number of element than requests)
   * @param allOrNone Specifies what to do when an error occurs while processing a subrequest.
   * @see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_composite.htm
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  composite(
    requests: Array<any>,
    refIds: Array<any>,
    allOrNone: any,
    callback: SuccessCallback,
    error: ErrorCallback
  ): void {
    const args = { requests, refIds, allOrNone };
    forceExec(
      'SFNetReactBridge',
      SFNetReactBridge,
      callback,
      error,
      'compositeRequests',
      args
    );
  }

  /*
   * Runs apex request
   * @param method sets the http method
   * @param endPoint sets the path ending
   * @param namespace sets the namespace
   * @param params sets the additional query params
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */
  apexRest(
    method: string,
    endPoint: string,
    namespace: string,
    params: any,
    callback: SuccessCallback,
    error: ErrorCallback
  ): void {
    const args = { method, endPoint, namespace, params };
    forceExec(
      'SFNetReactBridge',
      SFNetReactBridge,
      callback,
      error,
      'apexRestWithMethod',
      args
    );
  }

  /*
   * Gets the report by id
   * @param reportId sets the id of report
   * @param callback function to which response will be passed
   * @param [error=null] function called in case of error
   */

  report(
    reportId: string,
    callback: SuccessCallback,
    error: ErrorCallback
  ): void {
    this.sendRequest(
      '/services/data',
      `/${this.apiVersion}/analytics/reports/${reportId}`,
      callback,
      error,
      'GET'
    );
  }
}

export const sfNetAPI: SFNetAPI = new SFNetAPI();
