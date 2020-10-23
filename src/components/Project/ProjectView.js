import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Input from '../../common/Input/Input'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import ProjectFunctions from '../../elements/ProjectFunctions/ProjectFunctions'
import ProjectJobs from '../../elements/ProjectJobs/ProjectJobs'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import Select from '../../common/Select/Select'

import { ReactComponent as Settings } from '../../images/settings.svg'
import ProjectArtifacts from '../../elements/ProjectArtifacts/ProjectArtifacts'

const ProjectView = React.forwardRef(
  (
    {
      createNewOptions,
      editProject,
      fetchProjectDataSets,
      fetchProjectFiles,
      fetchProjectFunctions,
      fetchProjectJobs,
      fetchProjectModels,
      handleEditProject,
      handleLaunchIDE,
      handleOnChangeProject,
      handleOnKeyDown,
      history,
      isPopupDialogOpen,
      launchIDEOptions,
      links,
      match,
      projectStore,
      setIsPopupDialogOpen,
      statusClassName
    },
    ref
  ) => {
    return (
      <>
        <div className="project__header">
          <Breadcrumbs match={match} />
        </div>
        {projectStore.project.loading ? (
          <Loader />
        ) : projectStore.project.error ? (
          <div className=" project__error-container">
            <h1>{projectStore.project.error}</h1>
          </div>
        ) : isEmpty(projectStore.project.data) ? (
          <NoData />
        ) : (
          <div className="project__content">
            <div className="general-info">
              <div className="general-info__main-data">
                <div className="general-info__main-data-wrapper">
                  <div
                    data-testid="project-name"
                    className="general-info__name"
                    onClick={() => handleEditProject('name')}
                  >
                    {editProject.name.isEdit ? (
                      <Input
                        focused={true}
                        name="name"
                        onChange={handleOnChangeProject}
                        onKeyDown={handleOnKeyDown}
                        ref={ref}
                        type="text"
                        value={
                          editProject.name.value ??
                          projectStore.project.data.name
                        }
                      />
                    ) : (
                      editProject.name.value ?? projectStore.project.data.name
                    )}
                  </div>
                  <Settings className="general-info__settings" />
                </div>
                <div
                  className="general-info__description"
                  data-testid="project-description"
                  onClick={() => handleEditProject('description')}
                >
                  {editProject.description.isEdit ? (
                    <Input
                      focused={true}
                      name="description"
                      onChange={handleOnChangeProject}
                      onKeyDown={handleOnKeyDown}
                      ref={ref}
                      type="text"
                      value={
                        editProject.description.value ??
                        projectStore.project.data.description
                      }
                    />
                  ) : (
                    editProject.description.value ??
                    projectStore.project.data.description
                  )}
                </div>
              </div>
              <div className="general-info__divider" />
              {projectStore.project.data.state && (
                <div className="general-info__status">
                  <span className="general-info__status-label">Status:</span>
                  <i className={statusClassName} />
                  <span className="general-info__status-name">
                    {projectStore.project.data.state}
                  </span>
                </div>
              )}
              <div className="general-info__owner">
                <span className="general-info__owner-label">Owner:</span>
                <span>{projectStore.project.data.owner}</span>
              </div>
              <div className="general-info__links">
                <div className="general-info__links-label">Quick Links</div>
                {links.map(({ label, link }) => {
                  return (
                    <Link
                      key={label}
                      className="general-info__links-link"
                      to={link}
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="main-info">
              <div className="main-info__toolbar">
                <Select
                  className="main-info__toolbar-menu launch-menu"
                  hideSelectedOption
                  label="Launch IDE"
                  onClick={handleLaunchIDE}
                  options={launchIDEOptions}
                />
                <Select
                  className="main-info__toolbar-menu create-new-menu"
                  hideSelectedOption
                  label="Create new"
                  options={createNewOptions}
                />
              </div>
              <div className="main-info__statistics-section">
                <ProjectArtifacts
                  artifacts={projectStore.project.models}
                  fetchArtifacts={fetchProjectModels}
                  link={`/projects/${match.params.projectName}/models`}
                  match={match}
                  title="Models"
                />
                <ProjectArtifacts
                  artifacts={projectStore.project.dataSets}
                  fetchArtifacts={fetchProjectDataSets}
                  link={`/projects/${match.params.projectName}/datasets`}
                  match={match}
                  title="Datasets"
                />
                <ProjectArtifacts
                  artifacts={projectStore.project.files}
                  fetchArtifacts={fetchProjectFiles}
                  link={`/projects/${match.params.projectName}/files`}
                  match={match}
                  title="Files"
                />
              </div>
              <div className="main-info__statistics-section">
                <ProjectJobs
                  fetchProjectJobs={fetchProjectJobs}
                  jobs={projectStore.project.jobs}
                  match={match}
                />
                <ProjectFunctions
                  fetchProjectFunctions={fetchProjectFunctions}
                  functionsStore={projectStore.project.functions}
                  match={match}
                />
              </div>
            </div>
          </div>
        )}
        {isPopupDialogOpen && (
          <RegisterArtifactPopup
            artifactFilter={{}}
            match={match}
            pageData={{}}
            refresh={() => {
              history.push(`/projects/${match.params.projectName}/artifacts`)
            }}
            setIsPopupDialogOpen={setIsPopupDialogOpen}
            title="Register artifact"
          />
        )}
      </>
    )
  }
)

ProjectView.propTypes = {
  createNewOptions: PropTypes.array.isRequired,
  editProject: PropTypes.shape({}).isRequired,
  fetchProjectDataSets: PropTypes.func.isRequired,
  fetchProjectFiles: PropTypes.func.isRequired,
  fetchProjectFunctions: PropTypes.func.isRequired,
  fetchProjectJobs: PropTypes.func.isRequired,
  fetchProjectModels: PropTypes.func.isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleLaunchIDE: PropTypes.func.isRequired,
  handleOnChangeProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  isPopupDialogOpen: PropTypes.bool.isRequired,
  launchIDEOptions: PropTypes.array.isRequired,
  links: PropTypes.array.isRequired,
  match: PropTypes.shape({}).isRequired,
  projectStore: PropTypes.shape({}).isRequired,
  setIsPopupDialogOpen: PropTypes.func.isRequired,
  statusClassName: PropTypes.string.isRequired
}

export default ProjectView
