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
