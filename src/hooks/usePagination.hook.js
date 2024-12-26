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
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { chunk, debounce, isEqual, isNull } from 'lodash'

import {
  BE_PAGE,
  BE_PAGE_SIZE,
  FE_PAGE,
  FE_PAGE_END,
  FE_PAGE_SIZE,
  FE_PAGE_START,
  ITEMS_COUNT_END,
  ITEMS_COUNT_START
} from '../constants'
import { useSelector } from 'react-redux'

export const usePagination = ({
  bePageSize = 1000,
  content = [],
  fePageSize = 50,
  filters,
  hidden = false,
  paginationConfigRef,
  refreshContent,
  resetPaginationTrigger
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [paginatedContent, setPaginatedContent] = useState([])
  const resetPaginationTriggerRef = useRef(resetPaginationTrigger)
  const filtersStore = useSelector(store => store.filtersStore)

  const refreshContentDebounced = useMemo(() => {
    return debounce(filters => refreshContent(filters))
  }, [refreshContent])

  const resetPagination = useCallback(
    resetSearchParams => {
      setSearchParams(
        prevSearchParams => {
          if (resetSearchParams) {
            prevSearchParams.set(BE_PAGE, 1)
            prevSearchParams.set(FE_PAGE, 1)
          }

          return prevSearchParams
        },
        { replace: true }
      )

      paginationConfigRef.current = {
        [BE_PAGE_SIZE]: bePageSize,
        [FE_PAGE_SIZE]: fePageSize,
        [BE_PAGE]: 1,
        [FE_PAGE]: 1,
        isNewResponse: false,
        paginationResponse: null
      }
    },
    [bePageSize, fePageSize, paginationConfigRef, setSearchParams]
  )

  useLayoutEffect(() => {
    if (!hidden) {
      const paginationResponse = paginationConfigRef.current.paginationResponse || null
      const newPaginationConfig = {
        [BE_PAGE_SIZE]: bePageSize,
        [FE_PAGE_SIZE]: fePageSize,
        [BE_PAGE]: parseInt(searchParams.get(BE_PAGE)) || 1,
        [FE_PAGE]: parseInt(searchParams.get(FE_PAGE)) || 1,
        paginationResponse
      }

      const fePageStart = (bePageSize * (newPaginationConfig[BE_PAGE] - 1)) / fePageSize + 1
      const fePageEnd = fePageStart + Math.ceil(content.length / fePageSize) - 1
      const bePage = newPaginationConfig[BE_PAGE]
      const bePageFromPaginationResponse = parseInt(paginationResponse?.page)
      newPaginationConfig.isNewResponse = bePage === bePageFromPaginationResponse

      if (
        (bePageFromPaginationResponse &&
          bePage === bePageFromPaginationResponse &&
          fePageEnd >= fePageStart) ||
        (!searchParams.has(FE_PAGE) && !searchParams.has(BE_PAGE))
      ) {
        newPaginationConfig[FE_PAGE_START] = fePageStart
        newPaginationConfig[FE_PAGE_END] = fePageEnd

        const fePage = newPaginationConfig[FE_PAGE]
        newPaginationConfig[FE_PAGE] =
          fePage && fePage >= fePageStart && fePage <= fePageEnd ? fePage : fePageStart

        setSearchParams(
          prevSearchParams => {
            prevSearchParams.set(BE_PAGE, newPaginationConfig[BE_PAGE])
            prevSearchParams.set(FE_PAGE, newPaginationConfig[FE_PAGE])
            return prevSearchParams
          },
          { replace: true }
        )
      }

      setPaginatedContent(prevPaginatedContent => {
        const newPaginatedContent = getPaginatedContent(
          content,
          newPaginationConfig,
          FE_PAGE,
          BE_PAGE
        )

        const prevItemsCount =
          (newPaginationConfig[FE_PAGE] - 1) * newPaginationConfig[FE_PAGE_SIZE]
        const itemsCountStart = newPaginatedContent.length === 0 ? 0 : prevItemsCount + 1
        const itemsCountEnd = prevItemsCount + newPaginatedContent.length

        if (itemsCountStart && itemsCountEnd) {
          newPaginationConfig[ITEMS_COUNT_START] = itemsCountStart
          newPaginationConfig[ITEMS_COUNT_END] = itemsCountEnd
        }

        paginationConfigRef.current = {
          ...paginationConfigRef.current,
          ...newPaginationConfig
        }

        return isEqual(prevPaginatedContent, newPaginatedContent)
          ? prevPaginatedContent
          : newPaginatedContent
      })
    }
  }, [bePageSize, fePageSize, paginationConfigRef, content, searchParams, setSearchParams, hidden])

  useEffect(() => {
    if (resetPaginationTrigger !== resetPaginationTriggerRef.current) {
      resetPaginationTriggerRef.current = resetPaginationTrigger

      if (paginationConfigRef.current.paginationResponse) {
        resetPagination(false)
      }
    }
  }, [hidden, paginationConfigRef, resetPagination, resetPaginationTrigger])

  useEffect(() => {
    const paginationResponse = paginationConfigRef.current?.paginationResponse

    if (
      !hidden &&
      searchParams.get(BE_PAGE) &&
      (!paginationResponse ||
        (paginationResponse?.page &&
          paginationResponse?.page !== parseInt(searchParams.get(BE_PAGE))))
    ) {
      refreshContentDebounced(filters)
    }
  }, [filters, hidden, paginationConfigRef, refreshContentDebounced, searchParams])

  useEffect(() => {
    if (
      !hidden &&
      content.length === 0 &&
      isNull(paginationConfigRef.current.paginationResponse?.page) &&
      parseInt(searchParams.get(BE_PAGE)) > 1
    ) {
      setSearchParams(
        prevSearchParams => {
          prevSearchParams.set(BE_PAGE, 1)
          prevSearchParams.set(FE_PAGE, 1)
          return prevSearchParams
        },
        { replace: true }
      )

      paginationConfigRef.current.paginationResponse = null
    }
  }, [paginationConfigRef, content, searchParams, setSearchParams, hidden])

  useEffect(() => {
    if (filtersStore.autoRefresh && paginationConfigRef.current[BE_PAGE] > 1) {
      setSearchParams(
        prevSearchParams => {
          prevSearchParams.set(BE_PAGE, 1)
          prevSearchParams.set(FE_PAGE, 1)
          return prevSearchParams
        },
        { replace: true }
      )
    }
  }, [filtersStore.autoRefresh, paginationConfigRef, setSearchParams])

  const handleRefresh = (filters, filtersChange) => {
    if (filtersChange && (searchParams.get(BE_PAGE) !== '1' || searchParams.get(FE_PAGE) !== '1')) {
      resetPagination(true)
    } else {
      refreshContent(filters)
    }
  }

  return [handleRefresh, paginatedContent, searchParams, setSearchParams, resetPagination]
}

export const getPaginatedContent = (
  content,
  paginationConfig,
  fePage = FE_PAGE,
  bePage = BE_PAGE
) => {
  const contentByPages = chunk(content, paginationConfig[FE_PAGE_SIZE])
  const convertedFePage =
    paginationConfig[fePage] -
    (paginationConfig[bePage] * paginationConfig[BE_PAGE_SIZE] - paginationConfig[BE_PAGE_SIZE]) /
      paginationConfig[FE_PAGE_SIZE]

  return contentByPages[convertedFePage - 1] ?? []
}
