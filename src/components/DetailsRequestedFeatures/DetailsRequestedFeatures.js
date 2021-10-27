import React, { useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, isNil } from 'lodash'

import { parseFeatureTemplate } from '../../utils/parseFeatureTemplate'

import Input from '../../common/Input/Input'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { headers } from './detailsRequestedFeatures.utils.js'
import { handleFinishEdit } from '../Details/details.util.js'

import {
  detailsRequestedFeaturesActions,
  detailsRequestedFeaturesReducer,
  initialState
} from './detailsRequestedFeaturesReducer.js'
import { DANGER_BUTTON, TERTIARY_BUTTON } from '../../constants'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

import './detailsRequestedFeatures.scss'

const DetailsRequestedFeatures = ({
  changes,
  handleEditInput,
  match,
  selectedItem,
  setChanges,
  setChangesData,
  setChangesCounter
}) => {
  const [
    detailsRequestedFeaturesState,
    detailsRequestedFeaturesDispatch
  ] = useReducer(detailsRequestedFeaturesReducer, initialState)
  const [currentData, setCurrentData] = useState([])
  const [confirmDialogData, setConfirmDialogData] = useState({
    index: null,
    feature: null
  })
  const [editableItemIndex, setEditableItemIndex] = useState(null)
  const [labelFetureIsEditable, setLabelFeatureIsEditable] = useState(false)

  useEffect(() => {
    return () => {
      setEditableItemIndex(null)
      setLabelFeatureIsEditable(false)
    }
  }, [selectedItem])

  useEffect(() => {
    setCurrentData(
      !isNil(changes.data.features)
        ? changes.data.features.currentFieldValue
        : selectedItem.specFeatures
    )

    return () => {
      setConfirmDialogData({ index: null, feature: null })
      setCurrentData([])
      detailsRequestedFeaturesDispatch({
        type: detailsRequestedFeaturesActions.RESET_EDIT_MODE
      })
    }
  }, [changes.data.features, selectedItem.specFeatures])

  useEffect(() => {
    if (
      labelFetureIsEditable &&
      !isNil(editableItemIndex) &&
      !isNil(changes.data.label_feature) &&
      !isNil(changes.data.features) &&
      changes.data.features.currentFieldValue[editableItemIndex] !==
        changes.data.label_feature.currentFieldValue
    ) {
      handleEditInput(
        changes.data.features.currentFieldValue[editableItemIndex],
        'label_feature'
      )
    }
  }, [
    changes.data.features,
    changes.data.label_feature,
    editableItemIndex,
    handleEditInput,
    labelFetureIsEditable
  ])

  const handleAliasChange = (index, alias) => {
    const generatedFeaturesArray = generateChangedArray(index, alias)

    handleEditInput(generatedFeaturesArray, 'features')
  }

  const handleItemClick = (field, fieldType, info, index, featureTemplate) => {
    if (isNil(editableItemIndex)) {
      setEditableItemIndex(index)
      detailsRequestedFeaturesDispatch({
        type: detailsRequestedFeaturesActions.SET_EDIT_MODE,
        payload: {
          field,
          fieldType
        }
      })

      const changesData = cloneDeep(changes.data)

      if (
        isNil(changesData.label_feature) &&
        featureTemplate === selectedItem.label_feature
      ) {
        setLabelFeatureIsEditable(true)

        changesData.label_feature = {
          initialFieldValue: selectedItem.label_feature,
          currentFieldValue: selectedItem.label_feature,
          previousFieldValue: selectedItem.label_feature
        }
      } else if (
        !isNil(changesData.label_feature) &&
        featureTemplate === changesData.label_feature.currentFieldValue
      ) {
        setLabelFeatureIsEditable(true)

        changesData.label_feature = {
          ...changesData.label_feature,
          currentFieldValue: changesData.label_feature.previousFieldValue
        }
      }

      if (isNil(changesData[field]?.initialFieldValue)) {
        changesData[field] = {
          initialFieldValue: selectedItem.specFeatures,
          currentFieldValue: selectedItem.specFeatures,
          previousFieldValue: selectedItem.specFeatures
        }

        setChangesData(changesData)
      } else {
        changesData[field] = {
          ...changesData[field],
          currentFieldValue: changesData[field].previousFieldValue
        }

        setChangesData(changesData)
      }
    }
  }

  const onFinishEdit = fields => {
    setEditableItemIndex(null)
    setLabelFeatureIsEditable(false)

    handleFinishEdit(
      fields,
      changes,
      detailsRequestedFeaturesActions,
      detailsRequestedFeaturesDispatch,
      detailsRequestedFeaturesState,
      setChangesData,
      setChangesCounter
    )
  }

  const handleDelete = index => {
    if (!isNil(editableItemIndex)) setEditableItemIndex(null)
    if (labelFetureIsEditable) setLabelFeatureIsEditable(false)

    const changesData = cloneDeep(changes.data)
    const editedFeatures = [...currentData]
    const [deletedFeature] = editedFeatures.splice(index, 1)

    changesData.features = {
      initialFieldValue: selectedItem.specFeatures,
      currentFieldValue: editedFeatures,
      previousFieldValue: editedFeatures
    }

    if (
      (changesData.label_feature &&
        deletedFeature === changesData.label_feature.currentFieldValue) ||
      deletedFeature === selectedItem.label_feature
    ) {
      changesData.label_feature = {
        initialFieldValue: selectedItem.label_feature,
        currentFieldValue: '',
        previousFieldValue: ''
      }
    }

    setChanges({
      data: changesData,
      counter: Object.keys(changesData).length
    })

    setConfirmDialogData({ index: null, feature: null })
  }

  const generateChangedArray = (index, changedAlias) => {
    return currentData.map((item, idx) => {
      if (idx === index) {
        if (currentData?.[index].match(/\s+as\s+(?<alias>.*)$/)) {
          item = currentData?.[index].replace(
            /\s+as\s+(?<alias>.*)$/,
            changedAlias === '' ? '' : ` as ${changedAlias}`
          )
        } else if (changedAlias !== '') {
          item = `${currentData?.[index]} as ${changedAlias}`
        }
      }

      return item
    })
  }

  return (
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
          {currentData.map((featureTemplate, index) => {
            const {
              project,
              featureSet,
              tag,
              feature,
              alias
            } = parseFeatureTemplate(featureTemplate)

            return (
              <div
                className="item-requested-features__table-row"
                key={featureTemplate}
              >
                <div className="item-requested-features__table-cell cell_project-name">
                  {project || match.params.projectName}
                </div>
                <div className="item-requested-features__table-cell">
                  <span className="cell_feature-set">{featureSet}</span>
                  {tag && (
                    <>
                      <span className="cell_tag">: {tag}</span>
                    </>
                  )}
                </div>
                <div className="item-requested-features__table-cell cell_feature">
                  {feature}
                </div>
                {editableItemIndex === index ? (
                  <div className="item-requested-features__table-cell cell_alias">
                    <div className="cell_alias__input-wrapper">
                      <Input
                        className="input"
                        focused
                        onChange={alias => handleAliasChange(index, alias)}
                        type="text"
                        value={alias}
                      />
                      <Tooltip template={<TextTooltipTemplate text="Apply" />}>
                        <Checkmark
                          className="cell_alias__input-btn"
                          onClick={() =>
                            onFinishEdit(['features', 'label_feature'])
                          }
                        />
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  <div
                    className="item-requested-features__table-cell cell_alias"
                    onClick={() =>
                      handleItemClick(
                        'features',
                        'input',
                        currentData,
                        index,
                        featureTemplate
                      )
                    }
                  >
                    <Tooltip
                      template={<TextTooltipTemplate text="Click to edit" />}
                    >
                      <div>{alias}</div>
                    </Tooltip>
                  </div>
                )}
                <div className="cell_delete">
                  <Tooltip template={<TextTooltipTemplate text="Delete" />}>
                    <Delete
                      onClick={() => setConfirmDialogData({ index, feature })}
                    />
                  </Tooltip>
                </div>
              </div>
            )
          })}
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
          message={`You try to delete feature "${confirmDialogData.feature}" from vector "${match.params.name}". The feature could be added back later.`}
        />
      )}
    </div>
  )
}

DetailsRequestedFeatures.propTypes = {
  changes: PropTypes.object.isRequired,
  handleEditInput: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsRequestedFeatures
