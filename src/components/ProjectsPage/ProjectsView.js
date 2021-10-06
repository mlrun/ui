import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Loader from '../../common/Loader/Loader'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Select from '../../common/Select/Select'
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
import CreateProjectDialog from './CreateProjectDialog/CreateProjectDialog'
import Button from '../../common/Button/Button'

import { projectsSortOptions, projectsStates } from './projectsData'
import { TERTIARY_BUTTON } from '../../constants'

import { ReactComponent as Refresh } from '../../images/refresh.svg'

import './projects.scss'

const ProjectsView = ({
  actionsMenu,
  closeNewProjectPopUp,
  confirmData,
  convertedYaml,
  convertToYaml,
  createProject,
  filterByName,
  filteredProjects,
  filterMatches,
  handleCreateProject,
  handleSearchOnChange,
  isDescendingOrder,
  isNameValid,
  match,
  projectStore,
  refreshProjects,
  removeNewProjectError,
  selectedProjectsState,
  setCreateProject,
  setFilterMatches,
  setIsDescendingOrder,
  setNameValid,
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
        <CreateProjectDialog
          closeNewProjectPopUp={closeNewProjectPopUp}
          handleCreateProject={handleCreateProject}
          isNameValid={isNameValid}
          removeNewProjectError={removeNewProjectError}
          setNameValid={setNameValid}
          setNewProjectDescription={setNewProjectDescription}
          setNewProjectName={setNewProjectName}
        />
      )}
      {confirmData && (
        <PopUpDialog
          headerText={confirmData.title}
          closePopUp={confirmData.rejectHandler}
        >
          <div>{confirmData.description}</div>
          <div className="pop-up-dialog__footer-container">
            <Button
              variant={TERTIARY_BUTTON}
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={confirmData.rejectHandler}
            />
            <Button
              variant={confirmData.btnConfirmType}
              label={confirmData.btnConfirmLabel}
              onClick={() => confirmData.confirmHandler(confirmData.item)}
            />
          </div>
        </PopUpDialog>
      )}
      <div className="projects__header">
        <Breadcrumbs match={match} />
        <PageActionsMenu
          actionsMenuHeader={'New Project'}
          onClick={() => setCreateProject(true)}
          showActionsMenu
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
                  value={filterByName}
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
                      key={project.id || project.metadata.name}
                      project={project}
                      projectSummary={projectStore.projectsSummary.data.find(
                        item => item.name === project.metadata.name
                      )}
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
      {convertedYaml.length > 0 && (
        <YamlModal
          convertedYaml={convertedYaml}
          toggleConvertToYaml={convertToYaml}
        />
      )}
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
  filterByName: PropTypes.string.isRequired,
  filteredProjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filterMatches: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCreateProject: PropTypes.func.isRequired,
  handleSearchOnChange: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  refreshProjects: PropTypes.func.isRequired,
  removeNewProjectError: PropTypes.func.isRequired,
  selectedProjectsState: PropTypes.string.isRequired,
  setCreateProject: PropTypes.func.isRequired,
  setFilterMatches: PropTypes.func.isRequired,
  setIsDescendingOrder: PropTypes.func.isRequired,
  setNewProjectDescription: PropTypes.func.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setNewProjectName: PropTypes.func.isRequired,
  setSelectedProjectsState: PropTypes.func.isRequired,
  setSortProjectId: PropTypes.func.isRequired,
  sortProjectId: PropTypes.string.isRequired
}

export default ProjectsView
