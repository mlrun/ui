import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Loader from '../../common/Loader/Loader'
import ChipCell from '../../elements/ChipCell/ChipCell'
import JobsItemInternal from '../JobsItemInternal/JobsItemInternal'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'

import { cutChips } from '../../utils/cutChips'
import { formatDatetime, truncateUid } from '../../utils'

const JobsTableView = ({
  hideChips,
  loading,
  job,
  jobs,
  handleShowElements,
  handleSelectJob,
  match,
  handleHoverOnRowActions,
  handleMouseLeaveFromRowActions,
  convertToYaml,
  ...props
}) => {
  return (
    <div className="jobs__table" onClick={hideChips}>
      {loading && <Loader />}
      <div className={job.uid && 'jobs__table__item_opened'}>
        <div className="jobs__table__content">
          <div className="jobs__table_head">
            <div className="jobs__table_head_item">Name</div>
            <div className="jobs__table_head_item jobs__table_smallCell">
              UID
            </div>
            <div className="jobs__table_head_item jobs__table_smallCell">
              Started at
            </div>
            <div className="jobs__table_head_item jobs__table_smallCell">
              Status
            </div>
            <div className="jobs__table_head_item">Parameters</div>
            <div className="jobs__table_head_item">Results</div>
          </div>
          <div className="jobs__table_body">
            {jobs.map((item, i) => {
              item.showedParameters = cutChips(
                item.parameters,
                2,
                handleShowElements
              )
              item.showedResults = cutChips(
                item.resultsChips,
                2,
                handleShowElements
              )
              return (
                <div
                  key={`${item}${i}`}
                  className="jobs__table_body__row parent_row"
                  onMouseEnter={handleHoverOnRowActions}
                  onMouseLeave={handleMouseLeaveFromRowActions}
                >
                  <div className="jobs__table_body__row__cell">
                    <Link
                      to={`/jobs/${item.uid}${
                        match.params.tab ? `/${match.params.tab}` : '/info'
                      }`}
                      onClick={() => handleSelectJob(item)}
                    >
                      {item.name}
                      <span>
                        {job.uid && `...${item.uid.slice(item.uid.length - 7)}`}
                      </span>
                    </Link>
                  </div>
                  <div className="jobs__table_body__row__cell jobs__table_smallCell">
                    <span title={item.uid}>{truncateUid(item.uid)}</span>
                  </div>
                  <div className="jobs__table_body__row__cell jobs__table_smallCell">
                    {formatDatetime(item.startTime)}
                  </div>
                  <div className="jobs__table_body__row__cell jobs__table_smallCell">
                    <i
                      className={item.state}
                      title={`${item.state[0].toUpperCase()}${item.state.slice(
                        1
                      )}`}
                    />
                  </div>
                  <div className="jobs__table_body__chips_cell jobs__table_body__row__cell">
                    <ChipCell
                      elements={item.showedParameters}
                      className="jobs__table_body__parameters"
                    />
                  </div>
                  <div className="jobs__table_body__chips_cell jobs__table_body__row__cell">
                    <ChipCell
                      className="jobs__table_body__results"
                      elements={item.showedResults}
                    />
                  </div>
                  <div className="jobs__table_body__row__cell row__actions">
                    <ActionsMenu convertToYaml={convertToYaml} item={item} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {job.uid && (
        <JobsItemInternal
          job={job}
          handleShowElements={handleShowElements}
          match={match}
          {...props}
        />
      )}
    </div>
  )
}

JobsTableView.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleShowElements: PropTypes.func.isRequired,
  job: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  hideChips: PropTypes.func.isRequired,
  handleSelectJob: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired
}

export default JobsTableView
