import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import ChipCell from '../ChipCell/ChipCell'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

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
        template={<TextTooltipTemplate text={func} />}
      >
        <Link
          to={`/projects/${match.params.projectName}/functions${func}/info`}
        >
          {func}
        </Link>
      </Tooltip>
    )
  } else {
    return <div className="details-item__data">{info}</div>
  }
}

DetailsInfoItem.defaultProps = {
  chips: [],
  chipsClassName: '',
  func: '',
  info: null,
  match: {},
  state: '',
  target_path: {}
}

DetailsInfoItem.propTypes = {
  chips: PropTypes.array,
  chipsClassName: PropTypes.string,
  func: PropTypes.string,
  info: PropTypes.any,
  match: PropTypes.shape({}),
  state: PropTypes.string,
  target_path: PropTypes.shape({})
}

export default DetailsInfoItem
