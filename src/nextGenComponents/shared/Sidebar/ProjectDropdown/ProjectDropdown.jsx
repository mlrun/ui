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
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Check, ChevronDown } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EllipsisTooltip,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from 'igz-controls/nextGenComponents'
import { generateProjectsList } from '../../../../utils/projects'

import HomepageIcon from 'igz-controls/images/mlrun-project-home.svg?react'
import SearchIcon from 'igz-controls/images/search.svg?react'
import { NO_PROJECTS_TEXT, PLACEHOLDER_SEARCH } from '../../../../constants'

const ProjectDropdown = ({ projectName }) => {
  const { pathname } = useLocation()
  const projectStore = useSelector(state => state.projectStore)
  const { setHoverLocked } = useSidebar()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const currentProjectRef = useRef(null)

  const projectsList = useMemo(() => {
    return generateProjectsList(projectStore.projectsNames.data)
      .map(project => ({
        ...project,
        link: pathname.replace(projectName, project.id),
        isCurrent: project.id === projectName
      }))
      .filter(project => project.label.toLowerCase().includes(filter.toLowerCase()))
  }, [projectStore.projectsNames.data, projectName, pathname, filter])

  useEffect(() => {
    if (!open) {
      return
    }

    const timer = setTimeout(() => {
      currentProjectRef.current?.scrollIntoView(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

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
                {projectsList.map(project => {
                  const itemClassName = 'flex w-full items-center justify-between gap-2'

                  return (
                    <DropdownMenuItem key={project.id} asChild>
                      <Link
                        ref={project.isCurrent ? currentProjectRef : null}
                        to={project.link}
                        className={itemClassName}
                      >
                        <EllipsisTooltip
                          className="min-w-0 flex-1 whitespace-nowrap"
                          side="bottom"
                          align="start"
                          sideOffset={10}
                        >
                          {project.label}
                        </EllipsisTooltip>
                        {project.isCurrent && (
                          <Check className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                        )}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
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
