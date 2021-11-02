import { DateTime } from 'luxon';

export const getDatesFromOrders = (orders = []) => {
    const dates = [];
    orders.map(item => {
        return item.deliveries.map(delivery => {
            const date = DateTime.fromISO(delivery.date).toFormat('M/d/yy');
            const foundIndexOf = dates.findIndex(el => el.date === date);
            if (foundIndexOf === -1) {
                dates.push({ date, quantity: delivery.quantity });
            } else {
                dates[foundIndexOf] = {
                    ...dates[foundIndexOf],
                    quantity: dates[foundIndexOf].quantity + delivery.quantity
                }
            }
        });
    });
    dates.sort((a, b) => new Date(a.date) - new Date(b.date));
    return dates;
}

export const getSummQtyByDate = (deliveries = [], singleDate) => {
    let productQuantityByDate = 0;
    deliveries.filter(singleDelivery => {
        return singleDate.date === DateTime.fromISO(singleDelivery.date).toFormat('M/d/yy');
    }).map(item => {
        productQuantityByDate = productQuantityByDate + item.quantity;
    });
    return productQuantityByDate;
}