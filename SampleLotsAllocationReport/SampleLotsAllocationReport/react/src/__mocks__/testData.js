
export const testSamplesLotReportRecords = [{
  AllocatedQuantity__c: 0,
  Id: "a5HO00000003q6RMAQ",
  LotProductId__c: "a4sO0000000S0cnIAC",
  Lot__c: "a3UO00000012GkjMAE",
  RemainingQuantity__c: 0,
  Lot__r: {
    Name: "6549-1",
    Product__r: {
      Name: "ADRAVIL TAB 20 MG Sign",
      attributes: { type: 'Product__c', url: '/services/data/v50.0/sobjects/Product__c/a4sO0000000S0cnIAC' }
    },
    attributes: {
      type: "Lot__c",
      url: "/services/data/v50.0/sobjects/Lot__c/a3UO00000012GkjMAE"
    },
    User__r: {
      Name: "DISTRICTMANAGER DISTRICTMANAGER",
      attributes: {
        type: "User",
        url: "/services/data/v50.0/sobjects/User/0052v00000d4KOkAAM"
      }
    },
    attributes: {
      type: "SampleLotAllocation__c",
      url: "/services/data/v50.0/sobjects/SampleLotAllocation__c/a5HO00000003q6RMAQ"
    }
  }
}, {
  AllocatedQuantity__c: 0,
  LotProductId__c: "a4sO0000000S0cnIAC",
  Lot__c: "a3UO00000012GkjMAE",
  RemainingQuantity__c: 0,
  Lot__r: {
    Product__r: {
      Name: "ADRAVIL TAB 20 MG Sign",
      attributes: { type: 'Product__c', url: '/services/data/v50.0/sobjects/Product__c/a4sO0000000S0cnIAC' }
    },
    attributes: {
      type: "Lot__c",
      url: "/services/data/v50.0/sobjects/Lot__c/a3UO00000012GkjMAE"
    },
    User__r: {
      Name: "DISTRICTMANAGER DISTRICTMANAGER",
      attributes: {
        type: "User",
        url: "/services/data/v50.0/sobjects/User/0052v00000d4KOkAAM"
      }
    },
    attributes: {
      type: "SampleLotAllocation__c",
      url: "/services/data/v50.0/sobjects/SampleLotAllocation__c/a5HO00000003q6RMAQ"
    }
  }
}, {
  AllocatedQuantity__c: 0,
  Id: "a5HO00000003q6SMAQ",
  LotProductId__c: "a4sO0000000S0cbIA",
  Lot__c: "a3UO00000012GkkMAE",
  RemainingQuantity__c: 0,
  Lot__r: {
    Name: "6549-2",
    Product__r: {
      Name: 'PROZALAND 5 MCG 10 Physical',
      attributes: { type: 'Product__c', url: '/services/data/v50.0/sobjects/Product__c/a4sO0000000S0cbIA' }
    },
    attributes: {
      type: "Lot__c",
      url: "/services/data/v50.0/sobjects/Lot__c/a3UO00000012GkFMAU"
    },
    User__r: {
      Name: "DISTRICTMANAGER DISTRICTMANAGER",
      attributes: {
        type: "User",
        url: "/services/data/v50.0/sobjects/User/0052v00000d4KOkAAM"
      }
    },
    attributes: {
      type: "SampleLotAllocation__c",
      url: "/services/data/v50.0/sobjects/SampleLotAllocation__c/a5HO00000003q6RMAQ"
    }
  }
}]

export const testEmptyRecords = [
  {
    AllocatedQuantity__c: "",
    Id: "",
    LotProductId__c: "",
    Lot__c: "",
    RemainingQuantity__c: "",
    Lot__r: {
      Name: '',
      Product__r: {
        Name: '',
        attributes: { type: '', url: '' }
      },
      attributes: {
        type: "",
        url: ""
      },
      User__r: {
        Name: "",
        attributes: {
          type: "",
          url: ""
        }
      },
      attributes: {
        type: "",
        url: ""
      }
    }
  },
];


export const testTransactionRecords = [{
  Id: "a5KO00000004ZGCMA2",
  LotNumber__r: {
    Name: "B-020-90-1",
    attributes: {
      type: "Lot__c",
      url: "/services/data/v50.0/sobjects/Lot__c/a3UO00000009x20MAA"
    }
  },
  Product__c: "a4sO00000000sZRIAY",
  Product__r: {
    Name: "Alodox 300 MG",
    attributes: {
      type: "Product__c",
      url: "/services/data/v50.0/sobjects/Product__c/a4sO00000000sZRIAY"
    }
  },
  Quantity__c: 15,
  SampleTransaction__c: "a5LO000000054EbMAI",
  SampleTransaction__r: {
    Call__c: "a2KO000000I7EXOMA3",
    Call__r: {
      Account__c: "001O000001keIX7IAM",
      Account__r: {
        Name: "BRIAN PAT __OLOFSSON",
        attributes: {
          type: "Account",
          url: "/services/data/v50.0/sobjects/Account/001O000001keIX7IAM"
        }
      },
      Name: "C-00000010",
      attributes: {
        type: "Call__c",
        url: "/services/data/v50.0/sobjects/Call__c/a2KO000000I7EXOMA3"
      }
    },
    RecordType: {
      DeveloperName: "Disbursement",
      attributes: {
        type: "RecordType",
        url: "/services/data/v50.0/sobjects/RecordType/012O0000000XndnIAC"
      }
    },
    Status__c: "Submitted",
    TransactionDateTime__c: "2022-01-19T15:12:38.000+0000",
    attributes: {
      type: "SampleTransaction__c",
      url: "/services/data/v50.0/sobjects/SampleTransaction__c/a5LO000000054EbMAI"
    }
  },
  attributes: {
    type: "SampleTransactionDetail__c",
    url: "/services/data/v50.0/sobjects/SampleTransactionDetail__c/a5KO00000004ZGCMA2"
  }
}, {
  Id: "a5KO00000004ZHjMAM",
  LotNumber__r: {
    Name: "B-020-90-1",
    attributes: {
      type: "Lot__c",
      url: "/services/data/v50.0/sobjects/Lot__c/a3UO00000009x20MAA"
    }
  },
  Product__c: "a4sO00000000sZRIAY",
  Product__r: {
    Name: "Alodox 300 MG",
    attributes: {
      type: "Product__c",
      url: "/services/data/v50.0/sobjects/Product__c/a4sO00000000sZRIAY"
    }
  },
  Quantity__c: 3,
  SampleTransaction__c: "a5LO000000054HpMAI",
  SampleTransaction__r: {
    Call__c: "a2KO000000I7KcMMAV",
    Call__r: {
      Account__c: "001O000001keIYIIA2",
      Account__r: {
        Name: "CHARLES DAVID _KALENOWSKI",
        attributes: {
          type: "Account",
          url: "/services/data/v50.0/sobjects/Account/001O000001keIX7IAM"
        }
      },
      Name: "C-00000015",
      attributes: {
        type: "Call__c",
        url: "/services/data/v50.0/sobjects/Call__c/a2KO000000I7KcMMAV"
      }
    },
    RecordType: {
      DeveloperName: "Disbursement",
      attributes: {
        type: "RecordType",
        url: "/services/data/v50.0/sobjects/RecordType/012O0000000XndnIAC"
      }
    },
    Status__c: "Submitted",
    TransactionDateTime__c: "2022-01-25T13:13:01.000+0000",
    attributes: {
      type: "SampleTransaction__c",
      url: "/services/data/v50.0/sobjects/SampleTransaction__c/a5LO000000054HpMAI"
    }
  },
  attributes: {
    type: "SampleTransactionDetail__c",
    url: "/services/data/v50.0/sobjects/SampleTransactionDetail__c/a5KO00000004ZHjMAM"
  }
}]

export const testEmptyTransactionRecords = [{
  Id: "",
  LotNumber__r: {
    Name: "",
    attributes: {
      type: "",
      url: ""
    }
  },
  Product__r: {
    Name: "",
    attributes: {
      type: "",
      url: ""
    }
  },
  Quantity__c: "",
  SampleTransaction__c: "",
  SampleTransaction__r: {
    Call__c: "",
    Call__r: {
      Name: "",
      Account__r: {
        Name: "",
        attributes: {
          type: "",
          url: ""
        }
      }
    },
    RecordType: {
      DeveloperName: "",
      attributes: {
        type: "",
        url: ""
      }
    },
    Status__c: "",
    TransactionDateTime__c: "",
    attributes: {
      type: "",
      url: ""
    }
  },
  attributes: {
    type: "",
    url: ""
  }
}]

export const mappedReports = [{
  productId: 'a4sO0000000S0cnIAC',
  productName: "ADRAVIL TAB 20 MG Sign",
  childRows: [{
    reportId: "a5HO00000003q6RMAQ",
    lotName: '6549-1',
    allocatedQuantity: 0,
    remainingQuantity: 0
  }, {
    reportId: "",
    lotName: '',
    allocatedQuantity: 0,
    remainingQuantity: 0
  }],
  isGrouped: true,
}, {
  productId: 'a4sO0000000S0cbIA',
  productName: 'PROZALAND 5 MCG 10 Physical',
  childRows: [{
    reportId: "a5HO00000003q6SMAQ",
    lotName: '6549-2',
    allocatedQuantity: 0,
    remainingQuantity: 0
  }],
  isGrouped: true,
}]

export const mappedTransactions = [{
  product: {
    sObject: 'Product__c',
    value: 'a4sO00000000sZRIAY',
    name: 'Alodox 300 MG'
  },
  recordType: 'Disbursement',
  callSample: "",
  transactionDate: {
    type: 'date',
    value: '2022-01-19T15:12:38.000+0000'
  },
  status: 'Submitted',
  quantity: 15,
  call: {
    sObject: `Call__c`,
    value: 'a2KO000000I7EXOMA3',
    name: 'C-00000010'
  }
}, {
  product: {
    sObject: 'Product__c',
    value: 'a4sO00000000sZRIAY',
    name: 'Alodox 300 MG',
  },
  recordType: 'Disbursement',
  callSample: "",
  transactionDate: {
    type: 'date',
    value: '2022-01-25T13:13:01.000+0000',
  },
  status: 'Submitted',
  quantity: 3,
  call: {
    sObject: `Call__c`,
    value: 'a2KO000000I7KcMMAV',
    name: 'C-00000015'
  }
}]

export const mappedEmptyTransactions = [
  {
    product: {
      sObject: 'Product__c',
      value: '',
      name: '',
    },
    recordType: '',
    callSample: "",
    transactionDate: {
      type: 'date',
      value: ''
    },
    status: '',
    quantity: '',
    call: {
      sObject: 'Call__c',
      value: '',
      name: ''
    }
  }
];

export const mappedEmptyReports = [{
  productId: '',
  productName: "",
  childRows: [{
    reportId: "",
    lotName: '',
    allocatedQuantity: "",
    remainingQuantity: ""
  }],
  isGrouped: true
}]


export const testProductAllocationData = [{
  AllocatedQuantity__c: null,
  AllocationsRemaining__c: null,
  AllocationsUsed__c: 0,
  Id: "a4rO00000000SdPIAU",
  MaxLimitPerCall__c: null,
  PlanCycle__c: null,
  PlanCycle__r: {
    EndDate__c: "2022-03-31",
    StartDate__c: "2022-03-01",
    attributes: {
      type: "PlanCycle__c",
      url: "/services/data/v50.0/sobjects/PlanCycle__c/a4WO00000000yC1MAI"
    }
  },
  Product__c: "a4sO00000000sZPIAY",
  Product__r: {
    Name: "Alodox 100 MG",
    ParentProduct__c: "a5D0T0000004prJUAQ",
    ParentProduct__r: {
      Name: "B:Alodox"
    },
    attributes: {
      type: "Product__c",
      url: "/services/data/v50.0/sobjects/Product__c/a4sO00000000sZPIAY",
    }
  },
  attributes: {
    type: "ProductTerritoryAllocation__c",
    url: "/services/data/v50.0/sobjects/ProductTerritoryAllocation__c/a4rO00000000SdPIAU"
  }
}, {
  AllocatedQuantity__c: null,
  AllocationsRemaining__c: null,
  AllocationsUsed__c: 0,
  Id: "a4rO00000000SdPIAU",
  MaxLimitPerCall__c: null,
  PlanCycle__c: null,
  PlanCycle__r: {
    EndDate__c: "2022-03-31",
    Name: "TM - SPC - Aurora 20A02T06 - 2022-03-01 - 2022-03-31",
    StartDate__c: "2022-03-01",
    Period__r: {
      StartDate__c: "2022-03-31",
      EndDate__c: "2022-03-01",
    },
    attributes: {
      type: "PlanCycle__c",
      url: "/services/data/v50.0/sobjects/PlanCycle__c/a4WO00000000yC1MAI"
    }
  },
  Product__c: "a4sO00000000sZPIAY",
  Product__r: {
    ParentProduct__c: "a5D0T0000004prJUAQ",
    ParentProduct__r: {
      Name: "B:Alodox"
    },
    attributes: {
      type: "Product__c",
      url: "/services/data/v50.0/sobjects/Product__c/a4sO00000000sZPIAY",
    }
  },
  attributes: {
    type: "ProductTerritoryAllocation__c",
    url: "/services/data/v50.0/sobjects/ProductTerritoryAllocation__c/a4rO00000000SdPIAU"
  }
}, {
  AllocatedQuantity__c: null,
  AllocationsRemaining__c: null,
  AllocationsUsed__c: 0,
  Id: "a4rO00000000SdZIAU",
  MaxLimitPerCall__c: null,
  PlanCycle__c: null,
  PlanCycle__r: {
    EndDate__c: "2022-03-31",
    Name: "TM - SPC - Aurora 20A02T06 - 2022-03-01 - 2022-03-31",
    StartDate__c: "2022-03-01",
    attributes: {
      type: "PlanCycle__c",
      url: "/services/data/v50.0/sobjects/PlanCycle__c/a4WO00000000yC1MAI"
    }
  },
  Product__c: "a4sO0000000S0dCIAS",
  Product__r: {
    Name: "Azelastine 100 MG",
    ParentProduct__c: "a5D0T0000004pr0UAA",
    ParentProduct__r: {
      Name: "B:Azelastine"
    },
    attributes: {
      type: "Product__c",
      url: "/services/data/v50.0/sobjects/Product__c/a4sO0000000S0dCIAS"
    },
    attributes: {
      type: "ProductTerritoryAllocation__c",
      url: "/services/data/v50.0/sobjects/ProductTerritoryAllocation__c/a4rO00000000SdZIAU"
    }
  }
}]
export const testProductAllocationEmptyData = [{
  AllocatedQuantity__c: '',
  AllocationsRemaining__c: 0,
  AllocationsUsed__c: 0,
  Id: "",
  MaxLimitPerCall__c: 0,
  PlanCycle__c: null,
  PlanCycle__r: {
    EndDate__c: "",
    Name: "",
    StartDate__c: "",
    attributes: {
      type: "",
      url: ""
    }
  },
  Product__c: "",
  Product__r: {
    ParentProduct__c: "",
    ParentProduct__r: {
      Name: ""
    },
    Name: "",
    attributes: {
      type: "",
      url: "",
    }
  },
  attributes: {
    type: "",
    url: ""
  }
}]

export const mappedProductAllocationData = [{
  productId: 'a5D0T0000004prJUAQ',
  productName: 'B:Alodox',
  childRows: [{
    product: 'Alodox 100 MG',
    id: "a4sO00000000sZPIAY",
    planCycle: "",
    startDate: "",
    endDate: "",
    allocatedQuantity: 0,
    maxLimitPerCall: 0,
    allocationsUsed: 0,
    allocationsRemaining: 0,
  }, {
    product: '',
    id: "a4sO00000000sZPIAY",
    planCycle: "TM - SPC - Aurora 20A02T06 - 2022-03-01 - 2022-03-31",
    startDate: "2022-03-31",
    endDate: "2022-03-01",
    allocatedQuantity: 0,
    maxLimitPerCall: 0,
    allocationsUsed: 0,
    allocationsRemaining: 0,
  }],
  isGrouped: true

}, {
  productId: 'a5D0T0000004pr0UAA',
  productName: 'B:Azelastine',
  childRows: [{
    product: 'Azelastine 100 MG',
    planCycle: "TM - SPC - Aurora 20A02T06 - 2022-03-01 - 2022-03-31",
    id: "a4sO0000000S0dCIAS",
    startDate: "",
    endDate: "",
    allocatedQuantity: 0,
    maxLimitPerCall: 0,
    allocationsUsed: 0,
    allocationsRemaining: 0
  }],
  isGrouped: true

}];

export const emptyProductAllocations = [{
  productId: '',
  productName: '',
  childRows: [{
    product: '',
    planCycle: "",
    startDate: "",
    endDate: "",
    id: "",
    allocatedQuantity: 0,
    maxLimitPerCall: 0,
    allocationsUsed: 0,
    allocationsRemaining: 0
  }],
  isGrouped: true
}]

export const testProductAllocationDetailData = [{
  Account__c: "001O000001keIXQIA2",
  Account__r: {
    Name: "ANGELO MIELE",
    attributes: {
      type: "Account",
      url: "/services/data/v50.0/sobjects/Account/001O000001keIXQIA2"
    }
  },
  Call__r: {
    Account__r: {
      Name: "ANGELO MIELE",
      attributes: {
        type: "Account",
        url: "/services/data/v50.0/sobjects/Account/001O000001keIXQIA2"
      },

      Date__c: null,
      Status__c: "Draft",

      attributes: { url: '/services/data/v50.0/sobjects/Call__c/a2KO000000I6wEcMAJ', type: 'Call__c' }
    },
  },
  DateShipped__c: null,
  FinalQuantity__c: 6,
  Id: "a2GO0000001dDZXMA2",
  Product__c: "a4sO00000000sXyIAI",
  Product__r: {
    Name: "B:Alodox",
    attributes: {
      type: "Product__c",
      url: "/services/data/v50.0/sobjects/Product__c/a4sO00000000sXyIAI"
    }
  },
  QuantityShipped__c: null,
  Quantity__c: 6,
  Sample__c: "a4sO00000000sarIAA",
  Sample__r: {
    Name: "Alodox 400 MG",
    attributes: {
      type: "Product__c",
      url: "/services/data/v50.0/sobjects/Product__c/a4sO00000000sarIAA"
    }
  },
  attributes: {
    type: "CallSampleOrder__c",
    url: "/services/data/v50.0/sobjects/CallSampleOrder__c/a2GO0000001dDZXMA2"
  }
}, {
  Account__c: "null",
  Account__r: null,
  Call__r: {
    Account__r: {
      Name: "ADAM DAVID STEIN",
      attributes: {
        type: "Account",
        url: "/services/data/v50.0/sobjects/Account/001O000001keIaOIAU"
      },

      Date__c: null,
      Status__c: "Draft",

      attributes: { url: '/services/data/v50.0/sobjects/Call__c/a2KO000000I6bvLMAR', type: 'Call__c' }
    },
  },
  DateShipped__c: null,
  FinalQuantity__c: 2,
  Id: "a2GO0000001dDgPMAU",
  Product__c: null,
  Product__r: null,
  QuantityShipped__c: null,
  Quantity__c: 2,
  Sample__c: "a4sO00000000sarIAA",
  Sample__r: {
    Name: "Alodox 400 MG",
    attributes: {
      type: "Product__c",
      url: "/services/data/v50.0/sobjects/Product__c/a4sO00000000sarIAA"
    }
  },
  attributes: {
    type: "CallSampleOrder__c",
    url: '/services/data/v50.0/sobjects/CallSampleOrder__c/a2GO0000001dDgPMAU'
  }
}]


export const emptyTestProductAllocationDetailData = [{
  Account__c: "",
  Account__r: {
    Name: "",
    attributes: {
      type: "",
      url: ""
    }
  },
  Call__r: {
    Account__r: {
      Name: "",
      attributes: {
        type: "",
        url: ""
      },

      Date__c: null,
      Status__c: "",

      attributes: { url: '', type: '' }
    },
  },
  DateShipped__c: null,
  FinalQuantity__c: 6,
  Id: "",
  Product__c: "",
  Product__r: {
    Name: "",
    attributes: {
      type: "",
      url: ""
    }
  },
  QuantityShipped__c: null,
  Quantity__c: 6,
  Sample__c: "",
  Sample__r: {
    Name: "",
    attributes: {
      type: "",
      url: ""
    }
  },
  attributes: {
    type: "",
    url: ""
  }
}]

export const mappedProductAllocationDetailData = [{
  product: {
    sObject: 'Product__c',
    value: 'a4sO00000000sXyIAI',
    name: 'B:Alodox'
  },
  callAccount: {
    sObject: 'Account',
    value: '001O000001keIXQIA2',
    name: 'ANGELO MIELE'
  },
  status: 'Draft',
  quantity: 6,
  quantityShipped: '',
  dateShipped: '',
  finalQuantity: 6,
  sample: 'Alodox 400 MG',
  sampleOrderAccount: {
    sObject: 'Account',
    value: '001O000001keIXQIA2',
    name: 'ANGELO MIELE'
  },
  date: {
    type: 'date',
    value: '',
  },
}, {
  product: {
    sObject: '',
    value: '',
    name: ''
  },
  callAccount: {
    sObject: 'Account',
    value: '001O000001keIaOIAU',
    name: 'ADAM DAVID STEIN'
  },
  status: 'Draft',
  quantity: 2,
  quantityShipped: '',
  dateShipped: '',
  finalQuantity: 2,
  sample: 'Alodox 400 MG',
  sampleOrderAccount: {
    sObject: '',
    value: '',
    name: ''
  },
  date: {
    type: 'date',
    value: '',
  },
}]



export const mappedEmptyProductAllocationDetailData = [{
  product: {
    sObject: '',
    value: '',
    name: ''
  },
  callAccount: {
    sObject: '',
    value: '',
    name: ''
  },
  status: '',
  quantity: '',
  quantityShipped: '',
  dateShipped: '',
  finalQuantity: '',
  sample: '',
  sampleOrderAccount: {
    sObject: '',
    value: '',
    name: ''
  },
}]


export const testLastInventoryDateData = [{
  "attributes": { "type": "AggregateResult" },
  "date": "2021-11-05T11:22:30.000+0000"
}]