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
import { useEffect, useState, createContext } from 'react'
import PropTypes from 'prop-types'
import { capitalize, isEmpty } from 'lodash'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import ContentMenu from '../../../elements/ContentMenu/ContentMenu'
import SearchNavigator from '../../../common/SearchNavigator/SearchNavigator'

import { ARGUMENTS_TAB } from '../../../constants'

import ExpandableText from '../../../common/ExpandableText/ExpandableText'

export const ExpandContext = createContext({})

const PromptTab = ({
  handleTabChange,
  selectedItem,
  selectedTab,
  setSelectedArgument,
  setSelectedTab,
  tabs
}) => {
  const [promptTemplate, setPromptTemplate] = useState([])
  const [searchResult, setSearchResult] = useState('')
  const [forceExpandAll, setForceExpandAll] = useState(false)

  useEffect(() => {
    if (Array.isArray(selectedItem.prompt_template) && !isEmpty(selectedItem.prompt_legend)) {
      const legendMap = { ...selectedItem.prompt_legend }
      const regex = new RegExp(`\\b(${Object.keys(legendMap).join('|')})\\b`, 'g')

      const jsxContent = selectedItem.prompt_template.map((item, idx) => {
        const parts = item.content.split(regex).map((part, i) => {
          if (legendMap[part]) {
            const currentArgument = legendMap[part]

            return (
              <Tooltip
                key={i}
                template={<TextTooltipTemplate text={legendMap[part].description} />}
                textShow
              >
                <span
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedArgument(currentArgument)
                    setSelectedTab(ARGUMENTS_TAB)
                  }}
                >
                  {`{${part}}`}
                </span>
              </Tooltip>
            )
          }

          return part
        })

        return (
          <div key={idx} className="prompt-tab__row">
            <div className="prompt-tab__role">{capitalize(item.role)}</div>
            <div className="prompt-tab__content">
              <ExpandableText context={ExpandContext}>{parts}</ExpandableText>
            </div>
          </div>
        )
      })

      setPromptTemplate(jsxContent)
    }
  }, [
    selectedItem.prompt_legend,
    setSelectedArgument,
    setSelectedTab,
    selectedItem.prompt_template
  ])

  return (
    <div className="prompt-tab">
      <div className="prompt-tab__header">
        <ContentMenu activeTab={selectedTab} fontSize="sm" onClick={handleTabChange} tabs={tabs} />
        <SearchNavigator
          promptTemplate={promptTemplate}
          setSearchResult={setSearchResult}
          searchOnChange={value => setForceExpandAll(Boolean(value))}
        />
      </div>
      <div className="prompt-tab__table">
        <div className="prompt-tab__table-header prompt-tab__row">
          <div className="prompt-tab__role">Role</div>
          <div className="prompt-tab__content">Content</div>
        </div>
        <ExpandContext.Provider value={{ contextForceExpand: forceExpandAll }}>
          {searchResult || promptTemplate}
        </ExpandContext.Provider>
      </div>
    </div>
  )
}

PromptTab.propTypes = {
  handleTabChange: PropTypes.func.isRequired,
  selectedTab: PropTypes.string.isRequired,
  selectedItem: PropTypes.object.isRequired,
  setSelectedArgument: PropTypes.func.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired
}

export default PromptTab
