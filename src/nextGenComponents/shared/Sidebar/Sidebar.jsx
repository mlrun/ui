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
import React, { useMemo } from 'react'

import '../../../tailwind.css'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator
} from 'igz-controls/nextGenComponents'
import { getFooterLinks, getLinks } from './navbarList.util'
import PropTypes from 'prop-types'
import ProjectDropdown from './ProjectDropdown'
import SidebarCollapseItem from './SidebarCollapseItem'
import SidebarItem from './SidebarItem'

function SidebarList({ projectName }) {
  const links = useMemo(() => {
    return projectName ? getLinks(projectName) : []
  }, [projectName])

  const footerLinks = useMemo(() => {
    return projectName ? getFooterLinks(projectName) : []
  }, [projectName])

  return (
    <Sidebar
      collapsible="icon"
      className="border-0 border-r border-solid border-gray-200 z-10 flex flex-col"
      data-testid="sidebar"
    >
      <SidebarHeader className="px-3 min-h-[70px]">
        <ProjectDropdown projectName={projectName} />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="pt-1 gap-y-1 group-data-[collapsible=icon]:gap-y-6">
        <SidebarMenu>
          {links.map(link =>
            link.nestedLinks ? (
              <SidebarCollapseItem key={link.id} {...link} />
            ) : (
              <SidebarItem key={link.id} {...link} />
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter
        data-testid="sidebar-footer"
        className="pt-1 px-0 gap-y-1 group-data-[collapsible=icon]:gap-y-6"
      >
        <SidebarMenu>
          {footerLinks.map(link => (
            <SidebarItem key={link.id} {...link} />
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

SidebarList.propTypes = {
  projectName: PropTypes.string.isRequired
}

export default React.memo(SidebarList)
