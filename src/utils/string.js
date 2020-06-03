import _ from 'lodash'

export const truncateUid = (value = '') =>
  value.length > 7 ? `...${value.slice(-7)}` : value

export const joinDataOfArrayOrObject = (data, splitCharacter = ',') => {
  if (Array.isArray(data)) {
    return data.join(splitCharacter)
  } else if (_.isObject(data)) {
    return Object.values(data).join(splitCharacter)
  }

  return data.toString()
}
