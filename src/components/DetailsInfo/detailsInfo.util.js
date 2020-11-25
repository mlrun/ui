import {
  ARTIFACTS_FEATURE_SETS_PAGE,
  ARTIFACTS_FEATURE_STORE,
  ARTIFACTS_FILES_PAGE,
  ARTIFACTS_MODELS_PAGE
} from '../../constants'
import { formatDatetime } from '../../utils'
import { isNil, isEmpty } from 'lodash'

export const generateArtifactsContent = (pageKind, pageTab, selectedItem) => {
  if (pageTab === ARTIFACTS_FEATURE_SETS_PAGE) {
    return [
      selectedItem.name,
      isEmpty(selectedItem.labels) ? [] : selectedItem.labels,
      selectedItem.tag,
      formatDatetime(selectedItem.updated, 'N/A'),
      selectedItem.parition_keys
    ]
  }

  return [
    selectedItem.hash ?? '',
    selectedItem.db_key,
    selectedItem.iter || '0',
    pageKind !== ARTIFACTS_FEATURE_STORE && pageKind !== ARTIFACTS_FILES_PAGE
      ? selectedItem.kind || ' '
      : null,
    selectedItem.size ?? '',
    selectedItem.target_path,
    selectedItem.tree,
    formatDatetime(new Date(selectedItem.updated), 'N/A'),
    pageKind === ARTIFACTS_MODELS_PAGE ? selectedItem.framework ?? '' : null,
    selectedItem.labels ?? [],
    selectedItem.sources
  ].filter(content => !isNil(content))
}
