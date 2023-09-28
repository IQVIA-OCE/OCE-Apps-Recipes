export const APPROVAL_REQUESTS_MOCK = [
  {
    CreatedDate: '2022-08-02T08:51:47.000+0000',
    Id: '04gO0000001AbhhIAC',
    Steps: {
      records: [
        {
          Comments: 'test',
          attributes: {
            type: 'ProcessInstanceStep',
            url: '/services/data/v50.0/sobjects/ProcessInstanceStep/04hO0000001dHurIAE',
          },
        },
      ],
      done: true,
      totalSize: 1,
    },
    SubmittedBy: {
      attributes: {
        url: '/services/data/v50.0/sobjects/User/0052v00000d4KO5AAM',
        type: 'User',
      },
      Name: 'OCEADMIN OCEADMIN',
    },
    attributes: {
      type: 'ProcessInstance',
      url: '/services/data/v50.0/sobjects/ProcessInstance/04gO0000001AbhhIAC',
    },
    TargetObjectId: 'a1lO0000003db2qIAA',
    TargetObject: {
      attributes: {
        url: '/services/data/v50.0/sobjects/ApprovalInquiry__c/a1lO0000003db2qIAA',
        type: 'Name',
      },
      Name: 'AI-00000008',
      Type: 'ApprovalInquiry__c',
    },
    Status: 'Pending',
  },
  {
    CreatedDate: '2022-08-01T15:18:12.000+0000',
    Id: '04gO0000001AbTBIA0',
    Steps: {
      records: [
        {
          Comments: 'test 5',
          attributes: {
            type: 'ProcessInstanceStep',
            url: '/services/data/v50.0/sobjects/ProcessInstanceStep/04hO0000001dHaIIAU',
          },
        },
      ],
      done: true,
      totalSize: 1,
    },
    SubmittedBy: {
      attributes: {
        url: '/services/data/v50.0/sobjects/User/0052v00000d4KO5AAM',
        type: 'User',
      },
      Name: 'OCEADMIN OCEADMIN',
    },
    attributes: {
      type: 'ProcessInstance',
      url: '/services/data/v50.0/sobjects/ProcessInstance/04gO0000001AbTBIA0',
    },
    TargetObjectId: '006O000000GZt1PIAT',
    TargetObject: {
      attributes: {
        url: '/services/data/v50.0/sobjects/Opportunity/006O000000GZt1PIAT',
        type: 'Name',
      },
      Name: 'Test opp 6 Approval Process',
      Type: 'Opportunity',
    },
    Status: 'Pending',
  },
  {
    CreatedDate: '2022-08-01T15:17:56.000+0000',
    Id: '04gO0000001AbT6IAK',
    Steps: {
      records: [
        {
          Comments: 'test 43',
          attributes: {
            type: 'ProcessInstanceStep',
            url: '/services/data/v50.0/sobjects/ProcessInstanceStep/04hO0000001dHaDIAU',
          },
        },
      ],
      done: true,
      totalSize: 1,
    },
    SubmittedBy: {
      attributes: {
        url: '/services/data/v50.0/sobjects/User/0052v00000d4KO5AAM',
        type: 'User',
      },
      Name: 'OCEADMIN OCEADMIN',
    },
    attributes: {
      type: 'ProcessInstance',
      url: '/services/data/v50.0/sobjects/ProcessInstance/04gO0000001AbT6IAK',
    },
    TargetObjectId: '006O000000GZsrZIAT',
    TargetObject: {
      attributes: {
        url: '/services/data/v50.0/sobjects/Opportunity/006O000000GZsrZIAT',
        type: 'Name',
      },
      Name: 'Test opp 5 Approval Process',
      Type: 'Opportunity',
    },
    Status: 'Pending',
  },
  {
    CreatedDate: '2022-08-01T15:16:31.000+0000',
    Id: '04gO0000001AbSxIAK',
    Steps: {
      records: [
        {
          Comments: 'test 3',
          attributes: {
            type: 'ProcessInstanceStep',
            url: '/services/data/v50.0/sobjects/ProcessInstanceStep/04hO0000001dHa4IAE',
          },
        },
      ],
      done: true,
      totalSize: 1,
    },
    SubmittedBy: {
      attributes: {
        url: '/services/data/v50.0/sobjects/User/0052v00000d4KO5AAM',
        type: 'User',
      },
      Name: 'OCEADMIN OCEADMIN',
    },
    attributes: {
      type: 'ProcessInstance',
      url: '/services/data/v50.0/sobjects/ProcessInstance/04gO0000001AbSxIAK',
    },
    TargetObjectId: '006O000000GZspaIAD',
    TargetObject: {
      attributes: {
        url: '/services/data/v50.0/sobjects/Opportunity/006O000000GZspaIAD',
        type: 'Name',
      },
      Name: 'Test opp 4',
      Type: 'Opportunity',
    },
    Status: 'Pending',
  },
  {
    CreatedDate: '2022-08-01T15:16:03.000+0000',
    Id: '04gO0000001AbSwIAK',
    Steps: {
      records: [
        {
          Comments: 'test 1',
          attributes: {
            type: 'ProcessInstanceStep',
            url: '/services/data/v50.0/sobjects/ProcessInstanceStep/04hO0000001dHa3IAE',
          },
        },
      ],
      done: true,
      totalSize: 1,
    },
    SubmittedBy: {
      attributes: {
        url: '/services/data/v50.0/sobjects/User/0052v00000d4KO5AAM',
        type: 'User',
      },
      Name: 'OCEADMIN OCEADMIN',
    },
    attributes: {
      type: 'ProcessInstance',
      url: '/services/data/v50.0/sobjects/ProcessInstance/04gO0000001AbSwIAK',
    },
    TargetObjectId: '006O000000GZsmAIAT',
    TargetObject: {
      attributes: {
        url: '/services/data/v50.0/sobjects/Opportunity/006O000000GZsmAIAT',
        type: 'Name',
      },
      Name: 'Test opp 3',
      Type: 'Opportunity',
    },
    Status: 'Pending',
  },
];

export const MAPPED_APPROVAL_REQUESTS_MOCK = [
  {
    comment: 'test',
    createdDate: '2022-08-02T08:51:47.000+0000',
    id: '04gO0000001AbhhIAC',
    label: 'Approval Inquiry',
    name: 'AI-00000008',
    status: 'Pending',
    submittedBy: 'OCEADMIN OCEADMIN',
    targetObjectId: 'a1lO0000003db2qIAA',
    type: 'ApprovalInquiry__c',
  },
  {
    comment: 'test 5',
    createdDate: '2022-08-01T15:18:12.000+0000',
    id: '04gO0000001AbTBIA0',
    label: 'Opportunity',
    name: 'Test opp 6 Approval Process',
    status: 'Pending',
    submittedBy: 'OCEADMIN OCEADMIN',
    targetObjectId: '006O000000GZt1PIAT',
    type: 'Opportunity',
  },
  {
    comment: 'test 43',
    createdDate: '2022-08-01T15:17:56.000+0000',
    id: '04gO0000001AbT6IAK',
    label: 'Opportunity',
    name: 'Test opp 5 Approval Process',
    status: 'Pending',
    submittedBy: 'OCEADMIN OCEADMIN',
    targetObjectId: '006O000000GZsrZIAT',
    type: 'Opportunity',
  },
  {
    comment: 'test 3',
    createdDate: '2022-08-01T15:16:31.000+0000',
    id: '04gO0000001AbSxIAK',
    label: 'Opportunity',
    name: 'Test opp 4',
    status: 'Pending',
    submittedBy: 'OCEADMIN OCEADMIN',
    targetObjectId: '006O000000GZspaIAD',
    type: 'Opportunity',
  },
  {
    comment: 'test 1',
    createdDate: '2022-08-01T15:16:03.000+0000',
    id: '04gO0000001AbSwIAK',
    label: 'Opportunity',
    name: 'Test opp 3',
    status: 'Pending',
    submittedBy: 'OCEADMIN OCEADMIN',
    targetObjectId: '006O000000GZsmAIAT',
    type: 'Opportunity',
  },
];
