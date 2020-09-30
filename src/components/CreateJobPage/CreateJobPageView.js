import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import CreateJobCardTemplate from '../../elements/CreateJobCardTemplate/CreateJobCardTemplate'
import Accordion from '../../common/Accordion/Accordion'
import Select from '../../common/Select/Select'
import Search from '../../common/Search/Search'
import NoData from '../../common/NoData/NoData'
import Loader from '../../common/Loader/Loader'

import { ReactComponent as Back } from '../../images/back-arrow.svg'
import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Filter } from '../../images/filter.svg'
import { ReactComponent as SearchIcon } from '../../images/search.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'

import { generateCategoryHeader } from './createJobPage.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import './createJobPage.scss'

const CreateJobPageView = ({
  filterByName,
  filterMatches,
  filteredFunctions,
  filteredTemplates,
  functions,
  handleSearchOnChange,
  handleSelectGroupFunctions,
  loading,
  match,
  projects,
  selectProject,
  selectedProject,
  setFilterMatches,
  templates
}) => (
  <div className="create-container">
    <div className="create-container__header">
      <div className="header-link">
        <Link
          to={`/projects/${match.params.projectName}/jobs/${match.params.jobTab}`}
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
        placeholder="Search by text, tags and keywords..."
        setMatches={setFilterMatches}
      />
      <Accordion
        accordionClassName="functions-container"
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
                (filterMatches.length === 0 ||
                  filteredFunctions.length === 0)) ||
              functions.length === 0 ? (
              <NoData />
            ) : (
              functions.map(func => (
                <CreateJobCardTemplate
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
              (filterMatches.length === 0 ||
                isEveryObjectValueEmpty(filteredTemplates))) ||
            templates.length === 0 ? (
              <NoData />
            ) : (
              Object.entries(templates).map(category => {
                const header = generateCategoryHeader(category[0])

                if (category[1].length === 0) return null

                return (
                  <Accordion
                    icon={<Arrow />}
                    iconClassName="expand-icon"
                    key={category}
                  >
                    <h6 className={`category-header ${header.className}`}>
                      <span className="category-header__icon">
                        {header.icon}
                      </span>
                      {header.label}
                    </h6>
                    <div className="create-container__data-list">
                      {category[1].map((template, index) => (
                        <CreateJobCardTemplate
                          func={template}
                          handleSelectGroupFunctions={
                            handleSelectGroupFunctions
                          }
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
  filterMatches: PropTypes.arrayOf(PropTypes.string).isRequired,
  filteredFunctions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filteredTemplates: PropTypes.shape({}).isRequired,
  functions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSearchOnChange: PropTypes.func.isRequired,
  handleSelectGroupFunctions: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  projects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectProject: PropTypes.func.isRequired,
  selectedProject: PropTypes.string.isRequired,
  setFilterMatches: PropTypes.func.isRequired,
  templates: PropTypes.shape({}).isRequired
}

export default CreateJobPageView
