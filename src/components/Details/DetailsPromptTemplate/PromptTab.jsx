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
import { useEffect, useState, createContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { capitalize, has, isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import { Loader, Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import ContentMenu from '../../../elements/ContentMenu/ContentMenu'
import SearchNavigator from '../../../common/SearchNavigator/SearchNavigator'
import ExpandableText from '../../../common/ExpandableText/ExpandableText'
import NoData from '../../../common/NoData/NoData'

import { ARGUMENTS_TAB } from '../../../constants'
import { fetchLLMPromptTemplate } from '../../../reducers/artifactsReducer'

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
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const dispatch = useDispatch()
  const artifactsStore = useSelector(store => store.artifactsStore)

  const isPromptTemplateValid = useCallback(prompt_template => {
    return prompt_template.every(
      templateRow => has(templateRow, 'role') && has(templateRow, 'content')
    )
  }, [])

  const generateJsxContent = useCallback(
    (prompt_template, prompt_legend = {}) => {
      const legendMap = { ...prompt_legend }

      return prompt_template.map((item, idx) => {
        const parts = item.content.split(/(\{[^}]+})/g).map((part, i) => {
          const match = part.match(/^\{([^}]+)}$/)

          if (match) {
            const argName = match[1]
            const currentArgument = legendMap[argName]

            if (currentArgument) {
              return (
                <Tooltip
                  key={i}
                  template={<TextTooltipTemplate text={currentArgument.description} />}
                  textShow
                >
                  <span
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedArgument(currentArgument)
                      setSelectedTab(ARGUMENTS_TAB)
                    }}
                  >
                    {`{${argName}}`}
                  </span>
                </Tooltip>
              )
            }

            return (
              <span key={i} style={{ color: 'blue' }}>
                {`{${argName}}`}
              </span>
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
    },
    [setSelectedArgument, setSelectedTab]
  )

  useEffect(() => {
    if (!isEmpty(selectedItem.prompt_template)) {
      if (!isPromptTemplateValid(selectedItem.prompt_template)) {
        setShowError(true)
      } else {
        setPromptTemplate(
          generateJsxContent(selectedItem.prompt_template, selectedItem.prompt_legend)
        )
      }
    } else if (isEmpty(artifactsStore.LLMPrompts.promptTemplate)) {
      if (!selectedItem.target_path.endsWith('.txt')) {
        setShowError(true)
      } else {
        setLoading(true)
        dispatch(
          fetchLLMPromptTemplate({
            project: selectedItem.project,
            config: {
              params: {
                path: selectedItem.target_path
              }
            }
          })
        )
          .unwrap()
          .then(response => {
            if (!isPromptTemplateValid(response.data)) {
              setShowError(true)
            } else {
              setPromptTemplate(generateJsxContent(response.data, selectedItem.prompt_legend))
            }
          })
          .catch(() => setShowError(true))
          .finally(() => {
            setLoading(false)
          })
      }
    } else if (!isEmpty(artifactsStore.LLMPrompts.promptTemplate)) {
      if (!isPromptTemplateValid(artifactsStore.LLMPrompts.promptTemplate)) {
        return setShowError(true)
      } else {
        setPromptTemplate(
          generateJsxContent(artifactsStore.LLMPrompts.promptTemplate, selectedItem.prompt_legend)
        )
      }
    }
  }, [
    selectedItem.prompt_template,
    selectedItem.prompt_legend,
    setSelectedArgument,
    setSelectedTab,
    selectedItem.project,
    selectedItem.target_path,
    generateJsxContent,
    dispatch,
    artifactsStore.LLMPrompts.promptTemplate,
    isPromptTemplateValid
  ])

  useEffect(() => {
    return () => {
      setPromptTemplate([])
      setSearchResult('')
      setForceExpandAll(false)
      setShowError(false)
      setLoading(false)
    }
  }, [])

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
        {showError ? (
          <NoData message="Prompt cannot be displayed." />
        ) : loading ? (
          <Loader section />
        ) : (
          <>
            <div className="prompt-tab__table-header prompt-tab__row">
              <div className="prompt-tab__role">Role</div>
              <div className="prompt-tab__content">Content</div>
            </div>
            <ExpandContext.Provider value={{ contextForceExpand: forceExpandAll }}>
              {searchResult || promptTemplate}
            </ExpandContext.Provider>
          </>
        )}
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
