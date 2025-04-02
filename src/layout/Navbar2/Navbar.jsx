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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import BreadcrumbsDropdown from '../../elements/BreadcrumbsDropdown/BreadcrumbsDropdown'
import NavbarLink from '../../elements/NavbarLink2/NavbarLink'
import { Button, RoundedIcon } from 'igz-controls/components'

import { getLinks } from './Navbar.utils'
import { scrollToElement } from '../../utils/scroll.util'
import { generateProjectsList } from '../../utils/projects'
import localStorageService from '../../utils/localStorageService'
import { ALERTS_PAGE_PATH, NAVBAR_WIDTH_OPENED } from '../../constants'
import { useDetectOutsideClick } from 'igz-controls/hooks'

import { ReactComponent as Alerts } from 'igz-controls/images/navbar/alerts-icon.svg'
import { ReactComponent as PinIcon } from 'igz-controls/images/pin-icon.svg'
import { ReactComponent as UnPinIcon } from 'igz-controls/images/unpin-icon.svg'
import { ReactComponent as SettingsIcon } from 'igz-controls/images/navbar/mlrun-project-settings.svg'
import { ReactComponent as Caret } from 'igz-controls/images/dropdown.svg'

import './Navbar.scss'

const Navbar = ({ projectName, setIsNavbarPinned }) => {
  const [isPinned, setIsPinned] = useState(
    localStorageService.getStorageValue('mlrunUi.navbarStatic', false) === 'true'
  )
  const [isShowProjectsList, setShowProjectsList] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const { pathname } = useLocation()
  const params = useParams()
  const navbarRef = useRef()
  const projectListRef = useRef()
  const projectListWrapperRef = useRef()
  const projectStore = useSelector(state => state.projectStore)

  useDetectOutsideClick(projectListWrapperRef, () => {
    setShowProjectsList(false)
    setSearchValue('')
  })

  const navbarClasses = classNames('navbar', isPinned && 'navbar_pinned')
  const navbarStyles = {
    maxWidth: isPinned && NAVBAR_WIDTH_OPENED
  }

  const links = useMemo(() => {
    return projectName ? getLinks(projectName) : []
  }, [projectName])

  const projectsList = useMemo(() => {
    const projectsList = generateProjectsList(projectStore.projectsNames.data)
    return projectsList.map(project => ({
      ...project,
      linkTo: pathname.replace(params.projectName, project.id)
    }))
  }, [projectStore.projectsNames.data, pathname, params.projectName])

  const handlePinClick = () => {
    setIsPinned(prevIsPinned => {
      localStorageService.setStorageValue('mlrunUi.navbarStatic', !prevIsPinned)
      return !prevIsPinned
    })
  }

  const handleOnMouseLeave = useCallback(() => {
    !isPinned && setShowProjectsList(false)
  }, [isPinned])

  useEffect(() => {
    setIsNavbarPinned(isPinned)
  }, [isPinned, setIsNavbarPinned])

  const scrollProjectOptionToView = useCallback(() => {
    scrollToElement(projectListRef, `#${params.projectName}`, searchValue)
  }, [params.projectName, projectListRef, searchValue])

  useEffect(() => {
    if (isShowProjectsList && projectListRef.current) {
      scrollProjectOptionToView()
    }
  }, [isShowProjectsList, scrollProjectOptionToView, projectListRef])

  return (
    <nav
      className={navbarClasses}
      data-testid="navbar"
      onMouseLeave={handleOnMouseLeave}
      style={navbarStyles}
      ref={navbarRef}
    >
      <div className="navbar__pin-icon">
        <RoundedIcon
          id="navabr-pin"
          onClick={handlePinClick}
          tooltipText={`${isPinned ? 'Unpin' : 'Pin'} Menu`}
        >
          {isPinned ? <UnPinIcon /> : <PinIcon />}
        </RoundedIcon>
      </div>
      <div className="navbar__projects" ref={projectListWrapperRef}>
        <Button
          label={projectName}
          icon={<Caret />}
          iconPosition="right"
          className={
            isShowProjectsList ? 'navbar__projects-button_active' : 'navbar__projects-button'
          }
          onClick={() => setShowProjectsList(!isShowProjectsList)}
        />
        {isShowProjectsList && (
          <BreadcrumbsDropdown
            id="navbar-projects-dropdown"
            list={projectsList}
            onClick={() => setShowProjectsList(!isShowProjectsList)}
            ref={projectListRef}
            selectedItem={params.projectName}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            withSearch
            withAllProjects
          />
        )}
      </div>
      <div className="navbar__separator" />
      <div className="navbar__body">
        <ul className="navbar-links">
          {links.map(
            link =>
              !link.hidden && (
                <li className="nav-link" data-testid={`nav-link-${link.id}`} key={link.id}>
                  <NavbarLink {...link} />
                  {link.nestedLinks && (
                    <ul className="navbar-links navbar-links_nested">
                      {link.nestedLinks.map(nestedLink => (
                        <li
                          className="nav-link"
                          data-testid={`nav-link-${nestedLink.id}`}
                          key={nestedLink.id}
                        >
                          <NavbarLink {...nestedLink} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
          )}
        </ul>
      </div>
      <div className="navbar__separator" />
      <div className="navbar__additional">
        <ul className="navbar-links">
          <li className="nav-link" data-testid="nav-link-alerts">
            <NavbarLink
              icon={<Alerts />}
              id="alerts"
              label="Alerts"
              link={`/projects/${projectName}/${ALERTS_PAGE_PATH}`}
            />
          </li>
          <li className="nav-link" data-testid="nav-link-project-settings">
            <NavbarLink
              id="project-settings"
              icon={<SettingsIcon />}
              label="Project settings"
              link={`/projects/${projectName}/settings`}
            />
          </li>
        </ul>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  projectName: PropTypes.string.isRequired,
  setIsNavbarPinned: PropTypes.func.isRequired
}

export default React.memo(Navbar)
