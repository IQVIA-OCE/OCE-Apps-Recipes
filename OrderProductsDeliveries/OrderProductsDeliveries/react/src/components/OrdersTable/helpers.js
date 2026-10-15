import { DateTime } from 'luxon';

export const getDatesFromOrders = (orders = []) => {
    const dates = [];
    orders.forEach(item => {
        return item.deliveries.map(delivery => {
            const date = DateTime.fromISO(delivery.date).toFormat('d/M/yy');
            const foundIndexOf = dates.findIndex(el => el.date === date);
            if (foundIndexOf === -1) {
                dates.push({ date, formattedDate: delivery.date, quantity: delivery.quantity });
            } else {
                dates[foundIndexOf] = {
                    ...dates[foundIndexOf],
                    quantity: dates[foundIndexOf].quantity + delivery.quantity
                }
            }
        });
    });

    dates.sort((a, b) => new Date(a.formattedDate) - new Date(b.formattedDate));
    return dates;
}

export const getSummQtyByDate = (singleDate, deliveries = []) => {
    let productQuantityByDate = 0;
    deliveries.filter(singleDelivery => {
        return singleDate.date === DateTime.fromISO(singleDelivery.date).toFormat('d/M/yy');
    }).forEach(item => {
        productQuantityByDate = productQuantityByDate + item.quantity;
    });
    return productQuantityByDate;
}
