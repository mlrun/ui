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
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ChevronRightIcon, ChevronDownIcon } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, useSidebar } from '@/ui/sidebar'
import SidebarItem from './SidebarItem'
import { toTestId } from '../../utils/toTestId'

const SidebarCollapseItem = ({ icon, label, nestedLinks }) => {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const { open: sidebarOpen } = useSidebar()

  const isAnyChildActive = nestedLinks.some(nested =>
    nested.link ? pathname.includes(nested.link.toLowerCase()) : false
  )

  return (
    <Collapsible
      className="group/collapsible w-full"
      open={sidebarOpen && open}
      onOpenChange={setOpen}
    >
      <SidebarMenuItem
        className="flex-col px-3 py-0.5"
        data-testid={`sidebar-collapsible-menu-item-${toTestId(label)}`}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="flex gap-2 pl-3 py-3 text-sidebar-foreground cursor-pointer"
            isActive={(!open && isAnyChildActive) || (!sidebarOpen && isAnyChildActive)}
          >
            {icon}
            <span className="flex justify-between whitespace-nowrap w-full items-center group-data-[collapsible=icon]:hidden">
              {label}
              {sidebarOpen &&
                (open ? (
                  <ChevronDownIcon className="w-5 h-5" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5" />
                ))}
            </span>
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-1">
          <SidebarMenuSub>
            {nestedLinks.map(nestedItem => (
              <SidebarItem
                key={nestedItem.id}
                {...nestedItem}
                menuItemClassname="p-0"
                menuButtonClassName="pl-10"
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

SidebarCollapseItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  nestedLinks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
      icon: PropTypes.node
    })
  ).isRequired
}

export default SidebarCollapseItem
