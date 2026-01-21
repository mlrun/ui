import { FILTER_ALL_ITEMS, LABELS_FILTER, ME_MODE_FILTER } from '../../constants'

export const filtersConfig = {
  [ME_MODE_FILTER]: { label: 'Mode:', initialValue: FILTER_ALL_ITEMS, isModal: true },
  [LABELS_FILTER]: { label: 'Labels:', initialValue: '', isModal: true }
}
