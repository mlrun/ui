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
import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { includes, isEmpty } from 'lodash'
import { OnChange } from 'react-final-form-listeners'

import ContentMenu from '../../../../elements/ContentMenu/ContentMenu'
import FunctionCardTemplate from '../../../../elements/FunctionCardTemplate/FunctionCardTemplate'
import NoData from '../../../../common/NoData/NoData'
import Search from '../../../../common/Search/Search'
import TabsSlider from '../../../../common/TabsSlider/TabsSlider'
import { FormSelect } from 'igz-controls/components'

import functionsActions from '../../../../actions/functions'
import jobsActions from '../../../../actions/jobs'
import projectsAction from '../../../../actions/projects'
import { SLIDER_STYLE_2 } from '../../../../types'
import { generateJobWizardData, getCategoryName } from '../../JobWizard.util'
import { generateProjectsList } from '../../../../utils/projects'
import { openConfirmPopUp } from 'igz-controls/utils/common.util'
import {
  FUNCTIONS_SELECTION_FUNCTIONS_TAB,
  FUNCTIONS_SELECTION_MARKETPLACE_TAB,
  functionsSelectionTabs,
  generateFunctionCardData,
  generateFunctionTemplateCardData
} from './jobWizardFunctionSelection.util'

import './jobWizardFunctionSelection.scss'

const JobWizardFunctionSelection = ({
  defaultData,
  fetchFunctionTemplate,
  fetchFunctions,
  fetchFunctionsTemplates,
  fetchProjectsNames,
  filteredFunctions,
  filteredTemplatesCategories,
  formState,
  frontendSpec,
  functions,
  functionsStore,
  isEditMode,
  isStagingMode,
  params,
  projectStore,
  selectedCategory,
  selectedFunctionData,
  setFilteredFunctions,
  setFilteredTemplatesCategories,
  setFunctions,
  setJobAdditionalData,
  setSelectedCategory,
  setSelectedFunctionData,
  setTemplates,
  setTemplatesCategories,
  templates,
  templatesCategories
}) => {
  const [activeTab, setActiveTab] = useState(FUNCTIONS_SELECTION_FUNCTIONS_TAB)
  const [filterByName, setFilterByName] = useState('')
  const [filterMatches, setFilterMatches] = useState([])
  const [projects, setProjects] = useState(
    generateProjectsList(projectStore.projectsNames.data, params.projectName)
  )

  const marketplaceSliderTabs = useMemo(() => {
    return Object.keys(templatesCategories).map(categoryId => {
      const categoryName = getCategoryName(categoryId)

      return {
        id: categoryId,
        label: categoryName
      }
    })
  }, [templatesCategories])

  useEffect(() => {
    if (!selectedCategory && !isEmpty(marketplaceSliderTabs)) {
      setSelectedCategory(marketplaceSliderTabs[0].id)
    }
  }, [marketplaceSliderTabs, selectedCategory, setSelectedCategory])

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
    if (filterByName.length > 0) {
      const filteredFunctions = functions.filter(func => func.name.includes(filterByName))
      const filteredTemplates = templates.filter(template =>
        template.metadata.name.includes(filterByName)
      )
      const filteredTemplatesCategories = {}

      Object.entries(templatesCategories).forEach(([key, value]) => {
        filteredTemplatesCategories[key] = value.filter(template =>
          template.metadata.name.includes(filterByName)
        )
      })

      setFilteredFunctions(filteredFunctions)
      setFilteredTemplatesCategories(filteredTemplatesCategories)

      const filterMatches =
        activeTab === FUNCTIONS_SELECTION_FUNCTIONS_TAB
          ? filteredFunctions.map(func => func.name)
          : filteredTemplates.map(template => template.metadata.name)

      setFilterMatches([...new Set(filterMatches)])
    }
  }, [
    activeTab,
    filterByName,
    functions,
    setFilteredFunctions,
    setFilteredTemplatesCategories,
    templates,
    templatesCategories
  ])

  useEffect(() => {
    if (filterByName.length === 0) {
      setFilterMatches([])

      if (filteredFunctions.length > 0) {
        setFilteredFunctions([])
      }

      if (!isEmpty(filteredTemplatesCategories)) {
        setFilteredTemplatesCategories({})
      }
    }
  }, [
    filterByName.length,
    filteredFunctions.length,
    filteredTemplatesCategories,
    setFilteredFunctions,
    setFilteredTemplatesCategories
  ])

  const generateData = functionData => {
    if (!isEmpty(functionData)) {
      const [jobFormData, jobAdditionalData] = generateJobWizardData(
        frontendSpec,
        functionData,
        defaultData,
        isEditMode,
        isStagingMode
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
        return !includes(['', 'handler', 'local', 'serving'], func.kind)
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

    if (isEmpty(functionsStore.templatesCatalog)) {
      fetchFunctionsTemplates().then(templatesObject => {
        setTemplatesCategories(templatesObject.templatesCategories)
        setTemplates(templatesObject.templates)
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
      fetchFunctionTemplate(functionData.metadata.versions.latest).then(result => {
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
    <div className="job-wizard__function-selection form">
      <div className="form-row">
        <h5 className="form-step-title">Function selection</h5>
      </div>
      <div className="form-row">
        This is a paragraph explaining what the user will find here and what he or she should do
        next, here we can throw in all the jargon words that normal people would glaze over.
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
              <FormSelect name="functionSelection.projectName" withoutBorder options={projects} />
            </div>
          </div>
          <div className="functions-list">
            {(filterByName.length > 0 &&
              (filterMatches.length === 0 || filteredFunctions.length === 0)) ||
            functions.length === 0 ? (
              <NoData />
            ) : (
              (filteredFunctions.length > 0 ? filteredFunctions : functions).map(functionData => {
                return (
                  <FunctionCardTemplate
                    dense
                    selected={
                      functionData?.functions?.[0].metadata?.hash ===
                      selectedFunctionData?.functions?.[0].metadata.hash
                    }
                    functionData={generateFunctionCardData(functionData)}
                    onSelectCard={() => selectProjectFunction(functionData)}
                    key={functionData.name}
                  />
                )
              })
            )}
          </div>
        </div>
      )}
      {activeTab === FUNCTIONS_SELECTION_MARKETPLACE_TAB && (
        <div className="marketplace-tab">
          <div className="form-row">
            <Search
              className=""
              matches={filterMatches}
              onChange={value => handleSearchOnChange(value)}
              value={filterByName}
              placeholder="Search functions..."
              setMatches={setFilterMatches}
            />
          </div>
          <div className="form-row align-stretch slider-row">
            <TabsSlider
              className="function-templates-slider"
              sliderStyle={SLIDER_STYLE_2}
              tabsList={marketplaceSliderTabs}
              initialTab={selectedCategory}
              onClick={tab => setSelectedCategory(tab.id)}
              skipLink
            />
          </div>
          <div className="functions-list">
            {!selectedCategory ? null : (filterByName.length > 0 &&
                (filterMatches.length === 0 || isEmpty(filteredTemplatesCategories))) ||
              isEmpty(templatesCategories) ? (
              <NoData />
            ) : (
              (!isEmpty(filteredTemplatesCategories)
                ? filteredTemplatesCategories
                : templatesCategories)[selectedCategory].map(templateData => {
                return (
                  <FunctionCardTemplate
                    selected={
                      templateData?.metadata?.name ===
                        selectedFunctionData?.functions?.[0].metadata.name &&
                      !selectedFunctionData?.functions?.[0].metadata.project
                    }
                    functionData={generateFunctionTemplateCardData(templateData)}
                    onSelectCard={() => selectTemplateFunction(templateData)}
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
  filteredTemplatesCategories: PropTypes.shape({}).isRequired,
  formState: PropTypes.shape({}).isRequired,
  frontendSpec: PropTypes.shape({}).isRequired,
  functions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isStagingMode: PropTypes.bool.isRequired,
  params: PropTypes.shape({}).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  selectedFunctionData: PropTypes.shape({}).isRequired,
  setFilteredFunctions: PropTypes.func.isRequired,
  setFilteredTemplatesCategories: PropTypes.func.isRequired,
  setFunctions: PropTypes.func.isRequired,
  setJobAdditionalData: PropTypes.func.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  setSelectedFunctionData: PropTypes.func.isRequired,
  setTemplates: PropTypes.func.isRequired,
  setTemplatesCategories: PropTypes.func.isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  templatesCategories: PropTypes.shape({}).isRequired
}

export default connect(({ functionsStore, projectStore }) => ({ functionsStore, projectStore }), {
  ...functionsActions,
  ...jobsActions,
  ...projectsAction
})(JobWizardFunctionSelection)
