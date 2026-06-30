/*
Copyright 2022 Iguazio Systems Ltd.
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
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty, isNumber } from 'lodash'

import Button from '../Button/Button'
import Modal from '../Modal/Modal'
import WizardSteps from './WizardSteps/WizardSteps'

import { MODAL_MD, TERTIARY_BUTTON } from '../../constants'
import { MODAL_SIZES, WIZARD_STEPS_CONFIG } from '../../types'

import Back from '../../images/back-arrow.svg?react'

import './Wizard.scss'

const Wizard = ({
  children,
  className = '',
  getActions = null,
  isWizardOpen,
  onWizardResolve,
  previewText = '',
  size = MODAL_MD,
  stepsConfig = [],
  subTitle = null,
  title
}) => {
  const wizardClasses = classNames('wizard-form', className)
  const [jumpingToFirstInvalid, setJumpingToFirstInvalid] = useState(false)
  const [activeStepNumber, setActiveStepNumber] = useState(0)
  const [firstDisabledStepIdx, setFirstDisabledStepIdx] = useState(null)

  const visibleSteps = useMemo(() => {
    return stepsConfig?.filter(step => !step.hidden) || []
  }, [stepsConfig])

  useLayoutEffect(() => {
    const disabledStep = visibleSteps.find((step, stepIdx) => {
      if (step.disabled) {
        setFirstDisabledStepIdx(stepIdx)
      }

      return step.disabled
    })

    if (!disabledStep) {
      setFirstDisabledStepIdx(null)
    }
  }, [visibleSteps])

  useEffect(() => {
    const firstInvalidStepIdx = visibleSteps.findIndex(step => step.invalid)

    if (jumpingToFirstInvalid && isNumber(firstInvalidStepIdx) && firstInvalidStepIdx !== -1) {
      setActiveStepNumber(firstInvalidStepIdx)
      setJumpingToFirstInvalid(false)
    }
  }, [jumpingToFirstInvalid, visibleSteps])

  const stepsTemplate = useMemo(() => {
    return React.Children.toArray(children)
      .filter((child, idx) => !isEmpty(stepsConfig) && !stepsConfig[idx].hidden)
      .map((child, idx) => {
        const stepIsActive = idx === activeStepNumber
        const newChild =
          !isNumber(firstDisabledStepIdx) || idx < firstDisabledStepIdx
            ? React.cloneElement(child, { stepIsActive })
            : null

        return (
          <div
            key={idx}
            className={
              !stepIsActive
                ? 'wizard-form__hidden-content-item'
                : 'wizard-form__visible-content-item'
            }
          >
            {newChild}
          </div>
        )
      })
  }, [activeStepNumber, children, firstDisabledStepIdx, stepsConfig])

  const totalSteps = useMemo(() => {
    return visibleSteps.length - 1 || 0
  }, [visibleSteps])

  const isLastStep = useMemo(() => {
    return activeStepNumber === totalSteps
  }, [activeStepNumber, totalSteps])

  const goToNextStep = () => {
    setActiveStepNumber(prevStep => Math.min(++prevStep, totalSteps))
  }

  const goToPreviousStep = () => setActiveStepNumber(prevStep => Math.max(--prevStep, 0))

  const goToFirstInvalidStep = () => {
    setJumpingToFirstInvalid(true)
  }

  const jumpToStep = idx => {
    return setActiveStepNumber(idx)
  }

  const getDefaultActions = stepConfig => {
    const defaultActions = []

    if (activeStepNumber !== 0) {
      defaultActions.push(
        <Button
          id="wizard-btn-back"
          icon={<Back />}
          className="wizard-form__back-button"
          onClick={goToPreviousStep}
          disabled={activeStepNumber === 0}
          label="Back"
          type="button"
          variant={TERTIARY_BUTTON}
        />
      )
    }

    defaultActions.push(
      <Button
        id="wizard-btn-next"
        icon={<Back />}
        iconPosition="right"
        className="wizard-form__next-button"
        disabled={stepConfig?.nextIsDisabled || isLastStep}
        onClick={goToNextStep}
        label="Next"
        type="button"
        variant={TERTIARY_BUTTON}
      />
    )

    return defaultActions
  }

  const renderModalActions = () => {
    if (isEmpty(visibleSteps)) return []

    const actionsList = getDefaultActions(visibleSteps[activeStepNumber])
    const allStepsAreEnabled = visibleSteps.every(step => !step.disabled)

    if (getActions) {
      const actions = getActions({ allStepsAreEnabled, jumpToStep, goToFirstInvalidStep })
      const mainActions = actions.map((action, index) => <Button {...action} key={index} />)
      actionsList.push(...mainActions)
    }

    return actionsList
  }

  return (
    <Modal
      actions={renderModalActions()}
      className={wizardClasses}
      onClose={onWizardResolve}
      previewText={previewText}
      show={isWizardOpen}
      size={size}
      subTitle={subTitle}
      title={title}
    >
      <WizardSteps
        activeStepNumber={activeStepNumber}
        firstDisabledStepIdx={firstDisabledStepIdx}
        jumpToStep={jumpToStep}
        steps={visibleSteps}
      />
      <div className="wizard-form__content-container">
        <div className="wizard-form__content">{stepsTemplate}</div>
      </div>
    </Modal>
  )
}

Wizard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  getActions: PropTypes.func,
  isWizardOpen: PropTypes.bool.isRequired,
  onWizardResolve: PropTypes.func.isRequired,
  previewText: PropTypes.string,
  size: MODAL_SIZES,
  stepsConfig: WIZARD_STEPS_CONFIG,
  subTitle: PropTypes.string,
  title: PropTypes.string.isRequired
}

Wizard.Step = ({ children }) => children

export default Wizard
