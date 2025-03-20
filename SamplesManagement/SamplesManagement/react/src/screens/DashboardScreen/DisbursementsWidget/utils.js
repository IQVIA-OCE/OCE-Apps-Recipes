import moment from 'moment';
const DATE_FORMAT = 'YYYY-MM';
import Color from 'color';

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

export const generateColors = total_colors => {
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

const generateDumpChartData = period => {
  const dumpData = [];
  for (let i = period; i >= 0; i -= 1) {
    dumpData.push({
      x: moment()
        .subtract(i, 'months')
        .format(DATE_FORMAT),
      y: 0,
    });
  }

  return dumpData;
};
export const normalizeDisbursements = period => data => {
  const normalized = data.reduce(
    (acc, disbursement) => {
      if (acc.allIds.indexOf(disbursement.Id) === -1) {
        acc.allIds.push(disbursement.Id);
      }

      if (!acc.byId[disbursement.Id]) {
        acc.byId[disbursement.Id] = {
          label: disbursement.productName ? disbursement.productName : '',
          data: generateDumpChartData(period),
        };
      }

      acc.byId[disbursement.Id].data.map(el => {
        const label = moment()
          .month(disbursement.month - 1)
          .year(disbursement.year)
          .format(DATE_FORMAT);

        if (moment(el.x).isSame(label, 'month')) {
          el.y = disbursement.totalQuantity;
        }

        el.tooltip = `${disbursement.productName}: ${el.y}`;
        el.x = moment(el.x).toDate();
        return el;
      });

      return acc;
    },
    { allIds: [], byId: {} }
  );

  normalized.colors = generateColors(normalized.allIds.length)

  normalized.allIds.forEach((id, i) => {
    normalized.byId[id].color = normalized.colors[i];
  })

  return normalized;
};
export  const handleFilterData = (id, filtered, disbursements) => {
  const index = filtered.ids.indexOf(id);
  const colors = [];
  let ids = [];
  if (index !== -1) {
    ids = filtered.ids.filter(el => {
      if (el !== id) {
        colors.push(disbursements.data.byId[el].color);
        return true;
      }
      return false;
    });
  } else {
    disbursements.data.allIds.forEach(el => {
      if (el === id || filtered.ids.includes(el)) {
        ids.push(el);
        colors.push(disbursements.data.byId[el].color);
      }
    });
  }

  return { colors, ids }
};