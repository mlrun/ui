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
import { cloneDeep } from 'lodash'
import { deleteTag, editTag, addTag } from '../reducers/artifactsReducer'

import artifactApi from '../api/artifacts-api'
import { ARTIFACT_TYPE, DATASET_TYPE, MODEL_TYPE } from '../constants'
import { getArtifactIdentifier } from './getUniqueIdentifier'
import { parseArtifacts } from './parseArtifacts'

export const applyTagChanges = (changes, artifactItem, projectName, dispatch, setNotification) => {
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
            message: 'Tag was updated successfully'
          })
        )
      })
      .catch(error => {
        dispatch(
          setNotification({
            status: error.response?.status || 400,
            id: Math.random(),
            message: 'Failed to update the tag',
            retry: () =>
              applyTagChanges(changes, artifactItem, projectName, dispatch, setNotification)
          })
        )
      })
  } else {
    return updateTagPromise
  }
}

export const isArtifactNameUnique = projectName => async value => {
  if (!value) return

  const {
    data: { artifacts }
  } = await artifactApi.getArtifact(projectName, value)

  return artifacts.length === 0
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
