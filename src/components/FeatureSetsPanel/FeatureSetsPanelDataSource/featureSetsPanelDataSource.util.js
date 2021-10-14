import {
  AZURE_STORAGE_INPUT_PATH_SCHEME,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  S3_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../../../constants'

export const kindOptions = [
  { label: 'CSV', id: 'csv' },
  { label: 'PARQUET', id: 'parquet' }
]

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
    className: 'path-type-az',
    label: 'Azure storage',
    id: AZURE_STORAGE_INPUT_PATH_SCHEME
  }
]

export const generateComboboxMatchesList = (
  url,
  artifacts,
  projects,
  projectName,
  urlProjectPathEntered,
  urlArtifactPathEntered,
  urlArtifactReferencePathEntered,
  artifactsReferences,
  urlProjectItemTypeEntered
) => {
  if (!urlProjectItemTypeEntered) {
    return projectItemsPathTypes.some(type =>
      type.id.startsWith(url.projectItemType)
    )
      ? projectItemsPathTypes
      : []
  } else if (
    !urlProjectPathEntered &&
    projectItemsPathTypes.some(type => type.id === url.projectItemType)
  ) {
    return projects.filter(project => {
      return project.id.startsWith(url.project)
    })
  } else if (!urlArtifactPathEntered) {
    return (artifacts ?? []).filter(artifact => {
      return artifact.id.startsWith(url.artifact)
    })
  } else if (!urlArtifactReferencePathEntered) {
    return (artifactsReferences ?? []).filter(projectItem => {
      return projectItem.id.startsWith(url.artifactReference)
    })
  }

  return []
}

export const projectItemsPathTypes = [
  {
    label: 'Artifacts',
    id: 'artifacts'
  }
]

export const isUrlInputValid = (
  pathInputType,
  pathInputValue,
  dataSourceKind
) => {
  const regExp =
    dataSourceKind === CSV
      ? /^artifacts\/(.+?)\/(.+?)(#(.+?))?(:(.+?))?(@(.+))?(?<!\/)$/
      : /^artifacts\/(.+?)\/(.+?)(#(.+?))?(:(.+?))?(@(.+))?$/

  switch (pathInputType) {
    case MLRUN_STORAGE_INPUT_PATH_SCHEME:
      return regExp.test(pathInputValue)
    default:
      return dataSourceKind === CSV
        ? pathInputValue.length > 0 && !pathInputValue.endsWith('/')
        : pathInputValue.length > 0
  }
}

export const TIME_FIELD = 'timeField'
export const START_TIME = 'startTime'
export const END_TIME = 'endTime'
export const CSV = 'csv'
export const PARQUET = 'parquet'
