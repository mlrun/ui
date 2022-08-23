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
  FILES_PAGE,
  ITERATIONS_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  TREE_FILTER
} from '../../constants'
import { generateProducerDetailsInfo } from '../../utils/generateProducerDetailsInfo'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

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
export const filters = [
  { type: TREE_FILTER, label: 'Tree:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: ITERATIONS_FILTER, label: 'Show iterations' }
]
export const page = FILES_PAGE
export const actionsMenuHeader = 'Register artifact'
export const tableHeaders = isSelectedFile => [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Type',
    class: 'artifacts_extra-small',
    hidden: isSelectedFile
  },
  {
    header: 'Labels',
    class: 'artifacts_big',
    hidden: isSelectedFile
  },
  {
    header: 'Producer',
    class: 'artifacts_small',
    hidden: isSelectedFile
  },
  {
    header: 'Owner',
    class: 'artifacts_small',
    hidden: isSelectedFile
  },
  {
    header: 'Updated',
    class: 'artifacts_small',
    hidden: isSelectedFile
  },
  {
    header: 'Size',
    class: 'artifacts_small',
    hidden: isSelectedFile
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedFile
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedFile
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedFile
  },
  {
    header: '',
    class: 'action_cell',
    hidden: isSelectedFile
  }
]

export const generatePageData = (handleRequestOnExpand, selectedFile) => ({
  actionsMenuHeader,
  details: {
    menu: detailsMenu,
    infoHeaders,
    type: FILES_PAGE,
    additionalInfo: {
      header: 'Producer',
      body: generateProducerDetailsInfo(selectedFile),
      hidden: !selectedFile.item?.producer
    }
  },
  filters,
  handleRequestOnExpand,
  page,
  tableHeaders: tableHeaders(!isEveryObjectValueEmpty(selectedFile))
})
