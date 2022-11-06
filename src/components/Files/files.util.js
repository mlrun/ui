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
import { isEmpty } from 'lodash'

import {
  FILES_PAGE,
  ITERATIONS_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  TREE_FILTER
} from '../../constants'
import { generateProducerDetailsInfo } from '../../utils/generateProducerDetailsInfo'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { createFilesRowData } from '../../utils/createArtifactsContent'
import { searchArtifactItem } from '../../utils/searchArtifactItem'

export const pageDataInitialState = {
  details: {
    menu: [],
    infoHeaders: []
  },
  filters: [],
  page: '',
  registerArtifactDialogTitle: '',
  tableHeaders: []
}

export const detailsMenu = [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'preview',
    id: 'preview'
  }
]

export const infoHeaders = [
  {
    label: 'Hash',
    id: 'hash',
    tip: 'Represents hash of the data. when the data changes the hash would change'
  },
  { label: 'Key', id: 'db_key' },
  { label: 'Tag', id: 'tag' },
  { label: 'Iter', id: 'iter' },
  { label: 'Size', id: 'size' },
  { label: 'Path', id: 'target_path' },
  { label: 'URI', id: 'target_uri' },
  {
    label: 'UID',
    id: 'tree',
    tip: 'Unique identifier representing the job or the workflow that generated the artifact'
  },
  { label: 'Updated', id: 'updated' },
  { label: 'Labels', id: 'labels' },
  { label: 'Sources', id: 'sources' }
]

export const generatePageData = selectedFile => {
  return {
    page: FILES_PAGE,
    details: {
      type: FILES_PAGE,
      menu: detailsMenu,
      infoHeaders,
      additionalInfo: {
        header: 'Producer',
        body: generateProducerDetailsInfo(selectedFile),
        hidden: !selectedFile.producer
      }
    }
  }
}

export const filters = [
  { type: TREE_FILTER, label: 'Tree:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: ITERATIONS_FILTER, label: 'Show iterations' }
]
export const actionsMenuHeader = 'Register artifact'

export const fetchFilesRowData = (
  file,
  setSelectedRowData,
  fetchFile,
  projectName,
  iter,
  tag,
  selectedFile
) => {
  const fileIdentifier = getArtifactIdentifier(file)

  setSelectedRowData(state => ({
    ...state,
    [fileIdentifier]: {
      loading: true
    }
  }))

  fetchFile(file.project ?? projectName, file.db_key, !iter, tag)
    .then(result => {
      if (result?.length > 0) {
        setSelectedRowData(state => ({
          ...state,
          [fileIdentifier]: {
            content: result.map(artifact =>
              createFilesRowData(artifact, projectName, !isEmpty(selectedFile))
            ),
            error: null,
            loading: false
          }
        }))
      }
    })
    .catch(error => {
      setSelectedRowData(state => ({
        ...state,
        [fileIdentifier]: {
          ...state[fileIdentifier],
          error,
          loading: false
        }
      }))
    })
}

export const checkForSelectedFile = (
  name,
  selectedRowData,
  files,
  tag,
  iter,
  navigate,
  projectName,
  setSelectedFile
) => {
  if (name) {
    const artifacts = selectedRowData?.[name]?.content || files

    if (artifacts.length > 0) {
      const searchItem = searchArtifactItem(
        artifacts.map(artifact => artifact.data ?? artifact),
        name,
        tag,
        iter
      )

      if (!searchItem) {
        navigate(`/projects/${projectName}/files`, { replace: true })
      } else {
        setSelectedFile(searchItem)
      }
    }
  } else {
    setSelectedFile({})
  }
}
