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
import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { GROUP_BY_NAME, SHOW_ITERATIONS } from '../constants'
import { setFilters } from '../reducers/filtersReducer'
import { sortListByDate } from '../utils'

export const useInitialArtifactsFetch = (
  fetchData,
  urlTagOption,
  artifactsLength,
  setExpandedRowsData,
  createArtifactsRowData
) => {
  const [searchParams] = useSearchParams()
  const params = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    if (urlTagOption && artifactsLength === 0) {
      let filtersLocal = { tag: urlTagOption, iter: SHOW_ITERATIONS }

      if (searchParams.get('useUrlParamsAsFilter') === 'true') {
        filtersLocal = { tag: urlTagOption, iter: '', name: params.name }

        dispatch(
          setFilters({
            groupBy: GROUP_BY_NAME
          })
        )
      }

      fetchData(filtersLocal).then(result => {
        if (filtersLocal.name) {
          setExpandedRowsData(state => ({
            ...state,
            [filtersLocal.name]: {
              content: sortListByDate(result, 'updated', false).map(artifact =>
                createArtifactsRowData(artifact, params.projectName)
              )
            },
            error: null,
            loading: false
          }))
        }
      })
    }
  }, [
    dispatch,
    fetchData,
    artifactsLength,
    params.name,
    params.projectName,
    searchParams,
    urlTagOption,
    setExpandedRowsData,
    createArtifactsRowData
  ])
}
