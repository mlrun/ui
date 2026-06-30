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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import arrayMutators from 'final-form-arrays'
import classnames from 'classnames'
import { Form } from 'react-final-form'
import { cloneDeep, isEqual, pickBy } from 'lodash'
import { createForm } from 'final-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'

import BlockerSpy from '../components/BlockerSpy/BlockerSpy'
import ErrorMessage from '../components/ErrorMessage/ErrorMessage'
import Loader from '../components/Loader/Loader'
import TabsSlider from '../components/TabsSlider/TabsSlider'
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog'

import {
  removeDetailsPopUpInfoContent,
  removeInfoContent,
  resetChanges,
  setDetailsPopUpInfoContent,
  setEditMode,
  setFiltersWasHandled,
  setInfoContent,
  showWarning
} from '../reducers/commonDetailsReducer'
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../constants'
import { VIEW_SEARCH_PARAMETER } from '../constants'
import { DETAILS_MENU } from '../types'
import { setFieldState } from '../utils/form.util'

const DetailsContainer = ({
  blocker,
  commonDetailsStore,
  detailsMenu,
  detailsPanelClassNames,
  detailsPopUpSelectedTab = '',
  detailsRef,
  detailsStore,
  doNotLeavePage,
  formRef,
  isDetailsPopUp = null,
  leavePage,
  params,
  renderHeader,
  renderTabsContent,
  setBlocker,
  setDetailsPopUpSelectedTab = null,
  shouldDetailsBlock,
  withActionMenu = true
}) => {
  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => (
        <div className={detailsPanelClassNames} ref={detailsRef} data-testid="detailsPanel">
          {detailsStore.loadingCounter > 0 && <Loader />}
          {detailsStore.error && <ErrorMessage message={detailsStore.error.message} />}
          <div className="item-header-wrapper">
            {renderHeader()}
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
          <div className="item-info">{renderTabsContent(formState)}</div>
          {(blocker.state === 'blocked' || commonDetailsStore.showWarning) && (
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
              isOpen={blocker.state === 'blocked' || commonDetailsStore.showWarning}
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

DetailsContainer.propTypes = {
  blocker: PropTypes.object.isRequired,
  detailsMenu: DETAILS_MENU.isRequired,
  detailsPanelClassNames: PropTypes.string.isRequired,
  detailsPopUpSelectedTab: PropTypes.string,
  detailsRef: PropTypes.object.isRequired,
  detailsStore: PropTypes.object.isRequired,
  commonDetailsStore: PropTypes.object.isRequired,
  doNotLeavePage: PropTypes.func.isRequired,
  formRef: PropTypes.object.isRequired,
  isDetailsPopUp: PropTypes.bool,
  leavePage: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  renderHeader: PropTypes.func.isRequired,
  renderTabsContent: PropTypes.func.isRequired,
  setBlocker: PropTypes.func.isRequired,
  setDetailsPopUpSelectedTab: PropTypes.func,
  shouldDetailsBlock: PropTypes.func.isRequired,
  withActionMenu: PropTypes.bool
}

export const useDetails = ({
  applyDetailsChanges,
  applyDetailsChangesCallback,
  formInitialValues,
  isDetailsPopUp,
  isDetailsScreen,
  selectedItem
}) => {
  const [blocker, setBlocker] = useState({})
  const applyChangesRef = useRef()
  const dispatch = useDispatch()
  const detailsRef = useRef()
  const params = useParams()
  const commonDetailsStore = useSelector(store => store.commonDetailsStore)
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
    commonDetailsStore.showWarning && 'pop-up-dialog-opened',
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

  useEffect(() => {
    return () => {
      if (!isDetailsPopUp) {
        dispatch(resetChanges())
      }
    }
  }, [dispatch, isDetailsPopUp])

  const handleShowWarning = useCallback(
    show => {
      dispatch(showWarning(show))
    },
    [dispatch]
  )

  const handleRefreshClick = useCallback(
    event => {
      if (
        commonDetailsStore.changes.counter > 0 &&
        document.getElementById('refresh')?.contains(event.target)
      ) {
        handleShowWarning(true)
        dispatch(setFiltersWasHandled(true))
      }
    },
    [commonDetailsStore.changes.counter, dispatch, handleShowWarning]
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
        commonDetailsStore.changes.counter > 0 &&
        (currentLocationPathname.join('/') !== nextLocationPathname.join('/') ||
          currentDetailsView !== nextDetailsView)
      )
    },
    [commonDetailsStore.changes.counter]
  )

  useEffect(() => {
    if (
      formRef.current &&
      commonDetailsStore.changes.counter === 0 &&
      !isEqual(pickBy(formInitialValues), pickBy(formRef.current.getState()?.values)) &&
      !formRef.current.getState()?.active
    ) {
      formRef.current.restart(formInitialValues)
    }
  }, [formInitialValues, commonDetailsStore.changes.counter])

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
    applyDetailsChanges(commonDetailsStore.changes)
      .then(() => {
        dispatch(resetChanges())

        const changes = cloneDeep(commonDetailsStore.changes)

        // todo [redux-toolkit] rework it after redux-toolkit will be added to the details store. Need to remove setTimeout and use a Promise that resolves after the state is updated.
        setTimeout(() => {
          applyDetailsChangesCallback(changes, selectedItem)
        })
      })
      .catch(() => {})
  }, [
    applyDetailsChanges,
    applyDetailsChangesCallback,
    commonDetailsStore.changes,
    dispatch,
    selectedItem
  ])

  const cancelChanges = useCallback(() => {
    if (commonDetailsStore.changes.counter > 0) {
      dispatch(resetChanges())
      formRef.current.reset(formInitialValues)
    }
  }, [commonDetailsStore.changes.counter, dispatch, formInitialValues])

  const leavePage = useCallback(() => {
    cancelChanges()
    handleShowWarning(false)

    if (commonDetailsStore.filtersWasHandled) {
      dispatch(setFiltersWasHandled(false))
    }

    blocker.proceed?.()

    window.dispatchEvent(new CustomEvent('discardChanges'))
  }, [blocker, cancelChanges, commonDetailsStore.filtersWasHandled, dispatch, handleShowWarning])

  const doNotLeavePage = useCallback(() => {
    blocker.reset?.()
    dispatch(showWarning(false))
    window.dispatchEvent(new CustomEvent('cancelLeave'))
  }, [blocker, dispatch])

  return {
    DetailsContainer,
    applyChanges,
    applyChangesRef,
    blocker,
    cancelChanges,
    detailsPanelClassNames,
    detailsRef,
    commonDetailsStore,
    doNotLeavePage,
    formRef,
    handleShowWarning,
    leavePage,
    location,
    params,
    removeDetailsInfo,
    setBlocker,
    setDetailsInfo,
    shouldDetailsBlock
  }
}
