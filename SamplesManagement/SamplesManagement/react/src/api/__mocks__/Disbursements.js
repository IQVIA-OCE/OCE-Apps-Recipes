export const fetchDisbursements = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5E0k000001lMI9EAM',
      productName: 'Azelastine 100 MG',
      totalQuantity: 3,
      year: 2024,
      month: 5,
    },
  ],
  {
    totalSize: 1,
    done: true,
  },
]);
