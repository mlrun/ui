import { capitalize } from 'lodash'

export const generateFunctionPriorityLabel = id => {
  let labelName = id.split('-').pop()
  return capitalize(labelName)
}
