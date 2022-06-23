import { filterArtifacts } from '../../utils/filterArtifacts'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { generateProducerDetailsInfo } from '../../utils/generateProducerDetailsInfo'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import {
  DATASETS,
  DATASETS_PAGE,
  ITERATIONS_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  TREE_FILTER
} from '../../constants'

export const pageDataInitialState = {
  actionsMenu: [],
  actionsMenuHeader: '',
  details: {
    menu: [],
    infoHeaders: []
  },
  filters: [],
  page: '',
  selectedRowData: {}
}

export const infoHeaders = [
  {
    label: 'Hash',
    id: 'hash',
    tip: 'Represents hash of the data. when the data changes the hash would change'
  },
  { label: 'Key', id: 'db_key' },
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

export const filters = [
  { type: TREE_FILTER, label: 'Tree:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: ITERATIONS_FILTER, label: 'Show iterations' }
]

export const actionsMenuHeader = 'Register dataset'
export const page = DATASETS_PAGE

export const tableHeaders = isSelectedItem => [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Labels',
    class: 'artifacts_big',
    hidden: isSelectedItem
  },
  {
    header: 'Producer',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },
  {
    header: 'Owner',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },
  {
    header: 'Updated',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },
  {
    header: 'Size',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },

  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'action_cell',
    hidden: isSelectedItem
  }
]

export const generateDataSetsDetailsMenu = selectedItem => [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'preview',
    id: 'preview'
  },
  {
    label: 'metadata',
    id: 'metadata',
    hidden: !selectedItem.item?.schema
  },
  {
    label: 'analysis',
    id: 'analysis',
    hidden: !selectedItem.item?.extra_data
  }
]

export const generatePageData = (handleRequestOnExpand, selectedItem) => ({
  actionsMenuHeader,
  details: {
    menu: [],
    infoHeaders,
    type: DATASETS,
    additionalInfo: {
      header: 'Producer',
      body: generateProducerDetailsInfo(selectedItem),
      hidden: !selectedItem.item?.producer
    }
  },
  filters,
  filterMenuActionButton: null,
  handleRequestOnExpand,
  page,
  tableHeaders: tableHeaders(!isEveryObjectValueEmpty(selectedItem))
})

export const fetchDataSetRowData = async (fetchDataSet, dataSet, setPageData, iter, tag) => {
  const dataSetIdentifier = getArtifactIdentifier(dataSet)

  setPageData(state => ({
    ...state,
    selectedRowData: {
      ...state.selectedRowData,
      [dataSetIdentifier]: {
        loading: true
      }
    }
  }))

  fetchDataSet(dataSet.project, dataSet.db_key, iter, tag)
    .then(result => {
      if (result?.length > 0) {
        setPageData(state => {
          return {
            ...state,
            selectedRowData: {
              ...state.selectedRowData,
              [dataSetIdentifier]: {
                content: [...generateArtifacts(filterArtifacts(result), DATASETS, iter)],
                error: null,
                loading: false
              }
            }
          }
        })
      }
    })
    .catch(error => {
      setPageData(state => ({
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          [dataSetIdentifier]: {
            ...state.selectedRowData[dataSetIdentifier],
            error,
            loading: false
          }
        }
      }))
    })
}
