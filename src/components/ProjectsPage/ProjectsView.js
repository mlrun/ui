import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Loader from '../../common/Loader/Loader'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import ProjectCard from '../../elements/ProjectCard/ProjectCard'
import NoData from '../../common/NoData/NoData'
import YamlModal from '../../common/YamlModal/YamlModal'
import Notification from '../../common/Notification/Notification'
import Search from '../../common/Search/Search'
import Sort from '../../common/Sort/Sort'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import { pageData, projectsSortOptions, projectsStates } from './projectsData'

import { ReactComponent as Refresh } from '../../images/refresh.svg'

import './projects.scss'

const ProjectsView = ({
  actionsMenu,
  closeNewProjectPopUp,
  confirmData,
  convertedYaml,
  convertToYaml,
  createProject,
  fetchProjectDataSets,
  fetchProjectFailedJobs,
  fetchProjectFunctions,
  fetchProjectModels,
  fetchProjectRunningJobs,
  filterByName,
  filteredProjects,
  filterMatches,
  handleCreateProject,
  handleSearchOnChange,
  isDescendingOrder,
  isEmptyValue,
  match,
  nuclioStore,
  projectStore,
  refreshProjects,
  removeNewProjectError,
  selectedProjectsState,
  setCreateProject,
  setFilterMatches,
  setIsDescendingOrder,
  setNewProjectDescription,
  setNewProjectName,
  setSelectedProjectsState,
  setSortProjectId,
  sortProjectId
}) => {
  const projectsClassNames = classnames(
    'projects',
    (createProject || convertedYaml.length > 0) && 'projects-modal_opened'
  )

  return (
    <div className={projectsClassNames}>
      {projectStore.loading && <Loader />}
      {createProject && (
        <PopUpDialog
          headerText="Create new project"
          closePopUp={closeNewProjectPopUp}
        >
          <form onSubmit={handleCreateProject} noValidate>
            <div className="pop-up-dialog__form">
              <Input
                className="pop-up-dialog__form-input"
                floatingLabel
                label="Name"
                maxLength={63}
                onChange={name => setNewProjectName(name)}
                required={
                  isEmptyValue && projectStore.newProject.name.length === 0
                }
                requiredText="Name is required"
                pattern="^(?=[\S\s]{1,63}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?$"
                tip="&bull; Valid characters: a-z, 0-9, -&#13;&#10;&bull; Must being and end with: a-z, 0-9&#13;&#10;&bull; Length - max: 63"
                type="text"
                value={projectStore.newProject.name}
              />
              <Input
                className="pop-up-dialog__form-input"
                floatingLabel
                label="Description"
                onChange={description => setNewProjectDescription(description)}
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
              <button
                className="btn_default pop-up-dialog__btn_cancel"
                onClick={closeNewProjectPopUp}
              >
                Cancel
              </button>
              <button className="btn_primary" type="submit">
                Create
              </button>
            </div>
          </form>
        </PopUpDialog>
      )}
      {confirmData && (
        <PopUpDialog
          headerText={confirmData.title}
          closePopUp={confirmData.rejectHandler}
        >
          <div>{confirmData.description}</div>
          <div className="pop-up-dialog__footer-container">
            <button
              className="btn_default pop-up-dialog__btn_cancel"
              onClick={confirmData.rejectHandler}
            >
              Cancel
            </button>
            <button
              className={confirmData.btnConfirmClassNames}
              onClick={() => confirmData.confirmHandler(confirmData.item)}
            >
              {confirmData.btnConfirmLabel}
            </button>
          </div>
        </PopUpDialog>
      )}
      <div className="projects__header">
        <Breadcrumbs match={match} />
        <PageActionsMenu
          match={match}
          onClick={() => setCreateProject(true)}
          pageData={pageData}
          registerDialog
          registerDialogHeader="New Project"
        />
      </div>
      <div className="projects__wrapper">
        {projectStore.projects.length > 0 && !projectStore.error ? (
          <>
            <div className="projects-content-header">
              <div className="projects-content-header-item">
                <Select
                  onClick={setSelectedProjectsState}
                  options={projectsStates}
                  selectedId={selectedProjectsState}
                  className="project-types-select"
                  withoutBorder
                />
                <Sort
                  isDescendingOrder={isDescendingOrder}
                  onSelectOption={setSortProjectId}
                  options={projectsSortOptions}
                  selectedId={sortProjectId}
                  setIsDescendingOrder={setIsDescendingOrder}
                />
              </div>
              <div className="projects-content-header-item">
                <Search
                  className="projects-search"
                  matches={filterMatches}
                  onChange={value => handleSearchOnChange(value)}
                  placeholder="Search projects..."
                  setMatches={setFilterMatches}
                />
                <Tooltip template={<TextTooltipTemplate text="Refresh" />}>
                  <button onClick={refreshProjects}>
                    <Refresh />
                  </button>
                </Tooltip>
              </div>
            </div>
            <div className="projects-content">
              {filterByName.length > 0 &&
              (filterMatches.length === 0 || filteredProjects.length === 0) ? (
                <NoData />
              ) : selectedProjectsState === 'archived' &&
                filteredProjects.length === 0 ? (
                <div className="no-filtered-data">No archived projects.</div>
              ) : (
                filteredProjects.map(project => {
                  return (
                    <ProjectCard
                      actionsMenu={actionsMenu}
                      fetchProjectDataSets={fetchProjectDataSets}
                      fetchProjectFailedJobs={fetchProjectFailedJobs}
                      fetchProjectFunctions={fetchProjectFunctions}
                      fetchProjectModels={fetchProjectModels}
                      fetchProjectRunningJobs={fetchProjectRunningJobs}
                      key={project.id || project.metadata.name}
                      nuclioStore={nuclioStore}
                      project={project}
                      projectStore={projectStore}
                    />
                  )
                })
              )}
            </div>
          </>
        ) : projectStore.loading ? null : (
          <NoData />
        )}
      </div>
      <YamlModal
        convertedYaml={convertedYaml}
        toggleConvertToYaml={convertToYaml}
      />
      <Notification />
    </div>
  )
}

ProjectsView.defaultProps = {
  searchValue: null
}

ProjectsView.propTypes = {
  actionsMenu: PropTypes.shape({}).isRequired,
  closeNewProjectPopUp: PropTypes.func.isRequired,
  confirmData: PropTypes.oneOfType([
    PropTypes.shape({}, PropTypes.instanceOf(null))
  ]),
  convertedYaml: PropTypes.string.isRequired,
  convertToYaml: PropTypes.func.isRequired,
  createProject: PropTypes.bool.isRequired,
  fetchProjectDataSets: PropTypes.func.isRequired,
  fetchProjectFailedJobs: PropTypes.func.isRequired,
  fetchProjectFunctions: PropTypes.func.isRequired,
  fetchProjectModels: PropTypes.func.isRequired,
  fetchProjectRunningJobs: PropTypes.func.isRequired,
  filterByName: PropTypes.string.isRequired,
  filteredProjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filterMatches: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCreateProject: PropTypes.func.isRequired,
  handleSearchOnChange: PropTypes.func.isRequired,
  isEmptyValue: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  nuclioStore: PropTypes.shape({}).isRequired,
  projectStore: PropTypes.shape({}).isRequired,
  refreshProjects: PropTypes.func.isRequired,
  removeNewProjectError: PropTypes.func.isRequired,
  selectedProjectsState: PropTypes.string.isRequired,
  setCreateProject: PropTypes.func.isRequired,
  setFilterMatches: PropTypes.func.isRequired,
  setIsDescendingOrder: PropTypes.func.isRequired,
  setNewProjectDescription: PropTypes.func.isRequired,
  setNewProjectName: PropTypes.func.isRequired,
  setSelectedProjectsState: PropTypes.func.isRequired,
  setSortProjectId: PropTypes.func.isRequired,
  sortProjectId: PropTypes.string.isRequired
}

export default ProjectsView
