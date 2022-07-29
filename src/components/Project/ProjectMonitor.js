import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import ProjectMonitorView from './ProjectMonitorView'
import NewFunctionModal from '../NewFunctionModal/NewFunctionModal'
import RegisterArtifactModal from '..//RegisterArtifactModal/RegisterArtifactModal'

import { DATASETS, PANEL_CREATE_MODE } from '../../constants'

import featureStoreActions from '../../actions/featureStore'
import functionsActions from '../../actions/functions'
import notificationActions from '../../actions/notification'
import nuclioAction from '../../actions/nuclio'
import projectsAction from '../../actions/projects'
import { generateCreateNewOptions, handleFetchProjectError } from './project.utils'
import { areNuclioStreamsEnabled } from '../../utils/helper'
import { openPopUp } from 'igz-controls/utils/common.util'
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
  removeV3ioStreams,
  setNotification
}) => {
  const [createFeatureSetPanelIsOpen, setCreateFeatureSetPanelIsOpen] = useState(false)
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false) //TODO: remove after Register Modal ready
  const [showFunctionsPanel, setShowFunctionsPanel] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const navigate = useNavigate()
  const params = useParams()
  const { isNuclioModeDisabled } = useNuclioMode()

  const registerArtifactLink = useCallback(
    artifactKind =>
      `/projects/${params.projectName}/${
        artifactKind === 'model' ? 'models' : artifactKind === 'dataset' ? DATASETS : 'files'
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
        projectName: params.projectName,
        refresh: () => navigate(registerArtifactLink(artifactKind)),
        title: `Register ${artifactKind}`
      })
    },
    [navigate, params.projectName, registerArtifactLink]
  )

  const openNewFunctionModal = useCallback(
    () => openPopUp(NewFunctionModal, { mode: PANEL_CREATE_MODE }),
    []
  )

  const { createNewOptions } = useMemo(() => {
    const createNewOptions = generateCreateNewOptions(
      navigate,
      params,
      openRegisterArtifactModal,
      openNewFunctionModal,
      setIsPopupDialogOpen,
      setCreateFeatureSetPanelIsOpen
    )

    return {
      createNewOptions
    }
  }, [navigate, openRegisterArtifactModal, openNewFunctionModal, params])

  const fetchProjectData = useCallback(() => {
    fetchProject(params.projectName).catch(error => {
      handleFetchProjectError(error, navigate, setConfirmData)
    })
  }, [fetchProject, navigate, params.projectName])

  const resetProjectData = useCallback(() => {
    removeProjectData()
  }, [removeProjectData])

  useEffect(() => {
    fetchProjectData()
    fetchProjectSummary(params.projectName)

    return () => {
      resetProjectData()
      removeProjectSummary()
    }
  }, [
    fetchProjectSummary,
    fetchProjectData,
    params.projectName,
    removeProjectSummary,
    resetProjectData
  ])

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

    return setNotification({
      status: 200,
      id: Math.random(),
      message: 'Function created successfully'
    })
  }

  const handleDeployFunctionSuccess = async ready => {
    let { name, tag } = functionsStore.newFunction.metadata
    const tab = ready === false ? 'build-log' : 'overview'

    tag ||= 'latest'

    setShowFunctionsPanel(false)
    removeNewFunction()

    const funcs = await fetchProjectFunctions(params.projectName).catch(() => {
      setNotification({
        status: 200,
        id: Math.random(),
        message: 'Function deployment initiated successfully'
      })

      setNotification({
        status: 400,
        id: Math.random(),
        message: 'Failed to fetch functions'
      })
    })

    if (funcs) {
      const currentItem = funcs.find(func => {
        return func.metadata.name === name && func.metadata.tag === tag
      })

      navigate(`/projects/${params.projectName}/functions/${currentItem.metadata.hash}/${tab}`)

      return setNotification({
        status: 200,
        id: Math.random(),
        message: 'Function deployment initiated successfully'
      })
    }
  }

  const handleDeployFunctionFailure = async () => {
    const { name, tag } = functionsStore.newFunction.metadata

    setShowFunctionsPanel(false)
    removeNewFunction()

    const funcs = await fetchProjectFunctions(params.projectName).catch(() => {
      setNotification({
        status: 400,
        id: Math.random(),
        message: 'Function deployment failed to initiate'
      })

      setNotification({
        status: 400,
        id: Math.random(),
        message: 'Failed to fetch functions'
      })
    })

    if (funcs) {
      const currentItem = funcs.find(func => {
        return func.metadata.name === name && func.metadata.tag === tag
      })

      navigate(`/projects/${params.projectName}/functions/${currentItem.metadata.hash}/overview`)

      return setNotification({
        status: 400,
        id: Math.random(),
        message: 'Function deployment failed to initiate'
      })
    }
  }

  const handleLaunchIDE = useCallback(() => {}, [])

  const handleRefresh = () => {
    removeProjectData()
    removeProjectSummary()
    fetchProjectData()
    fetchProjectSummary(params.projectName)

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
        isNuclioModeDisabled={isNuclioModeDisabled}
        isPopupDialogOpen={isPopupDialogOpen}
        navigate={navigate}
        nuclioStreamsAreEnabled={nuclioStreamsAreEnabled}
        params={params}
        project={projectStore.project}
        projectSummary={projectStore.projectSummary}
        refresh={handleRefresh}
        registerArtifactLink={registerArtifactLink} //TODO: remove after Register Modal ready
        setIsPopupDialogOpen={setIsPopupDialogOpen}
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
    ...nuclioAction,
    ...notificationActions
  }
)(ProjectMonitor)
