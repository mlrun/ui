import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import ChipCell from '../../common/ChipCell/ChipCell'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { copyToClipboard } from '../../utils/copyToClipboard'

const DetailsInfoItem = ({
  chips,
  chipsClassName,
  func,
  info,
  link,
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
      <Tooltip
        className="details-item__data details-item__path"
        template={<TextTooltipTemplate text="Click to copy" />}
      >
        <span onClick={() => copyToClipboard(target_path.path)}>{`${
          target_path.schema ? `${target_path.schema}://` : ''
        }${target_path.path}`}</span>
      </Tooltip>
    )
  } else if (state) {
    return (
      <div className="details-item__data details-item__status">
        {state}
        <i className={`status-icon ${state}`} />
      </div>
    )
  } else if (!isEmpty(func)) {
    const funcStr = func.split('/').pop()
    return (
      <Tooltip
        className="details-item__data details-item__link"
        template={<TextTooltipTemplate text={funcStr} />}
      >
        <Link
          to={`/projects/${match.params.projectName}/functions/${funcStr}/info`}
        >
          {funcStr}
        </Link>
      </Tooltip>
    )
  } else if (link) {
    return (
      <Link className="details-item__data details-item__link" to={link}>
        {info}
      </Link>
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
  link: '',
  match: {},
  state: '',
  target_path: {}
}

DetailsInfoItem.propTypes = {
  chips: PropTypes.array,
  chipsClassName: PropTypes.string,
  func: PropTypes.string,
  info: PropTypes.any,
  link: PropTypes.string,
  match: PropTypes.shape({}),
  state: PropTypes.string,
  target_path: PropTypes.shape({})
}

export default DetailsInfoItem
