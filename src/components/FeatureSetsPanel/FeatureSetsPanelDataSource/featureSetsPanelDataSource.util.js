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
  GOOGLE_STORAGE_INPUT_PATH_SCHEME,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  S3_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../../../constants'

export const TIME_FIELD = 'timeField'
export const START_TIME = 'startTime'
export const END_TIME = 'endTime'
export const CSV = 'csv'
export const PARQUET = 'parquet'

export const kindOptions = [
  { label: 'CSV', id: CSV },
  { label: 'PARQUET', id: PARQUET }
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
  },
  {
    className: 'path-type-gs',
    label: 'Google storage',
    id: GOOGLE_STORAGE_INPUT_PATH_SCHEME
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
  const defaultValidation =
    pathInputValue.length > 0 && /.*?\/(.*?)/.test(pathInputValue)

  switch (pathInputType) {
    case MLRUN_STORAGE_INPUT_PATH_SCHEME:
      return regExp.test(pathInputValue)
    default:
      return dataSourceKind === CSV
        ? defaultValidation && !pathInputValue.endsWith('/')
        : defaultValidation
  }
}
