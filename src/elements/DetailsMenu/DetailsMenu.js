import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { FUNCTIONS_PAGE } from '../../constants'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './detailsMenu.scss'

const DetailsMenu = ({
  detailsMenu,
  hash,
  id,
  iter,
  match,
  name,
  onClick,
  page
}) => {
  const [arrowsAreHidden, setArrowsAreHidden] = useState(true)
  const [scrolledWidth, setScrolledWidth] = useState(0)
  const [rightArrowDisabled, setRightArrowDisabled] = useState(false)
  const tabsWrapperRef = useRef()
  const tabsRef = useRef()
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
        scrollWidth =
          tabsRef.current?.scrollWidth - tabsWrapperRef.current?.offsetWidth

        setRightArrowDisabled(true)
      } else {
        scrollWidth =
          scrolledWidth +
          tabsWrapperRef.current?.offsetWidth / menuOffsetHalfWidth
      }
    } else {
      scrollWidth =
        scrolledWidth -
          tabsWrapperRef.current?.offsetWidth / menuOffsetHalfWidth <
        0
          ? 0
          : scrolledWidth -
            tabsWrapperRef.current?.offsetWidth / menuOffsetHalfWidth

      setRightArrowDisabled(false)
    }

    setScrolledWidth(scrollWidth)
  }

  const handleHideArrows = useCallback(() => {
    const scrollIsHidden =
      tabsRef.current?.offsetWidth === tabsRef.current?.scrollWidth

    setArrowsAreHidden(scrollIsHidden)

    if (rightArrowDisabled) {
      setScrolledWidth(
        tabsRef.current?.scrollWidth - tabsWrapperRef.current?.offsetWidth
      )
    }

    if (scrollIsHidden) {
      setScrolledWidth(0)
      setRightArrowDisabled(false)
    }
  }, [rightArrowDisabled, tabsRef, tabsWrapperRef])

  const moveToSelectedTab = useCallback(() => {
    const selectedTab = document.querySelector(
      `[data-tab='${match.params.tab}']`
    )
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
      setScrolledWidth(
        tabsRef.current?.scrollWidth - tabsWrapperRef.current?.offsetWidth
      )
      setRightArrowDisabled(true)
    } else {
      setScrolledWidth(centeredTabPosition)
      setRightArrowDisabled(false)
    }
  }, [match.params.tab])

  useEffect(() => {
    window.addEventListener('resize', handleHideArrows)

    return () => window.removeEventListener('resize', handleHideArrows)
  }, [handleHideArrows])

  useEffect(() => {
    window.addEventListener('resize', moveToSelectedTab)
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
          {detailsMenu.map(
            tab =>
              !tab.hidden && (
                <Link
                  to={`/projects/${
                    match.params.projectName
                  }/${page.toLowerCase()}/${
                    match.params.pageTab ? `${match.params.pageTab}/` : ''
                  }${page === FUNCTIONS_PAGE ? hash : id || name}/${
                    match.params.tag ? `${match.params.tag}/` : ''
                  }${isNaN(parseInt(iter)) ? '' : `${iter}/`}${tab.id}`}
                  onClick={onClick}
                  key={tab.id}
                >
                  <li
                    data-tab={tab.id}
                    className={classnames(
                      'details-menu__tab',
                      match.params.tab === tab.id && 'details-menu__tab_active'
                    )}
                  >
                    {tab.label}
                  </li>
                </Link>
              )
          )}
        </div>
      </div>
      <Arrow
        className={rightArrowClassNames}
        onClick={() => scrollTabs(true)}
      />
    </ul>
  )
}

DetailsMenu.defaultProps = {
  hash: '',
  id: '',
  iter: null,
  name: '',
  onClick: () => {}
}

DetailsMenu.propTypes = {
  detailsMenu: PropTypes.array.isRequired,
  hash: PropTypes.string,
  id: PropTypes.string,
  iter: PropTypes.number,
  match: PropTypes.shape({}).isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func,
  page: PropTypes.string.isRequired
}

export default DetailsMenu
