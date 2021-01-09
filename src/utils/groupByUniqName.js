import { isEmpty, chain, has } from 'lodash'

export const groupByUniqName = (value, field = '') => {
  const makeUniq = items => {
    return chain(items)
      .filter(item => has(item, field + '.name') || has(item, 'name'))
      .uniqBy(field + '.name')
      .value()
  }
  if (!isEmpty(value.data)) {
    return {
      data: makeUniq(value.data)
    }
  } else {
    return makeUniq(value)
  }
}
