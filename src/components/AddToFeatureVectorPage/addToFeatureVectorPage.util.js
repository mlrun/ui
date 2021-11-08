import React from 'react'

import FeaturesTablePanel from '../../elements/FeaturesTablePanel/FeaturesTablePanel'

import {
  ACTION_CELL_ID,
  LABELS_FILTER,
  NAME_FILTER,
  PROJECT_FILTER,
  TAG_FILTER
} from '../../constants'

export const page = 'FEATURE-STORE'

export const pageDataInitialState = {
  actionsMenu: [],
  actionsMenuHeader: '',
  details: {
    menu: [],
    infoHeaders: []
  },
  filters: [],
  page: '',
  selectedRowData: {},
  tabs: []
}

export const filters = [
  { type: TAG_FILTER, label: 'Tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Label:' },
  { type: PROJECT_FILTER, label: 'Project:' }
]

const generateTableHeaders = isTablePanelOpen => {
  return [
    {
      header: 'Feature Name',
      class: 'artifacts_medium'
    },
    {
      header: 'Feature set',
      class: 'artifacts_small'
    },
    {
      header: 'Type',
      class: 'artifacts_extra-small'
    },
    {
      header: 'Entities',
      class: 'artifacts_big'
    },
    {
      header: 'Description',
      class: 'artifacts_medium',
      hidden: isTablePanelOpen
    },
    {
      header: 'Labels',
      class: 'artifacts_big',
      hidden: isTablePanelOpen
    },
    {
      header: '',
      class: 'artifacts_small',
      hidden: isTablePanelOpen
    },
    {
      header: 'Validator',
      class: 'artifacts_medium',
      hidden: isTablePanelOpen
    },
    {
      header: '',
      id: ACTION_CELL_ID,
      class: 'action_cell',
      hidden: isTablePanelOpen
    },
    {
      header: '',
      class: 'artifacts_big align-right',
      hidden: !isTablePanelOpen
    }
  ]
}

export const generatePageData = (
  isTablePanelOpen,
  handleRemoveFeature,
  handleRequestOnExpand,
  handleCreateFeatureVector,
  handleCancelCreateFeatureVector
) => {
  return {
    details: {
      menu: []
    },
    page,
    tabs: [],
    actionsMenu: [],
    hidePageActionMenu: true,
    filters,
    tableHeaders: generateTableHeaders(isTablePanelOpen),
    tablePanel: (
      <FeaturesTablePanel
        onSubmit={handleCreateFeatureVector}
        handleCancel={handleCancelCreateFeatureVector}
      />
    ),
    handleRemoveRequestData: handleRemoveFeature,
    handleRequestOnExpand: handleRequestOnExpand,
    mainRowItemsCount: 2,
    noDataMessage:
      'No features yet. Go to "Feature Sets" tab to create your first feature set.'
  }
}
