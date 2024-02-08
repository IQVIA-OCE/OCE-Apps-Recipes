import { getDatesFromOrders, getSummQtyByDate } from "./helpers";
import mockData from "../../utils/mock.json";

const expectedDatesResult = [
  { date: "2/9/20", formattedDate: "2020-09-02", quantity: 90 },
  { date: "3/9/20", formattedDate: "2020-09-03", quantity: 930 },
  { date: "5/9/20", formattedDate: "2020-09-05", quantity: 800 },
  { date: "17/9/20", formattedDate: "2020-09-17", quantity: 111 },
  { date: "24/9/20", formattedDate: "2020-09-24", quantity: 7 },
  { date: "25/9/20", formattedDate: "2020-09-25", quantity: 9 },
  { date: "26/9/20", formattedDate: "2020-09-26", quantity: 7 },
  { date: "2/10/20", formattedDate: "2020-10-02", quantity: 903 },
  { date: "3/10/20", formattedDate: "2020-10-03", quantity: 9 },
  { date: "5/10/20", formattedDate: "2020-10-05", quantity: 9 },
  { date: "7/10/20", formattedDate: "2020-10-07", quantity: 9 },
];

describe("Order table helpers ", () => {
  it("should return sorted data", () => {
    const date = getDatesFromOrders(mockData);
    expect(date).toStrictEqual(expectedDatesResult);
  });
  it("should return sorted data without orders", () => {
    const date = getDatesFromOrders();
    expect(date).toStrictEqual([]);
  });
});

describe("Summ Qty by date ", () => {
  it("should return calculated data", () => {
    const order = mockData[0];
    const qty = getSummQtyByDate(expectedDatesResult[0], order.deliveries);
    expect(qty).toStrictEqual(90);
  });

  it("should return calculated data without deliveries", () => {
    const qty = getSummQtyByDate(expectedDatesResult[0]);
    expect(qty).toStrictEqual(0);
  });
});
