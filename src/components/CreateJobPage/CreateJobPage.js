import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { includes } from 'lodash'

import CreateJobPageView from './CreateJobPageView'
import Loader from '../../common/Loader/Loader'
import JobsPanel from '../JobsPanel/JobsPanel'

import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import projectsAction from '../../actions/projects'

const CreateJobPage = ({
  fetchFunctions,
  fetchFunctionsTemplates,
  fetchProjects,
  functionsStore,
  match,
  projectStore,
  removeNewJob
}) => {
  const [filterByName, setFilterByName] = useState('')
  const [filterMatches, setFilterMatches] = useState([])
  const [filteredFunctions, setFilteredFunctions] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [functions, setFunctions] = useState([])
  const [projects, setProjects] = useState(projectStore.projects)
  const [selectedGroupFunctions, setSelectedGroupFunctions] = useState({})
  const [selectedProject, setSelectedProject] = useState(
    match.params.projectName
  )
  const [templates, setTemplates] = useState(functionsStore.templatesCatalog)

  console.log(filterMatches)

  useEffect(() => {
    if (!selectedProject) {
      setSelectedProject(match.params.projectName)
    }
  }, [selectedProject, match.params.projectName])

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects().then(projects => {
        setProjects(
          projects.map(project => ({
            label:
              project.name === match.params.projectName
                ? 'Current project'
                : project.name,
            id: project.name
          }))
        )
      })
    }
  }, [fetchProjects, match.params.projectName, projects.length])

  useEffect(() => {
    fetchFunctions(selectedProject).then(functions => {
      const filteredFunctions = functions.filter(
        func => !includes(['', 'handler', 'local'], func.kind)
      )

      const groupedFunctions = Object.values(
        filteredFunctions.reduce((prev, curr) => {
          if (!prev[curr.metadata.name]) {
            prev[curr.metadata.name] = {
              name: curr.metadata.name,
              functions: []
            }
          }

          prev[curr.metadata.name].functions.push(curr)

          return prev
        }, {})
      )

      return setFunctions(groupedFunctions)
    })

    if (functionsStore.templatesCatalog.length === 0) {
      fetchFunctionsTemplates().then(setTemplates)
    }
  }, [
    fetchFunctions,
    fetchFunctionsTemplates,
    functionsStore.templatesCatalog.length,
    match.params.projectName,
    selectedProject
  ])

  useEffect(() => {
    if (filterByName.length > 0) {
      const filteredFuncs = functions.filter(func =>
        func.name.includes(filterByName)
      )
      const filteredTemplts = templates.filter(template =>
        template.metadata.name.includes(filterByName)
      )
      setFilteredFunctions(filteredFuncs)
      setFilteredTemplates(filteredTemplts)
      setFilterMatches([
        ...new Set(
          filteredFuncs
            .map(func => func.name)
            .concat(filteredTemplts.map(template => template.metadata.name))
        )
      ])
    } else if (filteredFunctions.length > 0 && filterByName.length === 0) {
      setFilteredFunctions([])
    } else if (filteredTemplates.length > 0 && filterByName.length === 0) {
      setFilteredTemplates([])
    }
  }, [
    filterByName,
    filteredFunctions.length,
    filteredTemplates.length,
    functions,
    templates
  ])

  const handleSelectGroupFunctions = item => {
    setSelectedGroupFunctions(item)

    if (!Object.keys(item).length) {
      removeNewJob()
    }
  }

  return functionsStore.loading ? (
    <Loader />
  ) : (
    <>
      <CreateJobPageView
        functions={filteredFunctions.length > 0 ? filteredFunctions : functions}
        handleSelectGroupFunctions={handleSelectGroupFunctions}
        match={match}
        projects={projects}
        selectedProject={selectedProject}
        setFilterByName={setFilterByName}
        setSelectedProject={setSelectedProject}
        templates={filteredTemplates.length > 0 ? filteredTemplates : templates}
      />
      {Object.values(selectedGroupFunctions).length > 0 && (
        <JobsPanel
          closePanel={handleSelectGroupFunctions}
          groupedFunctions={selectedGroupFunctions}
          match={match}
          project={match.params.projectName}
        />
      )}
    </>
  )
}

CreateJobPage.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ functionsStore, projectStore }) => ({ functionsStore, projectStore }),
  {
    ...functionsActions,
    ...jobsActions,
    ...projectsAction
  }
)(CreateJobPage)
