import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { includes, isEmpty } from 'lodash'
import { OnChange } from 'react-final-form-listeners'
// import PropTypes from 'prop-types'

import ContentMenu from '../../../../elements/ContentMenu/ContentMenu'
import JobWizardCardTemplate from '../../JobWizardCardTemplate/JobWizardCardTemplate'
import Loader from '../../../../common/Loader/Loader'
import NoData from '../../../../common/NoData/NoData'
import Search from '../../../../common/Search/Search'
import TabsSlider from '../../../../common/TabsSlider/TabsSlider'
import { FormSelect, ConfirmDialog } from 'igz-controls/components'

import functionsActions from '../../../../actions/functions'
import jobsActions from '../../../../actions/jobs'
import projectsAction from '../../../../actions/projects'
import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { SLIDER_STYLE_2 } from '../../../../types'
import { generateJobWizardData, getCategoryName } from '../../JobWizard.util'
import { generateProjectsList } from '../../../../utils/projects'
import { openPopUp } from 'igz-controls/utils/common.util'

import './jobWizardFunctionSelection.scss'

const functionsTabs = [
  {
    id: 'functions',
    label: 'Functions'
  },
  {
    id: 'marketplace',
    label: 'Marketplace'
  }
]

const JobWizardFunctionSelection = ({
  templatesCategories,
  setTemplatesCategories,
  templates,
  setTemplates,
  selectedCategory,
  setSelectedCategory,
  defaultData,
  fetchFunctions,
  fetchFunctionsTemplates,
  fetchProjectsNames,
  filteredFunctions,
  filteredTemplates,
  formState,
  frontendSpec,
  functions,
  functionsStore,
  isEditMode,
  isStagingMode,
  params,
  projectStore,
  selectedFunctionData,
  setFilteredFunctions,
  setFilteredTemplates,
  setFunctions,
  fetchFunctionTemplate,
  setSelectedFunctionData,
  setJobAdditionalData
}) => {
  const [activeTab, setActiveTab] = useState('functions')
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
        functionSelection: { ...initialValues.functionSelection, projectName: params.projectName }
      })
    }
  }, [formState.form, formState.initialValues, params.projectName, projects.length])

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
  }, [
    filterByName,
    functions,
    setFilteredFunctions,
    setFilteredTemplates,
    templates,
    templatesCategories
  ])

  useEffect(() => {
    if (filterByName.length === 0) {
      setFilterMatches([])

      if (filteredFunctions.length > 0) {
        setFilteredFunctions([])
      }

      if (!isEmpty(filteredTemplates)) {
        setFilteredTemplates({})
      }
    }
  }, [
    filterByName.length,
    filteredFunctions.length,
    filteredTemplates,
    setFilteredFunctions,
    setFilteredTemplates
  ])

  // const handleSelectGroupFunctions = item => {
  //   setSelectedGroupFunctions(item)
  // }

  // const selectProject = projectName => {
  //   setSelectedProject(projectName)
  // }

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
        return !includes(['', 'handler', 'local'], func.kind)
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

  const handleSelectProjectFunction = (groupedFunctions, funcData) => {
    const selectNewFunction = () => {
      setSelectedFunctionData(groupedFunctions)
      generateData(groupedFunctions)
    }

    if (
      selectedFunctionData?.functions?.[0].metadata.hash !== funcData?.functions?.[0].metadata?.hash
    ) {
      if (formState.dirty) {
        openResetConfirm(selectNewFunction)
      } else {
        selectNewFunction()
      }
    }
  }

  const handleSelectTemplateFunction = funcData => {
    const selectNewFunction = () => {
      fetchFunctionTemplate(funcData.metadata.versions.latest).then(result => {
        setSelectedFunctionData(result)
        generateData(result)
      })
    }

    if (
      selectedFunctionData?.functions?.[0].metadata.name !== funcData?.metadata?.name ||
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
    return openPopUp(ConfirmDialog, {
      cancelButton: {
        label: 'Cancel',
        variant: TERTIARY_BUTTON
      },
      confirmButton: {
        label: 'OK',
        variant: SECONDARY_BUTTON,
        handler: confirmHandler
      },
      header: 'Are you sure?',
      message: 'All changes will be lost'
    })
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
        tabs={functionsTabs}
        onClick={newTab => {
          setFilterByName('')
          setActiveTab(newTab)
        }}
      />
      {activeTab === 'functions' && (
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
              (filteredFunctions.length > 0 ? filteredFunctions : functions).map(funcData => {
                return (
                  <JobWizardCardTemplate
                    className={classnames(
                      'small',
                      funcData?.functions?.[0].metadata?.hash ===
                        selectedFunctionData?.functions?.[0].metadata.hash && 'selected'
                    )}
                    functionData={funcData}
                    handleSelectGroupFunctions={groupedFunctions =>
                      handleSelectProjectFunction(groupedFunctions, funcData)
                    }
                    key={funcData.name}
                  />
                )
              })
            )}
          </div>
        </div>
      )}
      {activeTab === 'marketplace' && (
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
                (filterMatches.length === 0 || isEmpty(filteredTemplates))) ||
              isEmpty(templatesCategories) ? (
              <NoData />
            ) : (
              (!isEmpty(filteredTemplates) ? filteredTemplates : templatesCategories)[
                selectedCategory
              ].map(funcData => {
                return (
                  <JobWizardCardTemplate
                    className={classnames(
                      funcData?.metadata?.name ===
                        selectedFunctionData?.functions?.[0].metadata.name &&
                        !selectedFunctionData?.functions?.[0].metadata.project &&
                        'selected'
                    )}
                    functionData={funcData}
                    handleSelectGroupFunctions={() => handleSelectTemplateFunction(funcData)}
                    key={funcData.metadata.name}
                  />
                )
              })
            )}
          </div>
        </div>
      )}
      <OnChange name="functionSelection.projectName">{onSelectedProjectNameChange}</OnChange>
      {functionsStore.loading && <Loader />}
    </div>
  )
}

JobWizardFunctionSelection.defaultProps = {}

JobWizardFunctionSelection.propTypes = {}

export default connect(({ functionsStore, projectStore }) => ({ functionsStore, projectStore }), {
  ...functionsActions,
  ...jobsActions,
  ...projectsAction
})(JobWizardFunctionSelection)
