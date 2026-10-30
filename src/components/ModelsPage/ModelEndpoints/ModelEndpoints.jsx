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
import React, { useRef, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useSearchParams } from 'react-router'

import ModelEndpointsTable from './ModelEndpointsTable'

import { fetchModelEndpoints } from '../../../reducers/artifactsReducer'
import { filtersConfig } from './modelEndpoints.util'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'

const ModelEndpoints = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const abortControllerRef = useRef(new AbortController())
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [, setSearchParams] = useSearchParams()
  const filters = useFiltersFromSearchParams(filtersConfig)

  const fetchEndpoints = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      return dispatch(
        fetchModelEndpoints({
          project: params.projectName,
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            }
          },
          params: {
            latest_only: 'True'
          }
        })
      )
    },
    [dispatch, params.projectName]
  )

  return (
    <ModelEndpointsTable
      fetchEndpoints={fetchEndpoints}
      filters={filters}
      filtersConfig={filtersConfig}
      ref={abortControllerRef}
      requestErrorMessage={requestErrorMessage}
      setSearchParams={setSearchParams}
    />
  )
}

export default ModelEndpoints
