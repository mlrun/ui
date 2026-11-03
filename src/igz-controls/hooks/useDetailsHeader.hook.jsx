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

import { useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router'

import { getViewMode, performDetailsActionHelper } from '../utils/common.util'

import DetailsHeaderContainer from './DetailsHeaderContainer'

export const useDetailsHeader = ({ handleCancel, handleShowWarning, isDetailsPopUp, pageData }) => {
  const commonDetailsStore = useSelector(store => store.commonDetailsStore)
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()
  const viewMode = getViewMode(window.location.search)
  const { actionButton, withToggleViewBtn, showAllVersions } = pageData.details
  const headerRef = useRef()
  const location = useLocation()

  const handleActionClick = async (event, handler) => {
    const actionCanBePerformed = await performDetailsActionHelper(
      commonDetailsStore.changes,
      dispatch
    )

    if (actionCanBePerformed) {
      handler(event)
    }
  }

  const handleBackClick = useCallback(() => {
    if (commonDetailsStore.changes.counter > 0) {
      handleShowWarning(true)
    } else if (handleCancel) {
      handleCancel()
    }
  }, [commonDetailsStore.changes.counter, handleCancel, handleShowWarning])

  const handleCancelClick = useCallback(() => {
    if (handleCancel && (commonDetailsStore.changes.counter === 0 || isDetailsPopUp)) {
      handleCancel()
    }
  }, [commonDetailsStore.changes.counter, handleCancel, isDetailsPopUp])

  return {
    DetailsHeaderContainer,
    actionButton,
    commonDetailsStore,
    handleActionClick,
    handleBackClick,
    handleCancelClick,
    headerRef,
    location,
    navigate,
    params,
    showAllVersions,
    viewMode,
    withToggleViewBtn
  }
}
