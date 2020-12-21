import {
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  MODELS_PAGE
} from '../../constants'
import { formatDatetime } from '../../utils'
import { isNil, isEmpty } from 'lodash'

export const generateArtifactsContent = (page, pageTab, selectedItem) => {
  if (pageTab === FEATURE_SETS_TAB) {
    return [
      selectedItem.description ?? '',
      isEmpty(selectedItem.labels) ? [] : selectedItem.labels,
      selectedItem.tag,
      formatDatetime(selectedItem.updated, 'N/A'),
      selectedItem.entities?.map(entity => entity.name),
      (selectedItem.parition_keys || []).map(key => key),
      selectedItem.timestamp_key ?? '',
      isEmpty(selectedItem.relations) ? [] : selectedItem.relations,
      selectedItem.label_column ?? ''
    ]
  }

  return [
    selectedItem.hash ?? '',
    selectedItem.db_key,
    selectedItem.iter || '0',
    page !== FEATURE_STORE_PAGE && page !== FILES_PAGE
      ? selectedItem.kind || ' '
      : null,
    selectedItem.size ?? '',
    selectedItem.target_path,
    selectedItem.tree,
    formatDatetime(new Date(selectedItem.updated), 'N/A'),
    page === MODELS_PAGE ? selectedItem.framework ?? '' : null,
    selectedItem.labels ?? [],
    selectedItem.sources
  ].filter(content => !isNil(content))
}
