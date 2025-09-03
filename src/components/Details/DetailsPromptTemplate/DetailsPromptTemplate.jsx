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
import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import PromptTab from './PromptTab'
import ArgumentsTab from './ArgumentsTab'

import { ARGUMENTS_TAB, PROMPT_TAB } from '../../../constants'
import { removeLLMPromptTemplate } from '../../../reducers/artifactsReducer'

import './detailsPromptTemplate.scss'

const DetailsPromptTemplate = ({ selectedItem }) => {
  const [selectedTab, setSelectedTab] = useState(PROMPT_TAB)
  const [selectedArgument, setSelectedArgument] = useState({})
  const dispatch = useDispatch()

  const tabs = [
    { id: PROMPT_TAB, label: 'Prompt' },
    { id: ARGUMENTS_TAB, label: 'Arguments' }
  ]

  const handleTabChange = useCallback(tabName => {
    setSelectedTab(tabName)
    setSelectedArgument({})
  }, [])

  useEffect(() => {
    return () => {
      dispatch(removeLLMPromptTemplate())
    }
  }, [dispatch, selectedItem])

  return (
    <div className="prompt-template">
      {selectedTab === PROMPT_TAB ? (
        <PromptTab
          handleTabChange={handleTabChange}
          selectedItem={selectedItem}
          selectedTab={selectedTab}
          setSelectedArgument={setSelectedArgument}
          setSelectedTab={setSelectedTab}
          tabs={tabs}
        />
      ) : (
        <ArgumentsTab
          handleTabChange={handleTabChange}
          selectedArgument={selectedArgument}
          selectedItem={selectedItem}
          selectedTab={selectedTab}
          tabs={tabs}
        />
      )}
    </div>
  )
}

DetailsPromptTemplate.propTypes = {
  selectedItem: PropTypes.object.isRequired
}

export default DetailsPromptTemplate
