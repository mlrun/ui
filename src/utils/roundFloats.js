export const roundFloats = (value, precision) => {
  const floatNumber = parseFloat(value)

  if (isNaN(floatNumber)) return ''

  return parseFloat(floatNumber.toFixed(precision ?? 2))
}
