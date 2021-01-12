import { isEmpty, chain, has } from 'lodash'

export const groupByUniqName = (value, path) => {
  const makeUniq = value => {
    return chain(value)
      .filter(item => has(item, path))
      .uniqBy(path)
      .value()
  }
  return isEmpty(value.data) ? makeUniq(value) : { data: makeUniq(value.data) }
}
