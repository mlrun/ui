import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import Input from '../../../common/Input/Input'
import ErrorMessage from '../../../common/ErrorMessage/ErrorMessage'
import PopUpDialog from '../../../common/PopUpDialog/PopUpDialog'
import Button from '../../../common/Button/Button'
import Loader from '../../../common/Loader/Loader'
import ProjectLabels from '../../Project/ProjectLabels/ProjectLabels'

import { getValidationRules } from '../../../utils/validationService'

import { SECONDARY_BUTTON, TERTIARY_BUTTON } from '../../../constants'

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
        <div className="pop-up-dialog__footer-container">
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
          <Button
            type="button"
            disabled={projectStore.loading}
            variant={TERTIARY_BUTTON}
            label="Cancel"
            className="pop-up-dialog__btn_cancel"
            onClick={closeNewProjectPopUp}
          />
          <Button
            disabled={
              projectStore.loading ||
              !isNameValid ||
              !projectStore.newProject.name
            }
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
