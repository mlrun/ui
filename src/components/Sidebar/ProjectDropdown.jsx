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
import { useMemo, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { ChevronDown } from 'lucide-react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { generateProjectsList } from '../../utils/projects'

import HomepageIcon from './icons/mlrun-project-home.svg?react'
import SearchIcon from 'igz-controls/images/search.svg?react'
import { Button } from '@/ui/button'
import {
  MAX_VISIBLE_PROJECTS,
  NO_PROJECTS_TEXT,
  PLACEHOLDER_SEARCH,
  SEE_ALL_PROJECTS_TEXT
} from '../../constants'

const ProjectDropdown = ({ projectName }) => {
  const { pathname } = useLocation()
  const projectStore = useSelector(state => state.projectStore)
  const { setHoverLocked } = useSidebar()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [showAllProjects, setShowAllProjects] = useState(false)

  const projectsList = useMemo(() => {
    const projects = generateProjectsList(projectStore.projectsNames.data, projectName)
    return projects
      .map(project => ({
        ...project,
        link: pathname.replace(projectName, project.id)
      }))
      .filter(project => project.label.toLowerCase().includes(filter.toLowerCase()))
  }, [projectStore.projectsNames.data, projectName, pathname, filter])

  return (
    <SidebarMenu>
      <SidebarMenuItem className="items-center h-full hidden group-data-[collapsible=icon]:flex">
        <SidebarMenuButton className="gap-2 px-3 py-2">
          <HomepageIcon />
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem className="h-full group-data-[collapsible=icon]:hidden">
        <DropdownMenu
          data-testid="sidebar-project-dropdown"
          open={open}
          onOpenChange={isOpen => {
            setOpen(isOpen)
            setHoverLocked(isOpen)
            setFilter('')
            setShowAllProjects(false)
          }}
        >
          <DropdownMenuTrigger
            asChild
            data-testid="sidebar-project-dropdown-trigger"
            className="h-full px-3 py-2
              data-[state=open]:bg-accent
              data-[state=open]:text-accent-foreground
            "
          >
            <SidebarMenuButton className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="truncate max-w-[--sidebar-width]">{projectName}</span>
                  </TooltipTrigger>
                  <TooltipContent className="mt-8 -ml-2" sideOffset={0} side="down">
                    {projectName}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-testid="sidebar-project-dropdown-content"
            className="w-[--radix-popper-anchor-width] max-h-[32rem] p-2 flex flex-col"
          >
            <div className="flex relative mb-2 shrink-0">
              <Input
                type="text"
                placeholder={PLACEHOLDER_SEARCH}
                value={filter}
                onChange={e => setFilter(e.target.value)}
                onKeyDown={e => e.stopPropagation()}
                className="w-full pr-10 border border-gray-300 rounded"
              />
              <SearchIcon className="absolute right-2 top-1/2 -translate-y-1/2" />
            </div>

            {projectsList.length > 0 ? (
              <div className="flex flex-col min-h-0 overflow-y-auto flex-1">
                {(showAllProjects ? projectsList : projectsList.slice(0, MAX_VISIBLE_PROJECTS)).map(
                  project => {
                    const isExternal = project.link.startsWith('http')
                    return (
                      <DropdownMenuItem key={project.id} asChild>
                        {isExternal ? (
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            {project.label}
                          </a>
                        ) : (
                          <Link to={project.link}>{project.label}</Link>
                        )}
                      </DropdownMenuItem>
                    )
                  }
                )}

                {!showAllProjects && projectsList.length > MAX_VISIBLE_PROJECTS && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Button
                        variant="outline"
                        onClick={e => {
                          e.preventDefault()
                          setShowAllProjects(true)
                        }}
                        className="w-full justify-start font-normal text-sm px-3 py-2"
                      >
                        <HomepageIcon className="h-[15px] w-[15px]" />
                        {SEE_ALL_PROJECTS_TEXT}
                      </Button>
                    </DropdownMenuItem>
                  </>
                )}
              </div>
            ) : (
              <div className="text-sm">{NO_PROJECTS_TEXT}</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

ProjectDropdown.propTypes = {
  projectName: PropTypes.string.isRequired
}

export default ProjectDropdown
