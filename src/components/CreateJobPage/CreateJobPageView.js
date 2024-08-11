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
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import CreateJobCardTemplate from '../../elements/CreateJobCardTemplate/CreateJobCardTemplate'
import Accordion from '../../common/Accordion/Accordion'
import Select from '../../common/Select/Select'
import Search from '../../common/Search/Search'
import NoData from '../../common/NoData/NoData'
import Loader from '../../common/Loader/Loader'

import { ReactComponent as Back } from 'igz-controls/images/back-arrow.svg'
import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'
import { ReactComponent as Filter } from 'igz-controls/images/filter.svg'
import { ReactComponent as SearchIcon } from 'igz-controls/images/search.svg'
import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'

import { generateCategoryHeader } from './createJobPage.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import './createJobPage.scss'

const CreateJobPageView = ({
  filterByName,
  filteredFunctions,
  filteredTemplates,
  filterMatches,
  functions,
  handleSearchOnChange,
  handleSelectGroupFunctions,
  loading,
  params,
  projects,
  requestErrorMessage,
  selectedProject,
  selectProject,
  setFilterMatches,
  templates
}) => (
  <div className="create-container">
    <div className="create-container__header">
      <div className="header-link">
        <Link
          to={`/projects/${params.projectName}/jobs/${params.pageTab}`}
          className="header-link__icon"
        >
          <Back />
        </Link>
        <h3 className="header-link__title">Create Job</h3>
      </div>
      <div className="header-buttons">
        <button>
          <Plus />
        </button>
        <button>
          <Filter />
        </button>
        <button>
          <SearchIcon />
        </button>
      </div>
    </div>
    <div className="create-container__data">
      <Search
        className="data-search"
        matches={filterMatches}
        onChange={value => handleSearchOnChange(value)}
        placeholder="Search by name..."
        setMatches={setFilterMatches}
      />
      <Accordion
        accordionClassName="container functions-wrapper"
        icon={<Arrow />}
        iconClassName="expand-icon"
        openByDefault
      >
        <div className="data-wrapper">
          <div className="data-header data-header_with-select">
            <h5 className="data-header__title">
              <span>Select functions from</span>
              <Arrow />
              <Select
                className="data-header__select"
                onClick={project => selectProject(project)}
                options={projects}
                selectedId={selectedProject}
              />
            </h5>
          </div>
          <div className="create-container__data-list">
            {loading ? (
              <Loader />
            ) : (filterByName.length > 0 &&
                (filterMatches.length === 0 || filteredFunctions.length === 0)) ||
              functions.length === 0 ? (
              <NoData />
            ) : (
              functions.map(func => (
                <CreateJobCardTemplate
                  className="small"
                  func={func}
                  handleSelectGroupFunctions={handleSelectGroupFunctions}
                  key={func.name}
                />
              ))
            )}
          </div>
        </div>
      </Accordion>
      <Accordion icon={<Arrow />} iconClassName="expand-icon" openByDefault>
        <div className="data-wrapper">
          <div className="data-header">
            <h5 className="data-header__title">Functions templates</h5>
          </div>
          <div className="templates-container">
            {(filterByName.length > 0 &&
              (filterMatches.length === 0 || isEveryObjectValueEmpty(filteredTemplates))) ||
            templates.length === 0 ? (
              <NoData message={requestErrorMessage} />
            ) : (
              Object.entries(templates).map(category => {
                const header = generateCategoryHeader(category[0])

                if (category[1].length === 0) return null

                return (
                  <Accordion
                    accordionClassName="container templates-wrapper"
                    icon={<Arrow />}
                    iconClassName="expand-icon"
                    key={category}
                  >
                    <h6 className={`category-header ${header.className}`}>
                      <span className="category-header__icon">{header.icon}</span>
                      {header.label}
                    </h6>
                    <div className="create-container__data-list">
                      {category[1].map((template, index) => (
                        <CreateJobCardTemplate
                          func={template}
                          handleSelectGroupFunctions={handleSelectGroupFunctions}
                          key={template?.metadata.hash + index}
                        />
                      ))}
                    </div>
                  </Accordion>
                )
              })
            )}
          </div>
        </div>
      </Accordion>
    </div>
  </div>
)

CreateJobPageView.propTypes = {
  filterByName: PropTypes.string.isRequired,
  filteredFunctions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filteredTemplates: PropTypes.shape({}).isRequired,
  filterMatches: PropTypes.arrayOf(PropTypes.string).isRequired,
  functions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSearchOnChange: PropTypes.func.isRequired,
  handleSelectGroupFunctions: PropTypes.func.isRequired,
  params: PropTypes.shape({}).isRequired,
  projects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedProject: PropTypes.string.isRequired,
  selectProject: PropTypes.func.isRequired,
  setFilterMatches: PropTypes.func.isRequired,
  templates: PropTypes.shape({}).isRequired
}

export default CreateJobPageView
