/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import Prism from 'prismjs'
import { useSelector } from 'react-redux'

import {
  CopyToClipboard,
  FormInput,
  FormOnChange,
  FormTextarea,
  RoundedIcon,
  TextTooltipTemplate,
  Tooltip
} from 'igz-controls/components'
import DetailsInfoItemChip from '../DetailsInfoItemChip/DetailsInfoItemChip'
import Input from '../../common/Input/Input'

import { CHIP_OPTIONS } from 'igz-controls/types'
import { TAG_LATEST } from '../../constants'
import { getValidationRules } from 'igz-controls/utils/validation.util'

import Checkmark from 'igz-controls/images/checkmark2.svg?react'
import Close from 'igz-controls/images/close.svg?react'
import Edit from 'igz-controls/images/edit.svg?react'

const DetailsInfoItem = React.forwardRef(
  (
    {
      chipsClassName = '',
      chipsData = {
        chips: [],
        chipOptions: {},
        delimiter: null,
        isEditEnabled: true
      },
      currentField = '',
      detailsInfoDispatch = () => {},
      editableFieldType = '',
      formState = {},
      handleDiscardChanges = null,
      handleFinishEdit = () => {},
      info = null,
      isDetailsPopUp = false,
      isFieldInEditMode = false,
      item = {},
      onClick = null,
      state = ''
    },
    ref
  ) => {
    const [inputIsValid, setInputIsValid] = useState(true)
    const commonDetailsStore = useSelector(store => store.commonDetailsStore)

    const discardChanges = () => {
      handleDiscardChanges && handleDiscardChanges(currentField)
      item.handleDiscardChanges && item.handleDiscardChanges(formState, commonDetailsStore)
    }

    if (item?.editModeType === 'chips') {
      return (
        <DetailsInfoItemChip
          chipsClassName={chipsClassName}
          chipsData={chipsData}
          currentField={currentField}
          detailsInfoDispatch={detailsInfoDispatch}
          commonDetailsStore={commonDetailsStore}
          editableFieldType={editableFieldType}
          formState={formState}
          handleFinishEdit={handleFinishEdit}
          isEditable={!isDetailsPopUp && item?.editModeEnabled}
          isFieldInEditMode={isFieldInEditMode}
          item={item}
        />
      )
    } else if (item?.editModeEnabled && isFieldInEditMode && !isDetailsPopUp) {
      return (
        <div className="details-item__input-wrapper" ref={ref}>
          {editableFieldType === 'input' && (
            <Input
              focused
              onChange={item.onChange}
              invalid={!inputIsValid}
              setInvalid={value => setInputIsValid(value)}
              value={info}
              validationRules={item.validationRules}
            />
          )}
          {editableFieldType === 'textarea' && (
            <FormTextarea focused maxLength={500} name={item.fieldData.name} />
          )}
          {editableFieldType === 'formInput' && (
            <>
              <FormInput
                async={item.fieldData.async}
                focused
                name={item.fieldData.name}
                validationRules={getValidationRules(
                  item.fieldData.validationRules.name,
                  item.fieldData.validationRules.additionalRules ?? []
                )}
              />
              <FormOnChange
                name={item.fieldData.name}
                handler={value => {
                  formState.form.change(item.fieldData.name, value.length === 0 ? '' : value)
                }}
              />
            </>
          )}
          <RoundedIcon
            disabled={!inputIsValid || formState.invalid || formState.validating}
            onClick={() => handleFinishEdit(item.fieldData.name)}
            tooltipText="Apply"
          >
            <Checkmark />
          </RoundedIcon>

          <RoundedIcon onClick={discardChanges} tooltipText="Discard changes">
            <Close />
          </RoundedIcon>
        </div>
      )
    } else if (item?.copyToClipboard && info) {
      return (
        <div className="details-item__data details-item__data_multiline">
          {(Array.isArray(info) ? info : [info]).map((infoItem, index) => {
            return (
              <CopyToClipboard
                key={index}
                className="details-item__data details-item__copy-to-clipboard"
                textToCopy={infoItem}
                tooltipText="Click to copy"
              >
                {infoItem}
              </CopyToClipboard>
            )
          })}
        </div>
      )
    } else if (currentField === 'usage_example') {
      return (
        <div className="details-item__data details-item__usage-example">
          {info.map((infoItem, index) => (
            <div key={index}>
              <div>
                {infoItem.title}
                <CopyToClipboard
                  className="details-item__btn-copy"
                  textToCopy={infoItem.code}
                  tooltipText="Copy"
                />
              </div>
              <pre>
                <code
                  dangerouslySetInnerHTML={{
                    __html:
                      infoItem.code && Prism.highlight(infoItem.code, Prism.languages.py, 'py')
                  }}
                />
              </pre>
            </div>
          ))}
        </div>
      )
    } else if (currentField === 'sparkUiUrl' && !isDetailsPopUp) {
      return (
        <Tooltip
          className="details-item__data details-item__link"
          template={<TextTooltipTemplate text={info} />}
        >
          <a className="link" href={'https://' + info} target="_blank" rel="noreferrer">
            {info}
          </a>
        </Tooltip>
      )
    } else if (state) {
      return (
        <div className="details-item__data details-item__status">
          {state}
          <i className={`state-${state}-job status-icon`} />
        </div>
      )
    } else if (!isEmpty(info) && item.shouldPopUp && item.handleClick && !isDetailsPopUp) {
      return (
        <div
          className="details-item__data details-item__link link"
          onClick={info && item.handleClick}
        >
          <Tooltip template={<TextTooltipTemplate text={info} />}>{info}</Tooltip>
        </div>
      )
    } else if ((item.link || item.externalLink) && info && !isDetailsPopUp) {
      return (
        <div className="details-item__data details-item__data_multiline">
          {(Array.isArray(info) ? info : [info]).map((infoItem, index) => {
            if (!infoItem) return null

            return item.link ? (
              <Link className="details-item__data details-item__link" to={item.link} key={index}>
                <Tooltip template={<TextTooltipTemplate text={infoItem} />}>{infoItem}</Tooltip>
              </Link>
            ) : (
              <a
                key={index}
                className="details-item__data details-item__link"
                href={
                  !infoItem.startsWith?.('http')
                    ? `${window.location.protocol}//${infoItem}`
                    : infoItem
                }
                target="_blank"
                rel="noreferrer"
              >
                <Tooltip className="link" template={<TextTooltipTemplate text={infoItem} />}>
                  {infoItem}
                </Tooltip>
              </a>
            )
          })}
        </div>
      )
    } else if (
      (typeof info !== 'object' || Array.isArray(info)) &&
      item?.editModeEnabled &&
      !isDetailsPopUp
    ) {
      return (
        <div className="details-item__data">
          {info.length === 0 ? (
            <span
              className="details-item__data-add-placeholder"
              onClick={() => {
                if (editableFieldType.length === 0) {
                  onClick(currentField, item?.editModeType, info)
                }
              }}
            >
              Click to add
            </span>
          ) : (
            <>
              <Tooltip template={<TextTooltipTemplate text={info} />}>{info}</Tooltip>
              {info !== TAG_LATEST && (
                <RoundedIcon
                  className="details-item__data-btn-edit"
                  onClick={() => {
                    if (editableFieldType.length === 0) {
                      onClick(currentField, item?.editModeType, info)
                    }
                  }}
                  tooltipText="Edit"
                >
                  <Edit />
                </RoundedIcon>
              )}
            </>
          )}
        </div>
      )
    } else if (Array.isArray(info)) {
      return (
        <div className="details-item__data details-item__data_multiline">
          {info.map((infoItem, index) => {
            return (
              <div className="details-item__data" key={index}>
                {typeof infoItem === 'string' ? (
                  <Tooltip template={<TextTooltipTemplate text={infoItem} />}>{infoItem}</Tooltip>
                ) : (
                  infoItem
                )}
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div className="details-item__data">
        {typeof info === 'string' ? (
          <Tooltip template={<TextTooltipTemplate text={info} />}>{info}</Tooltip>
        ) : (
          info
        )}
      </div>
    )
  }
)

DetailsInfoItem.propTypes = {
  chipsClassName: PropTypes.string,
  chipsData: PropTypes.shape({
    chips: PropTypes.arrayOf(PropTypes.object),
    chipOptions: CHIP_OPTIONS,
    delimiter: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }),
  currentField: PropTypes.string,
  detailsInfoDispatch: PropTypes.func,
  editableFieldType: PropTypes.string,
  formState: PropTypes.object,
  func: PropTypes.string,
  handleDiscardChanges: PropTypes.func,
  handleFinishEdit: PropTypes.func,
  info: PropTypes.any,
  isDetailsPopUp: PropTypes.bool,
  isFieldInEditMode: PropTypes.bool,
  item: PropTypes.object,
  onClick: PropTypes.func,
  state: PropTypes.string
}

DetailsInfoItem.displayName = 'DetailsInfoItem'

export default DetailsInfoItem
