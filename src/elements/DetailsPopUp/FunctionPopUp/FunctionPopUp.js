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
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import DetailsPopUp from '../DetailsPopUp'

import { useMode } from '../../../hooks/mode.hook'
import {
  generateActionsMenu,
  generateFunctionsPageData
} from '../../../components/FunctionsPage/functions.util'
import { parseFunction } from '../../../utils/parseFunction'
import { parseFunctionUri } from '../../../utils/link-helper.util'
import { showErrorNotification } from '../../../utils/notifications.util'
import { TAG_LATEST } from '../../../constants'

import functionsApi from '../../../api/functions-api'
import { toggleYaml } from '../../../reducers/appReducer'

const FunctionPopUp = ({ funcUri, isOpen, onResolve }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isDemoMode, isStagingMode } = useMode()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFunction, setSelectedFunction] = useState({})
  const fetchFunctionLogsTimeout = useRef(null)
  const fetchFunctionNuclioLogsTimeout = useRef(null)

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const fetchFunction = useCallback(() => {
    const parsedFuncUri = parseFunctionUri(funcUri)

    setIsLoading(true)
    return functionsApi
      .getFunction(
        parsedFuncUri.project,
        parsedFuncUri.name,
        parsedFuncUri.hash,
        parsedFuncUri.tag || TAG_LATEST
      )
      .then(result => {
        setSelectedFunction(parseFunction(result.data.func))
        setIsLoading(false)
      })
      .catch(error => {
        showErrorNotification(dispatch, error, '', 'Failed to retrieve function data')

        onResolve()
      })
  }, [dispatch, funcUri, onResolve])

  const actionsMenu = useMemo(
    () => func =>
      generateActionsMenu(
        dispatch,
        func,
        isDemoMode,
        isStagingMode,
        () => {},
        () => {},
        () => {},
        () => {},
        toggleConvertedYaml,
        () => {},
        {},
        selectedFunction,
        fetchFunction,
        true
      ),
    [dispatch, isDemoMode, isStagingMode, toggleConvertedYaml, selectedFunction, fetchFunction]
  )

  const pageData = useMemo(
    () =>
      generateFunctionsPageData(
        dispatch,
        selectedFunction,
        fetchFunctionLogsTimeout,
        fetchFunctionNuclioLogsTimeout,
        navigate,
        fetchFunction
      ),
    [dispatch, fetchFunction, navigate, selectedFunction]
  )

  useEffect(() => {
    if (isEmpty(selectedFunction)) {
      fetchFunction()
    }
  }, [fetchFunction, selectedFunction])

  return (
    <DetailsPopUp
      actionsMenu={actionsMenu}
      handleRefresh={fetchFunction}
      isLoading={isLoading}
      isOpen={isOpen}
      onResolve={onResolve}
      pageData={pageData}
      selectedItem={selectedFunction}
    />
  )
}

FunctionPopUp.propTypes = {
  funcUri: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onResolve: PropTypes.func.isRequired
}

export default FunctionPopUp
