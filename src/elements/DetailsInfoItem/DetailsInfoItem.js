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

import ChipCell from '../../common/ChipCell/ChipCell'
import CopyToClipboard from '../../common/CopyToClipboard/CopyToClipboard'
import Input from '../../common/Input/Input'
import { Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'
import { FormInput, FormTextarea } from 'igz-controls/components'
import DetailsInfoItemChip from '../DetailsInfoItemChip/DetailsInfoItemChip'
import FormOnChange from '../../common/FormOnChange/FormOnChange'

import { CHIP_OPTIONS } from '../../types'
import { getValidationRules } from 'igz-controls/utils/validation.util'

import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark2.svg'
import { ReactComponent as Close } from 'igz-controls/images/close.svg'
import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'

const DetailsInfoItem = React.forwardRef(
  (
    {
      changesData,
      chipsClassName,
      chipsData,
      currentField,
      detailsInfoDispatch,
      detailsInfoState,
      editableFieldType,
      formState,
      func,
      handleDiscardChanges,
      handleFinishEdit,
      info,
      isFieldInEditMode,
      item,
      onClick,
      params,
      setChangesData,
      state
    },
    ref
  ) => {
    const [inputIsValid, setInputIsValid] = useState(true)
    const detailsStore = useSelector(store => store.detailsStore)

    const discardChanges = () => {
      handleDiscardChanges(currentField)
      item.handleDiscardChanges && item.handleDiscardChanges(formState, detailsStore)
    }

    if (item?.editModeEnabled && item?.editModeType === 'chips') {
      return (
        <DetailsInfoItemChip
          changesData={changesData}
          chipsClassName={chipsClassName}
          chipsData={chipsData}
          currentField={currentField}
          detailsInfoDispatch={detailsInfoDispatch}
          detailsInfoState={detailsInfoState}
          editableFieldType={editableFieldType}
          handleFinishEdit={handleFinishEdit}
          isFieldInEditMode={isFieldInEditMode}
          item={item}
          setChangesData={setChangesData}
          formState={formState}
        />
      )
    } else if (item?.editModeEnabled && isFieldInEditMode) {
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
    } else if (chipsData?.chips?.length) {
      return (
        <div className="details-item__data">
          <ChipCell
            chipOptions={chipsData.chipOptions}
            className={`details-item__${chipsClassName}`}
            delimiter={chipsData.delimiter}
            elements={chipsData.chips}
            visibleChipsMaxLength="all"
          />
        </div>
      )
    } else if (item?.copyToClipboard && info) {
      return (
        <CopyToClipboard
          className="details-item__data details-item__copy-to-clipboard"
          textToCopy={info}
          tooltipText="Click to copy"
        >
          {info}
        </CopyToClipboard>
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
    } else if (currentField === 'sparkUiUrl') {
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
    } else if (!isEmpty(func)) {
      const [functionProject, functionNameWithHash] = func.split('/')

      return (
        <Tooltip
          className="details-item__data details-item__link"
          template={<TextTooltipTemplate text={func} />}
        >
          <Link
            className="link"
            to={`/projects/${functionProject}/functions/${functionNameWithHash}/overview`}
          >
            {func}
          </Link>
        </Tooltip>
      )
    } else if ((item.link || item.externalLink) && info) {
      return item.link ? (
        <Link className="link details-item__data details-item__link" to={item.link}>
          <Tooltip template={<TextTooltipTemplate text={info} />}>{info}</Tooltip>
        </Link>
      ) : (
        <a className="details-item__data details-item__link" href={info} target="_blank" rel="noreferrer">
          <Tooltip
            className="link"
            template={<TextTooltipTemplate text={info} />}
          >
            {info}
          </Tooltip>
        </a>
      )
    } else if ((typeof info !== 'object' || Array.isArray(info)) && item?.editModeEnabled) {
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

DetailsInfoItem.defaultProps = {
  chipsClassName: '',
  chipsData: {
    chips: [],
    chipOptions: {},
    delimiter: null
  },
  currentField: '',
  detailsInfoDispatch: () => {},
  detailsInfoState: {},
  editableFieldType: null,
  func: '',
  handleFinishEdit: () => {},
  info: null,
  isFieldInEditMode: false,
  item: {},
  onClick: null,
  params: {},
  setChangesData: () => {},
  state: ''
}

DetailsInfoItem.propTypes = {
  changesData: PropTypes.object,
  chipsClassName: PropTypes.string,
  chipsData: PropTypes.shape({
    chips: PropTypes.arrayOf(PropTypes.string),
    chipOptions: CHIP_OPTIONS,
    delimiter: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }),
  currentField: PropTypes.string,
  detailsInfoDispatch: PropTypes.func,
  detailsInfoState: PropTypes.object,
  editableFieldType: PropTypes.string,
  formState: PropTypes.shape({}),
  func: PropTypes.string,
  handleFinishEdit: PropTypes.func,
  info: PropTypes.any,
  isFieldInEditMode: PropTypes.bool,
  item: PropTypes.shape({}),
  onClick: PropTypes.func,
  params: PropTypes.shape({}),
  setChangesData: PropTypes.func,
  state: PropTypes.string
}

export default DetailsInfoItem
