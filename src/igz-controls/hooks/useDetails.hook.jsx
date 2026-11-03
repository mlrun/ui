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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import arrayMutators from 'final-form-arrays'
import classnames from 'classnames'
import { cloneDeep, isEqual, pickBy } from 'lodash-es'
import { createForm } from 'final-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'

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
import { VIEW_SEARCH_PARAMETER } from '../constants'
import { setFieldState } from '../utils/form.util'

import DetailsContainer from './DetailsContainer'

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

  const [formRef] = useState(() =>
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
      formRef &&
      commonDetailsStore.changes.counter === 0 &&
      !isEqual(pickBy(formInitialValues), pickBy(formRef.getState()?.values)) &&
      !formRef.getState()?.active
    ) {
      formRef.restart(formInitialValues)
    }
  }, [formInitialValues, commonDetailsStore.changes.counter, formRef])

  useEffect(() => {
    const currentPathname = location.pathname.substring(
      0,
      location.pathname.lastIndexOf(params.tab)
    )

    if (previousPathnameRef.current !== currentPathname && !isDetailsPopUp) {
      formRef.restart(formInitialValues)
      dispatch(setEditMode(false))
      previousPathnameRef.current = currentPathname
    }
  }, [dispatch, formInitialValues, formRef, isDetailsPopUp, location.pathname, params.tab])

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
      formRef.reset(formInitialValues)
    }
  }, [commonDetailsStore.changes.counter, dispatch, formInitialValues, formRef])

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
