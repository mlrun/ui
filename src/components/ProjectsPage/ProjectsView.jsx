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
import classnames from 'classnames'

import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import CreateProjectDialog from './CreateProjectDialog/CreateProjectDialog'
import NoData from '../../common/NoData/NoData'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import PageHeader from '../../elements/PageHeader/PageHeader'
import ProjectCard from '../../elements/ProjectCard/ProjectCard'
import ProjectsMonitoring from './ProjectsMonitoring/ProjectsMonitoring'
import Search from '../../common/Search/Search'
import Sort from '../../common/Sort/Sort'
import YamlModal from '../../common/YamlModal/YamlModal'
import { ConfirmDialog, RoundedIcon, PopUpDialog, Loader } from 'igz-controls/components'

import { projectsSortOptions, projectsStates } from './projects.util'
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'

import RefreshIcon from 'igz-controls/images/refresh.svg?react'

import './projects.scss'

const ProjectsView = ({
  actionsMenu,
  alertStore,
  closeNewProjectPopUp,
  confirmData = null,
  convertedYaml,
  convertToYaml,
  createProject,
  filterByName,
  filteredProjects,
  filterMatches,
  handleCreateProject,
  handleSearchOnChange,
  handleSelectSortOption,
  isDescendingOrder,
  projectsRequestErrorMessage,
  projectStore,
  refreshProjects,
  selectedProjectsState,
  setCreateProject,
  setFilterMatches,
  setIsDescendingOrder,
  setSelectedProjectsState,
  sortProjectId,
  tasksStore
}) => {
  const projectsClassNames = classnames(
    'projects',
    (createProject || convertedYaml.length > 0) && 'projects-modal_opened'
  )

  return (
    <div className={projectsClassNames}>
      {(projectStore.loading || projectStore.project.loading || tasksStore.loading) && <Loader />}
      {projectStore.mlrunUnhealthy.isUnhealthy && (
        <PopUpDialog headerIsHidden>
          MLRun seems to be down. Try again in a few minutes.
        </PopUpDialog>
      )}
      {createProject && (
        <CreateProjectDialog
          isOpen={createProject}
          closeNewProjectPopUp={closeNewProjectPopUp}
          handleCreateProject={handleCreateProject}
        />
      )}
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: 'Cancel',
            variant: TERTIARY_BUTTON
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: confirmData.confirmHandler,
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmType
          }}
          isOpen={Boolean(confirmData)}
          header={confirmData.header}
          message={confirmData.message}
        />
      )}
      <div className="projects__wrapper">
        <ProjectsMonitoring />
        <PageHeader title="Projects" />
        <div className="projects-content-header">
          <div className="projects-content-header__row">
            <div className="projects-content-header__col">
              <div className="projects-content-header-item">
                <ContentMenu
                  activeTab={selectedProjectsState}
                  disabled={projectStore.mlrunUnhealthy.retrying}
                  screen="active"
                  tabs={projectsStates}
                  onClick={setSelectedProjectsState}
                />
              </div>
            </div>
            <div className="projects-content-header__col projects-content-header__col-right">
              <div className="projects-content-header-item">
                <Search
                  className="projects-search"
                  disabled={projectStore.mlrunUnhealthy.retrying}
                  matches={filterMatches}
                  onChange={handleSearchOnChange}
                  placeholder="Search projects..."
                  setMatches={setFilterMatches}
                  value={filterByName}
                />
                <Sort
                  disabled={projectStore.mlrunUnhealthy.retrying}
                  isDescendingOrder={isDescendingOrder}
                  onSelectOption={handleSelectSortOption}
                  options={projectsSortOptions}
                  selectedId={sortProjectId}
                  setIsDescendingOrder={setIsDescendingOrder}
                />
                <PageActionsMenu
                  actionsMenuHeader={'New project'}
                  disabled={projectStore.mlrunUnhealthy.retrying}
                  onClick={() => setCreateProject(true)}
                  showActionsMenu
                  variant={PRIMARY_BUTTON}
                />
              </div>
              <RoundedIcon
                disabled={projectStore.mlrunUnhealthy.retrying}
                onClick={refreshProjects}
                className="panel-title__btn_close"
                tooltipText="Refresh"
                id="pop-up-close-btn"
              >
                <RefreshIcon />
              </RoundedIcon>
            </div>
          </div>
        </div>
        {projectStore.projects.length > 0 && !projectStore.error ? (
          filterByName.length > 0 &&
          (filterMatches.length === 0 || filteredProjects.length === 0) ? (
            <NoData />
          ) : selectedProjectsState === 'archived' && filteredProjects.length === 0 ? (
            <div className="no-filtered-data">No archived projects.</div>
          ) : (
            <div className="projects-content">
              {filteredProjects.map(project => {
                return (
                  <ProjectCard
                    actionsMenu={actionsMenu}
                    alert={alertStore[project.metadata.name] || 0}
                    key={project.id || project.metadata.name}
                    project={project}
                    projectSummary={projectStore.projectsSummary.data.find(
                      item => item.name === project.metadata.name
                    )}
                  />
                )
              })}
            </div>
          )
        ) : projectStore.loading ? null : (
          <NoData
            message={
              projectStore.mlrunUnhealthy.retrying
                ? 'Retrieving projects.'
                : projectsRequestErrorMessage || 'Your projects list is empty.'
            }
          />
        )}
      </div>
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={convertToYaml} />
      )}
    </div>
  )
}

ProjectsView.propTypes = {
  actionsMenu: PropTypes.object.isRequired,
  alertStore: PropTypes.object.isRequired,
  closeNewProjectPopUp: PropTypes.func.isRequired,
  confirmData: PropTypes.object,
  convertToYaml: PropTypes.func.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  createProject: PropTypes.bool.isRequired,
  filterByName: PropTypes.string.isRequired,
  filterMatches: PropTypes.arrayOf(PropTypes.string).isRequired,
  filteredProjects: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleCreateProject: PropTypes.func.isRequired,
  handleSearchOnChange: PropTypes.func.isRequired,
  handleSelectSortOption: PropTypes.func.isRequired,
  isDescendingOrder: PropTypes.bool.isRequired,
  projectStore: PropTypes.object.isRequired,
  projectsRequestErrorMessage: PropTypes.string.isRequired,
  refreshProjects: PropTypes.func.isRequired,
  selectedProjectsState: PropTypes.string.isRequired,
  setCreateProject: PropTypes.func.isRequired,
  setFilterMatches: PropTypes.func.isRequired,
  setIsDescendingOrder: PropTypes.func.isRequired,
  setSelectedProjectsState: PropTypes.func.isRequired,
  sortProjectId: PropTypes.string.isRequired,
  tasksStore: PropTypes.object.isRequired
}

export default ProjectsView
