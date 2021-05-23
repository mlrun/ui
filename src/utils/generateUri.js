import {
  DATASETS_TAB,
  ARTIFACTS,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  MODELS_TAB
} from '../constants'
import { isNil } from 'lodash'

export const generateUri = (item, tab) => {
  let uri = `store://${tab}/${item.project}/`

  if (tab === MODELS_TAB || tab === DATASETS_TAB || tab === ARTIFACTS) {
    uri += item.db_key
    if (item.tag) uri += `:${item.tag}`
    else {
      if (!isNil(item.iter)) uri += `#${item.iter}`
      if (item.tree) uri += `@${item.tree}`
    }
  } else if (tab === FEATURE_SETS_TAB || tab === FEATURE_VECTORS_TAB) {
    uri += item.name
    if (item.tag) uri += `:${item.tag}`
    else if (item.uid) uri += `@${item.uid}`
  }

  return uri
}
