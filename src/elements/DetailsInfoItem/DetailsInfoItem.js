import React from 'react'
import PropTypes from 'prop-types'
import ChipCell from '../ChipCell/ChipCell'
import { isEmpty } from 'lodash'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import { Link } from 'react-router-dom'

const DetailsInfoItem = ({
  chips,
  chipsClassName,
  func,
  info,
  match,
  state,
  target_path
}) => {
  if (chips?.length) {
    return (
      <div className="details-item__data">
        <ChipCell
          elements={chips}
          className={`details-item__${chipsClassName}`}
        />
      </div>
    )
  } else if (!isEmpty(target_path)) {
    return (
      <div className="details-item__data">
        <span>{`${target_path.schema ? `${target_path.schema}://` : ''}${
          target_path.path
        }`}</span>
      </div>
    )
  } else if (state) {
    return (
      <div className="details-item__data details-item__status">
        {state}
        <i className={`status-icon ${state}`} />
      </div>
    )
  } else if (!isEmpty(func)) {
    return (
      <Tooltip
        className="details-item__data details-item__link"
        template={<TextTooltipTemplate text={func.hash} />}
      >
        <Link
          to={`/projects/${match.params.projectName}/functions/${func.hash}/info`}
        >
          {func.name}
        </Link>
      </Tooltip>
    )
  } else {
    return <div className="details-item__data">{info}</div>
  }
}

DetailsInfoItem.propTypes = {
  chips: PropTypes.array,
  info: PropTypes.any,
  chipsClassName: PropTypes.string,
  target_path: PropTypes.shape({})
}

export default DetailsInfoItem
