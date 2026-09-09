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
import { capitalize, has, isEmpty } from 'lodash-es'
import { useDispatch, useSelector } from 'react-redux'

import { Loader, Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import ContentMenu from '../../../elements/ContentMenu/ContentMenu'
import SearchNavigator from '../../../common/SearchNavigator/SearchNavigator'
import ExpandableText from '../../../common/ExpandableText/ExpandableText'
import NoData from '../../../common/NoData/NoData'

import { ARGUMENTS_TAB } from '../../../constants'
import { fetchLLMPromptTemplate } from '../../../reducers/artifactsReducer'

const ExpandContext = createContext({})
// Module-local only — keeps react-refresh happy (no extra exports from this file).

const resolvePromptSource = (localTemplate, remoteTemplate, targetPath, isValid) => {
  if (!isEmpty(localTemplate)) {
    return { source: isValid(localTemplate) ? localTemplate : null, needsFetch: false }
  }

  if (!isEmpty(remoteTemplate)) {
    return { source: isValid(remoteTemplate) ? remoteTemplate : null, needsFetch: false }
  }

  return {
    source: null,
    needsFetch: targetPath?.endsWith('.txt') || targetPath?.endsWith('.json')
  }
}

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
  const [prevSourcePromptTemplate, setPrevSourcePromptTemplate] = useState(null)
  const [prevPromptLegend, setPrevPromptLegend] = useState(null)
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

  const { source: sourcePromptTemplate, needsFetch } = resolvePromptSource(
    selectedItem.prompt_template,
    artifactsStore.LLMPrompts.promptTemplate,
    selectedItem.target_path,
    isPromptTemplateValid
  )
  const isError = !sourcePromptTemplate && !needsFetch

  // Sync derived state during render (not in useEffect) — avoids react-hooks/set-state-in-effect
  // and an extra paint. See React docs: "Adjusting some state when a prop changes".
  if (isError && !showError) {
    setShowError(true)
  }

  if (
    sourcePromptTemplate &&
    (sourcePromptTemplate !== prevSourcePromptTemplate ||
      selectedItem.prompt_legend !== prevPromptLegend)
  ) {
    setPrevSourcePromptTemplate(sourcePromptTemplate)
    setPrevPromptLegend(selectedItem.prompt_legend)
    setPromptTemplate(generateJsxContent(sourcePromptTemplate, selectedItem.prompt_legend))
  }

  if (needsFetch && !loading) {
    setLoading(true)
  }

  // Only the network request belongs in an effect; loading/error/template sync is handled above.
  useEffect(() => {
    if (needsFetch) {
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
  }, [
    needsFetch,
    selectedItem.prompt_legend,
    selectedItem.project,
    selectedItem.target_path,
    generateJsxContent,
    dispatch,
    isPromptTemplateValid
  ])

  return (
    <div className="prompt-tab">
      <div className="prompt-tab__header">
        <ContentMenu activeTab={selectedTab} fontSize="sm" onClick={handleTabChange} tabs={tabs} />
        <SearchNavigator
          searchTemplate={promptTemplate}
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
