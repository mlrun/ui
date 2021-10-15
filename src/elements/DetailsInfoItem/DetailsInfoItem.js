import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import Prism from 'prismjs'

import ChipCell from '../../common/ChipCell/ChipCell'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { copyToClipboard } from '../../utils/copyToClipboard'
import Input from '../../common/Input/Input'
import { CHIP_OPTIONS } from '../../types'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'
import { ReactComponent as Copy } from '../../images/ic_copy-to-clipboard.svg'

const DetailsInfoItem = React.forwardRef(
  (
    {
      chipOptions,
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
            <Tooltip template={<TextTooltipTemplate text="Apply" />}>
              <Checkmark
                className="details-item__input-btn"
                onClick={() => handleFinishEdit(currentField)}
              />
            </Tooltip>
          </div>
        )
      } else if (editableFieldType === 'chips') {
        return (
          <div className="details-item__data details-item__data-chips">
            <ChipCell
              addChip={(chip, chips) => item.onAdd(chip, chips, currentField)}
              chipOptions={chipOptions}
              className={`details-item__${chipsClassName}`}
              delimiter={chipsData.delimiter}
              editChip={chips => {
                item.onChange(chips, currentField)
              }}
              elements={chipsData.chips}
              isEditMode={true}
              removeChip={chips => item.handleDelete(chips, currentField)}
            />
            <Tooltip template={<TextTooltipTemplate text="Apply" />}>
              <Checkmark
                className="details-item__input-btn"
                onClick={() => handleFinishEdit(currentField)}
              />
            </Tooltip>
          </div>
        )
      }
    } else if (chipsData?.chips?.length) {
      return (
        <div className="details-item__data">
          <ChipCell
            chipOptions={chipOptions}
            className={`details-item__${chipsClassName}`}
            delimiter={chipsData.delimiter}
            elements={chipsData.chips}
            onClick={() =>
              onClick(currentField, item?.editModeType, chipsData.chips)
            }
            visibleChipsMaxLength="all"
          />
        </div>
      )
    } else if (!isEmpty(target_path)) {
      const path = `${target_path}${target_path.modelFile ?? ''}`
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
    } else if (currentField === 'usage_example') {
      return (
        <div className="details-item__data details-item__usage-example">
          {info.map((item, index) => (
            <div key={index}>
              <p>
                {item.title}
                <button
                  className="details-item__btn-copy"
                  onClick={() => copyToClipboard(item.code)}
                >
                  <Tooltip template={<TextTooltipTemplate text="copy" />}>
                    <Copy />
                  </Tooltip>
                </button>
              </p>
              <pre>
                <code
                  dangerouslySetInnerHTML={{
                    __html:
                      item.code &&
                      Prism.highlight(item.code, Prism.languages.py, 'py')
                  }}
                />
              </pre>
            </div>
          ))}
        </div>
      )
    } else if (state) {
      return (
        <div className="details-item__data details-item__status">
          {state}
          <i className={`state-${state}-job status-icon`} />
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
              {info.length === 0 ? (
                <span className="details-item__data-edit-placeholder">
                  Click to edit
                </span>
              ) : (
                info
              )}
            </div>
          </Tooltip>
        )
      }

      return <div className="details-item__data">{info}</div>
    }
  }
)

DetailsInfoItem.defaultProps = {
  chipOptions: {},
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
  target_path: ''
}

DetailsInfoItem.propTypes = {
  chipOptions: CHIP_OPTIONS,
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
  target_path: PropTypes.string
}

export default DetailsInfoItem
