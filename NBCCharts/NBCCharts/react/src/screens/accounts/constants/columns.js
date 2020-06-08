export const columns = [
    {
        id: 'SampleEligibility',
        title: 'Sample eligibility',
        accessor: 'OCE__Account__r.OCE__PrimaryAccountAddress__r.OCE__SampleEligibilityStatus__c',
        isSortable: true,
    },
    {
        id: 'NextBestTime',
        title: 'Next best time',
        accessor: 'OCE__Account__r.OCE__PrimaryAccountAddress__r.OCE__BestTime__c',
        isSortable: false,
    },
    {
        id: 'Rank',
        title: 'Rank',
        accessor: 'OCE__Rank__c',
        isSortable: true,
        type: 'number'
    }
]

export const defaultSortingColumns = [
    {
        id: 'Rank',
        title: 'Rank',
        accessor: 'OCE__Rank__c'
    }
]

export const extraSortingColumns = [
    {
        id: 'Last Name',
        title: 'LastName',
        accessor: 'OCE__Account__r.LastName'
    },
]