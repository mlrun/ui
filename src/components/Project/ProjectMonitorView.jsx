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
import { isEmpty } from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import FeatureSetsPanel from '../FeatureSetsPanel/FeatureSetsPanel'
import FunctionsPanel from '../FunctionsPanel/FunctionsPanel'
import NewFunctionPopUp from '../../elements/NewFunctionPopUp/NewFunctionPopUp'
import NoData from '../../common/NoData/NoData'
import ProjectDetailsHeader from '../../common/ProjectDetailsHeader/ProjectDetailsHeader'
import ProjectFunctions from '../../elements/ProjectFunctions/ProjectFunctions'
import ProjectJobs from '../../elements/ProjectJobs/ProjectJobs'
import ProjectsMonitoring from '../ProjectsPage/ProjectsMonitoring/ProjectsMonitoring'
import Select from '../../common/Select/Select'

import { ConfirmDialog, RoundedIcon, Loader } from 'igz-controls/components'

import { PANEL_CREATE_MODE } from '../../constants'
import { launchIDEOptions } from './project.utils'

import RefreshIcon from 'igz-controls/images/refresh.svg?react'

import './project.scss'

const ProjectMonitorView = ({
  closeFeatureSetPanel,
  closeFunctionsPanel,
  confirmData = null,
  createFeatureSetPanelIsOpen,
  createFeatureSetSuccess,
  createFunctionSuccess,
  createNewOptions,
  handleDeployFunctionFailure,
  handleDeployFunctionSuccess,
  handleLaunchIDE,
  isNewFunctionPopUpOpen,
  nuclioStreamsAreEnabled,
  params,
  project,
  refresh,
  setIsNewFunctionPopUpOpen,
  setShowFunctionsPanel,
  showFunctionsPanel
}) => {
  return (
    <div className="content-wrapper">
      <div className="content__header">
        <Breadcrumbs />
      </div>
      {project.loading ? (
        <Loader />
      ) : project.error ? (
        <div className="project__error-container">
          {confirmData ? (
            <ConfirmDialog
              closePopUp={confirmData.confirmHandler}
              confirmButton={{
                handler: confirmData.confirmHandler,
                label: confirmData.btnConfirmLabel,
                variant: confirmData.btnConfirmType
              }}
              isOpen={Boolean(confirmData)}
              message={confirmData.message}
              messageOnly={confirmData.messageOnly}
            />
          ) : (
            <h1>{project.error.message}</h1>
          )}
        </div>
      ) : isEmpty(project.data) ? (
        <NoData />
      ) : (
        <div className="content project-content">
          <div className="main-info">
            <ProjectDetailsHeader projectData={project.data} projectName={params.projectName} />
            <div className="main-info__toolbar">
              <div className="main-info__toolbar-actions">
                <Select
                  className="main-info__toolbar-menu launch-menu"
                  density="dense"
                  hideSelectedOption
                  label="Launch IDE"
                  onClick={handleLaunchIDE}
                  options={launchIDEOptions}
                />
                <Select
                  className="main-info__toolbar-menu create-new-menu"
                  density="dense"
                  hideSelectedOption
                  position="bottom-left"
                  width="auto"
                  popUpClassName=""
                  label="Quick actions"
                  options={createNewOptions}
                />
                <RoundedIcon
                  onClick={refresh}
                  id="refresh"
                  tooltipText="Refresh"
                  className="refresh"
                >
                  <RefreshIcon />
                </RoundedIcon>
              </div>
            </div>
            <ProjectsMonitoring />
            <div className="main-info__statistics-section">
              <div className="d-flex">
                <ProjectJobs />
              </div>
              <div className="d-flex">
                <ProjectFunctions nuclioStreamsAreEnabled={nuclioStreamsAreEnabled} />
              </div>
            </div>
          </div>
        </div>
      )}
      {createFeatureSetPanelIsOpen && (
        <FeatureSetsPanel
          closePanel={closeFeatureSetPanel}
          createFeatureSetSuccess={createFeatureSetSuccess}
          project={params.projectName}
        />
      )}
      {isNewFunctionPopUpOpen && (
        <NewFunctionPopUp
          closePopUp={() => setIsNewFunctionPopUpOpen(false)}
          currentProject={params.projectName}
          isOpened={isNewFunctionPopUpOpen}
          setFunctionsPanelIsOpen={setShowFunctionsPanel}
        />
      )}
      {showFunctionsPanel && (
        <FunctionsPanel
          closePanel={closeFunctionsPanel}
          createFunctionSuccess={createFunctionSuccess}
          handleDeployFunctionFailure={handleDeployFunctionFailure}
          handleDeployFunctionSuccess={handleDeployFunctionSuccess}
          mode={PANEL_CREATE_MODE}
          project={params.projectName}
        />
      )}
    </div>
  )
}

ProjectMonitorView.propTypes = {
  closeFeatureSetPanel: PropTypes.func.isRequired,
  closeFunctionsPanel: PropTypes.func.isRequired,
  confirmData: PropTypes.object,
  createFeatureSetPanelIsOpen: PropTypes.bool.isRequired,
  createFeatureSetSuccess: PropTypes.func.isRequired,
  createFunctionSuccess: PropTypes.func.isRequired,
  createNewOptions: PropTypes.array.isRequired,
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  handleLaunchIDE: PropTypes.func.isRequired,
  isNewFunctionPopUpOpen: PropTypes.bool.isRequired,
  nuclioStreamsAreEnabled: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  setIsNewFunctionPopUpOpen: PropTypes.func.isRequired,
  setShowFunctionsPanel: PropTypes.func.isRequired,
  showFunctionsPanel: PropTypes.bool.isRequired
}

export default ProjectMonitorView
