import React, { useState } from 'react'

import JobsPanelTable from '../../elements/JobsPanelTable/JobsPanelTable'
import JobsPanelAddInputRow from '../../elements/JobsPanelAddInputRow/JobsPanelAddInputRow'
import JobsPanelTableAddItemRow from '../../elements/JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'

import panelData from '../JobsPanel/panelData'

const JobsPanelDataInputs = () => {
  const [inputs, setInputs] = useState({})
  const [addNewInput, setAddNewInput] = useState(false)
  const [newInputName, setNewInputName] = useState('')
  const [newInputPath, setNewInputPath] = useState('')

  const handleAddNewInput = () => {
    const newInput = {
      [newInputName]: newInputPath
    }

    setInputs({ ...inputs, ...newInput })
    setAddNewInput(false)
  }

  return (
    <div className="job-panel__item">
      <div className="item__title">
        <h5>Data inputs</h5>
      </div>
      <div className="item__body">
        <JobsPanelTable
          headers={panelData['data-inputs']['table-headers']}
          addNewItem={addNewInput}
          content={inputs}
        >
          {addNewInput ? (
            <JobsPanelAddInputRow
              handleAddNewInput={handleAddNewInput}
              setNewInputName={setNewInputName}
              setNewInputPath={setNewInputPath}
            />
          ) : (
            <JobsPanelTableAddItemRow onClick={setAddNewInput} />
          )}
        </JobsPanelTable>
      </div>
    </div>
  )
}

export default JobsPanelDataInputs
