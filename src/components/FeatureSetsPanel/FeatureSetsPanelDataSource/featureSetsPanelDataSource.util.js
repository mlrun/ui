import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../../constants'

export const kindOptions = [
  { label: 'CSV', id: 'csv' },
  { label: 'PARQUET', id: 'parquet' }
]

export const comboboxSelectList = [
  {
    className: 'path-type-store',
    label: 'MLRun store',
    id: 'store://'
  },
  {
    className: 'path-type-v3io',
    label: 'V3IO',
    id: 'v3io://'
  },
  {
    className: 'path-type-s3',
    label: 'S3',
    id: 's3://'
  },
  {
    className: 'path-type-az',
    label: 'Azure storage',
    id: 'az://'
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
  } else if (!urlProjectPathEntered) {
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

export const isUrlInputValid = (pathInputType, pathInputValue) => {
  switch (pathInputType) {
    case MLRUN_STORAGE_INPUT_PATH_SCHEME:
      return /^artifacts\/(.+?)\/(.+?)(#(.+?))?(:(.+?))?(@(.+))?$/.test(
        pathInputValue
      )
    default:
      return pathInputValue.length > 0
  }
}
