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
import { useSelector } from 'react-redux'

import ErrorMessage from '../../../common/ErrorMessage/ErrorMessage'
import Loader from '../../../common/Loader/Loader'
import { Button, FormChipCell, FormInput, FormTextarea, PopUpDialog } from 'igz-controls/components'

import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { createForm } from 'final-form'
import { getChipOptions } from '../../../utils/getChipOptions'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { setFieldState } from 'igz-controls/utils/form.util'

import './createProjectDialog.scss'

const CreateProjectDialog = ({
  closeNewProjectPopUp,
  handleCreateProject,
  removeNewProjectError
}) => {
  const projectStore = useSelector(store => store.projectStore)
  const initialValues = {
    name: '',
    description: '',
    labels: []
  }
  const formRef = React.useRef(
    createForm({
      initialValues,
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )

  return (
    <PopUpDialog
      headerText="Create new project"
      className="create-project-dialog"
      closePopUp={closeNewProjectPopUp}
    >
      {projectStore.loading && <Loader />}
      <Form form={formRef.current} onSubmit={() => {}}>
        {formState => {
          return (
            <>
              <div className="form-row">
                <FormInput
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
                    key: getValidationRules('project.labels.key'),
                    value: getValidationRules('project.labels.value')
                  }}
                />
              </div>
              {projectStore.newProject.error && (
                <div className="form-row">
                  <ErrorMessage
                    closeError={() => {
                      if (projectStore.newProject.error) {
                        removeNewProjectError()
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
                  onClick={closeNewProjectPopUp}
                />
                <Button
                  disabled={projectStore.loading || !formState.values.name || formState.invalid}
                  variant={SECONDARY_BUTTON}
                  label="Create"
                  onClick={(event) => handleCreateProject(event, formState)}
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
  removeNewProjectError: PropTypes.func.isRequired
}

export default CreateProjectDialog
