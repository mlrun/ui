/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { cloneDeep, debounce, isEmpty, isEqual, isNil } from 'lodash'

import artifactApi from '../api/artifacts-api'
import {
  ARTIFACT_TYPE,
  BE_PAGE,
  DATASET_TYPE,
  DATASETS_PAGE,
  DOCUMENT_TYPE,
  DOCUMENTS_PAGE,
  FE_PAGE,
  FILES_PAGE,
  LLM_PROMPTS_PAGE,
  MODEL_TYPE,
  MODELS_PAGE,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST,
  ALL_VERSIONS_PATH,
  LLM_PROMPT_TYPE,
  LLM_PROMPT_TITLE
} from '../constants'
import { VIEW_SEARCH_PARAMETER } from 'igz-controls/constants'
import {
  deleteTag,
  editTag,
  addTag,
  fetchDataSet,
  fetchFile,
  fetchModel,
  fetchDocument,
  fetchLLMPrompt
} from '../reducers/artifactsReducer'
import { getArtifactIdentifier } from './getUniqueIdentifier'
import { parseArtifacts } from './parseArtifacts'
import { parseIdentifier } from './parseUri'
import { setFilters, setModalFiltersValues } from '../reducers/filtersReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { getFilteredSearchParams } from 'igz-controls/utils/filter.util'
import { generateObjectNotInTheListMessage } from './generateMessage.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { ConfirmDialog } from 'igz-controls/components'
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { createArtifactMessages } from './createArtifact.util'

export const applyTagChanges = (changes, artifactItem, projectName, dispatch, setNotification) => {
  let updateTagMsg = 'Tag was updated'
  let updateTagPromise = Promise.resolve()
  artifactItem = cloneDeep(artifactItem)

  if ('tag' in changes.data) {
    const identifier = {
      key: artifactItem.db_key || artifactItem.key,
      kind: artifactItem.kind,
      uid: artifactItem.uid || artifactItem.tree
    }

    if (artifactItem.iter !== 0) {
      identifier.iter = artifactItem.iter
    }

    let manageTagArgs = {
      project: projectName,
      tag: changes.data.tag.currentFieldValue,
      data: {
        kind: 'artifact',
        identifiers: [identifier]
      }
    }

    artifactItem.tag = changes.data.tag.currentFieldValue

    if (artifactItem.tag === '') {
      updateTagMsg = 'Tag was deleted successfully'
      manageTagArgs.tag = changes.data.tag.initialFieldValue
      updateTagPromise = dispatch(deleteTag(manageTagArgs))
    } else {
      manageTagArgs.oldTag = changes.data.tag.initialFieldValue

      if (manageTagArgs.oldTag) {
        updateTagPromise = dispatch(editTag(manageTagArgs))
      } else {
        updateTagPromise = dispatch(addTag(manageTagArgs))
      }
    }

    return updateTagPromise
      .unwrap()
      .then(response => {
        dispatch(
          setNotification({
            status: response.status,
            id: Math.random(),
            message: updateTagMsg
          })
        )
      })
      .catch(error => {
        showErrorNotification(dispatch, error, '', 'Failed to update the tag', () =>
          applyTagChanges(changes, artifactItem, projectName, dispatch, setNotification)
        )
      })
  } else {
    return updateTagPromise
  }
}

export const processActionAfterTagUniquesValidation = ({
  tag = '',
  artifact,
  projectName,
  dispatch,
  actionCallback,
  showLoader = () => {},
  hideLoader = () => {},
  getCustomErrorMsg = () => 'Failed to update a tag',
  onErrorCallback,
  throwError = false
}) => {
  showLoader()

  if (tag === '') {
    return actionCallback().finally(hideLoader)
  }

  const messagesByKind = createArtifactMessages[artifact.kind.toLowerCase()]

  return artifactApi
    .getExpandedArtifact(projectName, artifact.db_key ?? artifact.spec.db_key ?? artifact.key , tag)
    .then(response => {
      if (response?.data) {
        if (!isEmpty(response.data.artifacts)) {
          return new Promise((resolve, _reject) => {
            const reject = (...args) => {
              hideLoader()

              return _reject(...args)
            }

            // hide and show loader again to avoid UI loader above confirmation dialog
            hideLoader()
            openPopUp(ConfirmDialog, {
              confirmButton: {
                label: 'Overwrite',
                variant: PRIMARY_BUTTON,
                handler: () => {
                  showLoader()
                  actionCallback().then(resolve).catch(reject).finally(hideLoader)
                }
              },
              cancelButton: {
                label: 'Cancel',
                variant: TERTIARY_BUTTON,
                handler: () => reject()
              },
              closePopUp: () => reject(),
              header: messagesByKind.overwriteConfirmTitle,
              message: messagesByKind.getOverwriteConfirmMessage(
                response.data.artifacts[0].kind === LLM_PROMPT_TYPE
                  ? LLM_PROMPT_TITLE
                  : response.data.artifacts[0].kind || ARTIFACT_TYPE
              ),
              className: 'override-artifact-dialog'
            })
          })
        } else {
          return actionCallback().finally(hideLoader)
        }
      }
    })
    .catch(error => {
      if (error) {
        showErrorNotification(dispatch, error, '', getCustomErrorMsg(error), () =>
          processActionAfterTagUniquesValidation({
            tag,
            artifact,
            projectName,
            dispatch,
            actionCallback,
            getCustomErrorMsg,
            onErrorCallback,
            throwError
          })
        )

        onErrorCallback?.()
      }

      hideLoader()

      if (throwError) throw error
    })
}

export const isArtifactTagUnique = (projectName, category, artifact) => async value => {
  const artifactCategory = {
    MODELS_TAB: MODEL_TYPE,
    ARTIFACTS_PAGE: ARTIFACT_TYPE,
    DATASETS_PAGE: DATASET_TYPE,
    DOCUMENTS_PAGE: DOCUMENT_TYPE
  }

  if (!value) return

  const {
    data: { artifacts }
  } = await artifactApi.getArtifacts(
    projectName,
    {},
    {
      params: {
        category: artifactCategory[category],
        format: 'full',
        name: artifact.db_key,
        tag: value
      }
    }
  )

  if (
    artifacts.length === 1 &&
    getArtifactIdentifier(parseArtifacts(artifacts)[0], true) ===
      getArtifactIdentifier(artifact, true)
  ) {
    return true
  }

  return artifacts.length === 0
}

/**
 * Sets artifact tags for filtering and dispatches a filter update action
 *
 * @param {Array.<Object>} artifacts - Array of artifact objects
 * @param {Function} setArtifacts - Setter function for filtered artifacts
 * @param {Function} setAllArtifacts - Setter function for all artifacts
 * @param {Object} filters - Object containing current filter settings
 * @param {Function} dispatch - Redux dispatch function
 * @param {String} page - Current page value
 */
export const setArtifactTags = (
  artifacts,
  setArtifacts,
  setAllArtifacts,
  filters,
  dispatch,
  page
) => {
  if (artifacts) {
    const tagOptions = generateArtifactTags(artifacts)
    const tag = !filters.tag ? TAG_FILTER_LATEST : filters.tag

    if (tag && tag !== TAG_FILTER_ALL_ITEMS) {
      const newArtifacts = artifacts.filter(
        artifact => artifact.tree === tag || artifact.tag === tag
      )

      setArtifacts(newArtifacts)
    } else {
      setArtifacts(artifacts)
    }

    setAllArtifacts(artifacts)

    dispatch(setFilters({ tagOptions }))
    dispatch(
      setModalFiltersValues({
        name: page,
        value: { tag }
      })
    )
  }
}

/**
 * Generates an array of unique artifact tags from an array of artifacts.
 *
 * @param {Array.<Object>} artifacts - An array of artifacts, where each artifact is an object with a `tag` property.
 * @returns {Array.<string>} An array of unique tag strings, with any falsy values (e.g. empty strings or nulls) filtered out.
 */
const generateArtifactTags = artifacts => {
  const uniqueTags = new Set()
  artifacts.forEach(artifact => uniqueTags.add(artifact.tag))

  return Array.from(uniqueTags).filter(Boolean)
}

const getArtifactLabelByTabName = (page = FILES_PAGE) => {
  const typeMap = {
    [FILES_PAGE]: 'artifact',
    [DATASETS_PAGE]: 'dataset',
    [DOCUMENTS_PAGE]: 'document',
    [MODELS_PAGE]: 'model',
    [LLM_PROMPTS_PAGE]: 'LLM prompt'
  }

  return typeMap[page]
}

export const checkForSelectedArtifact = debounce(
  ({
    artifactName,
    artifacts,
    dispatch,
    isAllVersions,
    navigate,
    paginatedArtifacts,
    paginationConfigRef,
    paramsId,
    projectName,
    searchParams,
    setSearchParams,
    setSelectedArtifact,
    lastCheckedArtifactIdRef,
    page,
    tab
  }) => {
    if (paramsId) {
      const searchBePage = parseInt(searchParams.get(BE_PAGE))
      const configBePage = paginationConfigRef.current[BE_PAGE]

      if (
        artifacts &&
        searchBePage === configBePage &&
        lastCheckedArtifactIdRef.current !== paramsId
      ) {
        lastCheckedArtifactIdRef.current = paramsId

        setFullSelectedArtifact(
          page,
          tab,
          dispatch,
          navigate,
          artifactName,
          setSelectedArtifact,
          projectName,
          paramsId,
          isAllVersions
        ).then(artifact => {
          if (artifact) {
            const findArtifactIndex = artifactList =>
              artifactList.findIndex(iteratedArtifact => {
                const iteratedArtifactData = iteratedArtifact.data ?? iteratedArtifact
                const fetchedArtifactData = artifact.data ?? artifact

                return (
                  iteratedArtifactData.uid === fetchedArtifactData.uid &&
                  (iteratedArtifactData.tag === fetchedArtifactData.tag ||
                    (isNil(iteratedArtifactData.tag) && isNil(fetchedArtifactData.tag)))
                )
              })

            if (findArtifactIndex(paginatedArtifacts) === -1) {
              const itemIndexInMainList = findArtifactIndex(artifacts)
              const { tag, uid } = parseIdentifier(paramsId)

              if (itemIndexInMainList > -1) {
                const { fePageSize } = paginationConfigRef.current

                setSearchParams(prevSearchParams => {
                  prevSearchParams.set(FE_PAGE, Math.ceil((itemIndexInMainList + 1) / fePageSize))

                  return prevSearchParams
                })
              } else if (tag && !artifact.tag && uid === artifact.uid) {
                artifact.ui.infoMessage = `The ${getArtifactLabelByTabName(page)} you are viewing was updated. Close the detail panel and refresh the list to see the current version.`
              } else {
                artifact.ui.infoMessage = generateObjectNotInTheListMessage(
                  getArtifactLabelByTabName(page)
                )
              }
            }
          }
        })
      }
    } else {
      setSelectedArtifact({})
    }
  },
  30
)

export const setFullSelectedArtifact = (
  page,
  tab,
  dispatch,
  navigate,
  artifactName,
  setSelectedArtifact,
  projectName,
  artifactId,
  isAllVersions
) => {
  const { tag, uid, iter } = parseIdentifier(artifactId)
  const fetchArtifactData = getArtifactFetchMethod(page)

  return dispatch(fetchArtifactData({ projectName, artifactName, uid, tag, iter }))
    .unwrap()
    .then(artifact => {
      if (!isEmpty(artifact)) {
        queueMicrotask(() => {
          setSelectedArtifact(prevState => {
            return isEqual(prevState, artifact) ? prevState : artifact
          })
        })
      } else {
        setSelectedArtifact({})
      }
      return artifact
    })
    .catch(error => {
      setSelectedArtifact({})
      navigate(
        `/projects/${projectName}/${page}${tab ? `/${tab}` : ''}${isAllVersions ? `/${artifactName}/${ALL_VERSIONS_PATH}` : ''}${getFilteredSearchParams(
          window.location.search,
          [VIEW_SEARCH_PARAMETER]
        )}`,
        { replace: true }
      )
      showArtifactErrorNotification(dispatch, error, page)
    })
}

export const chooseOrFetchArtifact = (dispatch, page, tab, selectedArtifact, artifactMin) => {
  if (!isEmpty(selectedArtifact)) return Promise.resolve(selectedArtifact)
  const fetchArtifactData = getArtifactFetchMethod(page)

  return dispatch(
    fetchArtifactData({
      projectName: artifactMin.project,
      artifactName: artifactMin.db_key,
      uid: artifactMin.uid,
      tree: artifactMin.tree,
      tag: artifactMin.tag,
      iter: artifactMin.iter
    })
  )
    .unwrap()
    .catch(error => {
      showArtifactErrorNotification(dispatch, error, page)
    })
}

const getArtifactFetchMethod = page => {
  switch (page) {
    case DATASETS_PAGE:
      return fetchDataSet
    case FILES_PAGE:
      return fetchFile
    case MODELS_PAGE:
      return fetchModel
    case DOCUMENTS_PAGE:
      return fetchDocument
    case LLM_PROMPTS_PAGE:
      return fetchLLMPrompt
    default:
      return null
  }
}

export const showArtifactErrorNotification = (dispatch, error, page) => {
  let customArtifactErrorMsg = `An error occurred while retrieving the ${getArtifactLabelByTabName(page)}.`

  showErrorNotification(dispatch, error, '', customArtifactErrorMsg)
}
