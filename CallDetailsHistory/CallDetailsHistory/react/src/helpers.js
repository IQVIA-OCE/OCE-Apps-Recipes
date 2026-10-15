import { fetchAccountCalls, fetchCallDetails } from './api/callDetailsHistoryApi';
import { NAMESPACE } from './constants/namespace';
import Color from 'color';
import { DateTime } from 'luxon';

const base_colors = [
  Color('#5899DA'),
  Color('#E8743B'),
  Color('#19A979'),
  Color('#ED4A7B'),
  Color('#945ECF'),
  Color('#13A4B4'),
  Color('#525DF4'),
  Color('#BF399E'),
  Color('#6C8893'),
  Color('#EE6868'),
  Color('#2F6497'),
];

const generateColors = (total_colors) => {
  const colors = [];
  const gradient_step = (base_colors.length - 1) / total_colors;

  let gradient = 0;

  colors.push(base_colors[0].hex());

  for (let i = 1; i < total_colors - 1; i++) {
    gradient += gradient_step;

    const from_index = Math.floor(gradient);
    let to_index = Math.ceil(gradient);

    if (from_index === to_index) {
      to_index = from_index + 1;
    }

    const from_color = base_colors[from_index];
    const to_color = base_colors[to_index];

    const mix_position = gradient % 1;

    colors.push(from_color.mix(to_color, mix_position).hex());
  }

  colors.push(base_colors[base_colors.length - 1].hex());

  return colors;
};

const getFilteredColors = (data, filteredData) => {
  const colors = generateColors(data.length);

  return filteredData.map(el => {
    const index = data.findIndex(x => x.productId === el.productId);
    return colors[index]
  });
};

const getNormalizedData = async accountId => {
  try {
    const accountCalls = await fetchAccountCalls(accountId);

    if (accountCalls.length === 0) {
      throw new Error('This account has no recent calls')
    }

    const callDetails = await fetchCallDetails(accountCalls);

    const filteredCallDetails = Array
      .from(new Set(callDetails.map(el => el[`${NAMESPACE}Product__r`].Id)))
      .map(id => callDetails.find(el => el[`${NAMESPACE}Product__r`].Id === id));

    const colors = generateColors(filteredCallDetails.length);

    return filteredCallDetails.map((el, i) => {
        const id = el[`${NAMESPACE}Product__r`].Id;
        const name = el[`${NAMESPACE}Product__r`].Name;

        return {
          productName: name,
          productId: id,
          productColor: colors[i],
          calls: callDetails
            .filter(x => x[`${NAMESPACE}Product__r`].Id === id)
            .map(x => {
              return {
                id: x.Id,
                date: x[`${NAMESPACE}CallDateTime__c`]
              }
            })
        }
      });
  } catch (e) {
    throw new Error(e.message)
  }
};

const getChartMonths = (period = 12) => {
  let array = [];

  for (let i = 0; i < period; i++) {
    const localDate = DateTime.local();
    const month = localDate.minus({ months: i }).get('monthShort');
    const year = localDate.minus({ months: i }).get('year');

    array.push({
      x: `${month} ${year}`,
      y: 0,
    })
  }

  return array.reverse();
};

const getNormalizedChartData = (data, period) => {
  if (data) {
    return data.map(el => {
      const chartData = getChartMonths(period);

      el.calls.forEach(call => {
        const callDate = DateTime.fromISO(call.date);
        const callFormattedDate = `${callDate.get('monthShort')} ${callDate.get('year')}`;
        const dataIndex = chartData.findIndex(n => n.x === callFormattedDate);

        if (dataIndex !== -1) {
          chartData[dataIndex].y += 1;
        }
      });

      chartData.forEach(dataEl => {
        dataEl.tooltip = `${el.productName}: Submitted ${dataEl.y} times`
      });

      return {
        data: chartData
      }
    })
  }
};

export {
  generateColors,
  getFilteredColors,
  getNormalizedData,
  getNormalizedChartData,
  getChartMonths
}
