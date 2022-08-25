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
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Tip } from 'igz-controls/components'

import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'

import './detailsMenu.scss'

const DetailsMenu = ({ detailsMenu, onClick, params }) => {
  const [arrowsAreHidden, setArrowsAreHidden] = useState(true)
  const [scrolledWidth, setScrolledWidth] = useState(0)
  const [rightArrowDisabled, setRightArrowDisabled] = useState(false)
  const tabsWrapperRef = useRef()
  const tabsRef = useRef()
  const location = useLocation()
  const menuOffsetHalfWidth = 2
  const tabOffset = 1.5

  const leftArrowClassNames = classnames(
    'details-menu__arrow',
    'details-menu__arrow_left',
    arrowsAreHidden && 'details-menu__arrow_hidden',
    scrolledWidth === 0 && 'details-menu__arrow_disabled'
  )
  const rightArrowClassNames = classnames(
    'details-menu__arrow',
    'details-menu__arrow_right',
    arrowsAreHidden && 'details-menu__arrow_hidden',
    rightArrowDisabled && 'details-menu__arrow_disabled'
  )

  const scrollTabs = toRight => {
    let scrollWidth

    if (toRight) {
      if (
        tabsRef.current?.scrollWidth <
        tabsWrapperRef.current?.offsetWidth * tabOffset + scrolledWidth
      ) {
        scrollWidth = tabsRef.current?.scrollWidth - tabsWrapperRef.current?.offsetWidth

        setRightArrowDisabled(true)
      } else {
        scrollWidth = scrolledWidth + tabsWrapperRef.current?.offsetWidth / menuOffsetHalfWidth
      }
    } else {
      scrollWidth = Math.max(
        0,
        scrolledWidth - tabsWrapperRef.current?.offsetWidth / menuOffsetHalfWidth
      )

      setRightArrowDisabled(false)
    }

    setScrolledWidth(scrollWidth)
  }

  const handleHideArrows = useCallback(() => {
    const scrollIsHidden = tabsRef.current?.offsetWidth === tabsRef.current?.scrollWidth

    setArrowsAreHidden(scrollIsHidden)

    if (rightArrowDisabled) {
      setScrolledWidth(tabsRef.current?.scrollWidth - tabsWrapperRef.current?.offsetWidth)
    }

    if (scrollIsHidden) {
      setScrolledWidth(0)
      setRightArrowDisabled(false)
    }
  }, [rightArrowDisabled, tabsRef, tabsWrapperRef])

  const moveToSelectedTab = useCallback(() => {
    const selectedTab = document.querySelector(`[data-tab='${params.tab}']`)
    const centeredTabPosition =
      selectedTab?.offsetLeft -
      tabsWrapperRef.current?.offsetWidth / menuOffsetHalfWidth +
      selectedTab?.offsetWidth / menuOffsetHalfWidth

    if (centeredTabPosition <= 0) {
      setScrolledWidth(0)
      setRightArrowDisabled(false)
    } else if (
      tabsRef.current?.scrollWidth <
      tabsWrapperRef.current?.offsetWidth / menuOffsetHalfWidth +
        selectedTab?.offsetLeft +
        selectedTab?.offsetWidth
    ) {
      setScrolledWidth(tabsRef.current?.scrollWidth - tabsWrapperRef.current?.offsetWidth)
      setRightArrowDisabled(true)
    } else {
      setScrolledWidth(centeredTabPosition)
      setRightArrowDisabled(false)
    }
  }, [params.tab])

  useEffect(() => {
    window.addEventListener('resize', handleHideArrows)

    return () => window.removeEventListener('resize', handleHideArrows)
  }, [handleHideArrows])

  useEffect(() => {
    window.addEventListener('resize', moveToSelectedTab)

    return () => window.removeEventListener('resize', moveToSelectedTab)
  }, [moveToSelectedTab])

  useEffect(() => {
    handleHideArrows()
  }, [detailsMenu, handleHideArrows])

  useEffect(() => {
    moveToSelectedTab()
  }, [moveToSelectedTab])

  return (
    <ul className="details-menu">
      <Arrow
        className={leftArrowClassNames}
        onClick={() => {
          scrollTabs(false)
        }}
      />
      <div className="details-menu__tabs-wrapper" ref={tabsWrapperRef}>
        <div
          ref={tabsRef}
          className="details-menu__tabs"
          style={{
            transform: `translateX(${-scrolledWidth}px)`
          }}
        >
          {detailsMenu.map(tab => {
            const tabLink = location.pathname?.replace(/^$|([^/]+$)/, tab.id)

            return (
              !tab.hidden && (
                <Link to={tabLink} onClick={onClick} key={tab.id}>
                  <li
                    data-tab={tab.id}
                    className={classnames(
                      'details-menu__tab',
                      params.tab === tab.id && 'details-menu__tab_active'
                    )}
                  >
                    {tab.label}
                    {tab.tip && <Tip className="details-menu__tab-tip" text={tab.tip} />}
                  </li>
                </Link>
              )
            )
          })}
        </div>
      </div>
      <Arrow className={rightArrowClassNames} onClick={() => scrollTabs(true)} />
    </ul>
  )
}

DetailsMenu.defaultProps = {
  onClick: () => {}
}

DetailsMenu.propTypes = {
  detailsMenu: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  params: PropTypes.shape({}).isRequired
}

export default DetailsMenu
