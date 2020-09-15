import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import CreateJobCardTemplate from '../../elements/CreateJobCardTemplate/CreateJobCardTemplate'
import Accordion from '../../common/Accordion/Accordion'
import Select from '../../common/Select/Select'
import Search from '../../common/Search/Search'

import { ReactComponent as Back } from '../../images/back-arrow.svg'
import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Filter } from '../../images/filter.svg'
import { ReactComponent as SearchIcon } from '../../images/search.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './createJobPage.scss'

const CreateJobPageView = ({
  functions,
  handleSelectGroupFunctions,
  match,
  projects,
  selectedProject,
  setFilterByName,
  setSelectedProject,
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
        onChange={setFilterByName}
        placeholder="Search by text, tags and keywords..."
      />
      <Accordion icon={<Arrow />} iconClassName="expand-icon" openByDefault>
        <div className="data-wrapper">
          <div className="data-header data-header_with-select">
            <h5 className="data-header__title">
              <span>Select functions from</span>
              <Arrow />
              <Select
                className="data-header__select"
                onClick={project => setSelectedProject(project)}
                options={projects}
                selectedId={selectedProject}
              />
            </h5>
          </div>
          <div className="data-list">
            {functions.map((func, index) => (
              <CreateJobCardTemplate
                func={func}
                handleSelectGroupFunctions={handleSelectGroupFunctions}
                key={func.name}
              />
            ))}
          </div>
        </div>
      </Accordion>
      <Accordion icon={<Arrow />} iconClassName="expand-icon" openByDefault>
        <div className="data-wrapper">
          <div className="data-header">
            <h5 className="data-header__title">Functions templates</h5>
          </div>
          <div className="data-list">
            {templates?.map((func, index) => (
              <CreateJobCardTemplate
                func={func}
                handleSelectGroupFunctions={handleSelectGroupFunctions}
                key={func?.metadata.hash + index}
              />
            ))}
          </div>
        </div>
      </Accordion>
    </div>
  </div>
)

CreateJobPageView.propTypes = {
  functions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSelectGroupFunctions: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default CreateJobPageView
