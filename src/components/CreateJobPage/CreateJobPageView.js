import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import CreateJobCardTemplate from '../../elements/CreateJobCardTemplate/CreateJobCardTemplate'
import Accordion from '../../common/Accordion/Accordion'

import { ReactComponent as Back } from '../../images/back-arrow.svg'
import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Filter } from '../../images/filter.svg'
import { ReactComponent as Search } from '../../images/search.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './createJobPage.scss'

const CreateJobPageView = ({
  functions,
  handleSelectFunction,
  match,
  templates
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
      <Accordion icon={<Arrow />} iconClassName="expand-icon" openByDefault>
        <div className="data-wrapper">
          <div className="data-wrapper__header">
            <h5 className="header__title">
              Functions from {match.params.projectName}
            </h5>
          </div>
          <div className="data-wrapper__list">
            {functions.map((func, index) => (
              <CreateJobCardTemplate
                key={func?.metadata?.hash + index}
                func={func}
                handleSelectFunction={handleSelectFunction}
              />
            ))}
          </div>
        </div>
      </Accordion>
      <Accordion icon={<Arrow />} iconClassName="expand-icon" openByDefault>
        <div className="data-wrapper">
          <div className="data-wrapper__header">
            <h5 className="header__title">Functions templates</h5>
          </div>
          <div className="data-wrapper__list">
            {templates?.map((func, index) => (
              <CreateJobCardTemplate
                key={func?.metadata?.hash + index}
                func={func}
                handleSelectFunction={handleSelectFunction}
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
  handleSelectFunction: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default CreateJobPageView
