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
import DatePicker from '../../common/DatePicker/DatePicker'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import ProjectCard from '../../elements/ProjectCard/ProjectCard'
import Search from '../../common/Search/Search'
import Sort from '../../common/Sort/Sort'
import StatsCard from '../../elements/StatsCard/StatsCard'
import YamlModal from '../../common/YamlModal/YamlModal'
import { ConfirmDialog, RoundedIcon } from 'igz-controls/components'

import { projectsSortOptions, projectsStates } from './projects.util'
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'

import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

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
  handleSearchOnFocus,
  handleSelectSortOption,
  isDescendingOrder,
  isDemoMode,
  loadingState,
  projectStore,
  refreshProjects,
  removeNewProjectError,
  selectedProjectsState,
  setCreateProject,
  setFilterByName,
  setFilterMatches,
  setIsDescendingOrder,
  setSelectedProjectsState,
  sortProjectId,
  statsConfig,
  tasksStore
}) => {
  const projectsClassNames = classnames(
    'projects',
    (createProject || convertedYaml.length > 0) && 'projects-modal_opened'
  )

  return (
    <div className={projectsClassNames}>
      {(projectStore.loading || projectStore.project.loading || tasksStore.loading) && <Loader />}
      {createProject && (
        <CreateProjectDialog
          closeNewProjectPopUp={closeNewProjectPopUp}
          handleCreateProject={handleCreateProject}
          removeNewProjectError={removeNewProjectError}
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
            handler: () => confirmData.confirmHandler(confirmData.item),
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmType
          }}
          isOpen={confirmData}
          header={confirmData.header}
          message={confirmData.message}
        />
      )}
      <div className='projects__wrapper'>
        {projectStore.projects.length > 0 && isDemoMode && (
          <div className='projects-jobs-container'>
            <div className='projects-jobs-legend'>
              <h5 className='projects-jobs-legend__title'>Monitoring</h5>
              <ul className='projects-jobs-stats__counters'>
                <li>
                  Running <i className='state-running-job'></i>
                </li>
                <li>
                  Failed <i className='state-failed-job'></i>
                </li>
                <li>
                  Completed <i className='state-completed-job'></i>
                </li>
              </ul>
            </div>
            <div className='projects-jobs-stats'>
              {statsConfig.map(stats => (
                <StatsCard key={stats.id}>
                  <>
                    <div className='projects-jobs-stats__row'>
                      <h5 className='projects-jobs-stats__title'>{stats.title}</h5>
                      <DatePicker
                        date={stats.filters.dates.value[0]}
                        dateTo={stats.filters.dates.value[1]}
                        initialDateID={stats.filters.initialDateID}
                        label=''
                        onChange={stats.filters.handler(stats.id)}
                        showNext={stats.id === 'scheduled'}
                        type='date-range-time'
                        withLabels
                        withOptions
                      />
                    </div>
                    {stats.id !== 'scheduled' ? (
                      <>
                        <div className='projects-jobs-stats__row  projects-jobs-stats__full-row'>
                          <div className='projects-jobs-stats__counter'>
                            <span className='projects-jobs-stats__counter-display'>
                              {loadingState[stats.id] ? (
                                <Loader section small secondary />
                              ) : (
                                stats.counters.all.counter
                              )}
                            </span>
                          </div>
                        </div>
                        <div className='projects-jobs-stats__row'>
                          <ul className='projects-jobs-stats__counters'>
                            <li className='link' onClick={stats.counters.running.link}>
                              {loadingState[stats.id] ? (
                                <Loader section small secondary />
                              ) : (
                                stats.counters.running.counter
                              )}
                              <i className='state-running-job'></i>
                            </li>
                            <li className='link' onClick={stats.counters.failed.link}>
                              {loadingState[stats.id] ? (
                                <Loader section small secondary />
                              ) : (
                                stats.counters.failed.counter
                              )}
                              <i className='state-failed-job'></i>
                            </li>
                            <li className='link' onClick={stats.counters.completed.link}>
                              {loadingState[stats.id] ? (
                                <Loader section small secondary />
                              ) : (
                                stats.counters.completed.counter
                              )}
                              <i className='state-completed-job'></i>
                            </li>
                          </ul>
                          <span className='link' onClick={stats.counters.all.link}>
                            See all
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='projects-jobs-stats__row projects-jobs-stats__full-row'>
                          <div className='projects-jobs-stats__counter'>
                            <span className='projects-jobs-stats__counter-display'>
                              {loadingState[stats.id] ? (
                                <Loader section small secondary />
                              ) : (
                                stats.counters.jobs.counter
                              )}
                            </span>
                            <h6 className='projects-jobs-stats__subtitle'>Jobs</h6>
                          </div>
                          <div className='projects-jobs-stats__counter'>
                            <span className='projects-jobs-stats__counter-display'>
                              {loadingState[stats.id] ? (
                                <Loader section small secondary />
                              ) : (
                                stats.counters.workflows.counter
                              )}
                            </span>
                            <h6 className='projects-jobs-stats__subtitle'>Workflows</h6>
                          </div>
                        </div>
                        <div className='projects-jobs-stats__row'>
                          <div className='projects-jobs-stats__counter'>
                            <span className='link' onClick={stats.counters.jobs.link}>
                              See all
                            </span>
                          </div>
                          <div className='projects-jobs-stats__counter'>
                            <span className='link' onClick={stats.counters.workflows.link}>
                              See all
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                </StatsCard>
              ))}
            </div>
          </div>
        )}
        <div className='projects-content-header'>
          <div className='projects-content-header__row'>
            <div className='projects-content-header__col'>
              <div className='projects-content-header-item'>
                <ContentMenu
                  activeTab={selectedProjectsState}
                  screen='active'
                  tabs={projectsStates}
                  onClick={setSelectedProjectsState}
                />

                <Sort
                  isDescendingOrder={isDescendingOrder}
                  onSelectOption={handleSelectSortOption}
                  options={projectsSortOptions}
                  selectedId={sortProjectId}
                  setIsDescendingOrder={setIsDescendingOrder}
                />
              </div>
            </div>
            <div className='projects-content-header__col projects-content-header__col-right'>
              <div className='projects-content-header-item'>
                <Search
                  className='projects-search'
                  matches={filterMatches}
                  onChange={setFilterByName}
                  onFocus={handleSearchOnFocus}
                  placeholder='Search projects...'
                  setMatches={setFilterMatches}
                  value={filterByName}
                />
                <PageActionsMenu
                  actionsMenuHeader={'New Project'}
                  onClick={() => setCreateProject(true)}
                  showActionsMenu
                  variant={PRIMARY_BUTTON}
                />
                <RoundedIcon
                  onClick={refreshProjects}
                  className='panel-title__btn_close'
                  tooltipText='Refresh'
                  id='pop-up-close-btn'
                >
                  <RefreshIcon />
                </RoundedIcon>
              </div>
            </div>
          </div>
        </div>
        {projectStore.projects.length > 0 && !projectStore.error ? (
          filterByName.length > 0 &&
          (filterMatches.length === 0 || filteredProjects.length === 0) ? (
            <NoData />
          ) : selectedProjectsState === 'archived' && filteredProjects.length === 0 ? (
            <div className='no-filtered-data'>No archived projects.</div>
          ) : (
            <div className='projects-content'>
              {filteredProjects.map(project => {
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
              })}
            </div>
          )
        ) : projectStore.loading ? null : (
          <NoData message='Your projects list is empty.' />
        )}
      </div>
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={convertToYaml} />
      )}
    </div>
  )
}

ProjectsView.defaultProps = {
  confirmData: null
}

ProjectsView.propTypes = {
  actionsMenu: PropTypes.shape({}).isRequired,
  closeNewProjectPopUp: PropTypes.func.isRequired,
  confirmData: PropTypes.shape({}),
  convertedYaml: PropTypes.string.isRequired,
  convertToYaml: PropTypes.func.isRequired,
  createProject: PropTypes.bool.isRequired,
  filterByName: PropTypes.string.isRequired,
  filteredProjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filterMatches: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCreateProject: PropTypes.func.isRequired,
  handleSearchOnFocus: PropTypes.func.isRequired,
  handleSelectSortOption: PropTypes.func.isRequired,
  refreshProjects: PropTypes.func.isRequired,
  removeNewProjectError: PropTypes.func.isRequired,
  selectedProjectsState: PropTypes.string.isRequired,
  setCreateProject: PropTypes.func.isRequired,
  setFilterByName: PropTypes.func.isRequired,
  setFilterMatches: PropTypes.func.isRequired,
  setIsDescendingOrder: PropTypes.func.isRequired,
  setSelectedProjectsState: PropTypes.func.isRequired,
  sortProjectId: PropTypes.string.isRequired
}

export default ProjectsView
