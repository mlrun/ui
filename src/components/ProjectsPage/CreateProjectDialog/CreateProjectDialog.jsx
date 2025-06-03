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
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { useDispatch, useSelector } from 'react-redux'
import { createForm } from 'final-form'

import {
  Button,
  FormChipCell,
  FormInput,
  FormTextarea,
  PopUpDialog,
  ErrorMessage,
  Loader
} from 'igz-controls/components'

import { PRIMARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { getChipOptions } from 'igz-controls/utils/chips.util'
import {
  getValidationRules,
  getInternalLabelsValidationRule
} from 'igz-controls/utils/validation.util'
import { setFieldState, isSubmitDisabled } from 'igz-controls/utils/form.util'
import { removeNewProjectError } from '../../../reducers/projectReducer'
import { useModalBlockHistory } from '../../../hooks/useModalBlockHistory.hook'

import './createProjectDialog.scss'

const CreateProjectDialog = ({ closeNewProjectPopUp, handleCreateProject, isOpen = false}) => {
  const projectStore = useSelector(store => store.projectStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const initialValues = {
    name: '',
    description: '',
    labels: []
  }

  const formRef = React.useRef(
    createForm({
      initialValues,
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: handleCreateProject
    })
  )
  const dispatch = useDispatch()
  const { handleCloseModal } = useModalBlockHistory(closeNewProjectPopUp, formRef.current)

  return (
    <PopUpDialog
      headerText="Create new project"
      className="create-project-dialog"
      closePopUp={handleCloseModal}
      isOpen={isOpen}
    >
      {projectStore.loading && <Loader />}
      <Form form={formRef.current} onSubmit={handleCreateProject}>
        {formState => {
          return (
            <>
              <div className="form-row">
                <FormInput
                  async
                  label="Name"
                  name="name"
                  required
                  validationRules={getValidationRules('project.name')}
                />
              </div>
              <div className="form-row">
                <FormTextarea name="description" label="Description" maxLength={255} />
              </div>
              <div className="form-row">
                <FormChipCell
                  chipOptions={getChipOptions('metrics')}
                  formState={formState}
                  initialValues={initialValues}
                  isEditable
                  label="Labels"
                  name="labels"
                  shortChips
                  visibleChipsMaxLength="2"
                  validationRules={{
                    key: getValidationRules(
                      'project.labels.key',
                      getInternalLabelsValidationRule(frontendSpec.internal_labels)
                    ),
                    value: getValidationRules('project.labels.value')
                  }}
                />
              </div>
              {projectStore.newProject.error && (
                <div className="form-row">
                  <ErrorMessage
                    closeError={() => {
                      if (projectStore.newProject.error) {
                        dispatch(removeNewProjectError())
                      }
                    }}
                    message={projectStore.newProject.error}
                  />
                </div>
              )}
              <div className="pop-up-dialog__footer-container">
                <Button
                  type="button"
                  disabled={projectStore.loading}
                  variant={TERTIARY_BUTTON}
                  label="Cancel"
                  className="pop-up-dialog__btn_cancel"
                  onClick={handleCloseModal}
                />
                <Button
                  disabled={projectStore.loading || isSubmitDisabled(formState)}
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

CreateProjectDialog.propTypes = {
  closeNewProjectPopUp: PropTypes.func.isRequired,
  handleCreateProject: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
}

export default CreateProjectDialog
