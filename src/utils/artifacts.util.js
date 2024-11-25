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
import { cloneDeep, debounce, isEmpty } from 'lodash'

import artifactApi from '../api/artifacts-api'
import {
  ARTIFACT_TYPE,
  DATASET_TYPE,
  DATASETS_TAB,
  FILES_TAB,
  MODEL_TYPE,
  MODELS_TAB
} from '../constants'
import { TAG_FILTER_ALL_ITEMS, TAG_FILTER_LATEST } from '../constants'
import {
  deleteTag,
  editTag,
  addTag,
  fetchDataSet,
  fetchFile,
  fetchModel
} from '../reducers/artifactsReducer'
import { getArtifactIdentifier } from './getUniqueIdentifier'
import { parseArtifacts } from './parseArtifacts'
import { setFilters, setModalFiltersValues } from '../reducers/filtersReducer'
import { showErrorNotification } from './notifications.util'

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

export const isArtifactTagUnique = (projectName, category, artifact) => async value => {
  const artifactCategory = {
    MODELS_TAB: MODEL_TYPE,
    ARTIFACTS_PAGE: ARTIFACT_TYPE,
    DATASETS_PAGE: DATASET_TYPE
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

export const setFullSelectedArtifact = debounce(
  (tab, dispatch, navigate, selectedArtifactMin, setSelectedArtifact, projectName) => {
    if (isEmpty(selectedArtifactMin)) {
      setSelectedArtifact({})
    } else {
      const { db_key, tree, tag, iter, uid } = selectedArtifactMin
      const fetchArtifactData = getArtifactFetchMethod(tab)

      dispatch(fetchArtifactData({ projectName, artifactName: db_key, uid, tree, tag, iter }))
        .unwrap()
        .then(artifact => {
          setSelectedArtifact(artifact)
        })
        .catch(error => {
          navigate(`/projects/${projectName}/${tab}${window.location.search}`, { replace: true })
          showArtifactErrorNotification(dispatch, error, tab)
        })
    }
  },
  50
)

export const chooseOrFetchArtifact = (dispatch, tab, selectedArtifact, artifactMin) => {
  if (!isEmpty(selectedArtifact)) return Promise.resolve(selectedArtifact)
  const fetchArtifactData = getArtifactFetchMethod(tab)

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
      showArtifactErrorNotification(dispatch, error, tab)
    })
}

const getArtifactFetchMethod = tab => {
  return tab === DATASETS_TAB
    ? fetchDataSet
    : tab === FILES_TAB
      ? fetchFile
      : tab === MODELS_TAB
        ? fetchModel
        : null
}

export const showArtifactErrorNotification = (dispatch, error, tab) => {
  const customArtifactErrorMsg =
    tab === DATASETS_TAB
      ? 'Failed to retrieve dataset data'
      : tab === FILES_TAB
        ? 'Failed to retrieve artifact data'
        : tab === MODELS_TAB
          ? 'Failed to retrieve model data'
          : null

  showErrorNotification(dispatch, error, '', customArtifactErrorMsg)
}
