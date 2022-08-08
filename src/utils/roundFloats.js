export const roundFloats = (value, precision) => {
  const floatNumber = parseFloat(value)

  if (isNaN(floatNumber)) return value

  return parseFloat(floatNumber.toFixed(precision ?? 2))
}
