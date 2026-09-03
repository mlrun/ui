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
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  RefreshButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  cn
} from 'igz-controls/nextGenComponents'
import { ArrowLeft, MoreVertical } from 'lucide-react'

const TITLE_FONT_SIZE = 'text-[22px] leading-7'

const DetailsTabs = ({
  activeTabId,
  actionsMenu = [],
  className = '',
  headerContent = null,
  onClose,
  onRefresh,
  onTabChange,
  tabs,
  title
}) => {
  const handleTabChange = useCallback(
    tabId => {
      onTabChange(tabId)
    },
    [onTabChange]
  )

  return (
    <div className={cn('flex flex-col h-full', className)} data-testid="details-tabs">
      <div className="flex items-center justify-between px-6 pt-2 pb-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-igz-hover-bg transition-colors shrink-0"
            aria-label="Back to list"
            data-testid="details-back-button"
          >
            <ArrowLeft className="w-5 h-5 text-igz-primary" />
          </button>
          <h1
            className={cn(TITLE_FONT_SIZE, 'font-bold text-igz-primary truncate')}
            data-testid="details-title"
          >
            {title}
          </h1>
          {headerContent}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onRefresh && <RefreshButton onClick={onRefresh} />}
          {actionsMenu.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  aria-label="Actions menu"
                  data-testid="details-actions-menu"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actionsMenu.map(action => (
                  <DropdownMenuItem
                    key={action.label}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    data-testid={`details-action-${action.label}`}
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden px-6">
        <Tabs
          value={activeTabId}
          onValueChange={handleTabChange}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <TabsList
            className="shrink-0 w-fit border-b border-igz-gray-light"
            data-testid="details-tabs-list"
          >
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                disabled={tab.disabled}
                data-testid={`details-tab-${tab.id}`}
                className="first:px-0 text-lg data-[state=active]:font-bold"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(tab => {
            const TabComponent = tab.component

            return (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="relative flex-1 overflow-auto"
                data-testid={`details-tab-content-${tab.id}`}
              >
                {TabComponent ? <TabComponent /> : null}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}

const tabShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  component: PropTypes.elementType,
  disabled: PropTypes.bool
})

const actionShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
})

DetailsTabs.propTypes = {
  activeTabId: PropTypes.string.isRequired,
  actionsMenu: PropTypes.arrayOf(actionShape),
  className: PropTypes.string,
  headerContent: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
  onTabChange: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(tabShape).isRequired,
  title: PropTypes.string.isRequired
}

export default DetailsTabs
