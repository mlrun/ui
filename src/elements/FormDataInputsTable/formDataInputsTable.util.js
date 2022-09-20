import {
  AZURE_STORAGE_INPUT_PATH_SCHEME,
  GOOGLE_STORAGE_INPUT_PATH_SCHEME,
  HTTP_STORAGE_INPUT_PATH_SCHEME,
  HTTPS_STORAGE_INPUT_PATH_SCHEME,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  S3_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../../constants'
import { getArtifactReference, getParsedResource } from '../../utils/resources'
import { isNil } from 'lodash'

export const comboboxSelectList = [
  {
    className: 'path-type-store',
    label: 'MLRun store',
    id: MLRUN_STORAGE_INPUT_PATH_SCHEME
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
  }
]

export const pathTips = storePathType => {
  const pathType = storePathType === 'feature-vectors' ? 'feature-vector' : 'artifact'

  return {
    [MLRUN_STORAGE_INPUT_PATH_SCHEME]: `${pathType}s/my-project/my-${pathType}:my-tag" or "${pathType}s/my-project/my-${pathType}@my-uid`,
    [S3_INPUT_PATH_SCHEME]: 'bucket/path',
    [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
    [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
    [V3IO_INPUT_PATH_SCHEME]: 'container-name/file'
  }
}

export const pathPlaceholders = {
  [MLRUN_STORAGE_INPUT_PATH_SCHEME]: 'artifacts/my-project/my-artifact:my-tag',
  [S3_INPUT_PATH_SCHEME]: 'bucket/path',
  [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
  [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
  [V3IO_INPUT_PATH_SCHEME]: 'container-name/file'
}

export const dataInputInitialState = {
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

export const storePathTypes = [
  {
    label: 'Artifacts',
    id: 'artifacts'
  },
  {
    label: 'Feature vectors',
    id: 'feature-vectors'
  }
]

export const isPathInputInvalid = (pathInputType, pathInputValue) => {
  const valueIsNotEmpty = pathInputValue?.trim().length > 0

  switch (pathInputType) {
    case MLRUN_STORAGE_INPUT_PATH_SCHEME:
      return valueIsNotEmpty &&
        /^(artifacts|feature-vectors)\/(.+?)\/(.+?)(#(.+?))?(:(.+?))?(@(.+))?$/.test(pathInputValue)
        ? false
        : 'This field is invalid'
    case V3IO_INPUT_PATH_SCHEME:
    case AZURE_STORAGE_INPUT_PATH_SCHEME:
    case GOOGLE_STORAGE_INPUT_PATH_SCHEME:
    case S3_INPUT_PATH_SCHEME:
      return valueIsNotEmpty && pathInputValue.split('/')?.[1]?.length > 0
        ? false
        : 'This field is invalid'
    default:
      return valueIsNotEmpty ? false : 'This field is invalid'
  }
}

export const handleStoreInputPathChange = (dataInputState, setDataInputState, value) => {
  const pathItems = value.split('/')
  const [projectItem, projectItemReference] = getParsedResource(pathItems[2])
  const projectItems = dataInputState[pathItems[0] === 'artifacts' ? 'artifacts' : 'featureVectors']
  const projectItemIsEntered = projectItems.find(project => project.id === projectItem)
  const projectItemsReferences =
    dataInputState[
      pathItems[0] === 'artifacts' ? 'artifactsReferences' : 'featureVectorsReferences'
    ]
  const projectItemReferenceIsEntered = projectItemsReferences.find(
    projectItemRef => projectItemRef.id === projectItemReference
  )
  const isInputStorePathTypeValid = storePathTypes.some(type => type.id.startsWith(pathItems[0]))

  setDataInputState(prev => ({
    ...prev,
    artifacts:
      isNil(pathItems[2]) && dataInputState.artifacts.length > 0 ? [] : dataInputState.artifacts,
    artifactsReferences: projectItemReference ? dataInputState.artifactsReferences : [],
    featureVectors:
      isNil(pathItems[2]) && dataInputState.featureVectors.length > 0
        ? []
        : dataInputState.featureVectors,
    featureVectorsReferences: projectItemReference ? dataInputState.featureVectorsReferences : [],
    inputProjectItemPathEntered: Boolean(projectItemIsEntered),
    inputProjectItemReferencePathEntered: Boolean(projectItemReferenceIsEntered),
    inputProjectPathEntered: isInputStorePathTypeValid && typeof pathItems[2] === 'string',
    inputStorePathTypeEntered: isInputStorePathTypeValid && typeof pathItems[1] === 'string',
    project: pathItems[1] ?? dataInputState.project,
    projectItem: projectItem ?? dataInputState.projectItem,
    projectItemReference: projectItemReference ?? dataInputState.projectItemReference,
    storePathType: pathItems[0] ?? dataInputState.storePathType
  }))
}

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
    const selectedStorePathType = storePathType
    const projectItems =
      selectedStorePathType === 'artifacts'
        ? artifacts
        : selectedStorePathType === 'feature-vectors'
        ? featureVectors
        : null

    return projectItems ? projectItems.filter(projItem => projItem.id.startsWith(projectItem)) : []
  } else if (!inputProjectItemReferencePathEntered) {
    const selectedStorePathType = storePathType
    const projectItemsReferences =
      selectedStorePathType === 'artifacts'
        ? artifactsReferences
        : selectedStorePathType === 'feature-vectors'
        ? featureVectorsReferences
        : null

    return projectItemsReferences
      ? projectItemsReferences.filter(projectItem =>
          projectItem.id.startsWith(projectItemReference)
        )
      : []
  } else {
    return []
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

export const generateArtifactsList = artifacts =>
  artifacts
    .map(artifact => {
      const key = artifact.link_iteration ? artifact.link_iteration.db_key : artifact.key ?? ''
      return {
        label: key,
        id: key
      }
    })
    .filter(artifact => artifact.label !== '')
    .sort((prevArtifact, nextArtifact) => prevArtifact.id.localeCompare(nextArtifact.id))

export const generateArtifactsReferencesList = artifacts =>
  artifacts
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
