import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import Input from '../../common/Input/Input'
import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'

import { headers } from './detailsRequestedFeatures.utils'
import { parseFeatureTemplate } from '../../utils/parseFeatureTemplate'
import { DANGER_BUTTON, TERTIARY_BUTTON } from '../../constants'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'
import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as EditIcon } from '../../images/edit.svg'
import { ReactComponent as AddIcon } from '../../images/add.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

import './detailsRequestedFeatures.scss'

const DetailsRequestedFeaturesView = ({
  confirmDialogData,
  currentData,
  editableItemIndex,
  handleAliasChange,
  handleDelete,
  handleItemClick,
  onFinishEdit,
  setConfirmDialogData,
  setEditableItemIndex
}) => {
  const params = useParams()

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
            const { project, featureSet, tag, feature, alias } =
              parseFeatureTemplate(featureTemplate)

            return (
              <div className="item-requested-features__table-row" key={featureTemplate}>
                <div className="item-requested-features__table-cell cell_project-name">
                  {project || params.projectName}
                </div>
                <div className="item-requested-features__table-cell">
                  <span className="cell_feature-set">{featureSet}</span>
                  {tag && (
                    <>
                      <span className="cell_tag">: {tag}</span>
                    </>
                  )}
                </div>
                <div className="item-requested-features__table-cell cell_feature">{feature}</div>
                {editableItemIndex === index ? (
                  <>
                    <div className="item-requested-features__table-cell cell_alias">
                      <div className="cell_alias__input-wrapper">
                        <Input
                          className="input"
                          focused
                          onChange={alias => handleAliasChange(index, alias)}
                          type="text"
                          value={alias}
                        />
                      </div>
                    </div>
                    <div className="cell_actions cell_actions-visible">
                      <RoundedIcon
                        onClick={() => onFinishEdit(['features', 'label_feature'])}
                        tooltipText="Apply"
                      >
                        <Checkmark className="details-item__apply-btn" />
                      </RoundedIcon>

                      <RoundedIcon
                        onClick={() => setEditableItemIndex(null)}
                        tooltipText="Discard changes"
                      >
                        <Close />
                      </RoundedIcon>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="item-requested-features__table-cell cell_alias">
                      {alias && (
                        <div className="cell_alias__input-wrapper">
                          <span>{alias}</span>
                          <RoundedIcon
                            className={!alias ? 'visibility-hidden' : ''}
                            onClick={() =>
                              handleItemClick(
                                'features',
                                'input',
                                currentData,
                                index,
                                featureTemplate
                              )
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
                        className={alias && 'visibility-hidden'}
                        onClick={() =>
                          handleItemClick('features', 'input', currentData, index, featureTemplate)
                        }
                        tooltipText="Click to add an alias"
                      >
                        <AddIcon />
                      </RoundedIcon>

                      <RoundedIcon
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
          message={`You try to delete feature "${confirmDialogData.feature}" from vector "${params.name}". The feature could be added back later.`}
        />
      )}
    </div>
  )
}

DetailsRequestedFeaturesView.defaultProps = {
  editableItemIndex: null
}

DetailsRequestedFeaturesView.propTypes = {
  confirmDialogData: PropTypes.object.isRequired,
  currentData: PropTypes.array.isRequired,
  editableItemIndex: PropTypes.number,
  handleAliasChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleItemClick: PropTypes.func.isRequired,
  onFinishEdit: PropTypes.func.isRequired,
  setConfirmDialogData: PropTypes.func.isRequired,
  setEditableItemIndex: PropTypes.func.isRequired
}

export default DetailsRequestedFeaturesView
