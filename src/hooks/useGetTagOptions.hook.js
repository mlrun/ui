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
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import filtersActions from '../actions/filters'

import { TAG_FILTER, TAG_FILTER_LATEST, TREE_FILTER } from '../constants'

export const useGetTagOptions = (fetchTags, filters) => {
  const [urlTag, setUrlTag] = useState(null)
  const { projectName, tag } = useParams()
  const tagOptions = useSelector(store => store.filtersStore.tagOptions)
  const dispatch = useDispatch()

  useEffect(() => {
    if (
      filters.length > 0 &&
      filters.find(
        filter => filter.type === TREE_FILTER || filter.type === TAG_FILTER
      ) &&
      tagOptions.length === 0
    ) {
      if (tag) {
        setUrlTag(tag)
        dispatch(filtersActions.setFilters({ tag }))
      } else {
        setUrlTag(TAG_FILTER_LATEST)
      }

      fetchTags(projectName).then(({ data }) => {
        dispatch(filtersActions.setFilterTagOptions([...new Set(data.tags)]))
      })
    } else {
      setUrlTag(null)
    }
  }, [dispatch, fetchTags, filters, projectName, tag, tagOptions.length])

  return urlTag
}
