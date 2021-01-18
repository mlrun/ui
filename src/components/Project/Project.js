import React, { useCallback, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import ProjectView from './ProjectView'

import projectsAction from '../../actions/projects'
import nuclioActions from '../../actions/nuclio'
import projectsApi from '../../api/projects-api'
import {
  launchIDEOptions,
  getLinks,
  generateCreateNewOptions
} from './project.utils'
import { parseKeyValues } from '../../utils'

import './project.scss'

const Project = ({
  addProjectLabel,
  editProjectLabels,
  fetchApiGateways,
  fetchNuclioFunctions,
  fetchProject,
  fetchProjectDataSets,
  fetchProjectFiles,
  fetchProjectJobs,
  fetchProjectModels,
  fetchProjectScheduledJobs,
  fetchProjectWorkflows,
  match,
  nuclioStore,
  projectStore,
  removeProjectData
}) => {
  const [artifactKind, setArtifactKind] = useState('')
  const [editProject, setEditProject] = useState({
    name: {
      value: null,
      isEdit: false
    },
    description: {
      value: null,
      isEdit: false
    },
    goals: {
      value: null,
      isEdit: false
    },
    source: {
      value: null,
      isEdit: false
    }
  })
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [visibleChipsMaxLength, setVisibleChipsMaxLength] = useState(1)
  const history = useHistory()
  const inputRef = React.createRef(null)

  const statusClassName = classnames(
    'general-info__status-icon',
    projectStore.project.data?.status.state
  )

  const { links, createNewOptions } = useMemo(() => {
    const links = getLinks(match)
    const createNewOptions = generateCreateNewOptions(
      history,
      match,
      setArtifactKind,
      setIsPopupDialogOpen
    )

    return {
      links,
      createNewOptions
    }
  }, [history, match, setIsPopupDialogOpen])

  useEffect(() => {
    fetchProject(match.params.projectName)

    return () => {
      removeProjectData()
    }
  }, [fetchProject, match.params.projectName, removeProjectData])

  const closeEditMode = useCallback(() => {
    setEditProject(prevState => ({
      name: {
        value: prevState.name.value || projectStore.project.data.metadata.name,
        isEdit: false
      },
      description: {
        value:
          prevState.description.value ||
          projectStore.project.data.spec.description,
        isEdit: false
      },
      goals: {
        value: prevState.goals.value || projectStore.project.data.spec.goals,
        isEdit: false
      },
      source: {
        value: prevState.source.value || projectStore.project.data.spec.source,
        isEdit: false
      }
    }))
  }, [projectStore.project])

  const handleSetProjectData = useCallback(() => {
    const data = {
      name: editProject.name.value ?? projectStore.project.data.metadata.name,
      goals: editProject.goals.value ?? projectStore.project.data.spec.goals,
      source: editProject.source.value ?? projectStore.project.data.spec.source,
      description:
        editProject.description.value ??
        projectStore.project.data.spec.description
    }

    closeEditMode()
    projectsApi
      .updateProject(match.params.projectName, {
        metadata: {
          name: data.name
        },
        spec: {
          description: data.description,
          goals: data.goals,
          source: data.source
        }
      })
      .then(() => {
        history.push(`/projects/${data.name}`)
      })
      .catch(() => {
        setEditProject({
          name: {
            value: projectStore.project.data.metadata.name,
            isEdit: false
          },
          description: {
            value: projectStore.project.data.spec.description,
            isEdit: false
          },
          goals: {
            value: projectStore.project.data.spec.goals,
            isEdit: false
          },
          source: {
            value: projectStore.project.data.spec.source,
            isEdit: false
          }
        })
      })
  }, [closeEditMode, editProject, history, match, projectStore.project])

  const handleDocumentClick = useCallback(
    event => {
      if (inputRef.current && event.target !== inputRef.current) {
        handleSetProjectData()
      }
    },
    [handleSetProjectData, inputRef]
  )

  useEffect(() => {
    if (
      editProject.name.isEdit ||
      editProject.description.isEdit ||
      editProject.goals.isEdit ||
      editProject.source.isEdit
    ) {
      document.addEventListener('click', handleDocumentClick)
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [editProject, handleDocumentClick])

  const handleEditProject = useCallback(inputName => {
    setEditProject(prevState => ({
      ...prevState,
      name: {
        ...prevState.name,
        isEdit: inputName === 'name'
      },
      description: {
        ...prevState.description,
        isEdit: inputName === 'description'
      },
      goals: {
        ...prevState.goals,
        isEdit: inputName === 'goals'
      },
      source: {
        ...prevState.source,
        isEdit: inputName === 'source'
      }
    }))
  }, [])

  const handleLaunchIDE = useCallback(launch => {}, [])

  const handleOnChangeProject = useCallback(
    value => {
      setEditProject(prevState => ({
        ...prevState,
        name: {
          ...prevState.name,
          value: editProject.name.isEdit ? value : prevState.name.value
        },
        description: {
          ...prevState.description,
          value: editProject.description.isEdit
            ? value
            : prevState.description.value
        },
        goals: {
          ...prevState.goals,
          value: editProject.goals.isEdit ? value : prevState.goals.value
        },
        source: {
          ...prevState.source,
          value: editProject.source.isEdit ? value : prevState.source.value
        }
      }))
    },
    [editProject]
  )

  const handleOnKeyDown = useCallback(
    event => {
      if (event.keyCode === 13) {
        handleSetProjectData()
      }
    },
    [handleSetProjectData]
  )

  const handleAddProjectLabel = (label, labels) => {
    const objectLabels = {}

    labels.forEach(label => {
      const labelParts = label.split(': ')

      objectLabels[labelParts[0]] = labelParts[1]
    })

    const newLabel = {
      [label.split(':')[0]]: label.split(':')[1].replace(' ', '')
    }

    setVisibleChipsMaxLength(null)
    addProjectLabel(newLabel, objectLabels)
  }

  const handleUpdateProjectLabels = labels => {
    const objectLabels = {}

    labels.forEach(label => {
      const splitedLabel = label.split(':')

      objectLabels[splitedLabel[0]] = splitedLabel[1].replace(' ', '')
    })

    const projectData = {
      description:
        editProject.description.value ??
        projectStore.project.data.spec.description,
      goals: editProject.goals.value ?? projectStore.project.data.spec.goals,
      name: editProject.name.value ?? projectStore.project.data.metadata.name,
      source: editProject.source.value ?? projectStore.project.data.spec.source
    }
    const data = {
      ...projectStore.project.data,
      metadata: {
        ...projectStore.project.data.metadata,
        labels: objectLabels,
        name: projectData.name
      },
      spec: {
        ...projectStore.project.data.spec,
        description: projectData.description,
        goals: projectData.goals,
        source: projectData.source
      }
    }

    setVisibleChipsMaxLength(1)
    editProjectLabels(
      match.params.projectName,
      { ...data },
      objectLabels
    ).then(() => fetchProject(match.params.projectName))
  }

  const projectLabels = useMemo(
    () =>
      projectStore.project.data?.metadata.labels
        ? parseKeyValues(projectStore.project.data.metadata.labels || {})
        : [],
    [projectStore.project.data]
  )

  return (
    <ProjectView
      artifactKind={artifactKind}
      fetchApiGateways={fetchApiGateways}
      createNewOptions={createNewOptions}
      editProject={editProject}
      fetchNuclioFunctions={fetchNuclioFunctions}
      fetchProjectDataSets={fetchProjectDataSets}
      fetchProjectFiles={fetchProjectFiles}
      fetchProjectJobs={fetchProjectJobs}
      fetchProjectModels={fetchProjectModels}
      fetchProjectScheduledJobs={fetchProjectScheduledJobs}
      fetchProjectWorkflows={fetchProjectWorkflows}
      handleAddProjectLabel={handleAddProjectLabel}
      handleEditProject={handleEditProject}
      handleLaunchIDE={handleLaunchIDE}
      handleOnChangeProject={handleOnChangeProject}
      handleOnKeyDown={handleOnKeyDown}
      handleUpdateProjectLabels={handleUpdateProjectLabels}
      history={history}
      isPopupDialogOpen={isPopupDialogOpen}
      launchIDEOptions={launchIDEOptions}
      links={links}
      match={match}
      nuclioStore={nuclioStore}
      projectLabels={projectLabels}
      projectStore={projectStore}
      ref={inputRef}
      setIsPopupDialogOpen={setIsPopupDialogOpen}
      statusClassName={statusClassName}
      visibleChipsMaxLength={visibleChipsMaxLength}
    />
  )
}

Project.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  (projectStore, nuclioStore) => ({
    ...projectStore,
    ...nuclioStore
  }),
  {
    ...projectsAction,
    ...nuclioActions
  }
)(Project)
