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
      editableFieldType,
      func,
      handleFinishEdit,
      info,
      isFieldInEditMode,
      item,
      link,
      match,
      onClick,
      state,
      target_path
    },
    ref
  ) => {
    if (item?.editModeEnabled && isFieldInEditMode) {
      if (editableFieldType === 'input') {
        return (
          <div className="details-item__input-wrapper" ref={ref}>
            <Input onChange={item.onChange} value={info} type="text" focused />
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
              addChip={(chip, chips) => item.onAdd(chip, chips, currentField)}
              removeChip={chips => item.handleDelete(chips, currentField)}
              elements={chipsData.chips}
              className={`details-item__${chipsClassName}`}
              delimiter={chipsData.delimiter}
              isEditMode={true}
              editChip={chips => {
                item.onChange(chips, currentField)
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
              onClick(currentField, item?.editModeType, chipsData.chips)
            }
          />
        </div>
      )
    } else if (!isEmpty(target_path)) {
      const path = `${target_path.schema ? `${target_path.schema}://` : ''}${
        target_path.path
      }${target_path.modelFile ? target_path.modelFile : ''}`
      return (
        <Tooltip
          className="details-item__data details-item__path"
          template={<TextTooltipTemplate text="Click to copy" />}
        >
          <span onClick={() => copyToClipboard(path)}>{path}</span>
        </Tooltip>
      )
    } else if (currentField === 'target_uri') {
      return (
        <Tooltip
          className="details-item__data details-item__uri"
          template={<TextTooltipTemplate text="Click to copy" />}
        >
          <span onClick={() => copyToClipboard(info)}>{info}</span>
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
            className="link"
            to={`/projects/${match.params.projectName}/functions/${funcStr}/overview`}
          >
            {funcStr}
          </Link>
        </Tooltip>
      )
    } else if (link) {
      return (
        <Link className="link details-item__data details-item__link" to={link}>
          {info}
        </Link>
      )
    } else if (typeof info !== 'object' || Array.isArray(info)) {
      if (item?.editModeEnabled) {
        return (
          <Tooltip template={<TextTooltipTemplate text="Click to edit" />}>
            <div
              className="details-item__data"
              onClick={() => {
                if (editableFieldType.length === 0) {
                  onClick(currentField, item?.editModeType, info)
                }
              }}
            >
              {info}
            </div>
          </Tooltip>
        )
      }

      return <div className="details-item__data">{info}</div>
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
  editableFieldType: null,
  func: '',
  handleFinishEdit: () => {},
  info: null,
  isFieldInEditMode: false,
  item: {},
  link: '',
  match: {},
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
  editableFieldType: PropTypes.string,
  func: PropTypes.string,
  handleFinishEdit: PropTypes.func,
  info: PropTypes.any,
  isFieldInEditMode: PropTypes.bool,
  item: PropTypes.shape({}),
  link: PropTypes.string,
  match: PropTypes.shape({}),
  onClick: PropTypes.func,
  state: PropTypes.string,
  target_path: PropTypes.shape({})
}

export default DetailsInfoItem
