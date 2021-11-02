import { DateTime } from 'luxon';
import { NAMESPACE } from '../constants';
import store from '../stores'

const mapRecordTypes = (recordTypes) => {
    return recordTypes.map((item) => (
        {
            id: item.recordTypeId,
            label: item.name,
            value: item.developerName,
        }

    ));
}
const alertValidationType = (isWalkIn) => {
    const { meetingGenConfig } = store.getState().meeting;
    if (isWalkIn) {
        if (meetingGenConfig[`${NAMESPACE}ValidateRestrictedProductsForWalkIns__c`]) {
            return meetingGenConfig[`${NAMESPACE}ValidateRestrictedProductsForWalkIns__c`].toLowerCase();
        } else {
            return 'warn';
        }
    } else {
        return 'block';
    }
}
const validateRestrictedProducts = (meetingDetails, record, topicProductIds) => {
    if (record.accountDetails[0] && !record.accountDetails[0][`${NAMESPACE}AllowRestrictedProducts__c`]) {
        const restrictedProducts = record.accountDetails[0][`${NAMESPACE}RestrictedProductsJSON__c`];
        const territoryRestrictedProducts = record.accountDetails[0][`${NAMESPACE}TerritoryRestrictedProductsJSON__c`];
        if (restrictedProducts && restrictedProducts.length > 0) {
            return restrictedProducts.filter((prod) => topicProductIds.some((topic) => topic.Id === prod.id));
        }
        if (territoryRestrictedProducts.records) {
            const territoryArr = meetingDetails[`${NAMESPACE}Territories__c`].split(';').filter((tp) => tp !== '');
            const territoryProduct = territoryRestrictedProducts.records.filter((rp) => territoryArr.some((terr) => rp.territory.includes(terr)));
            if (territoryProduct && territoryProduct.length > 0) {
                return territoryProduct[0].products && territoryProduct[0].products.filter((prod) => topicProductIds.some((topic) => topic.Id === prod.id));
            }
        }

    }
    return null;

}
const consentValidation = (meetingGenConfig, record) => {
    const signInAttendeeStatus = meetingGenConfig[0][`${NAMESPACE}SignInAttendanceStatuses__c`];
    const signInInviteStatus = meetingGenConfig[0][`${NAMESPACE}SignInInvitationStatuses__c`];
    return (signInAttendeeStatus !== null && signInAttendeeStatus.split(";").includes(record[`${NAMESPACE}AttendanceStatus__c`]))
        || (signInInviteStatus !== null && signInInviteStatus.split(";").includes(record[`${NAMESPACE}Status__c`]))
}

const signInDateValidation = (meetingDetails) => {
    return new Date().getTime() >= (DateTime.fromISO(meetingDetails[0][`${NAMESPACE}StartDateTime__c`])).toMillis()
        && new Date().getTime() <= (DateTime.fromISO(meetingDetails[0][`${NAMESPACE}EndDateTime__c`])).toMillis()
}


const validateSignIn = (meetingConfig, meetingDetails, record) => {
    let valid = true;
    if (record[`${NAMESPACE}SignatureDate__c`] !== null) {
        valid = false;
    }
    return valid;
}

export { mapRecordTypes, validateSignIn, signInDateValidation, alertValidationType, validateRestrictedProducts };
