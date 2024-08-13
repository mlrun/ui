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
import { Link, useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Tip } from 'igz-controls/components'

import { SLIDER_STYLE_1, SLIDER_STYLE_2, SLIDER_TABS } from '../../types'

import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'

import './tabsSlider.scss'

const TabsSlider = ({
  initialTab = '',
  onClick = () => {},
  skipLink = false,
  sliderStyle = SLIDER_STYLE_1,
  tabsList
}) => {
  const [selectedTab, setSelectedTab] = useState(initialTab)
  const [arrowsAreHidden, setArrowsAreHidden] = useState(true)
  const [scrolledWidth, setScrolledWidth] = useState(0)
  const [rightArrowDisabled, setRightArrowDisabled] = useState(false)
  const tabsWrapperRef = useRef()
  const tabsRef = useRef()
  const location = useLocation()
  const params = useParams()
  const menuOffsetHalfWidth = 2
  const tabOffset = 1.5

  const tabsSliderClassNames = classnames('tabs-slider', sliderStyle)
  const leftArrowClassNames = classnames(
    'tabs-slider__arrow',
    'tabs-slider__arrow_left',
    arrowsAreHidden && 'tabs-slider__arrow_hidden',
    scrolledWidth === 0 && 'tabs-slider__arrow_disabled'
  )
  const rightArrowClassNames = classnames(
    'tabs-slider__arrow',
    'tabs-slider__arrow_right',
    arrowsAreHidden && 'tabs-slider__arrow_hidden',
    rightArrowDisabled && 'tabs-slider__arrow_disabled'
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
    const selectedTabNode = document.querySelector(`[data-tab='${selectedTab}']`)
    const centeredTabPosition =
      selectedTabNode?.offsetLeft -
      tabsWrapperRef.current?.offsetWidth / menuOffsetHalfWidth +
      selectedTabNode?.offsetWidth / menuOffsetHalfWidth

    if (centeredTabPosition <= 0) {
      setScrolledWidth(0)
      setRightArrowDisabled(false)
    } else if (
      tabsRef.current?.scrollWidth <
      tabsWrapperRef.current?.offsetWidth / menuOffsetHalfWidth +
        selectedTabNode?.offsetLeft +
        selectedTabNode?.offsetWidth
    ) {
      setScrolledWidth(tabsRef.current?.scrollWidth - tabsWrapperRef.current?.offsetWidth)
      setRightArrowDisabled(true)
    } else {
      setScrolledWidth(centeredTabPosition)
      setRightArrowDisabled(false)
    }
  }, [selectedTab])

  const onSelectTab = newTab => {
    setSelectedTab(newTab.id)
    onClick && onClick(newTab)
  }

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
  }, [tabsList, handleHideArrows])

  useEffect(() => {
    moveToSelectedTab()
  }, [moveToSelectedTab])

  useEffect(() => {
    if (params.tab && params.tab !== selectedTab) {
      setSelectedTab(tabsList.find(tab => tab.id === params.tab).id)
    }
  }, [params.tab, selectedTab, tabsList])

  return (
    <div className={tabsSliderClassNames}>
      <div
        className={leftArrowClassNames}
        onClick={() => {
          scrollTabs(false)
        }}
      >
        <Arrow />
      </div>
      <div className="tabs-slider__tabs-wrapper" ref={tabsWrapperRef}>
        <div
          ref={tabsRef}
          className="tabs-slider__tabs"
          style={{
            transform: `translateX(${-scrolledWidth}px)`
          }}
        >
          {tabsList.map(tab => {
            const tabClassName = classnames(
              'tabs-slider__tab',
              selectedTab === tab.id && 'tabs-slider__tab_active'
            )

            return (
              !tab.hidden &&
              (!skipLink ? (
                <Link
                  className={tabClassName}
                  data-tab={tab.id}
                  to={`${location.pathname?.replace(/^$|([^/]+$)/, tab.id)}${
                    location.search ?? ''
                  }`}
                  onClick={() => onSelectTab(tab)}
                  key={tab.id}
                >
                  {tab.label}
                  {tab.tip && <Tip className="tabs-slider__tab-tip" text={tab.tip} />}
                </Link>
              ) : (
                <div
                  className={tabClassName}
                  data-tab={tab.id}
                  key={tab.id}
                  onClick={() => onSelectTab(tab)}
                >
                  {tab.label}
                  {tab.tip && <Tip className="tabs-slider__tab-tip" text={tab.tip} />}
                </div>
              ))
            )
          })}
        </div>
      </div>
      <div className={rightArrowClassNames} onClick={() => scrollTabs(true)}>
        <Arrow />
      </div>
    </div>
  )
}

TabsSlider.propTypes = {
  initialTab: PropTypes.string,
  onClick: PropTypes.func,
  skipLink: PropTypes.bool,
  sliderStyle: PropTypes.oneOf([SLIDER_STYLE_1, SLIDER_STYLE_2]),
  tabsList: SLIDER_TABS.isRequired
}

export default TabsSlider
