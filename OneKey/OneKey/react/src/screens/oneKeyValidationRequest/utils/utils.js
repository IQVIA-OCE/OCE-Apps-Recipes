export const groupBy = key => array =>
  array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
    }),
    {}
  );

export const mapCountries = (countriesValues, picklistValues) => {
    let valuesList = countriesValues.records.length ? countriesValues.records[0].QIDC__OK_Available_Countries_ims__c.split(';') : [];
    // if (!valuesList.length){
    //     valuesList = ["US", "FR"];
    // }
    const mappedCountries = valuesList.map(countryValue => {

        const countryPicklistItem = picklistValues.find(pickListItem => {
            return countryValue === pickListItem.value
        });

        const countryLabel = countryPicklistItem && countryPicklistItem.label ? countryPicklistItem.label : countryValue;

        return {label: countryLabel, value: countryValue };
    })

    return mappedCountries;
}

export const mapPicklist = (picklist) => {
    if (!picklist) return false;
    return picklist.map(picklist => {
        return {
            label: picklist.QIDC__Label_ims__c,
            value: picklist.Name
        }
    });
}

export const mapWorkplaces = (apiWorkplaces) => {
    return apiWorkplaces.records.map(workplace => {
        return {
            label: workplace.OCE__AccountFullName__c || workplace.Name,
            value: workplace.Id
        }
    });
}

export const mapWorkplaceFormValues = (formValues, userId) => {
    const { entityType, workplace, address } = formValues;

    return {
        'validation.requestProcess': 'I',
        'validation.requestDate': new Date(),
        'validation.user': userId,
        'entityType': "Workplace",
        'workplace.telephone': workplace.telephone,
        'workplace.activityLocationCode': workplace.activityLocationCode,
        'workplace.usualName': workplace.usualName,
        'workplace.parentUsualName': workplace.parentUsualName,
        'workplace.typeCode': workplace.typeCode,
        'workplace.workplaceEid': workplace.workplaceEid,
        'workplace.statusCode': workplace.statusCode,
        'workplace.speciality1':workplace.speciality1 ? workplace.speciality1 : '',
        'address.longLabel': address.longLabel,
        'address.city': address.city,
        'address.longPostalCode': address.longPostalCode,
        'address.countyCode': address.countyCode,
        'address.regionCode': address.regionCode ? address.regionCode : '',
        'address.country': address.country,
        isoCod2: address.country,
        'validation.clientRequestId': `OneKeyRN${Date.now()}`,
        'validation.process': 'Q',
        'validation.requestComment': workplace.requestComments,
    }
}

export const mapActivityFormValues = (formValues, userId) => {
    const { entityType, workplace, address, individual, activity } = formValues;

    return {
        'validation.requestProcess': 'I',
        'validation.requestDate': new Date(),
        'validation.user': userId,
        'entityType': "Activity",
        'workplace.telephone': workplace.telephone,
        'workplace.activityLocationCode': workplace.activityLocationCode,
        'workplace.usualName': workplace.usualName,
        'workplace.parentUsualName': workplace.parentUsualName,
        'workplace.typeCode': workplace.typeCode,
        'workplace.workplaceEid': workplace.workplaceEid,
        'workplace.statusCode': workplace.statusCode,
        'workplace.speciality1': workplace.speciality1 ? workplace.speciality1 : '',
        'address.longLabel': address.longLabel,
        'address.city': address.city,
        'address.longPostalCode': address.longPostalCode,
        'address.countyCode': address.countyCode,
        'address.regionCode': address.regionCode ? address.regionCode : '',
        'address.country': address.country,
        isoCod2: address.country,
        'validation.clientRequestId': `OneKeyRN${Date.now()}`,
        'validation.process': 'Q',
        'individual.firstName': individual.firstName,
        'individual.lastName': individual.lastName,
        'individual.typeCode': individual.typeCode,
        'individual.speciality1': individual.speciality1,
        'individual.middleName': individual.middleName,
        'individual.individualEid': individual.individualEid,
        'individual.statusCode': individual.statusCode,
        'individual.genderCode': individual.genderCode,
        'individual.prefixNameCode': individual.prefixNameCode,
        'individual.speciality2': individual.speciality2,
        'individual.speciality3': individual.specialty3,
        'individual.titleCode': individual.titleCode,
        'activity.activityEid': activity.activityEid,
        'activity.statusCode': activity.statusCode,
        'activity.telephone': activity.telephone,
        'activity.role': activity.role,
        'validation.requestComment': workplace.requestComments,
    }
}
