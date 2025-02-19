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
import React, { useEffect, useCallback, useRef, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { cloneDeep, isEqual, pickBy } from 'lodash'
import classnames from 'classnames'

import { ConfirmDialog } from 'igz-controls/components'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import DetailsTabsContent from './DetailsTabsContent/DetailsTabsContent'

import DetailsHeader from './DetailsHeader/DetailsHeader'
import Loader from '../../common/Loader/Loader'
import TabsSlider from '../../common/TabsSlider/TabsSlider'
import BlockerSpy from '../../common/BlockerSpy/BlockerSpy'

import { TERTIARY_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'
import detailsActions from '../../actions/details'
import {
  ALERTS_PAGE,
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  DETAILS_OVERVIEW_TAB,
  DOCUMENTS_TAB,
  EMPTY_OBJECT,
  FILES_TAB,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB,
  VIEW_SEARCH_PARAMETER
} from '../../constants'
import { ACTIONS_MENU } from '../../types'
import {
  generateAlertsContent,
  generateArtifactsContent,
  generateFeatureStoreContent,
  generateFunctionsContent,
  generateJobsContent
} from './details.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { showArtifactsPreview } from '../../reducers/artifactsReducer'
import { setFieldState } from 'igz-controls/utils/form.util'

import './details.scss'

const Details = ({
  actionsMenu,
  applyDetailsChanges = () => {},
  applyDetailsChangesCallback = () => {},
  detailsMenu,
  detailsPopUpSelectedTab = DETAILS_OVERVIEW_TAB,
  formInitialValues = EMPTY_OBJECT,
  getCloseDetailsLink = null,
  handleCancel = null,
  handleRefresh = () => {},
  isDetailsPopUp = false,
  isDetailsScreen = false,
  pageData,
  removeDetailsPopUpInfoContent,
  removeInfoContent,
  removeModelFeatureVector = () => {},
  resetChanges,
  retryRequest = () => {},
  selectedItem,
  setChanges,
  setChangesCounter,
  setChangesData,
  setDetailsPopUpInfoContent,
  setDetailsPopUpSelectedTab,
  setFiltersWasHandled,
  setInfoContent,
  setIteration,
  setIterationOption,
  showWarning,
  tab = '',
  withActionMenu = true
}) => {
  const [blocker, setBlocker] = useState({})
  const applyChangesRef = useRef()
  const dispatch = useDispatch()
  const detailsRef = useRef()
  const params = useParams()
  const detailsStore = useSelector(store => store.detailsStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const location = useLocation()
  const [setDetailsInfo, removeDetailsInfo] = useMemo(() => {
    return isDetailsPopUp
      ? [setDetailsPopUpInfoContent, removeDetailsPopUpInfoContent]
      : [setInfoContent, removeInfoContent]
  }, [
    isDetailsPopUp,
    removeDetailsPopUpInfoContent,
    removeInfoContent,
    setDetailsPopUpInfoContent,
    setInfoContent
  ])
  const previousPathnameRef = useRef(
    location.pathname.substring(0, location.pathname.lastIndexOf(params.tab))
  )

  const detailsPanelClassNames = classnames(
    'table__item',
    detailsStore.showWarning && 'pop-up-dialog-opened',
    isDetailsScreen && 'table__item_big',
    isDetailsPopUp && 'table__item-popup'
  )

  const formRef = useRef(
    createForm({
      initialValues: formInitialValues,
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )

  const handlePreview = useCallback(() => {
    dispatch(
      showArtifactsPreview({
        isPreview: true,
        selectedItem
      })
    )
  }, [dispatch, selectedItem])

  useEffect(() => {
    return () => {
      if (!isDetailsPopUp) {
        resetChanges()
      }
    }
  }, [isDetailsPopUp, resetChanges])

  useEffect(() => {
    if (!isEveryObjectValueEmpty(selectedItem)) {
      if (pageData.details.type === JOBS_PAGE) {
        setDetailsInfo(generateJobsContent(selectedItem))
      } else if (pageData.details.type === ALERTS_PAGE) {
        setDetailsInfo(generateAlertsContent(selectedItem))
      } else if (
        pageData.details.type === ARTIFACTS_PAGE ||
        pageData.details.type === FILES_TAB ||
        pageData.details.type === MODELS_TAB ||
        pageData.details.type === MODEL_ENDPOINTS_TAB ||
        pageData.details.type === DATASETS_TAB ||
        pageData.details.type === DOCUMENTS_TAB
      ) {
        setDetailsInfo(
          generateArtifactsContent(
            pageData.details.type,
            selectedItem,
            params.projectName,
            isDetailsPopUp,
            frontendSpec.internal_labels
          )
        )
      } else if (pageData.details.type === FUNCTIONS_PAGE) {
        setDetailsInfo(generateFunctionsContent(selectedItem))
      } else {
        setDetailsInfo(
          generateFeatureStoreContent(pageData.details.type, selectedItem, isDetailsPopUp)
        )
      }
    }
  }, [
    frontendSpec.internal_labels,
    isDetailsPopUp,
    location.search,
    pageData.details.type,
    params.projectName,
    setDetailsInfo,
    selectedItem
  ])

  useEffect(() => {
    return () => {
      if (pageData.details.type === MODELS_TAB) {
        removeModelFeatureVector()
      }

      removeDetailsInfo()
    }
  }, [pageData.details.type, removeDetailsInfo, removeModelFeatureVector, selectedItem])

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
        setFiltersWasHandled(true)
      }
    },
    [detailsStore.changes.counter, handleShowWarning, setFiltersWasHandled]
  )

  useEffect(() => {
    window.addEventListener('click', handleRefreshClick)

    return () => {
      window.removeEventListener('click', handleRefreshClick)
    }
  }, [handleRefreshClick])

  const shouldDetailsBlock = useCallback(
    ({ currentLocation, nextLocation }) => {
      const currentDetailsView = currentLocation.search.split(`${VIEW_SEARCH_PARAMETER}=`)?.[1]
      const nextDetailsView = nextLocation.search.split(`${VIEW_SEARCH_PARAMETER}=`)?.[1]
      const currentLocationPathname = currentLocation.pathname.split('/')
      const nextLocationPathname = nextLocation.pathname.split('/')
      currentLocationPathname.pop()
      nextLocationPathname.pop()

      return (
        detailsStore.changes.counter > 0 &&
        (currentLocationPathname.join('/') !== nextLocationPathname.join('/') ||
          currentDetailsView !== nextDetailsView)
      )
    },
    [detailsStore.changes.counter]
  )

  useEffect(() => {
    if (
      formRef.current &&
      detailsStore.changes.counter === 0 &&
      !isEqual(pickBy(formInitialValues), pickBy(formRef.current.getState()?.values)) &&
      !formRef.current.getState()?.active
    ) {
      formRef.current.restart(formInitialValues)
    }
  }, [formInitialValues, detailsStore.changes.counter])

  useEffect(() => {
    const currentPathname = location.pathname.substring(
      0,
      location.pathname.lastIndexOf(params.tab)
    )

    if (previousPathnameRef.current !== currentPathname && !isDetailsPopUp) {
      formRef.current.restart(formInitialValues)
      dispatch(detailsActions.setEditMode(false))
      previousPathnameRef.current = currentPathname
    }
  }, [dispatch, formInitialValues, isDetailsPopUp, location.pathname, params.tab])

  const applyChanges = useCallback(() => {
    applyDetailsChanges(detailsStore.changes).then(() => {
      resetChanges()

      const changes = cloneDeep(detailsStore.changes)
      
      setTimeout(() => {
        applyDetailsChangesCallback(changes, selectedItem)
      })
    })
  }, [
    applyDetailsChanges,
    applyDetailsChangesCallback,
    detailsStore.changes,
    resetChanges,
    selectedItem
  ])

  const cancelChanges = useCallback(() => {
    if (detailsStore.changes.counter > 0) {
      resetChanges()
      formRef.current.reset(formInitialValues)
    }
  }, [detailsStore.changes.counter, formInitialValues, resetChanges])

  const leavePage = useCallback(() => {
    cancelChanges()
    handleShowWarning(false)

    if (detailsStore.filtersWasHandled) {
      setFiltersWasHandled(false)
    } else {
      blocker.proceed?.()
    }

    window.dispatchEvent(new CustomEvent('discardChanges'))
  }, [
    blocker,
    cancelChanges,
    detailsStore.filtersWasHandled,
    handleShowWarning,
    setFiltersWasHandled
  ])

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => (
        <div className={detailsPanelClassNames} ref={detailsRef} data-testid="detailsPanel">
          {detailsStore.loadingCounter > 0 && <Loader />}
          {detailsStore.error && <ErrorMessage message={detailsStore.error.message} />}
          <div className="item-header-wrapper">
            <DetailsHeader
              actionsMenu={actionsMenu}
              applyChanges={applyChanges}
              applyChangesRef={applyChangesRef}
              cancelChanges={cancelChanges}
              getCloseDetailsLink={getCloseDetailsLink}
              isDetailsPopUp={isDetailsPopUp}
              isDetailsScreen={isDetailsScreen}
              handleCancel={handleCancel}
              handleRefresh={handleRefresh}
              handleShowWarning={handleShowWarning}
              pageData={pageData}
              selectedItem={selectedItem}
              setIteration={setIteration}
              tab={tab}
              withActionMenu={withActionMenu}
            />
            {withActionMenu && (
              <TabsSlider
                initialTab={isDetailsPopUp ? detailsPopUpSelectedTab : params.tab}
                isDetailsPopUp={isDetailsPopUp}
                onClick={newTab => setDetailsPopUpSelectedTab && setDetailsPopUpSelectedTab(newTab)}
                skipLink={isDetailsPopUp}
                tabsList={detailsMenu}
              />
            )}
          </div>
          <div className="item-info">
            <DetailsTabsContent
              applyChangesRef={applyChangesRef}
              detailsPopUpSelectedTab={detailsPopUpSelectedTab}
              formState={formState}
              handlePreview={handlePreview}
              isDetailsPopUp={isDetailsPopUp}
              pageData={pageData}
              selectedItem={selectedItem}
              setChanges={setChanges}
              setChangesCounter={setChangesCounter}
              setChangesData={setChangesData}
              setIteration={setIteration}
              setIterationOption={setIterationOption}
            />
          </div>
          {(blocker.state === 'blocked' || detailsStore.showWarning) && (
            <ConfirmDialog
              cancelButton={{
                handler: () => {
                  blocker.reset?.()
                  dispatch(detailsActions.showWarning(false))
                },
                label: detailsStore.filtersWasHandled ? "Don't refresh" : "Don't Leave",
                variant: TERTIARY_BUTTON
              }}
              closePopUp={() => {
                blocker.reset?.()
                dispatch(detailsActions.showWarning(false))
              }}
              confirmButton={{
                handler: leavePage,
                label: detailsStore.filtersWasHandled ? 'Refresh' : 'Leave',
                variant: PRIMARY_BUTTON
              }}
              header="You have unsaved changes."
              isOpen={blocker.state === 'blocked' || detailsStore.showWarning}
              message={`${
                detailsStore.filtersWasHandled ? 'Refreshing the list' : 'Leaving this page'
              } will discard your changes.`}
            />
          )}
          {!isDetailsPopUp && (
            <BlockerSpy setBlocker={setBlocker} shouldBlock={shouldDetailsBlock} />
          )}
        </div>
      )}
    </Form>
  )
}

Details.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func,
  applyDetailsChangesCallback: PropTypes.func,
  detailsMenu: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      hidden: PropTypes.bool
    })
  ).isRequired,
  formInitialValues: PropTypes.object,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func,
  handleRefresh: PropTypes.func,
  isDetailsScreen: PropTypes.bool,
  pageData: PropTypes.shape({}).isRequired,
  removeModelFeatureVector: PropTypes.func,
  retryRequest: PropTypes.func,
  selectedItem: PropTypes.shape({}).isRequired,
  tab: PropTypes.string
}

export default connect(null, { ...detailsActions })(Details)
