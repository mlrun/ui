import {
  NEW_FUNCTION_ADVANCED_SECTION,
  NEW_FUNCTION_SECRETS_SECTION,
  NEW_FUNCTION_TOPOLOGY_SECTION
} from '../../constants'

export const runtimeSections = {
  serving: [
    { id: NEW_FUNCTION_TOPOLOGY_SECTION },
    { id: NEW_FUNCTION_SECRETS_SECTION },
    { id: NEW_FUNCTION_ADVANCED_SECTION }
  ]
}
