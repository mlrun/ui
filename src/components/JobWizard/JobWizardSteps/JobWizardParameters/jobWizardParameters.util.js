import { LIST_TUNING_STRATEGY, MAX_SELECTOR_CRITERIA } from '../../../../constants'

export const selectOptions = {
  hyperStrategyType: [
    {
      label: 'List',
      id: LIST_TUNING_STRATEGY
    },
    {
      label: 'Grid',
      id: 'grid'
    },
    {
      label: 'Random',
      id: 'random'
    }
  ],
  selectorCriteria: [
    {
      label: 'Max',
      id: MAX_SELECTOR_CRITERIA
    },
    {
      label: 'Min',
      id: 'min'
    }
  ]
}