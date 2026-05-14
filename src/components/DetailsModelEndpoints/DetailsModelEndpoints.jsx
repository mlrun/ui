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
import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import ModelEndpointsTable from '../ModelsPage/ModelEndpoints/ModelEndpointsTable'

import { filtersConfig } from './detailsModelEndpoints.util'
import { fetchModelEndpoints } from '../../reducers/artifactsReducer'
import { FUNCTION_NAME_FILTER } from '../../constants'
import { getInitialFiltersByConfig } from '../../hooks/useFiltersFromSearchParams.hook'

const DetailsModelEndpoints = ({ selectedItem }) => {
  const params = useParams()
  const dispatch = useDispatch()
  const abortControllerRef = useRef(new AbortController())
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [localFilters, setLocalFilters] = useState(getInitialFiltersByConfig(filtersConfig))

  const fetchEndpoints = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      return dispatch(
        fetchModelEndpoints({
          project: params.projectName,
          filters: {
            ...filters,
            [FUNCTION_NAME_FILTER]: selectedItem.name
          },
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            }
          },
          params: {
            latest_only: 'True',
            'function-tag': selectedItem.tag
          }
        })
      )
    },
    [dispatch, params.projectName, selectedItem]
  )

  return (
    <ModelEndpointsTable
      fetchEndpoints={fetchEndpoints}
      filtersConfig={filtersConfig}
      filters={localFilters}
      setLocalFilters={setLocalFilters}
      ref={abortControllerRef}
      requestErrorMessage={requestErrorMessage}
      isDetails
    />
  )
}

DetailsModelEndpoints.propTypes = {
  selectedItem: PropTypes.object.isRequired
}

export default DetailsModelEndpoints
