import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { includes, isEmpty } from 'lodash'

import CreateJobPageView from './CreateJobPageView'
import JobsPanel from '../JobsPanel/JobsPanel'

import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import projectsAction from '../../actions/projects'
import { generateProjectsList } from './createJobPage.util'

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
  const [filteredTemplates, setFilteredTemplates] = useState({})
  const [functions, setFunctions] = useState([])
  const [projects, setProjects] = useState(
    generateProjectsList(projectStore.projects, match.params.projectName)
  )
  const [selectedGroupFunctions, setSelectedGroupFunctions] = useState({})
  const [selectedProject, setSelectedProject] = useState(
    match.params.projectName
  )
  const [templatesCategories, setTemplatesCategories] = useState(
    functionsStore.templatesCatalog
  )
  const [templates, setTemplates] = useState([])

  useEffect(() => {
    if (!selectedProject) {
      setSelectedProject(match.params.projectName)
    }
  }, [selectedProject, match.params.projectName])

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects().then(projects => {
        setProjects(generateProjectsList(projects, match.params.projectName))
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

    if (isEmpty(functionsStore.templatesCatalog)) {
      fetchFunctionsTemplates().then(templatesObject => {
        setTemplatesCategories(templatesObject.templatesCategories)
        setTemplates(templatesObject.templates)
      })
    }
  }, [
    fetchFunctions,
    fetchFunctionsTemplates,
    functionsStore.templatesCatalog,
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
      const filteredTemplatesCategories = {}

      Object.entries(templatesCategories).forEach(category => {
        filteredTemplatesCategories[
          category[0]
        ] = category[1].filter(template =>
          template.metadata.name.includes(filterByName)
        )
      })

      setFilteredFunctions(filteredFuncs)
      setFilteredTemplates(filteredTemplatesCategories)
      setFilterMatches([
        ...new Set(
          filteredFuncs
            .map(func => func.name)
            .concat(filteredTemplts.map(template => template.metadata.name))
        )
      ])
    }
  }, [filterByName, functions, templates, templatesCategories])

  const handleSelectGroupFunctions = item => {
    setSelectedGroupFunctions(item)

    if (!Object.keys(item).length) {
      removeNewJob()
    }
  }

  const selectProject = projectName => {
    setSelectedProject(projectName)

    if (filterByName.length > 0) {
      setFilterByName('')
    }
  }

  const handleSearchOnChange = value => {
    if (value.length === 0) {
      setFilterByName('')
      setFilterMatches([])

      if (filteredFunctions.length > 0) {
        setFilteredFunctions([])
      }

      if (!isEmpty(filteredTemplates)) {
        setFilteredTemplates({})
      }
    } else {
      setFilterByName(value)
    }
  }

  return (
    <>
      <CreateJobPageView
        filterByName={filterByName}
        filterMatches={filterMatches}
        filteredFunctions={filteredFunctions}
        filteredTemplates={filteredTemplates}
        functions={filteredFunctions.length > 0 ? filteredFunctions : functions}
        handleSearchOnChange={handleSearchOnChange}
        handleSelectGroupFunctions={handleSelectGroupFunctions}
        loading={functionsStore.loading}
        match={match}
        projects={projects}
        selectProject={selectProject}
        selectedProject={selectedProject}
        setFilterMatches={setFilterMatches}
        templates={
          !isEmpty(filteredTemplates) ? filteredTemplates : templatesCategories
        }
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
