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
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import { isEmpty } from 'lodash'
import { useSelector } from 'react-redux'

import {
  Button,
  FormChipCell,
  FormInput,
  FormOnChange,
  FormTextarea,
  PopUpDialog,
  TextTooltipTemplate,
  Tooltip
} from 'igz-controls/components'

import {
  getValidationRules,
  getInternalLabelsValidationRule
} from 'igz-controls/utils/validation.util'
import { setFieldState, isSubmitDisabled } from 'igz-controls/utils/form.util'
import { LABEL_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'
import { getChipOptions } from '../../utils/getChipOptions'
import { convertChipsData, parseChipsData } from '../../utils/convertChipsData'

import './createFeatureVectorPopUp.scss'

const CreateFeatureVectorPopUp = ({
  closePopUp,
  createFeatureVector,
  featureVectorData = {
    name: '',
    tag: '',
    description: '',
    labels: {}
  }
}) => {
  const [tagTooltipIsHidden, setTagTooltipIsHidden] = useState(false)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const initialValues = {
    name: featureVectorData.name,
    tag: featureVectorData.tag,
    description: featureVectorData.description,
    labels: parseChipsData(featureVectorData.labels, frontendSpec.internal_labels)
  }

  const handleCreateFeatureVector = values => {
    createFeatureVector({
      name: values.name,
      tag: values.tag,
      description: values.description,
      labels: convertChipsData(values.labels)
    })
  }

  const formRef = React.useRef(
    createForm({
      initialValues,
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: handleCreateFeatureVector
    })
  )

  return (
    <PopUpDialog
      className="new-feature-vector__pop-up form"
      headerText={`${!featureVectorData.name ? 'Create' : 'Edit'} feature vector`}
      closePopUp={closePopUp}
    >
      <Form form={formRef.current} onSubmit={handleCreateFeatureVector}>
        {formState => {
          return (
            <>
              <div className="form-row">
                <div className="form-col-2">
                  <FormInput
                    async
                    label="Vector name"
                    name="name"
                    required
                    validationRules={getValidationRules('feature.vector.name')}
                  />
                </div>
                <div className="form-col-1">
                  <Tooltip
                    hidden={tagTooltipIsHidden || isEmpty(formState.values.tag)}
                    template={<TextTooltipTemplate text={formState.values.tag} />}
                  >
                    <FormInput
                      label="Tag"
                      name="tag"
                      validationRules={getValidationRules('common.tag')}
                      onBlur={() => setTagTooltipIsHidden(false)}
                      placeholder="latest"
                    />
                    <FormOnChange
                      handler={() => {
                        setTagTooltipIsHidden(true)
                      }}
                      name={'tag'}
                    />
                  </Tooltip>
                </div>
              </div>
              <div className="form-row new-feature-vector__description-row">
                <FormTextarea name="description" label="Description" maxLength={500} />
              </div>
              <div className="form-row">
                <FormChipCell
                  chipOptions={getChipOptions('labels')}
                  formState={formState}
                  initialValues={initialValues}
                  isEditable
                  label="Labels"
                  name="labels"
                  shortChips
                  visibleChipsMaxLength="2"
                  validationRules={{
                    key: getValidationRules(
                      'common.tag',
                      getInternalLabelsValidationRule(frontendSpec.internal_labels)
                    ),
                    value: getValidationRules('common.tag')
                  }}
                />
              </div>
              <div className="pop-up-dialog__footer-container">
                <Button
                  type="button"
                  variant={LABEL_BUTTON}
                  label="Cancel"
                  className="pop-up-dialog__btn_cancel"
                  onClick={closePopUp}
                />
                <Button
                  disabled={isSubmitDisabled(formState)}
                  variant={PRIMARY_BUTTON}
                  label="Create"
                  onClick={formState.handleSubmit}
                />
              </div>
            </>
          )
        }}
      </Form>
    </PopUpDialog>
  )
}

CreateFeatureVectorPopUp.propTypes = {
  closePopUp: PropTypes.func.isRequired,
  featureVectorData: PropTypes.shape({
    name: PropTypes.string,
    tag: PropTypes.string,
    description: PropTypes.string,
    labels: PropTypes.shape({})
  })
}

export default CreateFeatureVectorPopUp
