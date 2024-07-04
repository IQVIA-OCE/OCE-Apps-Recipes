import { NAMESPACE } from '../../../constants';

export const mapSpeakers = speakers =>
  speakers.map(d => ({
    id: d.Id,
    name: d.Name,
    account: d[`${NAMESPACE}Account__c`],
    specialty: d[`${NAMESPACE}Specialty__c`],
    professionalDesignation: d[`${NAMESPACE}ProfessionalDesignation__c`],
    status: d[`${NAMESPACE}Status__c`],
    user: d[`${NAMESPACE}User__c`],
    allowRestrictedProducts: d[`${NAMESPACE}Account__r.${NAMESPACE}AllowRestrictedProducts__c`],
    accountId: d[`${NAMESPACE}Account__r.Id`],
  }));

export const mapMeeting = ({ Id, [`${NAMESPACE}ContextUserRole__c`]: role, ...m }) => ({
  ...m,
  [`${NAMESPACE}ContextUserRole__c`]: role.replace(/,\s*$/, ""),
  id: Id,
});

export const mapRecordType = rt => ({
  id: rt.Id,
});

export const mapMeetingMembers = members =>
  members.map(member => ({
    ...member,
    id: member.Id,
    speaker: member[`${NAMESPACE}Speaker__c`],
    name: member.Name,
  }));
