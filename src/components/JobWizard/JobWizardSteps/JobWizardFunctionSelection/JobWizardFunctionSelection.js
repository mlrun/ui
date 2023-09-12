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
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { OnChange } from 'react-final-form-listeners'
import { connect, useSelector } from 'react-redux'
import { includes, isEmpty, intersection, isBoolean, pickBy, keys, uniqBy } from 'lodash'

import ContentMenu from '../../../../elements/ContentMenu/ContentMenu'
import FilterMenuModal from '../../../FilterMenuModal/FilterMenuModal'
import FunctionCardTemplate from '../../../../elements/FunctionCardTemplate/FunctionCardTemplate'
import HubCategoriesFilter from '../../../FilterMenuModal/HubCategoriesFilter/HubCategoriesFilter'
import NoData from '../../../../common/NoData/NoData'
import Search from '../../../../common/Search/Search'
import { FormSelect } from 'igz-controls/components'

import functionsActions from '../../../../actions/functions'
import jobsActions from '../../../../actions/jobs'
import projectsAction from '../../../../actions/projects'
import {
  FILTER_MENU_MODAL,
  HUB_CATEGORIES_FILTER,
  JOB_WIZARD_FILTERS,
  TAG_LATEST
} from '../../../../constants'
import { generateJobWizardData, getCategoryName } from '../../JobWizard.util'
import { generateProjectsList } from '../../../../utils/projects'
import { functionRunKinds } from '../../../Jobs/jobs.util'
import { openConfirmPopUp } from 'igz-controls/utils/common.util'
import {
  FUNCTIONS_SELECTION_FUNCTIONS_TAB,
  FUNCTIONS_SELECTION_HUB_TAB,
  functionsSelectionTabs,
  generateFunctionCardData,
  generateFunctionTemplateCardData
} from './jobWizardFunctionSelection.util'

import './jobWizardFunctionSelection.scss'

const JobWizardFunctionSelection = ({
  defaultData,
  fetchFunctionTemplate,
  fetchFunctions,
  fetchHubFunctions,
  fetchProjectsNames,
  filteredFunctions,
  filteredTemplates,
  formState,
  frontendSpec,
  functions,
  isEditMode,
  params,
  projectStore,
  selectedFunctionData,
  setFilteredFunctions,
  setFilteredTemplates,
  setFunctions,
  setJobAdditionalData,
  setSelectedFunctionData,
  setTemplates,
  setTemplatesCategories,
  templates,
  templatesCategories
}) => {
  const [activeTab, setActiveTab] = useState(FUNCTIONS_SELECTION_FUNCTIONS_TAB)
  const [hubFiltersInitialValues] = useState({ [HUB_CATEGORIES_FILTER]: {} })
  const [filterByName, setFilterByName] = useState('')
  const [filterMatches, setFilterMatches] = useState([])
  const [projects, setProjects] = useState(
    generateProjectsList(projectStore.projectsNames.data, params.projectName)
  )
  const filtersStoreHubCategories = useSelector(
    store =>
      store.filtersStore[FILTER_MENU_MODAL][JOB_WIZARD_FILTERS]?.values?.[HUB_CATEGORIES_FILTER]
  )

  const filterTemplates = useMemo(() => {
    return templatesCategories.map(categoryId => {
      const categoryName = getCategoryName(categoryId)

      return {
        id: categoryId,
        label: categoryName
      }
    })
  }, [templatesCategories])

  const getFilteredTemplates = useCallback(
    (templates, filteredByCategory) => {
      const filteredArray = templates.filter(template => {
        const hubCategoriesArray = keys(pickBy(filtersStoreHubCategories, isBoolean))
        const validName = template.metadata.name.includes(filterByName)
        const validCategory = filteredByCategory
          ? !isEmpty(intersection(hubCategoriesArray, template.ui?.categories))
          : true

        return validName && validCategory && template.metadata.tag === TAG_LATEST
      })

      return uniqBy(filteredArray, 'metadata.name')
    },
    [filterByName, filtersStoreHubCategories]
  )

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjectsNames().then(projects => {
        setProjects(generateProjectsList(projects, params.projectName))
      })
    }
  }, [fetchProjectsNames, params.projectName, projects.length])

  useEffect(() => {
    const initialValues = formState.initialValues

    if (
      projects.length > 0 &&
      !initialValues?.functionSelection?.projectName &&
      params?.projectName
    ) {
      formState.form.reset({
        ...initialValues,
        functionSelection: { ...initialValues?.functionSelection, projectName: params.projectName }
      })
    }
  }, [formState.form, formState.initialValues, params.projectName, projects.length])

  useEffect(() => {
    const filteredByCategory = !isEmpty(filtersStoreHubCategories)

    const filteredTemplates = getFilteredTemplates(templates, filteredByCategory)
    setFilteredTemplates(filteredTemplates)

    if (filterByName.length > 0 || filteredByCategory) {
      const filteredFunctions = functions.filter(func => func.name.includes(filterByName))
      setFilteredFunctions(filteredFunctions)

      const filterMatches =
        activeTab === FUNCTIONS_SELECTION_FUNCTIONS_TAB
          ? filteredFunctions.map(func => func.name)
          : filteredTemplates.map(template => template.metadata.name)

      setFilterMatches([...new Set(filterMatches)])
    }
  }, [
    activeTab,
    filterByName,
    filtersStoreHubCategories,
    functions,
    getFilteredTemplates,
    setFilteredFunctions,
    setFilteredTemplates,
    templates,
    templatesCategories
  ])

  useEffect(() => {
    if (
      filterByName.length === 0 &&
      isEmpty(filtersStoreHubCategories) &&
      filterMatches.length > 0
    ) {
      setFilterMatches([])

      if (filteredFunctions.length > 0) {
        setFilteredFunctions([])
      }

      if (!isEmpty(filteredTemplates)) {
        const filteredByCategory = !isEmpty(filtersStoreHubCategories)

        setFilteredTemplates(getFilteredTemplates(templates, filteredByCategory))
      }
    }
  }, [
    filterByName.length,
    filterMatches.length,
    filteredFunctions.length,
    filteredTemplates,
    filtersStoreHubCategories,
    getFilteredTemplates,
    setFilteredFunctions,
    setFilteredTemplates,
    templates
  ])

  const generateData = functionData => {
    if (!isEmpty(functionData)) {
      const [jobFormData, jobAdditionalData] = generateJobWizardData(
        frontendSpec,
        functionData,
        defaultData,
        params.projectName,
        isEditMode
      )
      const newInitial = {
        ...formState.initialValues,
        ...jobFormData
      }

      formState.form.reset(newInitial)
      setJobAdditionalData(jobAdditionalData)
    }
  }

  const handleSearchOnChange = value => {
    setFilterByName(value)
  }

  const onSelectedProjectNameChange = currentValue => {
    formState.initialValues.functionSelection.projectName = currentValue

    fetchFunctions(currentValue).then(functions => {
      const validFunctions = functions.filter(func => {
        return includes(functionRunKinds, func.kind)
      })

      const groupedFunctions = Object.values(
        validFunctions.reduce((prev, curr) => {
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

      setFunctions(groupedFunctions)

      if (filterByName.length > 0) {
        const filteredFunctions = validFunctions.filter(func => {
          return func.metadata.name.includes(filterByName)
        })

        setFilteredFunctions(filteredFunctions)
      }
    })

    if (isEmpty(templatesCategories) || isEmpty(templates)) {
      fetchHubFunctions().then(templatesObject => {
        setTemplatesCategories(templatesObject.hubFunctionsCategories)
        setTemplates(templatesObject.hubFunctions)

        formState.initialValues.functionSelection.templatesLabels =
          templatesObject.hubFunctions.reduce((labels, template) => {
            labels[template.metadata.name] = template.ui.categories.map(categoryId => {
              return {
                id: categoryId,
                key: getCategoryName(categoryId),
                isKeyOnly: true
              }
            })

            return labels
          }, {})
      })
    }
  }

  const selectProjectFunction = functionData => {
    const selectNewFunction = () => {
      setSelectedFunctionData(functionData)
      generateData(functionData)
    }

    if (
      selectedFunctionData?.functions?.[0].metadata.hash !==
      functionData?.functions?.[0].metadata?.hash
    ) {
      if (formState.dirty) {
        openResetConfirm(selectNewFunction)
      } else {
        selectNewFunction()
      }
    }
  }

  const selectTemplateFunction = functionData => {
    const selectNewFunction = () => {
      const functionTemplatePath = `${functionData.spec.item_uri}${functionData.spec.assets.function}`

      fetchFunctionTemplate(functionTemplatePath).then(result => {
        setSelectedFunctionData(result)
        generateData(result)
      })
    }

    if (
      selectedFunctionData?.functions?.[0].metadata.name !== functionData?.metadata?.name ||
      selectedFunctionData?.functions?.[0].metadata.project
    ) {
      if (formState.dirty) {
        openResetConfirm(selectNewFunction)
      } else {
        selectNewFunction()
      }
    }
  }

  const openResetConfirm = confirmHandler => {
    return openConfirmPopUp(confirmHandler, 'All changes will be lost')
  }

  return (
    <div className="job-wizard__function-selection">
      <div className="form-row">
        <h5 className="form-step-title">Function selection</h5>
      </div>
      <ContentMenu
        activeTab={activeTab}
        tabs={functionsSelectionTabs}
        onClick={newTab => {
          setFilterByName('')
          setActiveTab(newTab)
        }}
      />
      {activeTab === FUNCTIONS_SELECTION_FUNCTIONS_TAB && (
        <div className="functions-tab">
          <div className="form-row">
            <Search
              matches={filterMatches}
              onChange={value => handleSearchOnChange(value)}
              placeholder="Search functions..."
              setMatches={setFilterMatches}
              value={filterByName}
            />
          </div>
          <div className="form-row">
            <div className="form-row__project-name">
              <FormSelect name="functionSelection.projectName" options={projects} />
            </div>
          </div>

          {(filterByName.length > 0 &&
            (filterMatches.length === 0 || filteredFunctions.length === 0)) ||
          functions.length === 0 ? (
            <NoData />
          ) : (
            <div className="functions-list">
              {(filteredFunctions.length > 0 ? filteredFunctions : functions).map(functionData => {
                return (
                  <FunctionCardTemplate
                    selected={
                      functionData?.functions?.[0].metadata?.hash ===
                      selectedFunctionData?.functions?.[0].metadata.hash
                    }
                    formState={formState}
                    functionData={generateFunctionCardData(functionData)}
                    onSelectCard={() => selectProjectFunction(functionData)}
                    key={functionData.name}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}
      {activeTab === FUNCTIONS_SELECTION_HUB_TAB && (
        <div className="hub-tab">
          <div className="form-row">
            <Search
              className="hub-search"
              matches={filterMatches}
              onChange={value => handleSearchOnChange(value)}
              value={filterByName}
              placeholder="Search functions..."
              setMatches={setFilterMatches}
            />
            <FilterMenuModal
              cancelButton={{ label: 'Clear', variant: 'tertiary' }}
              header="Filter by category"
              wizardClassName="hub-filter"
              filterMenuName={JOB_WIZARD_FILTERS}
              initialValues={hubFiltersInitialValues}
              values={hubFiltersInitialValues}
            >
              <HubCategoriesFilter templates={filterTemplates} />
            </FilterMenuModal>
          </div>
          <div className="functions-list">
            {(filterByName.length > 0 &&
              (filterMatches.length === 0 || isEmpty(filteredTemplates))) ||
            isEmpty(templates) ? (
              <NoData />
            ) : (
              filteredTemplates.map(templateData => {
                return (
                  <FunctionCardTemplate
                    selected={
                      templateData?.metadata?.name ===
                        selectedFunctionData?.functions?.[0].metadata.name &&
                      !selectedFunctionData?.functions?.[0].status
                    }
                    formState={formState}
                    functionData={generateFunctionTemplateCardData(templateData)}
                    onSelectCard={event => {
                      if (!event.target.closest('.chips')) {
                        selectTemplateFunction(templateData)
                      }
                    }}
                    key={templateData.metadata.name}
                  />
                )
              })
            )}
          </div>
        </div>
      )}
      <OnChange name="functionSelection.projectName">{onSelectedProjectNameChange}</OnChange>
    </div>
  )
}

JobWizardFunctionSelection.propTypes = {
  defaultData: PropTypes.shape({}).isRequired,
  filteredFunctions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filteredTemplates: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  formState: PropTypes.shape({}).isRequired,
  frontendSpec: PropTypes.shape({}).isRequired,
  functions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  params: PropTypes.shape({}).isRequired,
  selectedFunctionData: PropTypes.shape({}).isRequired,
  setFilteredFunctions: PropTypes.func.isRequired,
  setFilteredTemplates: PropTypes.func.isRequired,
  setFunctions: PropTypes.func.isRequired,
  setJobAdditionalData: PropTypes.func.isRequired,
  setSelectedFunctionData: PropTypes.func.isRequired,
  setTemplates: PropTypes.func.isRequired,
  setTemplatesCategories: PropTypes.func.isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  templatesCategories: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default connect(
  ({ projectStore }) => ({
    projectStore
  }),
  {
    ...functionsActions,
    ...jobsActions,
    ...projectsAction
  }
)(JobWizardFunctionSelection)
