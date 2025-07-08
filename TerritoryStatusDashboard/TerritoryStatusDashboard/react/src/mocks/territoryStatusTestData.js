import { TRENDS } from '../constants';

export const getChangeRequestsMockData = (first, second) => ([
  {
    status: 'Approved',
    number: first,
  },
  {
    status: 'Rejected',
    number: second,
  },
]);

export const COLLECTED_DATA = {
  totalHCPinTerritory: 100,
  newIndividuals: 1,
  newWorkplaces: 2,
  acceptedChangeRequests: {
    thisPeriod: 1,
    previousPeriod: 3,
  },
  rejectedChangeRequests: {
    thisPeriod: 2,
    previousPeriod: 4,
  },
  newEnrollments: {
    thisPeriod: 1,
    previousPeriod: 2,
  },
  connectRegistration: {
    thisPeriod: 3,
    previousPeriod: 4,
  },
  collectedOpt: {
    thisPeriod: 5,
    previousPeriod: 6,
  },
};

export const SUBGROUPS_DATA = [
  {
    iconName: 'cellphone-message',
    items: [
      {
        name: 'First subgroup first item name',
        tooltip: 'First subgroup first item tooltip',
        amount: 10,
        trend: TRENDS.NONE,
      },
      {
        name: 'First subgroup second item name',
        tooltip: 'First subgroup second item tooltip',
        amount: 20,
        trend: TRENDS.DOWNWARD,
        symbolAfter: '%',
      },
    ],
  },
  {
    iconName: 'format-list-checks',
    items: [
      {
        name: 'Second subgroup first item name',
        tooltip: 'Second subgroup first item tooltip',
        amount: 30,
        trend: TRENDS.STABLE,
        symbolAfter: '$',
      },
      {
        name: 'Second subgroup second item name',
        tooltip: 'Second subgroup second item name',
        amount: 40,
        trend: TRENDS.GROWING,
      },
    ],
  },
];
