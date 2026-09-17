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

export const generateColors = (total_colors) => {
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
