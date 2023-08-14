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
import {
  AZURE_STORAGE_INPUT_PATH_SCHEME,
  DBFS_STORAGE_INPUT_PATH_SCHEME,
  GOOGLE_STORAGE_INPUT_PATH_SCHEME,
  HTTP_STORAGE_INPUT_PATH_SCHEME,
  HTTPS_STORAGE_INPUT_PATH_SCHEME,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  S3_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../../constants'
import { get, isNil, uniqBy } from 'lodash'
import { getArtifactReference, getParsedResource } from '../../utils/resources'

const targetPathRegex =
  /^(store|v3io|s3|az|gs):(\/\/\/|\/\/)(?!.*:\/\/)([\w\-._~:?#[\]@!$&'()*+,;=]+)\/([\w\-._~:/?#[\]%@!$&'()*+,;=]+)$/i
const httpTargetPathRegex =
  /^(http|https):(\/\/\/|\/\/)(?!.*:\/\/)([\w\-._~:/?#[\]%@!$&'()*+,;=]+)$/i
const mlrunTargetPathRegex =
  /^(artifacts|feature-vectors|datasets)\/(.+?)\/(.+?)(#(.+?))?(:(.+?))?(@(.+))?$/

export const pathPlaceholders = {
  [MLRUN_STORAGE_INPUT_PATH_SCHEME]: 'artifacts/my-project/my-artifact:my-tag',
  [S3_INPUT_PATH_SCHEME]: 'bucket/path',
  [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
  [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
  [V3IO_INPUT_PATH_SCHEME]: 'container-name/file'
}

export const targetPathInitialState = {
  artifacts: [],
  artifactsReferences: [],
  comboboxMatches: [],
  featureVectors: [],
  featureVectorsReferences: [],
  inputProjectItemPathEntered: false,
  inputProjectItemReferencePathEntered: false,
  inputProjectPathEntered: false,
  inputStorePathTypeEntered: false,
  project: '',
  projectItemReference: '',
  projects: [],
  storePathType: ''
}

export const pathTips = projectItem => {
  const pathType =
    projectItem === 'feature-vectors'
      ? 'feature-vector'
      : projectItem === 'artifacts'
      ? 'artifact'
      : 'dataset'

  return {
    [MLRUN_STORAGE_INPUT_PATH_SCHEME]: `${pathType}s/my-project/my-${pathType}:my-tag" or "${pathType}s/my-project/my-${pathType}@my-uid`,
    [S3_INPUT_PATH_SCHEME]: 'bucket/path',
    [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
    [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
    [V3IO_INPUT_PATH_SCHEME]: 'container-name/file'
  }
}

export const storePathTypes = [
  {
    label: 'Artifacts',
    id: 'artifacts'
  },
  {
    label: 'Datasets',
    id: 'datasets'
  },
  {
    label: 'Feature vectors',
    id: 'feature-vectors'
  }
]

export const getTargetPathInvalidText = (dataInputState, formState, formStateFieldInfo) => {
  const pathType = get(formState.values, `${formStateFieldInfo}.pathType`)
  const pathTipsList = pathTips(dataInputState.storePathType)

  return pathTipsList[pathType]
    ? `Invalid URL. Field must be in "${pathTipsList[pathType]}" format`
    : 'The field is invalid'
}

export const handleStoreInputPathChange = (targetPathState, setTargetPathState, value) => {
  const pathItems = value.split('/')
  const [projectItem, projectItemReference] = getParsedResource(pathItems[2])
  const projectItems =
    targetPathState[pathItems[0] !== 'feature-vectors' ? 'artifacts' : 'featureVectors']
  const projectItemIsEntered = projectItems.find(project => project.id === projectItem)
  const projectItemsReferences =
    targetPathState[
      pathItems[0] !== 'feature-vectors' ? 'artifactsReferences' : 'featureVectorsReferences'
    ]
  const projectItemReferenceIsEntered = projectItemsReferences.find(
    projectItemRef => projectItemRef.id === projectItemReference
  )
  const isInputStorePathTypeValid = storePathTypes.some(type => type.id.startsWith(pathItems[0]))

  setTargetPathState(prev => ({
    ...prev,
    artifacts:
      isNil(pathItems[2]) && targetPathState.artifacts.length > 0 ? [] : targetPathState.artifacts,
    artifactsReferences: projectItemReference ? targetPathState.artifactsReferences : [],
    featureVectors:
      isNil(pathItems[2]) && targetPathState.featureVectors.length > 0
        ? []
        : targetPathState.featureVectors,
    featureVectorsReferences: projectItemReference ? targetPathState.featureVectorsReferences : [],
    inputProjectItemPathEntered: Boolean(projectItemIsEntered),
    inputProjectItemReferencePathEntered: Boolean(projectItemReferenceIsEntered),
    inputProjectPathEntered: isInputStorePathTypeValid && typeof pathItems[2] === 'string',
    inputStorePathTypeEntered: isInputStorePathTypeValid && typeof pathItems[1] === 'string',
    project: pathItems[1] ?? targetPathState.project,
    projectItem: projectItem ?? targetPathState.projectItem,
    projectItemReference: projectItemReference ?? targetPathState.projectItemReference,
    storePathType: pathItems[0] ?? targetPathState.storePathType
  }))
}

export const getTargetPathOptions = hiddenOptionsIds => [
  {
    className: 'path-type-store',
    label: 'MLRun store',
    id: MLRUN_STORAGE_INPUT_PATH_SCHEME,
    hidden: hiddenOptionsIds?.includes(MLRUN_STORAGE_INPUT_PATH_SCHEME)
  },
  {
    className: 'path-type-v3io',
    label: 'V3IO',
    id: V3IO_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-s3',
    label: 'S3',
    id: S3_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-http',
    label: 'HTTP',
    id: HTTP_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-https',
    label: 'HTTPS',
    id: HTTPS_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-az',
    label: 'Azure storage',
    id: AZURE_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-gs',
    label: 'Google storage',
    id: GOOGLE_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-dbfs',
    label: 'Databricks filesystem',
    id: DBFS_STORAGE_INPUT_PATH_SCHEME
  }
]

export const isPathInputInvalid = (pathInputType, pathInputValue) => {
  const valueIsNotEmpty = pathInputValue?.trim().length > 0

  switch (pathInputType) {
    case MLRUN_STORAGE_INPUT_PATH_SCHEME:
      return valueIsNotEmpty && mlrunTargetPathRegex.test(pathInputValue)
        ? false
        : 'This field is invalid'
    case V3IO_INPUT_PATH_SCHEME:
    case AZURE_STORAGE_INPUT_PATH_SCHEME:
    case GOOGLE_STORAGE_INPUT_PATH_SCHEME:
    case S3_INPUT_PATH_SCHEME:
      return valueIsNotEmpty && targetPathRegex.test(`${pathInputType}${pathInputValue}`)
        ? false
        : 'This field is invalid'
    case HTTP_STORAGE_INPUT_PATH_SCHEME:
    case HTTPS_STORAGE_INPUT_PATH_SCHEME:
      return valueIsNotEmpty && httpTargetPathRegex.test(`${pathInputType}${pathInputValue}`)
        ? false
        : 'This field is invalid'
    default:
      return valueIsNotEmpty ? false : 'This field is invalid'
  }
}

export const generateProjectsList = (projectsList, currentProject) =>
  projectsList
    .map(projectItem => ({
      label: projectItem === currentProject ? 'Current project' : projectItem,
      id: projectItem
    }))
    .sort((prevProject, nextProject) => {
      return prevProject.id === currentProject
        ? -1
        : nextProject.id === currentProject
        ? 1
        : prevProject.id.localeCompare(nextProject.id)
    })

export const generateComboboxMatchesList = (
  artifacts,
  artifactsReferences,
  featureVectors,
  featureVectorsReferences,
  inputProjectItemPathEntered,
  inputProjectItemReferencePathEntered,
  inputProjectPathEntered,
  inputStorePathTypeEntered,
  project,
  projectItem,
  projectItemReference,
  projects,
  storePathType
) => {
  if (!inputStorePathTypeEntered) {
    return storePathTypes.some(type => type.id.startsWith(storePathType)) ? storePathTypes : []
  } else if (!inputProjectPathEntered && storePathTypes.some(type => type.id === storePathType)) {
    return projects.filter(proj => proj.id.startsWith(project))
  } else if (!inputProjectItemPathEntered) {
    const projectItems = storePathType === 'feature-vectors' ? featureVectors : artifacts

    return projectItems ? projectItems.filter(projItem => projItem.id.startsWith(projectItem)) : []
  } else if (!inputProjectItemReferencePathEntered) {
    const projectItemsReferences =
      storePathType === 'feature-vectors' ? featureVectorsReferences : artifactsReferences

    return projectItemsReferences
      ? projectItemsReferences.filter(projectItem =>
          projectItem.id.startsWith(projectItemReference)
        )
      : []
  } else {
    return []
  }
}

export const generateArtifactsList = artifacts => {
  const generatedArtifacts = artifacts
    .map(artifact => {
      const key = artifact.link_iteration ? artifact.link_iteration.db_key : artifact.key ?? ''
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

      if (prevRefTree === nextRefTree) {
        return prevRefIter.localeCompare(nextRefIter)
      } else {
        return prevRefTree.localeCompare(nextRefTree)
      }
    })

  return uniqBy(generatedArtifacts, 'id')
}
