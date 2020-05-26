export const roundFloats = (value, precision) =>
  Number.isNaN(+value) || Number.isInteger(+value)
    ? value
    : (+value).toFixed(precision ?? 2)
