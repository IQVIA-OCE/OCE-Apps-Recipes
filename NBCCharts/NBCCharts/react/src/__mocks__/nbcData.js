export const NBC_DATA = {
  records: [
    {
      Id: "1",
      OCE__Rank__c: 10,
      attributes: {
        type: "OCE__NextBestCustomer__c",
        url:
          "/services/data/v43.0/sobjects/OCE__NextBestCustomer__c/a1j2D000000MNHhQAO"
      },
      OCE__TotalScore__c: 0,
      OCE__NbcData__c:
        '{"scores":{"isTarget":0,"recentlyCalled":0},"metrics":{"isTarget":false,"recentlyCalled":"DATA_NOT_AVAILABLE"},"customLabels":{}}',
      index: 0,
      OCE__Account__r: {
        Id: "1",
        Name: "Account Name 1",
        OCE__CountryCode__c: "testAccountCode 1",
        OCE__PrimaryAccountAddress__r: {
          OCE__Address__r: {
            OCE__DisplayAddress__c: "Account Address 1"
          }
        }
      }
    },
    {
      Id: "2",
      OCE__Rank__c: 10,
      attributes: {
        type: "OCE__NextBestCustomer__c",
        url:
          "/services/data/v43.0/sobjects/OCE__NextBestCustomer__c/a1j2D000000MNHhQAO"
      },
      OCE__TotalScore__c: 0,
      OCE__NbcData__c:
        '{"scores":{"isTarget":0,"recentlyCalled":0},"metrics":{"isTarget":false,"recentlyCalled":"DATA_NOT_AVAILABLE"},"customLabels":{}}',
      index: 1,
      OCE__Account__r: {
        Id: "1",
        Name: "Account Name 2",
        OCE__CountryCode__c: "testAccountCode 2",
        OCE__PrimaryAccountAddress__r: {
          OCE__Address__r: {
            OCE__DisplayAddress__c: "Account Address 2"
          }
        }
      }
    }
  ]
};

export const NBC_COUNT_DATA = {
  totalSize: 100
};

export const DEFAULT_QUERY_PARAMS = {
  filterQuery: "",
  limit: 20,
  offset: 0,
  sortColumn: {
    accessor:
      "OCE__Account__r.OCE__PrimaryAccountAddress__r.OCE__SampleEligibilityStatus__c",
    id: "SampleEligibility",
    isSortable: true,
    title: "Sample eligibility"
  },
  territoryName: "Territory",
  sortDirection: "asc"
};

export const NBC_HISTORY_DATA = {
  records: [
    {
      Id: "0171e00005x4KvkAAE",
      CreatedDate: "2022-08-28T07:06:57.000",
      NewValue: "50",
      OldValue: "51"
    },
    {
      Id: "0171e00005x4KvkAAM",
      CreatedDate: "2022-08-29T07:06:57.000",
      NewValue: "42",
      OldValue: "43"
    },
  ]
};
