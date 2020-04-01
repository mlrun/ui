import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { ReactComponent as Back } from '../../images/back-arrow.svg'
import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Filter } from '../../images/filter.svg'
import { ReactComponent as Search } from '../../images/search.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './createJobPage.scss'
import CreateJobCardTemplate from '../../elements/CreateJobCardTemplate/CreateJobCardTemplate'

const CreateJobPageView = ({
  functions,
  match,
  expandList,
  setExpandList,
  handleSelectFunction
}) => (
  <div className="create-container">
    <div className="create-container__header">
      <div className="header-link">
        <Link
          to={`/projects/${match.params.projectName}/jobs`}
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
          <Search />
        </button>
      </div>
    </div>
    <div className="create-container__data">
      <div className="data-wrapper">
        <div className="data-wrapper__header">
          <Arrow
            onClick={setExpandList}
            className={`header__icon${expandList && '-expanded'}`}
          />
          <h5 className="header__title">
            Functions from {match.params.projectName}
          </h5>
        </div>
        {expandList && (
          <div className="data-wrapper__list">
            {functions.map((func, index) => (
              <CreateJobCardTemplate
                key={func?.metadata?.hash + index}
                status={func?.status?.state}
                name={func?.metadata?.name}
                func={func}
                handleSelectFunction={handleSelectFunction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)

CreateJobPageView.propTypes = {
  expandList: PropTypes.bool.isRequired,
  functions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  match: PropTypes.shape({}).isRequired,
  setExpandList: PropTypes.func.isRequired
}

export default CreateJobPageView
