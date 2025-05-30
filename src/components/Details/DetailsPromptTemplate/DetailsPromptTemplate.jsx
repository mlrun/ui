import { useCallback, useState } from 'react'
import { ARGUMENTS_TAB, PROMPT_TAB } from '../../../constants'
import PromptTab from './PromptTab'

import './detailsPromptTemplate.scss'

const DetailsPromptTemplate = () => {
  const [selectedTab, setSelectedTab] = useState(PROMPT_TAB)
  const tabs = [
    { id: PROMPT_TAB, label: 'Prompt' },
    { id: ARGUMENTS_TAB, label: 'Arguments' }
  ]

  const handleTabChange = useCallback(tabName => {
    setSelectedTab(tabName)
  }, [])

  return (
    <div className="prompt-template">
      {selectedTab === PROMPT_TAB ? (
        <PromptTab handleTabChange={handleTabChange} tabs={tabs} selectedTab={selectedTab} />
      ) : null}
    </div>
  )
}

export default DetailsPromptTemplate
