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
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { CopyToClipboard,Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import ContentMenu from '../../../elements/ContentMenu/ContentMenu'
import SearchNavigator from '../../../common/SearchNavigator/SearchNavigator'

import { ARGUMENTS_TAB } from '../../../constants'

import Copy from 'igz-controls/images/copy-to-clipboard-icon.svg?react'

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
  const [rawPromptString, setRawPromptString] = useState('')

  useEffect(() => {
    if (!isEmpty(selectedItem.prompt_string) && !isEmpty(selectedItem.prompt_legend)) {
      const legendMap = Object.fromEntries(
        selectedItem.prompt_legend.map(({ field, description }) => [field, description])
      )

      const regex = new RegExp(
        `\\b(${selectedItem.prompt_legend.map(l => l.field).join('|')})\\b`,
        'g'
      )

      const jsxContent = selectedItem.prompt_string.split(regex).map((part, index) => {
        if (legendMap[part]) {
          const currentArgument = selectedItem.prompt_legend.find(legend => legend.field === part)

          return (
            <Tooltip key={index} template={<TextTooltipTemplate text={legendMap[part]} />} textShow>
              <span
                key={index}
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

      setPromptTemplate(jsxContent)
      setRawPromptString(selectedItem.prompt_string)
    } else if (!isEmpty(selectedItem.prompt_string)) {
      setPromptTemplate([selectedItem.prompt_string])
      setRawPromptString(selectedItem.prompt_string)
    }
  }, [selectedItem.prompt_string, selectedItem.prompt_legend, setSelectedArgument, setSelectedTab])

  return (
    <div className="prompt-tab">
      <div className="prompt-tab__header">
        <ContentMenu activeTab={selectedTab} fontSize="sm" onClick={handleTabChange} tabs={tabs} />
        <SearchNavigator
          promptTemplate={promptTemplate}
          rawPromptString={rawPromptString}
          setSearchResult={setSearchResult}
        />
        <CopyToClipboard
          className="prompt-tab__copy-btn-wrapper"
          textToCopy={selectedItem.prompt_string}
          tooltipText="Copy prompt"
        >
          <span className="prompt-tab__copy-btn">
            <Copy />
            <span>Copy prompt</span>
          </span>
        </CopyToClipboard>
      </div>
      <div className="prompt-tab__template">{searchResult || promptTemplate}</div>
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
