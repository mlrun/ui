import { chain } from 'lodash'
import { parseFunction } from './parseFunction'

export const parseFunctions = (functions, projectName) => {
  return chain(functions)
    .orderBy('metadata.updated', 'desc')
    .map(func => parseFunction(func, projectName))
    .value()
}
