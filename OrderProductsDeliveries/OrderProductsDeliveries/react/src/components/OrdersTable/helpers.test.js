import { getDatesFromOrders, getSummQtyByDate } from "./helpers";
import mockData from '../../utils/mock.json';

const expectedDatesResult = [
    { "date": "9/2/20", "quantity": 90 }, 
    { "date": "9/3/20", "quantity": 930 }, 
    { "date": "9/5/20", "quantity": 800 }, 
    { "date": "9/17/20", "quantity": 111 }, 
    { "date": "9/24/20", "quantity": 7 }, 
    { "date": "9/25/20", "quantity": 9 }, 
    { "date": "9/26/20", "quantity": 7 }, 
    { "date": "10/2/20", "quantity": 903 }, 
    { "date": "10/3/20", "quantity": 9 }, 
    { "date": "10/5/20", "quantity": 9 }, 
    { "date": "10/7/20", "quantity": 9 }
];

describe("Order table helpers ", () => {
    it('should return sorted data', () => {
        const date = getDatesFromOrders(mockData);
        expect(date).toStrictEqual(expectedDatesResult);
    });
});

describe("Summ Qty by date ", () => {
    it('should return calculated data', () => {
        const order = mockData[0];
        const qty = getSummQtyByDate(order.deliveries, expectedDatesResult[0]);
        expect(qty).toStrictEqual(90);
    });
});