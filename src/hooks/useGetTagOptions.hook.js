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
import { useParams } from 'react-router-dom'
import { useLayoutEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isNil } from 'lodash'

import {
  GROUP_BY_FILTER,
  GROUP_BY_NAME,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../constants'
import { getFilterTagOptions, setFilters, setModalFiltersValues } from '../reducers/filtersReducer'

export const useGetTagOptions = (fetchTags, filters, category, modalFiltersName) => {
  const [urlTagOption, setUrlTagOption] = useState(null)
  const { projectName, tag: paramTag } = useParams()
  const tagOptions = useSelector(store => store.filtersStore.tagOptions)
  const dispatch = useDispatch()
  const abortControllerRef = useRef(new AbortController())

  useLayoutEffect(() => {
    if (
      filters.length > 0 &&
      filters.find(filter => filter.type === TAG_FILTER) &&
      isNil(tagOptions)
    ) {
      if (!paramTag) {
        setUrlTagOption(TAG_FILTER_LATEST)
      } else if (paramTag) {
        setUrlTagOption(paramTag)
      }

      if (fetchTags) {
        abortControllerRef.current = new AbortController()

        dispatch(
          getFilterTagOptions({
            dispatch,
            fetchTags,
            project: projectName,
            category,
            config: {
              ui: {
                controller: abortControllerRef.current
              }
            }
          })
        )
          .unwrap()
          .then(tags => {
            if (paramTag) {
              if (tags.find(filterTag => filterTag === paramTag)) {
                dispatch(setFilters({ paramTag }))
                modalFiltersName &&
                  dispatch(
                    setModalFiltersValues({
                      name: modalFiltersName,
                      value: { tag: paramTag }
                    })
                  )
              } else {
                setUrlTagOption(TAG_FILTER_ALL_ITEMS)
                dispatch(
                  setFilters({ tag: TAG_FILTER_ALL_ITEMS, [GROUP_BY_FILTER]: GROUP_BY_NAME })
                )
                modalFiltersName &&
                  dispatch(
                    setModalFiltersValues({
                      name: modalFiltersName,
                      value: { tag: TAG_FILTER_ALL_ITEMS }
                    })
                  )
              }
            }
          })
      } else if (paramTag) {
        dispatch(setFilters({ paramTag }))
        modalFiltersName &&
          dispatch(
            setModalFiltersValues({
              name: modalFiltersName,
              value: { tag: paramTag }
            })
          )
      }
    } else {
      setUrlTagOption(null)
    }
  }, [category, dispatch, fetchTags, filters, modalFiltersName, paramTag, projectName, tagOptions])

  return [urlTagOption, abortControllerRef]
}
