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
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import ErrorMessage from '../../../common/ErrorMessage/ErrorMessage'
import Input from '../../../common/Input/Input'
import Loader from '../../../common/Loader/Loader'
import ProjectLabels from '../../Project/ProjectLabels/ProjectLabels'
import { Button, PopUpDialog } from 'igz-controls/components'

import { getValidationRules } from 'igz-controls/utils/validation.util'
import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'

import './createProjectDialog.scss'

const CreateProjectDialog = ({
  closeNewProjectPopUp,
  handleCreateProject,
  isNameValid,
  removeNewProjectError,
  setNameValid,
  setNewProjectDescription,
  setNewProjectLabels,
  setNewProjectName
}) => {
  const projectStore = useSelector(store => store.projectStore)

  return (
    <PopUpDialog
      headerText="Create new project"
      className="create-project-dialog"
      closePopUp={closeNewProjectPopUp}
    >
      {projectStore.loading && <Loader />}
      <form noValidate>
        <div className="pop-up-dialog__form">
          <Input
            className="pop-up-dialog__form-input"
            floatingLabel
            invalid={!isNameValid}
            invalidText="This field is invalid"
            label="Name"
            onChange={setNewProjectName}
            required
            setInvalid={value => setNameValid(value)}
            type="text"
            value={projectStore.newProject.name}
            validationRules={getValidationRules('project.name')}
          />
          <Input
            className="pop-up-dialog__form-input"
            floatingLabel
            label="Description"
            onChange={setNewProjectDescription}
            type="text"
            value={projectStore.newProject.description}
          />
          <div>
            <span>Labels:</span>
            <ProjectLabels
              addProjectLabel={setNewProjectLabels}
              isEditMode
              labels={projectStore.newProject.labels}
              updateProjectLabel={setNewProjectLabels}
              visibleChipsMaxLength="all"
            />
          </div>
        </div>
        {projectStore.newProject.error && (
          <ErrorMessage
            closeError={() => {
              if (projectStore.newProject.error) {
                removeNewProjectError()
              }
            }}
            message={projectStore.newProject.error}
          />
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
            disabled={projectStore.loading || !isNameValid || !projectStore.newProject.name}
            variant={SECONDARY_BUTTON}
            label="Create"
            onClick={handleCreateProject}
          />
        </div>
      </form>
    </PopUpDialog>
  )
}

CreateProjectDialog.propTypes = {
  closeNewProjectPopUp: PropTypes.func.isRequired,
  handleCreateProject: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  removeNewProjectError: PropTypes.func.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setNewProjectDescription: PropTypes.func.isRequired,
  setNewProjectName: PropTypes.func.isRequired
}

export default CreateProjectDialog
