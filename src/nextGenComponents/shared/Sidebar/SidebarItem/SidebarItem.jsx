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
import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link, useMatch } from 'react-router'
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from 'igz-controls/nextGenComponents'
import { toTestId } from '../../../../utils/toTestId'

const SidebarItem = ({
  link,
  icon,
  label,
  menuItemClassname,
  menuButtonClassName,
  externalLink
}) => {
  const ref = useRef(null)
  const { open: sidebarOpen } = useSidebar()

  const match = useMatch(link ? `${link}/*` : null)
  const isActive = Boolean(match)

  useEffect(() => {
    if (isActive && sidebarOpen) {
      const timer = setTimeout(() => {
        ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isActive, sidebarOpen])

  return (
    <SidebarMenuItem
      data-testid={`sidebar-menu-item-${toTestId(label)}`}
      ref={ref}
      className={`px-3 py-0.5 ${menuItemClassname ?? ''}`}
    >
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={`gap-2 p-3 ${menuButtonClassName ?? ''}`}
      >
        {externalLink ? (
          <a
            href={link}
            target="_top"
            data-testid={`sidebar-menu-item-${toTestId(label)}-external-link`}
          >
            {icon}
            <span className="overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 max-w-full group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
              {label}
            </span>
          </a>
        ) : (
          <Link to={link} data-testid={`sidebar-menu-item-${toTestId(label)}-internal-link`}>
            {icon}
            <span className="overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 max-w-full group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
              {label}
            </span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

SidebarItem.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string,
  icon: PropTypes.node,
  externalLink: PropTypes.bool,
  menuItemClassname: PropTypes.string,
  menuButtonClassName: PropTypes.string
}

export default SidebarItem
