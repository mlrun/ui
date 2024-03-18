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
import { getArtifactReference } from './resources'
import {
  AZURE_STORAGE_INPUT_PATH_SCHEME,
  GOOGLE_STORAGE_INPUT_PATH_SCHEME,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  S3_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../constants'
import { uniqBy } from 'lodash'

export const generateProjectsList = (projectsList, currentProject) =>
  projectsList
    .map(projectItem => ({
      label: projectItem === currentProject ? `${projectItem} (Current project)` : projectItem,
      id: projectItem
    }))
    .sort((prevProject, nextProject) => {
      return prevProject.id === currentProject
        ? -1
        : nextProject.id === currentProject
        ? 1
        : prevProject.id.localeCompare(nextProject.id)
    })

export const generateArtifactsList = artifacts => {
  const generatedArtifacts = artifacts
    .map(artifact => {
      const key = artifact.link_iteration?.db_key || artifact.db_key || artifact.key || ''
      return {
        label: key,
        id: key
      }
    })
    .filter(artifact => artifact.label !== '')
    .sort((prevArtifact, nextArtifact) => prevArtifact.id.localeCompare(nextArtifact.id))

  return uniqBy(generatedArtifacts, 'id')
}

export const generateArtifactsReferencesList = artifacts => {
  const generatedArtifacts = artifacts
    .map(artifact => {
      const artifactReference = getArtifactReference(artifact)

      return {
        label: artifactReference,
        id: artifactReference,
        customDelimiter: artifactReference[0]
      }
    })
    .filter(reference => reference.label !== '')
    .sort((prevRef, nextRef) => {
      const [prevRefIter, prevRefTree] = prevRef.id.split('@')
      const [nextRefIter, nextRefTree] = nextRef.id.split('@')

      if (!prevRefTree || !nextRefTree || prevRefTree === nextRefTree) {
        return prevRefIter.localeCompare(nextRefIter)
      } else {
        return prevRefTree.localeCompare(nextRefTree)
      }
    })

  return uniqBy(generatedArtifacts, 'id')
}

export const pathPlaceholders = {
  [MLRUN_STORAGE_INPUT_PATH_SCHEME]: 'artifacts/my-project/my-artifact:my-tag',
  [S3_INPUT_PATH_SCHEME]: 'bucket/path',
  [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
  [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
  [V3IO_INPUT_PATH_SCHEME]: 'container-name/file'
}

export const pathTips = projectItem => {
  const pathType = {
    'feature-vectors': 'feature-vector',
    artifacts: 'artifact',
    datasets: 'dataset',
    models: 'model'
  }
  const reference = pathType[projectItem]

  return {
    [MLRUN_STORAGE_INPUT_PATH_SCHEME]: `${
      reference ? `${reference}s` : '<artifact type>'
    }/<project>/${reference ? `<${reference} name>` : '<artifact name>'}:${
      reference ? `<${reference} tag>` : '<artifact tag>'
    }" or "${reference ? `${reference}s` : '<artifact type>'}/<project>/${
      reference ? `<${reference} name>` : '<artifact name>'
    }@${reference ? `<${reference} uid>` : '<artifact uid>'}`,
    [S3_INPUT_PATH_SCHEME]: 'bucket/path',
    [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
    [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
    [V3IO_INPUT_PATH_SCHEME]: 'container-name/file'
  }
}
