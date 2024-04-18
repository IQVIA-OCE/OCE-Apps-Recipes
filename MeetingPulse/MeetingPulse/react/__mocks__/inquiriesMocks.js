export const INQUIRIES_MOCK = [
  {
    Question__c:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
    Id: 'a6NO0000000ClKoMAK',
    'Inquiry__r.Name': 'INQ-0001',
    'Inquiry__r.Id': 'a6OO0000000CnlXMAS',
    'Inquiry__r.Account__r.Id': '001O000001keIYOIA2',
    'Inquiry__r.Account__r.Name': '_Southern Baptist Hospital of Florida, Inc',
    Inquiry__c: 'a6OO0000000CnlXMAS',
  },
  {
    Question__c:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur. 2',
    Id: 'a6NO0000000ClKoMAK1',
    'Inquiry__r.Name': 'INQ-0001',
    'Inquiry__r.Id': 'a6OO0000000CnlXMAS',
    'Inquiry__r.Account__r.Id': '001O000001keIYOIA2',
    'Inquiry__r.Account__r.Name': '_Southern Baptist Hospital of Florida, Inc',
    Inquiry__c: 'a6OO0000000CnlXMAS',
  },
  {
    Question__c:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
    Id: 'a6NO0000000ClKpMAK',
    'Inquiry__r.Name': 'INQ-0002',
    'Inquiry__r.Id': 'a6OO0000000CnlYMAS',
    'Inquiry__r.Account__r.Id': '001O000001keIYOIA2',
    'Inquiry__r.Account__r.Name': '_Southern Baptist Hospital of Florida, Inc',
    Inquiry__c: 'a6OO0000000CnlYMAS',
  },
  {
    Question__c:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
    Id: 'a6NO0000000ClKqMAK',
    'Inquiry__r.Name': 'INQ-0003',
    'Inquiry__r.Id': 'a6OO0000000CnlZMAS',
    'Inquiry__r.Account__r.Id': '001O000001keIYOIA2',
    'Inquiry__r.Account__r.Name': '_Southern Baptist Hospital of Florida, Inc',
    Inquiry__c: 'a6OO0000000CnlZMAS',
  },
  {
    Question__c:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
    Id: 'a6NO0000000ClKrMAK',
    'Inquiry__r.Name': 'INQ-0004',
    'Inquiry__r.Id': 'a6OO0000000CnlaMAC',
    'Inquiry__r.Account__r.Id': '001O000001keIYOIA2',
    'Inquiry__r.Account__r.Name': '_Southern Baptist Hospital of Florida, Inc',
    Inquiry__c: 'a6OO0000000CnlaMAC',
  },
  {
    Question__c:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
    Id: 'a6NO0000000ClKsMAK',
    'Inquiry__r.Name': 'INQ-0005',
    'Inquiry__r.Id': 'a6OO0000000CnlbMAC',
    'Inquiry__r.Account__r.Id': '001O000001keIYOIA2',
    'Inquiry__r.Account__r.Name': '_Southern Baptist Hospital of Florida, Inc',
    Inquiry__c: 'a6OO0000000CnlbMAC',
  },

  {
    Question__c:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
    Id: 'a6NO0000000ClKsMAK2',
    'Inquiry__r.Name': 'INQ-0009',
    'Inquiry__r.Id': 'a6OO0000000CnlbMAC1',
    'Inquiry__r.Account__r.Id': '001O000001keIYOIA22',
    'Inquiry__r.Account__r.Name': 'Acc',
    Inquiry__c: 'a6OO0000000CnlbMAC0',
  },

  {
    Question__c:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur. 2',
    Id: 'a6NO0000000ClKsMAK3',
    'Inquiry__r.Name': 'INQ-0010',
    'Inquiry__r.Id': 'a6OO0000000CnlbMAC2',
    'Inquiry__r.Account__r.Id': '001O000001keIYOIA23',
    'Inquiry__r.Account__r.Name': 'acc 3',
    Inquiry__c: 'a6OO0000000CnlbMAC1',
  },
];

export const MOCK_ACCOUNT_WITH_INQUIRIES = {
  id: '001O000001keIYOIA2',
  name: '_Southern Baptist Hospital of Florida, Inc',
  inquiries: [
    {
      id: 'a6OO0000000CnlXMAS',
      name: 'INQ-0001',
      questions: [
        {
          id: 'a6NO0000000ClKoMAK',
          question: 'Lorem ipsum',
        },
        {
          id: 'a6NO0000000ClKoMAK1',
          question: 'Lorem ipsum',
        },
      ],
    },
    {
      id: 'a6OO0000000CnlYMAS',
      name: 'INQ-0002',
      questions: [
        {
          id: 'a6NO0000000ClKpMAK',
          question: 'Lorem ipsum',
        },
      ],
    },
    {
      id: 'a6OO0000000CnlZMAS',
      name: 'INQ-0003',
      questions: [
        {
          id: 'a6NO0000000ClKqMAK',
          question: 'Lorem ipsum',
        },
      ],
    },
    {
      id: 'a6OO0000000CnlaMAC',
      name: 'INQ-0004',
      questions: [
        {
          id: 'a6NO0000000ClKrMAK',
          question: 'Lorem ipsum',
        },
      ],
    },
    {
      id: 'a6OO0000000CnlbMAC',
      name: 'INQ-0005',
      questions: [
        {
          id: 'a6NO0000000ClKsMAK',
          question: 'Lorem ipsum',
        },
      ],
    },
  ],
};

export const GROUPED_QUESTIONS = [
  {
    id: '001O000001keIYOIA2',
    name: '_Southern Baptist Hospital of Florida, Inc',
    inquiries: [
      {
        id: 'a6OO0000000CnlXMAS',
        name: 'INQ-0001',
        questions: [
          {
            id: 'a6NO0000000ClKoMAK',
            question:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
          },
          {
            id: 'a6NO0000000ClKoMAK1',
            question:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur. 2',
          },
        ],
      },
      {
        id: 'a6OO0000000CnlYMAS',
        name: 'INQ-0002',
        questions: [
          {
            id: 'a6NO0000000ClKpMAK',
            question:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
          },
        ],
      },
      {
        id: 'a6OO0000000CnlZMAS',
        name: 'INQ-0003',
        questions: [
          {
            id: 'a6NO0000000ClKqMAK',
            question:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
          },
        ],
      },
      {
        id: 'a6OO0000000CnlaMAC',
        name: 'INQ-0004',
        questions: [
          {
            id: 'a6NO0000000ClKrMAK',
            question:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
          },
        ],
      },
      {
        id: 'a6OO0000000CnlbMAC',
        name: 'INQ-0005',
        questions: [
          {
            id: 'a6NO0000000ClKsMAK',
            question:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
          },
        ],
      },
    ],
  },
  {
    id: '001O000001keIYOIA22',
    name: 'Acc',
    inquiries: [
      {
        id: 'a6OO0000000CnlbMAC1',
        name: 'INQ-0009',
        questions: [
          {
            id: 'a6NO0000000ClKsMAK2',
            question:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur.',
          },
        ],
      },
    ],
  },
  {
    id: '001O000001keIYOIA23',
    name: 'acc 3',
    inquiries: [
      {
        id: 'a6OO0000000CnlbMAC2',
        name: 'INQ-0010',
        questions: [
          {
            id: 'a6NO0000000ClKsMAK3',
            question:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ipsum ac erat facilisis egestas. Suspendisse potenti. Sed vehicula neque quis aliquam vehicula. Morbi consectetur. 2',
          },
        ],
      },
    ],
  },
];
