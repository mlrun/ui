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
import classnames from 'classnames'

import BreadcrumbsDropdown from '../BreadcrumbsDropdown/BreadcrumbsDropdown'
import { NavbarLink } from 'igz-controls/elements'
import { Button, Navbar } from 'igz-controls/components'

import { useMode } from '../../hooks/mode.hook'
import { getNavbarLinks } from './navbarList.util'
import { scrollToElement } from '../../utils/scroll.util'
import { generateProjectsList } from '../../utils/projects'
import { ALERTS_PAGE_PATH } from '../../constants'
import { useDetectOutsideClick } from 'igz-controls/hooks'

import Alerts from 'igz-controls/images/navbar/alerts-icon.svg?react'
import Caret from 'igz-controls/images/dropdown.svg?react'
import HomepageIcon from 'igz-controls/images/navbar/mlrun-project-home.svg?react'
import SettingsIcon from 'igz-controls/images/navbar/mlrun-project-settings.svg?react'

import './NavbarList.scss'

const NavbarList = ({ navbarIsPinned, projectName }) => {
  const [isShowProjectsList, setShowProjectsList] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(null)

  const { pathname } = useLocation()
  const params = useParams()
  const projectListRef = useRef()
  const projectListWrapperRef = useRef()
  const projectStore = useSelector(state => state.projectStore)
  const { isDemoMode } = useMode()

  useDetectOutsideClick(projectListWrapperRef, () => {
    setShowProjectsList(false)
    setSearchValue('')
  })

  const links = useMemo(() => {
    return projectName ? getNavbarLinks(projectName, isDemoMode).filter(link => !link.hidden) : []
  }, [projectName, isDemoMode])

  const projectsList = useMemo(() => {
    const projectsList = generateProjectsList(projectStore.projectsNames.data, params.projectName, true)
    return projectsList.map(project => ({
      ...project,
      link: pathname.replace(params.projectName, project.id)
    }))
  }, [projectStore.projectsNames.data, pathname, params.projectName])


  const handleOnMouseLeave = useCallback(() => {
    !navbarIsPinned && setShowProjectsList(false)
  }, [navbarIsPinned])

  const scrollProjectOptionToView = useCallback(() => {
    scrollToElement(projectListRef, `#${params.projectName}`, searchValue)
  }, [params.projectName, projectListRef, searchValue])

  useEffect(() => {
    if (isShowProjectsList && projectListRef.current) {
      scrollProjectOptionToView()
    }
  }, [isShowProjectsList, scrollProjectOptionToView, projectListRef])

  return (
    <>
      <div onMouseLeave={handleOnMouseLeave}>
        <div className="navbar__projects" ref={projectListWrapperRef}>
          <span className="nav-link__icon"><HomepageIcon /></span>
          <Button
            label={projectName}
            icon={<Caret />}
            id="navbar-projects-button"
            iconPosition="right"
            className={classnames(isShowProjectsList && 'btn_active')}
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
      </div>
      <Navbar.Divider />
      <Navbar.Body>
        <ul className="navbar-links">
          {links.map(
            (link, index) =>
              <li className="nav-link" data-testid={`nav-link-${link.id}`} key={link.id}>
                <NavbarLink {...link} index={index} setSelectedIndex={setSelectedIndex} selectedIndex={selectedIndex} />
                {link.nestedLinks && (
                  <ul className="navbar-links navbar-links_nested">
                    {link.nestedLinks.filter(nestedLink => !nestedLink.hidden).map(nestedLink => (
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
          )}
        </ul>
      </Navbar.Body>
      <Navbar.Divider />
      <div className="navbar__additional">
        <ul className="navbar-links">
          <li className="nav-link" data-testid="nav-link-alerts">
            <NavbarLink
              icon={<Alerts />}
              id="alerts"
              label="Alerts"
              link={`/projects/${projectName}/${ALERTS_PAGE_PATH}`}
              setSelectedIndex={setSelectedIndex}
            />
          </li>
          <li className="nav-link" data-testid="nav-link-project-settings">
            <NavbarLink
              id="project-settings"
              icon={<SettingsIcon />}
              label="Project settings"
              link={`/projects/${projectName}/settings`}
              setSelectedIndex={setSelectedIndex}
            />
          </li>
        </ul>
      </div>
    </>
  )
}

NavbarList.propTypes = {
  navbarIsPinned: PropTypes.bool,
  projectName: PropTypes.string
}

export default React.memo(NavbarList)
