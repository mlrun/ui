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
import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { FieldArray } from 'react-final-form-arrays'
import classnames from 'classnames'

import NoData from '../../common/NoData/NoData'
import {
  ConfirmDialog,
  Tooltip,
  TextTooltipTemplate,
  RoundedIcon,
  FormInput,
  FormOnChange
} from 'igz-controls/components'

import { headers } from './detailsRequestedFeatures.utils'
import { DANGER_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { getValidationRules } from 'igz-controls/utils/validation.util'

import Checkmark from 'igz-controls/images/checkmark.svg?react'
import Close from 'igz-controls/images/close.svg?react'
import EditIcon from 'igz-controls/images/edit.svg?react'
import AddIcon from 'igz-controls/images/add.svg?react'
import Delete from 'igz-controls/images/delete.svg?react'
import LabelColumn from 'igz-controls/images/ic_target-with-dart.svg?react'

import './detailsRequestedFeatures.scss'

const DetailsRequestedFeaturesView = ({
  confirmDialogData,
  editableItemIndex = null,
  formState,
  handleDelete,
  handleDiscardChanges,
  handleItemClick,
  isDetailsPopUp = false,
  onFinishEdit,
  selectedItem,
  setConfirmDialogData
}) => {
  const params = useParams()

  return formState.values?.features?.length === 0 ? (
    <NoData />
  ) : (
    <div className="item-requested-features">
      <div className="item-requested-features__table">
        <div className="item-requested-features__table-header">
          {headers.map(header => (
            <div
              className={`item-requested-features__table-cell header_${header.id}`}
              key={header.id}
            >
              {header.label}
            </div>
          ))}
        </div>
        <div className="item-requested-features__table-body">
          <FieldArray name="features">
            {({ fields }) => {
              return (
                <>
                  {fields.map((featureData, index) => {
                    const { project, featureSet, tag, feature, alias, originalTemplate } =
                      fields.value[index]

                    return (
                      <div className="item-requested-features__table-row" key={originalTemplate}>
                        <div className="item-requested-features__table-cel cell_icon">
                          {selectedItem.label_feature === originalTemplate && (
                            <Tooltip
                              className="icon-wrapper"
                              template={<TextTooltipTemplate text="Label column" />}
                            >
                              <LabelColumn />
                            </Tooltip>
                          )}
                        </div>
                        <div className="item-requested-features__table-cell cell_project-name">
                          <Tooltip
                            template={<TextTooltipTemplate text={project || params.projectName} />}
                          >
                            {project || params.projectName}
                          </Tooltip>
                        </div>
                        <div className="item-requested-features__table-cell">
                          <Tooltip
                            className="cell_feature-set"
                            template={<TextTooltipTemplate text={featureSet} />}
                          >
                            {featureSet}
                          </Tooltip>
                          {tag && (
                            <Tooltip template={<TextTooltipTemplate text={featureSet} />}>
                              <span className="cell_tag">: {tag}</span>
                            </Tooltip>
                          )}
                        </div>
                        <div className="item-requested-features__table-cell cell_feature">
                          <Tooltip template={<TextTooltipTemplate text={feature} />}>
                            {feature}
                          </Tooltip>
                        </div>
                        {editableItemIndex === index && (
                          <>
                            <div className="item-requested-features__table-cell cell_alias">
                              <div className="cell_alias__input-wrapper">
                                <FormInput
                                  focused
                                  name={`${featureData}.alias`}
                                  validationRules={getValidationRules('feature.vector.alias')}
                                />
                                <FormOnChange
                                  handler={value => {
                                    formState.form.change(
                                      `${featureData}.alias`,
                                      value.length === 0 ? '' : value
                                    )
                                  }}
                                  name={`${featureData}.alias`}
                                />
                              </div>
                            </div>
                            <div className="cell_actions cell_actions-visible">
                              <RoundedIcon
                                disabled={formState.invalid || formState.validating}
                                onClick={onFinishEdit}
                                tooltipText="Apply"
                              >
                                <Checkmark className="details-item__apply-btn" />
                              </RoundedIcon>

                              <RoundedIcon
                                onClick={() => handleDiscardChanges(index)}
                                tooltipText="Discard changes"
                              >
                                <Close />
                              </RoundedIcon>
                            </div>
                          </>
                        )}
                        {editableItemIndex !== index && (
                          <>
                            <div className="item-requested-features__table-cell cell_alias">
                              {alias && (
                                <div className="cell_alias__input-wrapper">
                                  <Tooltip template={<TextTooltipTemplate text={alias} />}>
                                    {alias}
                                  </Tooltip>
                                  <RoundedIcon
                                    className={classnames(
                                      (!alias || isDetailsPopUp) && 'visibility-hidden'
                                    )}
                                    onClick={() =>
                                      handleItemClick('features', 'input', index, originalTemplate)
                                    }
                                    tooltipText="Click to edit"
                                  >
                                    <EditIcon />
                                  </RoundedIcon>
                                </div>
                              )}
                            </div>
                            <div className="cell_actions">
                              <RoundedIcon
                                className={classnames(
                                  (alias || isDetailsPopUp) && 'visibility-hidden'
                                )}
                                onClick={() =>
                                  handleItemClick('features', 'input', index, originalTemplate)
                                }
                                tooltipText="Click to add an alias"
                              >
                                <AddIcon />
                              </RoundedIcon>

                              <RoundedIcon
                                className={classnames(isDetailsPopUp && 'visibility-hidden')}
                                onClick={() => setConfirmDialogData({ index, feature })}
                                tooltipText="Delete"
                              >
                                <Delete />
                              </RoundedIcon>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </>
              )
            }}
          </FieldArray>
        </div>
      </div>
      {confirmDialogData.feature && (
        <ConfirmDialog
          cancelButton={{
            handler: () => {
              setConfirmDialogData({
                index: null,
                feature: null
              })
            },
            label: 'Cancel',
            variant: TERTIARY_BUTTON
          }}
          closePopUp={() => {
            setConfirmDialogData({ index: null, feature: null })
          }}
          confirmButton={{
            handler: () => handleDelete(confirmDialogData.index),
            label: 'Delete',
            variant: DANGER_BUTTON
          }}
          header="Delete feature?"
          isOpen={Boolean(confirmDialogData.feature)}
          message={`You try to delete feature "${confirmDialogData.feature}" from vector "${params.name}". The feature could be added back later.`}
        />
      )}
    </div>
  )
}

DetailsRequestedFeaturesView.propTypes = {
  confirmDialogData: PropTypes.object.isRequired,
  editableItemIndex: PropTypes.number,
  formState: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleDiscardChanges: PropTypes.func.isRequired,
  handleItemClick: PropTypes.func.isRequired,
  isDetailsPopUp: PropTypes.bool,
  onFinishEdit: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
  setConfirmDialogData: PropTypes.func.isRequired
}

export default DetailsRequestedFeaturesView
