import React from 'react'
import PropTypes from 'prop-types'
import FormChip from '../FormChip/FormChip'
import { FieldArray } from 'react-final-form-arrays'
import classnames from 'classnames'

import FormHiddenChipsBlock from '../../elements/FormHiddenChipsBlock/FormHiddenChipsBlock'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { CHIP_OPTIONS } from '../../types'

import { ReactComponent as Add } from 'igz-controls/images/add.svg'

import './formChipCell.scss'

const FormChipCellView = React.forwardRef(
  (
    {
      chipOptions,
      chips,
      className,
      editConfig,
      handleAddNewChip,
      handleEditChip,
      handleIsEdit,
      handleRemoveChip,
      handleShowElements,
      isEditMode,
      name,
      setChipsSizes,
      setEditConfig,
      shortChips,
      showChips,
      showHiddenChips
    },
    { chipsCellRef, chipsWrapperRef }
  ) => {
    const buttonAddClassNames = classnames(
      'button-add',
      className,
      chipOptions.background && `button-add-background_${chipOptions.background}`,
      chipOptions.borderColor && `button-add-border_${chipOptions.borderColor}`,
      chipOptions.font && `button-add-font_${chipOptions.font}`,
      chipOptions.density && `button-add-density_${chipOptions.density}`
    )
    const wrapperClassNames = classnames('chips-wrapper', isEditMode && 'fixed-max-width')
    const chipClassNames = classnames(
      'chip',
      'chip__content',
      isEditMode && 'data-ellipsis',
      shortChips && 'chip_short',
      chips.hiddenChips && 'chip_hidden',
      chipOptions.density && `chip-density_${chipOptions.density}`,
      chipOptions.borderRadius && `chip-border_${chipOptions.borderRadius}`,
      chipOptions.background && `chip-background_${chipOptions.background}`,
      chipOptions.borderColor && `chip-border_${chipOptions.borderColor}`,
      chipOptions.font && `chip-font_${chipOptions.font}`,
      isEditMode && 'editable',
      (showChips || isEditMode) && 'chip_visible',
      className
    )

    return (
      <div>
        <FieldArray name={name}>
          {({ fields }) => {
            return (
              (isEditMode || !isEveryObjectValueEmpty(fields)) && (
                <div className="chips-cell" ref={chipsCellRef}>
                  <div className={wrapperClassNames} ref={chipsWrapperRef}>
                    {fields.map((contentItem, index) => {
                      const chipData = fields.value[index]

                      return (
                        index < chips.visibleChips.length && (
                          <div className="chip-block" key={contentItem}>
                            <Tooltip
                              hidden={editConfig.isEdit}
                              key={contentItem}
                              template={
                                <TextTooltipTemplate
                                  text={
                                    <span className="chip__content">
                                      {chipData.key}
                                      <span className="chip__delimiter">
                                        {chipData.delimiter ? chipData.delimiter : ':'}
                                      </span>
                                      {chipData.value}
                                    </span>
                                  }
                                />
                              }
                            >
                              <FormChip
                                chip={chipData}
                                chipClassNames={chipClassNames}
                                chipIndex={index}
                                chipOptions={chipOptions}
                                className={className}
                                editConfig={editConfig}
                                handleEditChip={(event, nameEvent) =>
                                  handleEditChip(event, fields, nameEvent)
                                }
                                handleIsEdit={handleIsEdit}
                                handleRemoveChip={(event, index) =>
                                  handleRemoveChip(event, fields, index)
                                }
                                isEditMode={isEditMode}
                                keyName={`${contentItem}.key`}
                                ref={chipsCellRef}
                                setChipsSizes={setChipsSizes}
                                setEditConfig={setEditConfig}
                                textOverflowEllipsis
                                valueName={`${contentItem}.value`}
                              />
                            </Tooltip>
                            {chips.visibleChips.length - 1 === index && showHiddenChips && (
                              <FormHiddenChipsBlock
                                chipClassNames={chipClassNames}
                                chipIndex={index}
                                chipOptions={chipOptions}
                                chips={chips.hiddenChips}
                                className={className}
                                editConfig={editConfig}
                                handleEditChip={(event, nameEvent) =>
                                  handleEditChip(event, fields, nameEvent)
                                }
                                handleIsEdit={handleIsEdit}
                                handleRemoveChip={(event, index) =>
                                  handleRemoveChip(event, fields, index)
                                }
                                handleShowElements={handleShowElements}
                                isEditMode={isEditMode}
                                ref={chipsCellRef}
                                setChipsSizes={setChipsSizes}
                                setEditConfig={setEditConfig}
                              />
                            )}
                          </div>
                        )
                      )
                    })}
                    {chips.hiddenChipsNumber && (
                      <span
                        className={`${chipClassNames} chips_button`}
                        onClick={handleShowElements}
                      >
                        {chips.hiddenChipsNumber}
                      </span>
                    )}
                    {isEditMode && (
                      <button
                        className={buttonAddClassNames}
                        onClick={e => handleAddNewChip(e, fields)}
                      >
                        <Add />
                      </button>
                    )}
                  </div>
                </div>
              )
            )
          }}
        </FieldArray>
      </div>
    )
  }
)

FormChipCellView.defaultProps = {
  chipOptions: {
    background: 'purple',
    boldValue: false,
    borderRadius: 'primary',
    borderColor: 'transparent',
    density: 'dense',
    font: 'purple'
  },
  isEditMode: false,
  delimiter: null,
  onClick: () => {},
  shortChips: false
}

FormChipCellView.propTypes = {
  chipOptions: CHIP_OPTIONS,
  chips: PropTypes.object.isRequired,
  className: PropTypes.string,
  editConfig: PropTypes.object.isRequired,
  handleAddNewChip: PropTypes.func.isRequired,
  handleEditChip: PropTypes.func.isRequired,
  handleIsEdit: PropTypes.func.isRequired,
  handleRemoveChip: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  name: PropTypes.string.isRequired,
  delimiter: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClick: PropTypes.func,
  setChipsSizes: PropTypes.func.isRequired,
  setEditConfig: PropTypes.func.isRequired,
  shortChips: PropTypes.bool,
  showChips: PropTypes.bool.isRequired,
  showHiddenChips: PropTypes.bool.isRequired
}

export default FormChipCellView
