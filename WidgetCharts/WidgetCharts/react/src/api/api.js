import {sfNetAPI} from "oce-apps-bridges";

sfNetAPI.enablePromises();

export const fetchMarkets = (recordId, territoryName) => {
    const filter = recordId
        ? `And OCE__Account__c = '${recordId}'`
        : `And OCE__Territory__c = '${territoryName}'`;

    return sfNetAPI.query(`SELECT OCE__Market__c FROM OCE__XponentSalesData__c Where OCE__Measure1Total__c != null ${filter} Group By OCE__Market__c`)
}

export const fetchMarketData = (recordId, marketLabel, territoryName) => {
    let filter = recordId
        ? `And OCE__Territory__c = '${territoryName}' And OCE__Account__c = '${recordId}'`
        : `And OCE__Territory__c = '${territoryName}'`;

    return sfNetAPI.query(
        `SELECT\
                    OCE__Measure1Bucket01__c,\
                    OCE__Measure1Bucket02__c,\
                    OCE__Measure1Bucket03__c,\
                    OCE__Measure1Bucket04__c,\
                    OCE__Measure1Bucket05__c,\
                    OCE__Measure1Bucket06__c,\
                    OCE__Measure1Bucket07__c,\
                    OCE__Measure1Bucket08__c,\
                    OCE__Measure1Bucket09__c,\
                    OCE__Measure1Bucket10__c,\
                    OCE__Measure1Bucket11__c,\
                    OCE__Measure1Bucket12__c,\
                    OCE__Measure1Bucket13__c,\
                    OCE__Measure1Bucket14__c,\
                    OCE__Measure1Bucket15__c,\
                    OCE__Measure1Bucket16__c,\
                    OCE__Measure1Bucket17__c,\
                    OCE__Measure1Bucket18__c,\
                    OCE__Measure1Bucket19__c,\
                    OCE__Measure1Bucket20__c,\
                    OCE__Measure1Bucket21__c,\
                    OCE__Measure1Bucket22__c,\
                    OCE__Measure1Bucket23__c,\
                    OCE__Measure1Bucket24__c,\
                    OCE__Measure1Bucket25__c,\
                    OCE__Measure1Bucket26__c,\
                    OCE__PeriodLabelBucket01__c,\
                    OCE__PeriodLabelBucket02__c,\
                    OCE__PeriodLabelBucket03__c,\
                    OCE__PeriodLabelBucket04__c,\
                    OCE__PeriodLabelBucket05__c,\
                    OCE__PeriodLabelBucket06__c,\
                    OCE__PeriodLabelBucket07__c,\
                    OCE__PeriodLabelBucket08__c,\
                    OCE__PeriodLabelBucket09__c,\
                    OCE__PeriodLabelBucket10__c,\
                    OCE__PeriodLabelBucket11__c,\
                    OCE__PeriodLabelBucket12__c,\
                    OCE__PeriodLabelBucket13__c,\
                    OCE__PeriodLabelBucket14__c,\
                    OCE__PeriodLabelBucket15__c,\
                    OCE__PeriodLabelBucket16__c,\
                    OCE__PeriodLabelBucket17__c,\
                    OCE__PeriodLabelBucket18__c,\
                    OCE__PeriodLabelBucket19__c,\
                    OCE__PeriodLabelBucket20__c,\
                    OCE__PeriodLabelBucket21__c,\
                    OCE__PeriodLabelBucket22__c,\
                    OCE__PeriodLabelBucket23__c,\
                    OCE__PeriodLabelBucket24__c,\
                    OCE__PeriodLabelBucket25__c,\
                    OCE__PeriodLabelBucket26__c,\
                    OCE__Product__r.Name FROM OCE__XponentSalesData__c\
                    Where OCE__Market__c = '${marketLabel}' And OCE__Measure1Total__c != null ${filter}`)
}

export const fetchCall = (recordId, territoryName) => {
    let filter = recordId
        ? `And OCE__Territory__c = '${territoryName}' And OCE__Account__c = '${recordId}'`
        : `And OCE__Territory__c = '${territoryName}'`;

    return sfNetAPI.query(`SELECT OCE__CallType__c, OCE__CallDateTime__c FROM OCE__Call__c WHERE OCE__CallDateTime__c != null ${filter} ORDER BY OCE__CallDateTime__c`)
}
