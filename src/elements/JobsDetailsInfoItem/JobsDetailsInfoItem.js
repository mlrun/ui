import React from 'react'
import PropTypes from 'prop-types'

import ChipCell from '../ChipCell/ChipCell'
import { Link } from 'react-router-dom'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

const JobsDetailsInfoItem = ({
  chips,
  chipsClassName,
  header,
  info,
  handleShowElements,
  state,
  func,
  match
}) => {
  return (
    <li className="table__item_details_item">
      <div className="table__item_details_item_header">{header}</div>
      {state && (
        <div className="table__item_details_item_data">
          {`${state[0].toUpperCase()}${state.slice(1)}`}
          <i className={state} />
        </div>
      )}
      {func?.name && (
        <Tooltip
          className="table__item_details_item_data link"
          template={<TextTooltipTemplate text={func.hash} />}
        >
          <Link
            to={`/projects/${match.params.projectName}/functions/${func.hash}/info`}
          >
            {func.name}
          </Link>
        </Tooltip>
      )}
      {chips && (
        <div className="table__item_details_item_data">
          {
            <ChipCell
              elements={chips}
              className={`table__item_details_item_data__${chipsClassName}`}
              handleShowElements={handleShowElements}
            />
          }
        </div>
      )}
      {info && <div className="table__item_details_item_data">{info}</div>}
    </li>
  )
}
JobsDetailsInfoItem.defaultProps = {
  chipsClassName: ''
}

JobsDetailsInfoItem.propTypes = {
  chips: PropTypes.arrayOf(PropTypes.string),
  chipsClassName: PropTypes.string,
  header: PropTypes.string.isRequired,
  handleShowElements: PropTypes.func
}

export default JobsDetailsInfoItem
