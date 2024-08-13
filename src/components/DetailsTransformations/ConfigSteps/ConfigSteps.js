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
import React from 'react'
import PropTypes from 'prop-types'
import { find, unset, cloneDeep } from 'lodash'

import CodeBlock from '../../../common/CodeBlock/CodeBlock'
import Accordion from '../../../common/Accordion/Accordion'
import Select from '../../../common/Select/Select'
import TextArea from '../../../common/TextArea/TextArea'
import RadioButtons from '../../../common/RadioButtons/RadioButtons'
import { kindList } from '../detailsTransformations.util'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
// import { DANGER_BUTTON } from 'igz-controls/constants'

import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'
// import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

import './configSteps.scss'

const ConfigSteps = ({
  afterSteps = [],
  errorSteps = [],
  selectedAfterStep = '',
  selectedErrorStep = '',
  selectedStep = '',
  setSelectedAfterStep = () => {},
  setSelectedErrorStep = () => {},
  setSelectedStep = () => {},
  setStates = () => {},
  states = {},
  steps = []
}) => {
  const onChangeComments = newComments => {
    states[selectedStep].comments = newComments
    setStates(cloneDeep(states))
  }

  const onChangeStepKind = selectedKind => {
    setStates({
      ...states,
      [selectedStep]: {
        ...states[selectedStep],
        kind: selectedKind
      }
    })
  }

  const onSelectStep = step => {
    setSelectedStep(step)
    setSelectedAfterStep(
      states[step].after ? states[step].after[0] : !find(states, ['on_error', step]) ? 'Source' : ''
    )
    setSelectedErrorStep(states[step].on_error ?? '')
  }

  const onSelectAfterStep = newAfterStep => {
    if (newAfterStep !== selectedAfterStep) {
      let afterSelectedState = find(states, {
        after: [selectedStep]
      })

      if (selectedAfterStep && afterSelectedState) {
        afterSelectedState.after = [selectedAfterStep]
      } else if (!selectedAfterStep && afterSelectedState) {
        unset(afterSelectedState, 'after')
      }

      if (newAfterStep === 'Source') {
        unset(states[selectedStep], 'after')
      } else {
        let newAfterSelectedState = find(states, {
          after: [newAfterStep]
        })

        if (newAfterSelectedState) {
          newAfterSelectedState.after = [selectedStep]
        }
        states[selectedStep].after = [newAfterStep]
      }

      setSelectedAfterStep(newAfterStep)
      setStates(cloneDeep(states))
    }
  }

  const onSelectErrorStep = step => {
    states[selectedStep].on_error = step
    setSelectedErrorStep(step)
    setStates(cloneDeep(states))
  }

  // const deleteSelectedStep = selectedId => {
  //   let selectedState = states[selectedId]
  //   let afterSelectedState = find(states, {
  //     after: [selectedId]
  //   })
  //
  //   if (selectedState.after && afterSelectedState) {
  //     afterSelectedState.after = selectedState.after
  //   } else if (!selectedState.after && afterSelectedState) {
  //     unset(afterSelectedState, 'after')
  //   }
  //
  //   if (selectedState.on_error) {
  //     unset(states, selectedState.on_error)
  //   }
  //
  //   unset(states, selectedId)
  //
  //   setSelectedStep('')
  //   setSelectedAfterStep('')
  //   setStates(cloneDeep(states))
  // }

  return (
    <Accordion
      accordionClassName="config-item steps"
      icon={<Arrow />}
      iconClassName="expand-icon"
      openByDefault
    >
      <div className="config-item__title">Steps</div>
      <div className="config-item__content">
        <Select
          density="chunky"
          disabled={steps.length === 0}
          floatingLabel
          label="Selected step"
          onClick={onSelectStep}
          options={steps}
          selectedId={selectedStep}
          // selectedItemAction={{
          //   icon: <Delete />,
          //   tooltip: 'Delete step',
          //   confirm: {
          //     title: `Delete step ${selectedStep}?`,
          //     description: 'Deleted steps cannot be restored.',
          //     btnConfirmLabel: 'Delete',
          //     btnConfirmType: DANGER_BUTTON
          //   },
          //   handler: deleteSelectedStep
          // }}
        />
        <div className="row radio-buttons-row">
          <RadioButtons
            elements={kindList}
            selectedValue={states[selectedStep]?.kind}
            onChangeCallback={onChangeStepKind}
            disabled
          />
        </div>
        <div className="row select-row">
          <Select
            density="chunky"
            disabled
            floatingLabel
            label="After"
            onClick={onSelectAfterStep}
            options={afterSteps}
            selectedId={selectedAfterStep}
          />
          <Select
            density="chunky"
            disabled
            floatingLabel
            label="On error (optional)"
            onClick={onSelectErrorStep}
            options={errorSteps}
            selectedId={selectedErrorStep}
          />
        </div>
        <div className="row">
          <div className="row-label">Class Name</div>
          <Tooltip
            className="row-value"
            template={<TextTooltipTemplate text={states[selectedStep]?.class_name} />}
          >
            {states[selectedStep]?.class_name}
          </Tooltip>
        </div>
        <div className="row">
          <div className="row-label">Handler</div>
          <div className="row-value">{states[selectedStep]?.handler}</div>
        </div>
        <div className="row">
          <CodeBlock label="Arguments" codeData={states[selectedStep]?.class_args} />
        </div>
        <div className="row">
          <TextArea
            floatingLabel
            label="comments"
            disabled={!selectedStep}
            value={states[selectedStep]?.comments}
            onChange={onChangeComments}
          />
        </div>
      </div>
    </Accordion>
  )
}

ConfigSteps.propTypes = {
  afterSteps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  errorSteps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedAfterStep: PropTypes.string.isRequired,
  selectedErrorStep: PropTypes.string.isRequired,
  selectedStep: PropTypes.string.isRequired,
  setSelectedAfterStep: PropTypes.func.isRequired,
  setSelectedErrorStep: PropTypes.func.isRequired,
  setSelectedStep: PropTypes.func.isRequired,
  setStates: PropTypes.func.isRequired,
  states: PropTypes.shape({}).isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default ConfigSteps
