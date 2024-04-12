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
import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { connect, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

import ProjectMonitorView from './ProjectMonitorView'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'
import RegisterModelModal from '../../elements/RegisterModelModal/RegisterModelModal'

import featureStoreActions from '../../actions/featureStore'
import functionsActions from '../../actions/functions'
import nuclioAction from '../../actions/nuclio'
import projectsAction from '../../actions/projects'
import {
  DATASET_TYPE,
  DATASETS_TAB,
  DETAILS_BUILD_LOG_TAB,
  FILES_TAB,
  MODELS_TAB,
  MODEL_TYPE
} from '../../constants'
import { areNuclioStreamsEnabled } from '../../utils/helper'
import { generateCreateNewOptions, handleFetchProjectError } from './project.utils'
import { openPopUp } from 'igz-controls/utils/common.util'
import { setNotification } from '../../reducers/notificationReducer'
import { useMode } from '../../hooks/mode.hook'
import { showErrorNotification } from '../../utils/notifications.util'
import { useNuclioMode } from '../../hooks/nuclioMode.hook'

const ProjectMonitor = ({
  featureStore,
  fetchNuclioV3ioStreams,
  fetchProject,
  fetchProjectFunctions,
  fetchProjectSummary,
  frontendSpec,
  functionsStore,
  nuclioStore,
  projectStore,
  removeFeatureStoreError,
  removeFunctionsError,
  removeNewFeatureSet,
  removeNewFunction,
  removeProjectData,
  removeProjectSummary,
  removeV3ioStreams
}) => {
  const [createFeatureSetPanelIsOpen, setCreateFeatureSetPanelIsOpen] = useState(false)
  const [isNewFunctionPopUpOpen, setIsNewFunctionPopUpOpen] = useState(false)
  const [showFunctionsPanel, setShowFunctionsPanel] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const navigate = useNavigate()
  const params = useParams()
  const { isDemoMode } = useMode()
  const dispatch = useDispatch()
  const { isNuclioModeDisabled } = useNuclioMode()

  const registerArtifactLink = useCallback(
    artifactKind =>
      `/projects/${params.projectName}/${
        artifactKind === MODEL_TYPE
          ? MODELS_TAB
          : artifactKind === DATASET_TYPE
            ? DATASETS_TAB
            : FILES_TAB
      }`,
    [params.projectName]
  )

  const nuclioStreamsAreEnabled = useMemo(
    () => areNuclioStreamsEnabled(frontendSpec),
    [frontendSpec]
  )

  const openRegisterArtifactModal = useCallback(
    artifactKind => {
      openPopUp(RegisterArtifactModal, {
        artifactKind,
        params,
        refresh: () => navigate(registerArtifactLink(artifactKind)),
        title: `Register ${artifactKind}`
      })
    },
    [navigate, params, registerArtifactLink]
  )

  const openRegisterModelModal = useCallback(() => {
    openPopUp(RegisterModelModal, {
      projectName: params.projectName,
      refresh: () => navigate(registerArtifactLink(MODEL_TYPE))
    })
  }, [params.projectName, navigate, registerArtifactLink])

  const { createNewOptions } = useMemo(() => {
    const createNewOptions = generateCreateNewOptions(
      navigate,
      params,
      openRegisterArtifactModal,
      openRegisterModelModal,
      setCreateFeatureSetPanelIsOpen,
      setIsNewFunctionPopUpOpen,
      isDemoMode
    )

    return {
      createNewOptions
    }
  }, [isDemoMode, navigate, params, openRegisterArtifactModal, openRegisterModelModal])

  const fetchProjectDataAndSummary = useCallback(() => {
    Promise.all([fetchProject(params.projectName), fetchProjectSummary(params.projectName)]).catch(
      error => {
        handleFetchProjectError(error, navigate, setConfirmData)
      }
    )
  }, [fetchProject, fetchProjectSummary, navigate, params.projectName])

  const resetProjectData = useCallback(() => {
    removeProjectData()
  }, [removeProjectData])

  useEffect(() => {
    fetchProjectDataAndSummary()

    return () => {
      resetProjectData()
      removeProjectSummary()
    }
  }, [fetchProjectDataAndSummary, removeProjectSummary, resetProjectData])

  useEffect(() => {
    if (nuclioStreamsAreEnabled && !isNuclioModeDisabled) {
      fetchNuclioV3ioStreams(params.projectName)

      return () => removeV3ioStreams()
    }
  }, [
    fetchNuclioV3ioStreams,
    isNuclioModeDisabled,
    params.projectName,
    nuclioStreamsAreEnabled,
    removeV3ioStreams
  ])

  const closeFeatureSetPanel = () => {
    setCreateFeatureSetPanelIsOpen(false)
    removeNewFeatureSet()

    if (featureStore.error) {
      removeFeatureStoreError()
    }
  }

  const closeFunctionsPanel = () => {
    setShowFunctionsPanel(false)
    removeNewFunction()

    if (functionsStore.error) {
      removeFunctionsError()
    }
  }

  const createFeatureSetSuccess = async () => {
    setCreateFeatureSetPanelIsOpen(false)
    removeNewFeatureSet()
  }

  const createFunctionSuccess = async () => {
    setShowFunctionsPanel(false)
    removeNewFunction()

    return dispatch(
      setNotification({
        status: 200,
        id: Math.random(),
        message: 'Function created successfully'
      })
    )
  }

  const handleDeployFunctionSuccess = async ready => {
    let { name, tag } = functionsStore.newFunction.metadata
    const tab = ready === false ? DETAILS_BUILD_LOG_TAB : 'overview'

    tag ||= 'latest'

    setShowFunctionsPanel(false)
    removeNewFunction()

    const funcs = await fetchProjectFunctions(params.projectName).catch(error => {
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Function deployment initiated successfully'
        })
      )

      showErrorNotification(dispatch, error, '', 'Failed to fetch functions')
    })

    if (!isEmpty(funcs)) {
      const currentItem = funcs.find(func => {
        return func.metadata.name === name && func.metadata.tag === tag
      })

      if (currentItem) {
        navigate(`/projects/${params.projectName}/functions/${currentItem.metadata.hash}/${tab}`)
      }

      return dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Function deployment initiated successfully'
        })
      )
    }
  }

  const handleDeployFunctionFailure = async deployError => {
    const { name, tag } = functionsStore.newFunction.metadata

    setShowFunctionsPanel(false)
    removeNewFunction()

    const funcs = await fetchProjectFunctions(params.projectName).catch(error => {
      showErrorNotification(dispatch, deployError, '', 'Function deployment failed to initiate')
      showErrorNotification(dispatch, error, '', 'Failed to fetch functions')
    })

    if (!isEmpty(funcs)) {
      const currentItem = funcs.find(func => {
        return func.metadata.name === name && func.metadata.tag === tag
      })

      if (currentItem) {
        navigate(`/projects/${params.projectName}/functions/${currentItem.metadata.hash}/overview`)
      }

      showErrorNotification(dispatch, deployError, '', 'Function deployment failed to initiate')
    }
  }

  const handleLaunchIDE = useCallback(() => {}, [])

  const handleRefresh = () => {
    removeProjectData()
    removeProjectSummary()
    fetchProjectDataAndSummary()

    if (nuclioStreamsAreEnabled && !isNuclioModeDisabled) {
      fetchNuclioV3ioStreams(params.projectName)
    }
  }

  return (
    <>
      <ProjectMonitorView
        closeFeatureSetPanel={closeFeatureSetPanel}
        closeFunctionsPanel={closeFunctionsPanel}
        confirmData={confirmData}
        createFeatureSetPanelIsOpen={createFeatureSetPanelIsOpen}
        createFeatureSetSuccess={createFeatureSetSuccess}
        createFunctionSuccess={createFunctionSuccess}
        createNewOptions={createNewOptions}
        handleDeployFunctionFailure={handleDeployFunctionFailure}
        handleDeployFunctionSuccess={handleDeployFunctionSuccess}
        handleLaunchIDE={handleLaunchIDE}
        isNewFunctionPopUpOpen={isNewFunctionPopUpOpen}
        isNuclioModeDisabled={isNuclioModeDisabled}
        navigate={navigate}
        nuclioStreamsAreEnabled={nuclioStreamsAreEnabled}
        params={params}
        project={projectStore.project}
        projectSummary={projectStore.projectSummary}
        refresh={handleRefresh}
        setIsNewFunctionPopUpOpen={setIsNewFunctionPopUpOpen}
        setShowFunctionsPanel={setShowFunctionsPanel}
        showFunctionsPanel={showFunctionsPanel}
        v3ioStreams={nuclioStore.v3ioStreams}
      />
    </>
  )
}

export default connect(
  ({ appStore, functionsStore, featureStore, nuclioStore, projectStore }) => ({
    featureStore,
    functionsStore,
    frontendSpec: appStore.frontendSpec,
    nuclioStore,
    projectStore
  }),
  {
    ...featureStoreActions,
    ...functionsActions,
    ...projectsAction,
    ...nuclioAction
  }
)(ProjectMonitor)
