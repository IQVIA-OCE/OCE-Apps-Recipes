import { NAMESPACE } from '../constants';
import { environment } from '@oce-apps/oce-apps-bridges';
import api from '../utils/api';
import { resetTimeZone } from '../utils';

export const fetchPlanCycle = () => {
  const query = `SELECT Id, ${NAMESPACE}Territory__c, ${NAMESPACE}StartDate__c, ${NAMESPACE}Type__c, ${NAMESPACE}EndDate__c FROM ${NAMESPACE}PlanCycle__c WHERE ${NAMESPACE}Active__c = true AND ${NAMESPACE}Territory__c = '${environment.territory().name}' AND ${NAMESPACE}Type__c IN ('AccountGoal', 'WeightedTerritoryGoals')`

  return api.query(query);
}

export const fetchBusinessHoursConfig = () => {
  const query = `SELECT Name, ${NAMESPACE}BusinessHours__c FROM ${NAMESPACE}CalendarConfig__c WHERE SetupOwnerId = '${environment.profileId()}'`

  return api.query(query);
}

export const fetchBusinessHours = (name, fields) => {
  const query = `SELECT ${fields.join(', ')} FROM BusinessHours WHERE Name = '${name}'`

  return api.query(query);
}

export const fetchWorkingDaysConfig = () => {
  const query = `SELECT ${NAMESPACE}Start2__c, ${NAMESPACE}End2__c FROM ${NAMESPACE}WorkingDaysConfig__mdt WHERE ${NAMESPACE}Object__c = 'BusinessHours'`

  return api.query(query);
}

export const fetchHolidayDaysConfig = () => {
  const query = `SELECT ${NAMESPACE}Priority2__c, ${NAMESPACE}Start2__c FROM ${NAMESPACE}WorkingDaysConfig__mdt WHERE ${NAMESPACE}Object__c = 'Holiday__c'`

  return api.query(query);
}

export const fetchTimeOffDaysConfig = () => {
  const query = `SELECT ${NAMESPACE}Start2__c, ${NAMESPACE}End2__c, ${NAMESPACE}Priority2__c, ${NAMESPACE}Method2__c, ${NAMESPACE}Type2__c, ${NAMESPACE}Value2__c FROM ${NAMESPACE}WorkingDaysConfig__mdt WHERE ${NAMESPACE}Object__c = 'TimeOffTerritory__c'`

  return api.query(query);
}

export const fetchHolidays = (fieldName, businessHoursConfigName, startDate, endDate) => {
  const query = `SELECT Id, ${NAMESPACE}${fieldName} FROM ${NAMESPACE}Holiday__c WHERE ${NAMESPACE}BusinessHoursName__c = '${businessHoursConfigName}' AND ${NAMESPACE}${fieldName} >= ${startDate} AND ${NAMESPACE}${fieldName} <= ${endDate}`;

  return api.query(query);
}

export const fetchHoursInWorkDay = () => {
  const query = `SELECT ${NAMESPACE}HoursInWorkDay__c FROM ${NAMESPACE}TOTSettings__c WHERE SetupOwnerId ='${environment.organizationId()}'`

  return api.query(query);
}

export const fetchTOTSettings = () => {
  const query = `SELECT ${NAMESPACE}Working__c FROM ${NAMESPACE}TOTSettings__c WHERE SetupOwnerId = '${environment.organizationId()}'`

  return api.query(query);
}

export const fetchTOTs = (fields, working, startDate, endDate) => {
  const normalizedStartDate = resetTimeZone(startDate.value);
  const normalizedEndDate = resetTimeZone(endDate.value).set({ hours: 24 });

  const query = `SELECT Id, ${fields} FROM ${NAMESPACE}TimeOffTerritory__c\
    WHERE ${NAMESPACE}Territory__c = '${environment.territory().name}'\
    AND ((${startDate.fieldName} >= ${normalizedStartDate} AND ${endDate.fieldName} < ${normalizedEndDate})\
    OR ((${startDate.fieldName} < ${normalizedStartDate} AND ${endDate.fieldName} > ${normalizedStartDate})\
    OR (${startDate.fieldName} < ${normalizedEndDate} AND ${endDate.fieldName} > ${normalizedEndDate}))) ${Boolean(working.length) ? `AND ${NAMESPACE}Type__c NOT IN (${working.map(el => `'${el}'`)})` : ''}`

  return api.query(query);
}
