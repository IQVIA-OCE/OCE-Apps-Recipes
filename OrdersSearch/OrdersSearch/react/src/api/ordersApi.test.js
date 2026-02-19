import { databaseManager } from "@oce-apps/oce-apps-bridges";
import { fetchBrands, fetchAccount, fetchAccounts, fetchAccountIdByOrderId, fetchOrders, fetchParentProductIds } from "./ordersApi";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    environment: {
        namespace: () => 'OCE__',
    },
    databaseManager: {
        fetch: jest.fn(),
    },
}));
describe('orders api', () => {

    beforeAll(() => {
        jest.mock('./ordersApi', () => ({
          fetchBrands: jest.fn(),
          fetchAccount: jest.fn(),
          fetchAccounts: jest.fn(),
          fetchOrders: jest.fn(),
          fetchParentProductIds: jest.fn()
        }));
      })

    it('should query fetchParentProductIds', () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchParentProductIds();
        expect(spy).toHaveBeenCalled();
    });
    it('should query brands', () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchBrands();
        expect(spy).toHaveBeenCalled();
    });
    it('should query account', () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchAccount(123);
        expect(spy).toHaveBeenCalled();
    });
    describe('query accounts', () => {
        it('should query accounts with nameFilter', () => {
            const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
            fetchAccounts('test');
            expect(spy).toHaveBeenCalled();
        });
        it('should query accounts without nameFilter', () => {
            const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
            fetchAccounts();
            expect(spy).toHaveBeenCalled();
        });
    });

    it('should query account by order id', () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchAccountIdByOrderId(123);
        expect(spy).toHaveBeenCalled();
    });

    describe('query orders', () => {
        it('should query orders with empty filters', () => {
            const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
            fetchOrders({
                orderName: "",
                productName: "",
                orderStartDate: "",
                orderEndDate: "",
                deliveryStartDate: "",
                deliveryEndDate: "",
                orderStatus: [],
                deliveryStatus: [],
                brands: [],
            }, '123');
            expect(spy).toHaveBeenCalled();
        });
        it('should query orders with filters', () => {
            const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
            fetchOrders({
                orderName: "123",
                productName: "123",
                orderStartDate: "2022-11-09T08:31:34.000Z",
                orderEndDate: "2022-12-09T08:31:34.000Z",
                deliveryStartDate: "2022-11-09T08:31:34.000Z",
                deliveryEndDate: "2022-12-09T08:31:34.000Z",
                orderStatus: [{ label: 'test', value: 'test' }, { label: 'test', value: 'test' }],
                deliveryStatus: [{ label: 'test', value: 'test' }, { label: 'test', value: 'test' }],
                brands: [{ label: 'test', value: 'test' }, { label: 'test', value: 'test' }],
            });
            expect(spy).toHaveBeenCalled();
        });
    });
});
