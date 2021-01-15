import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import ChipCell from '../../common/ChipCell/ChipCell'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { copyToClipboard } from '../../utils/copyToClipboard'
import Input from '../../common/Input/Input'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const DetailsInfoItem = React.forwardRef(
  (
    {
      chipsClassName,
      chipsData,
      currentField,
      currentFieldType,
      editableFieldType,
      func,
      handleFinishEdit,
      info,
      isEditModeEnabled,
      isFieldInEditMode,
      link,
      match,
      onChange,
      onClick,
      state,
      target_path
    },
    ref
  ) => {
    if (isEditModeEnabled && isFieldInEditMode) {
      if (editableFieldType === 'input') {
        return (
          <div className="details-item__input-wrapper" ref={ref}>
            <Input onChange={onChange} value={info} type="text" focused />
            <Checkmark
              className="details-item__input-btn"
              onClick={event => handleFinishEdit(event, currentField)}
            />
          </div>
        )
      } else if (editableFieldType === 'chips') {
        return (
          <div className="details-item__data">
            <ChipCell
              elements={chipsData.chips}
              className={`details-item__${chipsClassName}`}
              delimiter={chipsData.delimiter}
              isEditMode={true}
              editChip={chips => {
                onChange(chips, currentField)
              }}
            />
            <Checkmark
              className="details-item__input-btn"
              onClick={event => handleFinishEdit(event, currentField)}
            />
          </div>
        )
      }
    } else if (chipsData?.chips?.length) {
      return (
        <div className="details-item__data">
          <ChipCell
            elements={chipsData.chips}
            className={`details-item__${chipsClassName}`}
            delimiter={chipsData.delimiter}
            onClick={() =>
              onClick(currentField, currentFieldType, chipsData.chips)
            }
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
            to={`/projects/${match.params.projectName}/functions/${funcStr}/overview`}
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
    } else if (typeof info !== 'object') {
      return (
        <div
          className="details-item__data"
          onClick={() => {
            if (editableFieldType.length === 0 && isEditModeEnabled) {
              onClick(currentField, currentFieldType, info)
            }
          }}
        >
          {info}
        </div>
      )
    }
  }
)

DetailsInfoItem.defaultProps = {
  chipsClassName: '',
  chipsData: {
    chips: [],
    delimiter: null
  },
  currentField: '',
  currentFieldType: '',
  editableFieldType: null,
  func: '',
  handleFinishEdit: () => {},
  info: null,
  isEditModeEnabled: false,
  isFieldInEditMode: false,
  link: '',
  match: {},
  onChange: null,
  onClick: null,
  state: '',
  target_path: {}
}

DetailsInfoItem.propTypes = {
  chipsClassName: PropTypes.string,
  chipsData: PropTypes.shape({
    chips: PropTypes.arrayOf(PropTypes.string),
    delimiter: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }),
  currentField: PropTypes.string,
  currentFieldType: PropTypes.string.isRequired,
  editableFieldType: PropTypes.string,
  func: PropTypes.string,
  handleFinishEdit: PropTypes.func,
  info: PropTypes.any,
  isEditModeEnabled: PropTypes.bool.isRequired,
  isFieldInEditMode: PropTypes.bool,
  link: PropTypes.string,
  match: PropTypes.shape({}),
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  state: PropTypes.string,
  target_path: PropTypes.shape({})
}

export default DetailsInfoItem
