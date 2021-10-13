import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import Input from '../../../common/Input/Input'
import ErrorMessage from '../../../common/ErrorMessage/ErrorMessage'
import PopUpDialog from '../../../common/PopUpDialog/PopUpDialog'
import Button from '../../../common/Button/Button'
import Loader from '../../../common/Loader/Loader'

import { SECONDARY_BUTTON, TERTIARY_BUTTON } from '../../../constants'

import './createProjectDialog.scss'

const CreateProjectDialog = ({
  closeNewProjectPopUp,
  handleCreateProject,
  isNameValid,
  removeNewProjectError,
  setNameValid,
  setNewProjectDescription,
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
            maxLength={63}
            onChange={setNewProjectName}
            required
            requiredText="Name is required"
            pattern="^(?=[\S\s]{1,63}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?$"
            setInvalid={value => setNameValid(value)}
            tip="&bull; Valid characters: a-z, 0-9, -&#13;&#10;&bull; Must being and end with: a-z, 0-9&#13;&#10;&bull; Length - max: 63"
            type="text"
            value={projectStore.newProject.name}
          />
          <Input
            className="pop-up-dialog__form-input"
            floatingLabel
            label="Description"
            onChange={setNewProjectDescription}
            type="text"
            value={projectStore.newProject.description}
          />
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
            disabled={projectStore.loading}
            variant={TERTIARY_BUTTON}
            label="Cancel"
            className="pop-up-dialog__btn_cancel"
            onClick={closeNewProjectPopUp}
          />
          <Button
            disabled={
              projectStore.loading ||
              !projectStore.newProject.name.match(
                /^(?=[\S\s]{1,63}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?$/
              )
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
