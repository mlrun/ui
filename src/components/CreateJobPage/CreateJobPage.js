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
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { includes, isEmpty } from 'lodash'

import CreateJobPageView from './CreateJobPageView'
import JobsPanel from '../JobsPanel/JobsPanel'

import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import projectsAction from '../../actions/projects'
import { FUNCTION_RUN_KINDS, PANEL_CREATE_MODE } from '../../constants'
import { generateProjectsList } from '../../utils/projects'

const CreateJobPage = ({
  fetchFunctions,
  fetchFunctionsTemplates,
  fetchProjectsNames,
  functionsStore,
  projectStore,
  removeNewJob
}) => {
  const params = useParams()
  const [filterByName, setFilterByName] = useState('')
  const [filterMatches, setFilterMatches] = useState([])
  const [filteredFunctions, setFilteredFunctions] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState({})
  const [functions, setFunctions] = useState([])
  const [projects, setProjects] = useState(
    generateProjectsList(projectStore.projectsNames.data, params.projectName)
  )
  const [selectedGroupFunctions, setSelectedGroupFunctions] = useState({})
  const [selectedProject, setSelectedProject] = useState(params.projectName)
  const [templatesCategories, setTemplatesCategories] = useState(functionsStore.templatesCatalog)
  const [templates, setTemplates] = useState([])
  const [showPanel, setShowPanel] = useState(false)
  const [requestErrorMessage, setRequestErrorMessage] = useState('')

  useEffect(() => {
    if (!selectedProject) {
      setSelectedProject(params.projectName)
    }
  }, [selectedProject, params.projectName])

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjectsNames().then(projects => {
        setProjects(generateProjectsList(projects, params.projectName))
      })
    }
  }, [fetchProjectsNames, params.projectName, projects.length])

  useEffect(() => {
    fetchFunctions(selectedProject, {}, {}, setRequestErrorMessage).then(functions => {
      if (functions) {
        const filteredFunctions = functions.filter(func => includes(FUNCTION_RUN_KINDS, func.kind))

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
      }
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
    params.projectName,
    selectedProject
  ])

  useEffect(() => {
    if (filterByName.length > 0) {
      const filteredFuncs = functions.filter(func => func.name.includes(filterByName))
      const filteredTemplts = templates.filter(template =>
        template.metadata.name.includes(filterByName)
      )
      const filteredTemplatesCategories = {}

      Object.entries(templatesCategories).forEach(([key, value]) => {
        filteredTemplatesCategories[key] = value.filter(template =>
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
    setShowPanel(true)
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
        filteredFunctions={filteredFunctions}
        filteredTemplates={filteredTemplates}
        filterMatches={filterMatches}
        functions={filteredFunctions.length > 0 ? filteredFunctions : functions}
        handleSearchOnChange={handleSearchOnChange}
        handleSelectGroupFunctions={handleSelectGroupFunctions}
        loading={functionsStore.loading || functionsStore.funcLoading}
        params={params}
        projects={projects}
        selectedProject={selectedProject}
        selectProject={selectProject}
        setFilterMatches={setFilterMatches}
        templates={!isEmpty(filteredTemplates) ? filteredTemplates : templatesCategories}
        requestErrorMessage={requestErrorMessage}
      />
      {showPanel && (
        <JobsPanel
          closePanel={() => {
            setShowPanel(false)
            removeNewJob()
          }}
          groupedFunctions={selectedGroupFunctions}
          mode={PANEL_CREATE_MODE}
          project={params.projectName}
        />
      )}
    </>
  )
}

export default connect(({ functionsStore, projectStore }) => ({ functionsStore, projectStore }), {
  ...functionsActions,
  ...jobsActions,
  ...projectsAction
})(CreateJobPage)
