import { sfNetAPI } from "oce-apps-bridges";

export const fetchNbcData = ({
  filterQuery,
  limit,
  offset,
  sortColumn,
  sortDirection,
  territoryName
}) => {
  const defaultCols =
    "Id, OCE__Account__r.Id, OCE__Account__r.Name, OCE__Account__r.OCE__CountryCode__c, OCE__Account__r.OCE__PrimaryAccountAddress__r.OCE__Address__r.OCE__DisplayAddress__c, OCE__NbcData__c, OCE__TotalScore__c, OCE__Account__r.OCE__Specialty__c, OCE__Account__r.OCE__ParentAccount__r.Name,";
  const cols =
    "OCE__Account__r.OCE__PrimaryAccountAddress__r.OCE__SampleEligibilityStatus__c, OCE__Account__r.OCE__PrimaryAccountAddress__r.OCE__BestTime__c, OCE__Account__r.LastName, OCE__Rank__c";

  const filterTerritory = `OCE__Territory__c = '${territoryName}'`;
  const filter = filterQuery
    ? `WHERE ${filterTerritory} And OCE__Account__r.Name LIKE '%${filterQuery}%'`
    : `WHERE ${filterTerritory}`;

  const query = `SELECT ${defaultCols} ${cols} FROM OCE__NextBestCustomer__c ${filter} ORDER BY ${sortColumn.accessor} ${sortDirection} LIMIT ${limit} OFFSET ${offset}`;

  return sfNetAPI.query(query);
};

export const fetchNbcDataCount = ({ filterQuery, territoryName }) => {
  const filterTerritory = `OCE__Territory__c = '${territoryName}'`;
  const filter = filterQuery
    ? `WHERE ${filterTerritory} And OCE__Account__r.Name LIKE '%${filterQuery}%'`
    : `WHERE ${filterTerritory}`;

  return sfNetAPI.query(
    `SELECT count() FROM OCE__NextBestCustomer__c ${filter}`
  );
};

export const fetchNbcHistory = parentId => {
  const cols = "CreatedDate,Id,NewValue,OldValue";
  const filter = `ParentId = '${parentId}'`;

  return sfNetAPI.query(
    `SELECT ${cols} FROM OCE__NextBestCustomer__History WHERE ${filter} ORDER BY CreatedDate ASC`
  );
};
