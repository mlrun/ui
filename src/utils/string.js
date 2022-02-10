import { isNil, isObject } from 'lodash'

export const truncateUid = (value = '') =>
  value.length > 7 ? `...${value.slice(-7)}` : value

export const joinDataOfArrayOrObject = (data, splitCharacter = ',') => {
  if (isNil(data)) {
    return ''
  } else if (Array.isArray(data)) {
    return data.join(splitCharacter)
  } else if (isObject(data)) {
    return Object.values(data).join(splitCharacter)
  }

  return data.toString()
}

export const deleteUnsafeHtml = unsafeStr => {
  return unsafeStr.replace(/[&<>"'()]/g, '')
}

export const trimSplit = (value, delimiter) => {
  const trimmed = (value ?? '').trim()
  return trimmed ? trimmed.split(delimiter) : []
}
