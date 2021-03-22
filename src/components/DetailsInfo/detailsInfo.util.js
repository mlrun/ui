import {
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE
} from '../../constants'
import { formatDatetime } from '../../utils'
import { isNil } from 'lodash'

export const generateArtifactsInfoContent = (page, pageTab, selectedItem) => {
  if (pageTab === MODEL_ENDPOINTS_TAB) {
    const { name, tag } =
      (selectedItem?.metadata?.uid ?? '').match(/^(?<name>.*?):(?<tag>.*)$/)
        ?.groups ?? {}
    return [tag, name]
  } else
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
