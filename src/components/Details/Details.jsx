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
import { useDispatch, useSelector } from 'react-redux'
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

import {
  ALERTS_PAGE,
  ARTIFACTS_PAGE,
  DATASETS_PAGE,
  DETAILS_OVERVIEW_TAB,
  DOCUMENTS_PAGE,
  EMPTY_OBJECT,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  LLM_PROMPTS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB,
  VIEW_SEARCH_PARAMETER
} from '../../constants'
import {
  generateAlertsContent,
  generateArtifactsContent,
  generateFeatureStoreContent,
  generateFunctionsContent,
  generateJobsContent
} from './details.util'
import {
  removeDetailsPopUpInfoContent,
  removeInfoContent,
  removeModelFeatureVector,
  resetChanges,
  setDetailsPopUpInfoContent,
  setEditMode,
  setFiltersWasHandled,
  setInfoContent,
  showWarning
} from '../../reducers/detailsReducer'
import { ACTIONS_MENU } from '../../types'
import { TERTIARY_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { setFieldState } from 'igz-controls/utils/form.util'
import { showArtifactsPreview } from '../../reducers/artifactsReducer'

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
  selectedItem,
  setDetailsPopUpSelectedTab = null,
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
  }, [isDetailsPopUp])
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
        dispatch(resetChanges())
      }
    }
  }, [dispatch, isDetailsPopUp])

  useEffect(() => {
    if (!isEveryObjectValueEmpty(selectedItem)) {
      if (pageData.details.type === JOBS_PAGE) {
        dispatch(setDetailsInfo(generateJobsContent(selectedItem)))
      } else if (pageData.details.type === ALERTS_PAGE) {
        dispatch(setDetailsInfo(generateAlertsContent(selectedItem)))
      } else if (
        pageData.details.type === ARTIFACTS_PAGE ||
        pageData.details.type === FILES_PAGE ||
        pageData.details.type === MODELS_TAB ||
        pageData.details.type === MODEL_ENDPOINTS_TAB ||
        pageData.details.type === DATASETS_PAGE ||
        pageData.details.type === DOCUMENTS_PAGE ||
        pageData.details.type === LLM_PROMPTS_PAGE
      ) {
        dispatch(
          setDetailsInfo(
            generateArtifactsContent(
              pageData.details.type,
              selectedItem,
              params.projectName,
              isDetailsPopUp,
              frontendSpec.internal_labels
            )
          )
        )
      } else if (pageData.details.type === FUNCTIONS_PAGE) {
        dispatch(setDetailsInfo(generateFunctionsContent(selectedItem)))
      } else {
        dispatch(
          setDetailsInfo(
            generateFeatureStoreContent(pageData.details.type, selectedItem, isDetailsPopUp)
          )
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
    selectedItem,
    dispatch
  ])

  useEffect(() => {
    return () => {
      if (pageData.details.type === MODELS_TAB) {
        dispatch(removeModelFeatureVector())
      }

      dispatch(removeDetailsInfo())
    }
  }, [dispatch, pageData.details.type, removeDetailsInfo, selectedItem])

  const handleShowWarning = useCallback(
    show => {
      dispatch(showWarning(show))
    },
    [dispatch]
  )

  const handleRefreshClick = useCallback(
    event => {
      if (
        detailsStore.changes.counter > 0 &&
        document.getElementById('refresh')?.contains(event.target)
      ) {
        handleShowWarning(true)
        dispatch(setFiltersWasHandled(true))
      }
    },
    [detailsStore.changes.counter, dispatch, handleShowWarning]
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
      dispatch(setEditMode(false))
      previousPathnameRef.current = currentPathname
    }
  }, [dispatch, formInitialValues, isDetailsPopUp, location.pathname, params.tab])

  const applyChanges = useCallback(() => {
    applyDetailsChanges(detailsStore.changes).then(() => {
      dispatch(resetChanges())

      const changes = cloneDeep(detailsStore.changes)

      // todo [redux-toolkit] rework it after redux-toolkit will be added to the details store. Need to remove setTimeout and use a Promise that resolves after the state is updated.
      setTimeout(() => {
        applyDetailsChangesCallback(changes, selectedItem)
      })
    })
  }, [
    applyDetailsChanges,
    applyDetailsChangesCallback,
    detailsStore.changes,
    dispatch,
    selectedItem
  ])

  const cancelChanges = useCallback(() => {
    if (detailsStore.changes.counter > 0) {
      dispatch(resetChanges())
      formRef.current.reset(formInitialValues)
    }
  }, [detailsStore.changes.counter, dispatch, formInitialValues])

  const leavePage = useCallback(() => {
    cancelChanges()
    handleShowWarning(false)

    if (detailsStore.filtersWasHandled) {
      dispatch(setFiltersWasHandled(false))
    } else {
      blocker.proceed?.()
    }

    window.dispatchEvent(new CustomEvent('discardChanges'))
  }, [blocker, cancelChanges, detailsStore.filtersWasHandled, dispatch, handleShowWarning])

  const doNotLeavePage = useCallback(() => {
    blocker.reset?.()
    dispatch(showWarning(false))
    window.dispatchEvent(new CustomEvent('cancelLeave'))
  }, [blocker, dispatch])

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
            />
          </div>
          {(blocker.state === 'blocked' || detailsStore.showWarning) && (
            <ConfirmDialog
              cancelButton={{
                handler: doNotLeavePage,
                label: 'Cancel',
                variant: TERTIARY_BUTTON
              }}
              closePopUp={doNotLeavePage}
              confirmButton={{
                handler: leavePage,
                label: 'Yes',
                variant: PRIMARY_BUTTON
              }}
              header="You have unsaved changes."
              isOpen={blocker.state === 'blocked' || detailsStore.showWarning}
              message="Do you want to discard the changes?"
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
  detailsPopUpSelectedTab: PropTypes.string,
  formInitialValues: PropTypes.object,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func,
  handleRefresh: PropTypes.func,
  isDetailsPopUp: PropTypes.bool,
  isDetailsScreen: PropTypes.bool,
  pageData: PropTypes.object.isRequired,
  selectedItem: PropTypes.object.isRequired,
  setDetailsPopUpSelectedTab: PropTypes.func,
  tab: PropTypes.string,
  withActionMenu: PropTypes.bool
}

export default Details
