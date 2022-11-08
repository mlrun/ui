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
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'

import DetailsView from './DetailsView'

import artifactActions from '../../actions/artifacts'
import detailsActions from '../../actions/details'
import {
  ARTIFACTS_PAGE,
  DATASETS,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB
} from '../../constants'
import { ACTIONS_MENU } from '../../types'
import {
  generateArtifactsContent,
  generateFeatureStoreContent,
  generateFunctionsContent,
  generateJobsContent,
  renderContent
} from './details.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { useBlockHistory } from '../../hooks/useBlockHistory.hook'

import './details.scss'

const Details = ({
  actionsMenu,
  applyDetailsChanges,
  applyDetailsChangesCallback,
  detailsMenu,
  detailsStore,
  filtersStore,
  getCloseDetailsLink,
  handleCancel,
  handleRefresh,
  isDetailsScreen,
  pageData,
  removeInfoContent,
  removeModelFeatureVector,
  resetChanges,
  retryRequest,
  selectedItem,
  setChanges,
  setChangesCounter,
  setChangesData,
  setInfoContent,
  setIteration,
  setIterationOption,
  setRefreshWasHandled,
  showWarning,
  tab
}) => {
  const applyChangesRef = useRef()
  const dispatch = useDispatch()
  const detailsRef = useRef()
  const params = useParams()
  const { blockHistory, unblockHistory } = useBlockHistory()
  const [historyIsBlocked, setHistoryIsBlocked] = useState(false)

  const handlePreview = useCallback(() => {
    dispatch(
      artifactActions.showArtifactsPreview({
        isPreview: true,
        selectedItem
      })
    )
  }, [dispatch, selectedItem])

  const setNewChangesData = useCallback(
    (value, field) => {
      setChangesData({
        ...detailsStore.changes.data,
        [field]: {
          ...detailsStore.changes.data[field],
          currentFieldValue: value
        }
      })
    },
    [detailsStore.changes.data, setChangesData]
  )

  const handleEditInput = useCallback(
    (value, field) => {
      setNewChangesData(value, field)
    },
    [setNewChangesData]
  )

  const handleEditChips = useCallback(
    (chips, field) => {
      setNewChangesData(chips, field)
    },
    [setNewChangesData]
  )

  const handleAddChip = useCallback(
    (chip, chips, field) => {
      setNewChangesData([...chips, ...chip], field)
    },
    [setNewChangesData]
  )

  const handleDeleteChip = useCallback(
    (chips, field) => {
      setNewChangesData(chips, field)
    },
    [setNewChangesData]
  )

  useEffect(() => {
    return () => {
      //TODO
      resetChanges()
    }
  }, [resetChanges])

  useEffect(() => {
    if (!isEveryObjectValueEmpty(selectedItem)) {
      if (pageData.details.type === JOBS_PAGE) {
        setInfoContent(generateJobsContent(selectedItem))
      } else if (
        pageData.details.type === ARTIFACTS_PAGE ||
        pageData.details.type === FILES_PAGE ||
        pageData.details.type === MODELS_TAB ||
        pageData.details.type === MODEL_ENDPOINTS_TAB ||
        pageData.details.type === DATASETS
      ) {
        setInfoContent(
          generateArtifactsContent(
            handleAddChip,
            handleDeleteChip,
            handleEditChips,
            handleEditInput,
            pageData.details.type,
            selectedItem
          )
        )
      } else if (pageData.details.type === FUNCTIONS_PAGE) {
        setInfoContent(generateFunctionsContent(selectedItem))
      } else {
        setInfoContent(
          generateFeatureStoreContent(
            handleAddChip,
            handleDeleteChip,
            handleEditChips,
            handleEditInput,
            pageData.details.type,
            selectedItem
          )
        )
      }
    }
  }, [
    handleAddChip,
    handleDeleteChip,
    handleEditChips,
    handleEditInput,
    pageData.details.type,
    selectedItem,
    setInfoContent
  ])

  useEffect(() => {
    return () => {
      //TODO
      if (pageData.details.type === MODELS_TAB) {
        removeModelFeatureVector()
      }

      removeInfoContent()
      setHistoryIsBlocked(false)
    }
  }, [
    pageData.details.type,
    removeInfoContent,
    removeModelFeatureVector,
    selectedItem,
    setChangesData
  ])

  const handleShowWarning = useCallback(
    show => {
      showWarning(show)
    },
    [showWarning]
  )

  const handleRefreshClick = useCallback(
    event => {
      if (
        detailsStore.changes.counter > 0 &&
        document.getElementById('refresh')?.contains(event.target)
      ) {
        handleShowWarning(true)
        setRefreshWasHandled(true)
      }
    },
    [detailsStore.changes.counter, handleShowWarning, setRefreshWasHandled]
  )

  useEffect(() => {
    window.addEventListener('click', handleRefreshClick)

    return () => {
      window.removeEventListener('click', handleRefreshClick)
    }
  }, [handleRefreshClick])

  useEffect(() => {
    if (detailsStore.changes.counter > 0 && !historyIsBlocked) {
      blockHistory(() => handleShowWarning(true))
      setHistoryIsBlocked(true)
    } else if (detailsStore.changes.counter === 0 && historyIsBlocked) {
      unblockHistory()
      setHistoryIsBlocked(false)
    }
  }, [
    blockHistory,
    detailsStore.changes.counter,
    handleShowWarning,
    unblockHistory,
    historyIsBlocked
  ])

  const detailsMenuClick = () => {
    let changesData = {}

    if (
      Object.keys(detailsStore.changes.data).some(key => {
        return (
          detailsStore.changes.data[key].currentFieldValue !==
          detailsStore.changes.data[key].previousFieldValue
        )
      })
    ) {
      Object.keys(detailsStore.changes.data).forEach(key => {
        changesData[key] = {
          initialFieldValue: detailsStore.changes.data[key].initialFieldValue,
          previousFieldValue: detailsStore.changes.data[key].previousFieldValue,
          currentFieldValue: detailsStore.changes.data[key].previousFieldValue
        }
      })
      setChangesData({ ...changesData })
    }

    if (historyIsBlocked) {
      unblockHistory()
    }
  }

  const applyChanges = () => {
    applyDetailsChanges(detailsStore.changes).then(() => {
      resetChanges()
      unblockHistory()
      setHistoryIsBlocked(false)
      applyDetailsChangesCallback(detailsStore.changes)
    })
  }

  const cancelChanges = () => {
    if (detailsStore.changes.counter > 0) {
      resetChanges()
      unblockHistory()
      setHistoryIsBlocked(false)
    }
  }

  const leavePage = () => {
    cancelChanges()
    handleShowWarning(false)

    if (detailsStore.refreshWasHandled) {
      retryRequest(filtersStore)
      setRefreshWasHandled(false)
    } else {
      unblockHistory(true)
    }
  }

  const tabsContent = useMemo(() => {
    return renderContent(
      applyChangesRef,
      params.tab,
      detailsStore,
      selectedItem,
      pageData,
      handlePreview,
      handleEditInput,
      setChanges,
      setChangesData,
      setChangesCounter,
      setIteration,
      setIterationOption
    )
  }, [
    detailsStore,
    handleEditInput,
    handlePreview,
    pageData,
    params.tab,
    selectedItem,
    setChanges,
    setChangesCounter,
    setChangesData,
    setIteration,
    setIterationOption
  ])

  return (
    <DetailsView
      actionsMenu={actionsMenu}
      applyChanges={applyChanges}
      applyChangesRef={applyChangesRef}
      cancelChanges={cancelChanges}
      detailsMenu={detailsMenu}
      detailsMenuClick={detailsMenuClick}
      detailsStore={detailsStore}
      getCloseDetailsLink={getCloseDetailsLink}
      handleCancel={handleCancel}
      handleRefresh={handleRefresh}
      handleShowWarning={handleShowWarning}
      isDetailsScreen={isDetailsScreen}
      leavePage={leavePage}
      pageData={pageData}
      params={params}
      ref={detailsRef}
      selectedItem={selectedItem}
      setIteration={setIteration}
      setRefreshWasHandled={setRefreshWasHandled}
      tabsContent={tabsContent}
      tab={tab}
    />
  )
}

Details.defaultProps = {
  applyDetailsChanges: () => {},
  applyDetailsChangesCallback: () => {},
  cancelRequest: () => {},
  getCloseDetailsLink: null,
  handleRefresh: () => {},
  isDetailsScreen: false,
  item: {},
  retryRequest: () => {},
  removeModelFeatureVector: () => {},
  tab: ''
}

Details.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func,
  applyDetailsChangesCallback: PropTypes.func,
  cancelRequest: PropTypes.func,
  detailsMenu: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      hidden: PropTypes.bool
    })
  ).isRequired,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func,
  isDetailsScreen: PropTypes.bool,
  pageData: PropTypes.shape({}).isRequired,
  removeModelFeatureVector: PropTypes.func,
  retryRequest: PropTypes.func,
  selectedItem: PropTypes.shape({}).isRequired,
  tab: PropTypes.string
}

export default connect(
  ({ detailsStore, filtersStore }) => ({
    detailsStore,
    filtersStore
  }),
  { ...detailsActions }
)(Details)
