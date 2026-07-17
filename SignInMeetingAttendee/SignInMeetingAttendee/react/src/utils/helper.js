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
        return (meetingGenConfig[`${NAMESPACE}ValidateRestrictedProductsForWalkIns__c`]
            && (meetingGenConfig[`${NAMESPACE}ValidateRestrictedProductsForWalkIns__c`] != '' || meetingGenConfig[`${NAMESPACE}ValidateRestrictedProductsForWalkIns__c`] != null))
            ? meetingGenConfig[`${NAMESPACE}ValidateRestrictedProductsForWalkIns__c`].toLowerCase() : 'warn';
    }
    return 'block';
}
const validateRestrictedProducts = (meetingDetails, record, topicProductIds) => {
    if (record.accountDetails[0] && !record.accountDetails[0][`${NAMESPACE}AllowRestrictedProducts__c`]) {
        const restrictedProducts = record.accountDetails[0][`${NAMESPACE}RestrictedProductsJSON__c`];
        const territoryRestrictedProducts = record.accountDetails[0][`${NAMESPACE}TerritoryRestrictedProductsJSON__c`];
        const territoryProductJson = territoryRestrictedProducts && JSON.parse(territoryRestrictedProducts)
        if (restrictedProducts && restrictedProducts.length > 0) {
            const restrictedProductsJson = JSON.parse(restrictedProducts);
            return restrictedProductsJson.filter((prod) => topicProductIds.some((topic) => topic.Id === prod.id));
        }
        if (territoryProductJson && territoryProductJson.records) {
            const territoryArr = meetingDetails[`${NAMESPACE}Territories__c`].split(';').filter((tp) => tp !== '');
            const territoryProduct = territoryProductJson.records.filter((rp) => territoryArr.some((terr) => rp.territory.includes(terr)));
            if (territoryProduct && territoryProduct.length > 0) {
                return territoryProduct[0] && territoryProduct[0].products.filter((prod) => topicProductIds.some((topic) => topic.Id === prod.id));
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
    if (meetingConfig[0]) {
        valid = (meetingDetails[0] && meetingConfig[0][`${NAMESPACE}IsEnabledSignInDateValidation__c`] ? signInDateValidation(meetingDetails) : true) &&
            (meetingConfig[0][`${NAMESPACE}EnableConsent__c`] ? consentValidation(meetingConfig, record) : true);

    }
    if (record[`${NAMESPACE}SignatureDate__c`] !== null) {
        valid = false;
    }
    return valid;
}

const sortStrings = (accessor, sortOrder, a, b) => {
    const va = (a[accessor] === null) ? "" : "" + a[accessor],
        vb = (b[accessor] === null) ? "" : "" + b[accessor];
    if (sortOrder === 'ascending') {
        return (va > vb) ? 1 : ((vb > va) ? -1 : 0)
    } else {
        return (va < vb) ? 1 : ((vb < va) ? -1 : 0)
    }
};

const sortSignIn = (accessor, sortOrder, a, b) => {
    if (sortOrder === 'ascending') {
        return new Date(a[accessor]) - new Date(b[accessor])
    } else {
        return new Date(b[accessor]) - new Date(a[accessor])
    }
};

const onValidateWriteIn = () => {
    const { meetingGenConfig, meetingDetails } = store.getState().meeting;
    const meetingConfigRecord = meetingGenConfig[0];
    const meetingDetailRecord = meetingDetails[0];
    let isValid = !meetingDetailRecord;
    if (meetingConfigRecord) {
        const isSignInDateValidation = meetingConfigRecord[`${NAMESPACE}IsEnabledSignInDateValidation__c`];
        const isWriteInEnabled = meetingConfigRecord[`${NAMESPACE}EnableWriteIns__c`]
        if (isSignInDateValidation) {
            isValid = !signInDateValidation(meetingDetails)
        }
        if (!isValid) {
            return !isWriteInEnabled
        }
    }
    return isValid;
}


export { mapRecordTypes, validateSignIn, signInDateValidation, alertValidationType, validateRestrictedProducts, sortStrings, sortSignIn, onValidateWriteIn };
