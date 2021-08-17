import React, { useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'

import { parseFeatureTemplate } from '../../utils/parseFeatureTemplate'

import Input from '../../common/Input/Input'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Button from '../../common/Button/Button'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { headers } from './detailsRequestedFeatures.utils.js'
import { handleFinishEdit } from '../Details/details.util.js'

import {
  detailsRequestedFeaturesActions,
  detailsRequestedFeaturesReducer,
  initialState
} from './detailsRequestedFeaturesReducer.js'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

import './detailsRequestedFeatures.scss'

const DetailsRequestedFeatures = ({
  changes,
  detailsState,
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
  const [editableItem, setEditableItem] = useState(null)

  useEffect(() => {
    return () => {
      setEditableItem(null)
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

  const handleItemClick = (field, fieldType, info, index) => {
    if (isNil(editableItem)) {
      setEditableItem(index)
      detailsRequestedFeaturesDispatch({
        type: detailsRequestedFeaturesActions.SET_EDIT_MODE,
        payload: {
          field,
          fieldType
        }
      })

      if (isNil(changes.data[field]?.initialFieldValue)) {
        setChangesData({
          [field]: {
            initialFieldValue: selectedItem.specFeatures,
            currentFieldValue: selectedItem.specFeatures,
            previousFieldValue: selectedItem.specFeatures
          }
        })
      } else {
        setChangesData({
          [field]: {
            ...changes.data[field],
            currentFieldValue: changes.data[field].previousFieldValue
          }
        })
      }
    }
  }

  const onFinishEdit = field => {
    setEditableItem(null)
    handleFinishEdit(
      field,
      changes,
      detailsRequestedFeaturesActions,
      detailsRequestedFeaturesDispatch,
      detailsRequestedFeaturesState,
      setChangesData,
      setChangesCounter
    )
  }

  const handleDelete = index => {
    if (editableItem) setEditableItem(null)

    if (!changes.data.features) {
      setChangesData({
        features: {
          initialFieldValue: selectedItem.specFeatures,
          currentFieldValue: selectedItem.specFeatures,
          previousFieldValue: selectedItem.specFeatures
        }
      })
    }

    let editedArr = [...currentData]

    editedArr.splice(index, 1)
    setConfirmDialogData({ index: null, feature: null })
    setChanges({
      ...detailsState.changes,
      data: {
        features: {
          initialFieldValue: selectedItem.specFeatures,
          currentFieldValue: editedArr,
          previousFieldValue: editedArr
        }
      },
      counter: Object.keys(changes.data).length + 1
    })
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
                {editableItem === index ? (
                  <div className="item-requested-features__table-cell cell_alias">
                    <div className="cell_alias__input-wrapper">
                      <Input
                        className="input"
                        focused
                        onChange={alias =>
                          handleEditInput(
                            generateChangedArray(index, alias),
                            'features'
                          )
                        }
                        type="text"
                        value={alias}
                      />
                      <Checkmark
                        className="cell_alias__input-btn"
                        onClick={() => onFinishEdit('features')}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="item-requested-features__table-cell cell_alias"
                    onClick={() =>
                      handleItemClick('features', 'input', currentData, index)
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
        <PopUpDialog
          headerText={`Delete feature ${confirmDialogData.feature} from vector ${match.params.name}?`}
          closePopUp={() => {
            setConfirmDialogData({ index: null, feature: null })
          }}
        >
          <div>The feature could be added back later.</div>
          <div className="pop-up-dialog__footer-container">
            <Button
              variant="tertiary"
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={() => {
                setConfirmDialogData({
                  index: null,
                  feature: null
                })
              }}
            />
            <Button
              label="Delete"
              onClick={() => handleDelete(confirmDialogData.index)}
              variant="danger"
            />
          </div>
        </PopUpDialog>
      )}
    </div>
  )
}

DetailsRequestedFeatures.propTypes = {
  changes: PropTypes.object.isRequired,
  detailsState: PropTypes.object.isRequired,
  handleEditInput: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsRequestedFeatures
