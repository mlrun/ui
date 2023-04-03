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
import { useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { TAG_FILTER, TAG_FILTER_ALL_ITEMS, TAG_FILTER_LATEST } from '../constants'
import { getFilterTagOptions, setFilters } from '../reducers/filtersReducer'
import { isNil } from 'lodash'

export const useGetTagOptions = (fetchTags, filters, category) => {
  const [urlTagOption, setUrlTagOption] = useState(null)
  const { projectName, tag: paramTag } = useParams()
  const tagOptions = useSelector(store => store.filtersStore.tagOptions)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    if (
      filters.length > 0 &&
      filters.find(filter => filter.type === TAG_FILTER) &&
      isNil(tagOptions)
    ) {
      if (!paramTag) {
        setUrlTagOption(TAG_FILTER_LATEST)
      }

      if (fetchTags) {
        dispatch(
          getFilterTagOptions({
            dispatch,
            fetchTags,
            project: projectName,
            category
          })
        )
          .unwrap()
          .then(tags => {
            if (paramTag) {
              if (tags.find(filterTag => filterTag === paramTag)) {
                setUrlTagOption(paramTag)
                dispatch(setFilters({ paramTag }))
              } else {
                setUrlTagOption(TAG_FILTER_ALL_ITEMS)
                dispatch(setFilters({ tag: TAG_FILTER_ALL_ITEMS }))
              }
            }
          })
      } else if (paramTag) {
        setUrlTagOption(paramTag)
        dispatch(setFilters({ paramTag }))
      }
    } else {
      setUrlTagOption(null)
    }
  }, [category, dispatch, fetchTags, filters, paramTag, projectName, tagOptions])

  return [urlTagOption]
}
