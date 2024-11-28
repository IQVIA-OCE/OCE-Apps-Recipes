import { DATA_FETCHING_PERIOD, TRENDS } from '../constants';
import { calculateRatio, getTrend } from './trendsCalculations';

export const getDataToDisplay = (data) => ([
  {
    name: 'Accounts',
    subgroups: [
      {
        iconName: 'account-multiple-plus-outline',
        items: [
          {
            name: 'New Individuals',
            tooltip: `Number of HCPs that have been added to the territory in the last ${DATA_FETCHING_PERIOD} days.`,
            amount: data.newIndividuals,
            trend: TRENDS.NONE,
          },
          {
            name: 'New Workplaces',
            tooltip: `Number of HCOs that have been added to the territory in the last ${DATA_FETCHING_PERIOD} days.`,
            amount: data.newWorkplaces,
            trend: TRENDS.NONE,
          },
        ],
      },
      {
        iconName: 'file-document-edit-outline',
        items: [
          {
            name: 'Accepted Change Requests',
            tooltip: 'Number of change requests that have recently been accepted.',
            amount: data.acceptedChangeRequests.thisPeriod,
            trend: getTrend(
              data.acceptedChangeRequests.thisPeriod,
              data.acceptedChangeRequests.previousPeriod,
            ),
          },
          {
            name: 'Rejected Change Requests',
            tooltip: 'Number of change requests that have recently been rejected.',
            amount: data.rejectedChangeRequests.thisPeriod,
            trend: getTrend(
              data.rejectedChangeRequests.thisPeriod,
              data.rejectedChangeRequests.previousPeriod,
            ),
          },
        ],
      },
    ],
  },
  {
    name: 'OCE Digital Campaign Activity',
    subgroups: [
      {
        iconName: 'cellphone-message',
        items: [
          {
            name: 'New Enrollments',
            tooltip: `The percentage of HCPs (compared to the Territory) who have been enrolled into Journeys in the past ${DATA_FETCHING_PERIOD} days. This is comparing the total amount of accounts aligned to the user's territory and the accounts that have been enrolled`,
            amount: calculateRatio(data.newEnrollments.thisPeriod, data.totalHCPinTerritory).toFixed(2),
            trend: getTrend(
              calculateRatio(data.newEnrollments.thisPeriod, data.totalHCPinTerritory),
              calculateRatio(data.newEnrollments.previousPeriod, data.totalHCPinTerritory),
            ),
            symbolAfter: '%',
          },
          {
            name: 'OCE Connect Registration',
            tooltip: 'The percentage of HCPs who registered to the portal (compared to the target population).',
            amount: calculateRatio(data.connectRegistration.thisPeriod, data.totalHCPinTerritory).toFixed(2),
            trend: getTrend(
              calculateRatio(data.connectRegistration.thisPeriod, data.totalHCPinTerritory),
              calculateRatio(data.connectRegistration.previousPeriod, data.totalHCPinTerritory),
            ),
            symbolAfter: '%',
          },
        ],
      },
      {
        iconName: 'format-list-checks',
        items: [
          {
            name: 'Collected Opt',
            tooltip: 'The percentage of HCPs from whom consent was collected.',
            amount: calculateRatio(data.collectedOpt.thisPeriod, data.totalHCPinTerritory).toFixed(2),
            trend: getTrend(
              calculateRatio(data.collectedOpt.thisPeriod, data.totalHCPinTerritory),
              calculateRatio(data.collectedOpt.previousPeriod, data.totalHCPinTerritory),
            ),
            symbolAfter: '%',
          },
        ],
      },
    ],
  },
]);
