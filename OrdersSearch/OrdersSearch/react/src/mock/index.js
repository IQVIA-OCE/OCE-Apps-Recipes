import { LOADING_STATUS, PAGE_TYPE } from "../utils/constants"

export const mockState = {
    filters: {
        values: {
            orderName: "name",
            productName: "",
            orderStartDate: "",
            orderEndDate: "",
            deliveryStartDate: "",
            deliveryEndDate: "",
            orderStatus: [{ label: 'Submitted', value: 'Submitted' }],
            deliveryStatus: [{ label: 'Submitted', value: 'Submitted' }],
            brands: [{ label: 'Brand1', value: 'Brand1' }],
        },
        filterCount: 0,
        statusOrderPicklist: [{ label: 'Submitted', value: 'Submitted' }],
        statusDeliveryPicklist: [{ label: 'Submitted', value: 'Submitted' }],
        account: "",
        brandsOptions: [{ label: 'Brand1', value: 'Brand1' }],
        error: null
    },
    orders: {
        ordersList: {
            list: [{
                Order_Name: null,
                Order_Date: "2022-11-09T08:31:34.000Z",
                Id: 'oce__order2__c-46CD48C4-3FEB-47E8-B3FF-05FDB7BD1E8F',
                Net_Amount: 2599.419909
            },
            {
                Order_Name: 'test1',
                Order_Date: "2022-11-09T08:31:34.000Z",
                Id: 'a3s6t000000KzqzAXC',
                Net_Amount: 55
            },
            {
                Order_Name: 'test2',
                Order_Date: "2022-11-09T08:31:34.000Z",
                Id: 'a3s6t000000KzqzAAC',
                Net_Amount: null
            }],
        },
        account: {
            name: 'test',
            id: 'test',
            loadingStatus: LOADING_STATUS.SUCCESS
        },
        pageType: PAGE_TYPE.ACCOUNT,
    }
}

export const mockEmptyStore = {
    orders: {
        ordersList: {
            list: [],
            loadingStatus: LOADING_STATUS.IDLE,
          },
          account: {
            name: null,
            id: null,
            loadingStatus: LOADING_STATUS.IDLE,
          },
          pageType: null,
          error: null 
    },
    filters: {
        values: {
            orderName: "",
            productName: "",
            orderStartDate: "",
            orderEndDate: "",
            deliveryStartDate: "",
            deliveryEndDate: "",
            orderStatus: [],
            deliveryStatus: [],
            brands: [],
          },
          filterCount: 0,
          statusOrderPicklist: [],
          statusDeliveryPicklist: [],
          account: "",
          brandsOptions: [],
          error: null
    }
}