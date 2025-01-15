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
import React, { useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { max, min } from 'lodash'

import { RoundedIcon } from 'igz-controls/components'

import {
  BE_PAGE,
  BE_PAGE_SIZE,
  FE_PAGE,
  FE_PAGE_END,
  FE_PAGE_SIZE,
  FE_PAGE_START,
  ITEMS_COUNT_END,
  ITEMS_COUNT_START
} from '../../constants'
import { PAGINATION_CONFIG } from '../../types'
import { getCloseDetailsLink } from '../../utils/link-helper.util'

import { ReactComponent as DoubleArrow } from 'igz-controls/images/pagination-double-arrow.svg'
import { ReactComponent as Arrow } from 'igz-controls/images/pagination-arrow.svg'

import './pagination.scss'

const threeDotsString = '...'

const Pagination = ({
  closeParamName = '',
  disableNextDoubleBtn = false,
  disabledNextDoubleBtnTooltip = '',
  paginationConfig
}) => {
  const [, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const paginationPagesRef = useRef()
  const leftSideRef = useRef(0)
  const rightSideRef = useRef(0)

  // Total pages are now calculated based on start and end pages
  const totalPagesCount = useMemo(
    () => paginationConfig[FE_PAGE_END] - paginationConfig[FE_PAGE_START] + 1,
    [paginationConfig]
  )

  const navigationDisableState = useMemo(() => {
    return {
      prevBtn: paginationConfig[FE_PAGE] === 1,
      prevDoubleBtn: paginationConfig[BE_PAGE] === 1,
      nextBtn:
        (paginationConfig[FE_PAGE] === paginationConfig[FE_PAGE_END] && disableNextDoubleBtn) ||
        (paginationConfig[FE_PAGE] === paginationConfig[FE_PAGE_END] &&
          !paginationConfig.paginationResponse?.['page-token']),
      nextDoubleBtn: disableNextDoubleBtn || !paginationConfig.paginationResponse?.['page-token']
    }
  }, [disableNextDoubleBtn, paginationConfig])

  const prevDoubleBtnTooltip = useMemo(() => {
    const visiblePagesCount = paginationConfig[BE_PAGE_SIZE] / paginationConfig[FE_PAGE_SIZE]
    const firstPrevPage = paginationConfig[FE_PAGE_START] - visiblePagesCount
    const lastPrevPage = firstPrevPage + visiblePagesCount - 1
    return firstPrevPage && lastPrevPage ? `Load pages ${firstPrevPage}-${lastPrevPage}` : ''
  }, [paginationConfig])

  const handlePageChange = useCallback(() => {
    if (closeParamName) {
      navigate(getCloseDetailsLink(closeParamName, true), { replace: true })
    }
  }, [closeParamName, navigate])

  const paginationItems = useMemo(() => {
    if (!paginationConfig[FE_PAGE]) return []

    const items = []
    const firstPage = paginationConfig[FE_PAGE_START]
    const lastPage = paginationConfig[FE_PAGE_END]

    // Always show the first page in the dynamic range
    items.push(firstPage)

    if (totalPagesCount <= 7) {
      // If total pages within range are 7 or fewer, show all
      for (let i = firstPage + 1; i <= lastPage; i++) {
        items.push(i)
      }
    } else {
      const isFirstFourRange = paginationConfig[FE_PAGE] < paginationConfig[FE_PAGE_START] + 4
      const isLastFourRange = paginationConfig[FE_PAGE] > paginationConfig[FE_PAGE_END] - 4
      let leftSide = Math.max(firstPage + 1, paginationConfig[FE_PAGE] - (isFirstFourRange ? 2 : 1))
      let rightSide = Math.min(lastPage - 1, paginationConfig[FE_PAGE] + (isLastFourRange ? 2 : 1))

      if (paginationConfig[FE_PAGE] <= firstPage + 3) {
        // Case when activePage is close to the start
        rightSide = firstPage + 4
      } else if (paginationConfig[FE_PAGE] >= lastPage - 3) {
        // Case when activePage is close to the end
        leftSide = lastPage - 4
      }

      rightSideRef.current = rightSide
      leftSideRef.current = leftSide

      if (leftSide > firstPage + 1) {
        items.push(threeDotsString)
      }

      for (let i = leftSide; i <= rightSide; i++) {
        items.push(i)
      }

      if (rightSide < lastPage - 1) {
        items.push(threeDotsString)
      }

      // Always show the last page in the dynamic range
      items.push(lastPage)
    }

    return items
  }, [paginationConfig, totalPagesCount])

  const goToPage = page => {
    setSearchParams(prevSearchParams => {
      prevSearchParams.set(FE_PAGE, page)

      return prevSearchParams
    })

    handlePageChange()
  }

  const goToNextBePage = () => {
    setSearchParams(prevSearchParams => {
      prevSearchParams.set(BE_PAGE, paginationConfig[BE_PAGE] + 1)
      return prevSearchParams
    })

    handlePageChange()
  }

  const goToPrevBePage = customFePage => {
    setSearchParams(prevSearchParams => {
      prevSearchParams.set(BE_PAGE, paginationConfig[BE_PAGE] - 1)

      if (customFePage) {
        prevSearchParams.set(FE_PAGE, customFePage)
      }

      return prevSearchParams
    })

    handlePageChange()
  }

  const goToNextFePage = () => {
    if (paginationConfig[FE_PAGE] === paginationConfig[FE_PAGE_END]) {
      goToNextBePage()
    } else {
      setSearchParams(prevSearchParams => {
        prevSearchParams.set(FE_PAGE, paginationConfig[FE_PAGE] + 1)

        return prevSearchParams
      })

      handlePageChange()
    }
  }

  const goToPrevFePage = () => {
    if (paginationConfig[FE_PAGE] === paginationConfig[FE_PAGE_START]) {
      goToPrevBePage(paginationConfig[FE_PAGE] - 1)
    } else {
      setSearchParams(prevSearchParams => {
        prevSearchParams.set(FE_PAGE, paginationConfig[FE_PAGE] - 1)

        return prevSearchParams
      })

      handlePageChange()
    }
  }

  const getPageNumberStyle = useCallback(paginationItems => {
    const maxPage = max(paginationItems)
    const paginationItemWidth = `${maxPage.toString().length}ch`

    return { width: paginationItemWidth }
  }, [])

  const getPaginationPagesStyle = useCallback(
    paginationItems => {
      const maxFePages = paginationConfig[BE_PAGE_SIZE] / paginationConfig[FE_PAGE_SIZE]
      const maxPage = max(paginationItems)
      const maxPageCount = min([7, maxPage, maxFePages])
      const paginationPagesWidth = `${maxPageCount * 40}px`

      return { minWidth: paginationPagesWidth }
    },
    [paginationConfig]
  )

  return (
    <div className="pagination">
      {paginationConfig.isNewResponse && (
        <>
          <div className="pagination-items-count">
            Showing {paginationConfig[ITEMS_COUNT_START]} - {paginationConfig[ITEMS_COUNT_END]}
          </div>
          <div className="pagination-navigation">
            <RoundedIcon
              id="pagination-navigate-double-prev-btn"
              className="pagination-navigate-btn pagination-navigate-prev-btn"
              onClick={() => goToPrevBePage()}
              tooltipText={!navigationDisableState.prevDoubleBtn ? prevDoubleBtnTooltip : ''}
              disabled={navigationDisableState.prevDoubleBtn}
            >
              <DoubleArrow />
            </RoundedIcon>
            <RoundedIcon
              id="pagination-navigate-prev-btn"
              className="pagination-navigate-btn pagination-navigate-prev-btn"
              onClick={() => goToPrevFePage()}
              tooltipText={!navigationDisableState.prevBtn ? 'Previous page' : ''}
              disabled={navigationDisableState.prevBtn}
            >
              <Arrow />
            </RoundedIcon>

            <div
              className="pagination-pages"
              ref={paginationPagesRef}
              style={getPaginationPagesStyle(paginationItems)}
            >
              {paginationItems.map(
                (pageItem, index) =>
                  pageItem && (
                    <button
                      key={index}
                      data-testid={
                        pageItem === threeDotsString
                          ? 'pagination-dots'
                          : `pagination-page-${pageItem}`
                      }
                      onClick={
                        pageItem !== paginationConfig[FE_PAGE] ? () => goToPage(pageItem) : null
                      }
                      className={classnames(
                        'pagination-btn',
                        pageItem !== threeDotsString && 'pagination-page-btn',
                        pageItem === threeDotsString && 'pagination-dots',
                        pageItem === paginationConfig[FE_PAGE] && 'pagination-btn_active'
                      )}
                      disabled={pageItem === threeDotsString}
                    >
                      <div
                        className={classnames('pagination-page-number')}
                        style={getPageNumberStyle(paginationItems, pageItem, index)}
                      >
                        {pageItem}
                      </div>
                    </button>
                  )
              )}
            </div>

            <RoundedIcon
              id="pagination-navigate-next-btn"
              className="pagination-navigate-btn"
              onClick={() => goToNextFePage()}
              tooltipText={!navigationDisableState.nextBtn ? 'Next page' : ''}
              disabled={navigationDisableState.nextBtn}
            >
              <Arrow />
            </RoundedIcon>
            <RoundedIcon
              id="pagination-navigate-next-double-btn"
              className="pagination-navigate-btn"
              onClick={() => goToNextBePage()}
              tooltipText={
                navigationDisableState.nextDoubleBtn && disabledNextDoubleBtnTooltip
                  ? disabledNextDoubleBtnTooltip
                  : !navigationDisableState.nextDoubleBtn
                    ? `Load page ${paginationConfig[FE_PAGE_END] + 1}+`
                    : ''
              }
              disabled={navigationDisableState.nextDoubleBtn}
            >
              <DoubleArrow />
            </RoundedIcon>
          </div>
          <div className="pagination-items-selector"></div>
        </>
      )}
    </div>
  )
}

Pagination.propTypes = {
  closeParamName: PropTypes.string,
  disableNextDoubleBtn: PropTypes.bool,
  disabledNextDoubleBtnTooltip: PropTypes.string,
  paginationConfig: PAGINATION_CONFIG.isRequired
}

export default Pagination
