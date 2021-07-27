import { roundFloats } from './roundFloats'

export const getChipLabelAndValue = chip => {
  const indexOfDelimiter = chip.value.indexOf(':')

  return {
    chipLabel:
      indexOfDelimiter > 0 ? chip.value.slice(0, indexOfDelimiter) : chip.value,
    chipValue:
      indexOfDelimiter > 0
        ? roundFloats(chip.value.slice(indexOfDelimiter + 1))
        : ''
  }
}
