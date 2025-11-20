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
import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

import ProjectMonitorView from './ProjectMonitorView'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'
import RegisterModelModal from '../../elements/RegisterModelModal/RegisterModelModal'

import {
  DATASET_TYPE,
  DETAILS_BUILD_LOG_TAB,
  MODELS_TAB,
  MODEL_TYPE,
  REQUEST_CANCELED,
  DATASETS_PAGE,
  FILES_PAGE
} from '../../constants'
import {
  fetchProject,
  fetchProjectFunctions,
  fetchProjectSummaryAndNuclioFuncs,
  removeProjectData,
  removeProjectSummary
} from '../../reducers/projectReducer'
import { areNuclioStreamsEnabled } from '../../utils/helper'
import { fetchNuclioV3ioStreams } from '../../reducers/nuclioReducer'
import { generateCreateNewOptions, handleFetchProjectError } from './project.utils'
import { openPopUp } from 'igz-controls/utils/common.util'
import { generateNuclioLink } from '../../utils'
import { removeFunctionsError, removeNewFunction } from '../../reducers/functionReducer'
import { removeNewFeatureSet } from '../../reducers/featureStoreReducer'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { useNuclioMode } from '../../hooks/nuclioMode.hook'
import { useMode } from '../../hooks/mode.hook'

const ProjectMonitor = () => {
  const [createFeatureSetPanelIsOpen, setCreateFeatureSetPanelIsOpen] = useState(false)
  const [isNewFunctionPopUpOpen, setIsNewFunctionPopUpOpen] = useState(false)
  const [showFunctionsPanel, setShowFunctionsPanel] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const { isNuclioModeDisabled } = useNuclioMode()
  const { isDemoMode } = useMode()
  const projectAbortControllerRef = useRef(new AbortController())
  const projectSummariesAbortControllerRef = useRef(new AbortController())
  const v3ioStreamsAbortControllerRef = useRef(new AbortController())
  const nuclioFunctionsAbortControllerRef = useRef(new AbortController())
  const frontendSpec = useSelector(state => state.appStore.frontendSpec)
  const functionsStore = useSelector(store => store.functionsStore)
  const projectStore = useSelector(store => store.projectStore)

  const registerArtifactLink = useCallback(
    artifactKind =>
      `/projects/${params.projectName}/${
        artifactKind === MODEL_TYPE
          ? MODELS_TAB
          : artifactKind === DATASET_TYPE
            ? DATASETS_PAGE
            : FILES_PAGE
      }`,
    [params.projectName]
  )

  const nuclioStreamsAreEnabled = useMemo(
    () => areNuclioStreamsEnabled(frontendSpec),
    [frontendSpec]
  )

  const openRegisterModelModal = useCallback(() => {
    openPopUp(RegisterModelModal, {
      params: params,
      refresh: () => navigate(registerArtifactLink(MODEL_TYPE))
    })
  }, [params, navigate, registerArtifactLink])

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
  const { createNewOptions } = useMemo(() => {
    const createNewOptions = generateCreateNewOptions(
      navigate,
      params,
      openRegisterArtifactModal,
      generateNuclioLink,
      openPopUp,
      openRegisterModelModal,
      setCreateFeatureSetPanelIsOpen,
      setIsNewFunctionPopUpOpen,
      isDemoMode
    )

    return {
      createNewOptions
    }
  }, [navigate, params, openRegisterArtifactModal, openRegisterModelModal, isDemoMode])

  const fetchProjectDataAndSummary = useCallback(() => {
    projectAbortControllerRef.current = new AbortController()
    projectSummariesAbortControllerRef.current = new AbortController()
    nuclioFunctionsAbortControllerRef.current = new AbortController()

    Promise.all([
      dispatch(
        fetchProject({
          project: params.projectName,
          params: {},
          signal: projectAbortControllerRef.current.signal
        })
      ).unwrap(),
      dispatch(
        fetchProjectSummaryAndNuclioFuncs({
          project: params.projectName,
          projectSummarySignal: projectSummariesAbortControllerRef.current.signal,
          functionsSignal: nuclioFunctionsAbortControllerRef.current.signal
        })
      ).unwrap()
    ]).catch(error => {
      handleFetchProjectError(error, navigate, setConfirmData, dispatch)
    })
  }, [dispatch, navigate, params.projectName])

  const resetProjectData = useCallback(() => {
    dispatch(removeProjectData())
  }, [dispatch])

  useEffect(() => {
    return () => {
      projectAbortControllerRef.current.abort(REQUEST_CANCELED)
      projectSummariesAbortControllerRef.current.abort(REQUEST_CANCELED)
      v3ioStreamsAbortControllerRef.current.abort(REQUEST_CANCELED)
      nuclioFunctionsAbortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [params.projectName])

  useEffect(() => {
    fetchProjectDataAndSummary()

    return () => {
      resetProjectData()
      dispatch(removeProjectSummary())
    }
  }, [dispatch, fetchProjectDataAndSummary, resetProjectData])

  useEffect(() => {
    if (nuclioStreamsAreEnabled && !isNuclioModeDisabled) {
      v3ioStreamsAbortControllerRef.current = new AbortController()

      dispatch(
        fetchNuclioV3ioStreams({
          project: params.projectName,
          signal: v3ioStreamsAbortControllerRef.current.signal
        })
      )
    }
  }, [isNuclioModeDisabled, params.projectName, nuclioStreamsAreEnabled, dispatch])

  const closeFeatureSetPanel = () => {
    setCreateFeatureSetPanelIsOpen(false)
    dispatch(removeNewFeatureSet())
  }

  const closeFunctionsPanel = () => {
    setShowFunctionsPanel(false)
    dispatch(removeNewFunction())

    if (functionsStore.error) {
      dispatch(removeFunctionsError())
    }
  }

  const createFeatureSetSuccess = async () => {
    setCreateFeatureSetPanelIsOpen(false)
    dispatch(removeNewFeatureSet())
  }

  const createFunctionSuccess = async () => {
    setShowFunctionsPanel(false)
    dispatch(removeNewFunction())

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
    dispatch(removeNewFunction())

    const funcs = await dispatch(fetchProjectFunctions({ project: params.projectName }))
      .unwrap()
      .catch(error => {
        dispatch(
          setNotification({
            status: 200,
            id: Math.random(),
            message: 'Function was deployed'
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
          message: 'Function was deployed'
        })
      )
    }
  }

  const handleDeployFunctionFailure = async deployError => {
    const { name, tag } = functionsStore.newFunction.metadata

    setShowFunctionsPanel(false)
    dispatch(removeNewFunction())

    const funcs = await dispatch(fetchProjectFunctions({ project: params.projectName }))
      .unwrap()
      .catch(error => {
        showErrorNotification(dispatch, deployError, '', 'Failed to deploy the function')
        showErrorNotification(dispatch, error, '', 'Failed to fetch functions')
      })

    if (!isEmpty(funcs)) {
      const currentItem = funcs.find(func => {
        return func.metadata.name === name && func.metadata.tag === tag
      })

      if (currentItem) {
        navigate(`/projects/${params.projectName}/functions/${currentItem.metadata.hash}/overview`)
      }

      showErrorNotification(dispatch, deployError, '', 'Failed to deploy the function')
    }
  }

  const handleLaunchIDE = useCallback(() => {}, [])

  const handleRefresh = () => {
    dispatch(removeProjectData())
    dispatch(removeProjectSummary())
    fetchProjectDataAndSummary()

    if (nuclioStreamsAreEnabled && !isNuclioModeDisabled) {
      v3ioStreamsAbortControllerRef.current = new AbortController()

      dispatch(
        fetchNuclioV3ioStreams({
          project: params.projectName,
          signal: v3ioStreamsAbortControllerRef.current.signal
        })
      )
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
        navigate={navigate}
        nuclioStreamsAreEnabled={nuclioStreamsAreEnabled}
        params={params}
        project={projectStore.project}
        projectSummary={projectStore.projectSummary}
        refresh={handleRefresh}
        setIsNewFunctionPopUpOpen={setIsNewFunctionPopUpOpen}
        setShowFunctionsPanel={setShowFunctionsPanel}
        showFunctionsPanel={showFunctionsPanel}
      />
    </>
  )
}

export default ProjectMonitor
