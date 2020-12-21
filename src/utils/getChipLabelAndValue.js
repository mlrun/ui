import { roundFloats } from './roundFloats'

export const getChipLabelAndValue = chip => {
  const indexOfDelimiter = chip.value.indexOf(':')

  return {
    chipLabel: chip.value.slice(0, indexOfDelimiter),
    chipValue:
      indexOfDelimiter > 0
        ? roundFloats(chip.value.slice(indexOfDelimiter + 1))
        : chip.value
  }
}
