import React, { useRef, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import FormChip from '../../common/FormChip/FormChip'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getFirstScrollableParent } from '../../utils/getFirstScrollableParent'
import { CHIP_OPTIONS } from '../../types'

import './formHiddenChipsBlock.scss'

const FormHiddenChipsBlock = React.forwardRef(
  (
    {
      chipClassNames,
      chipIndex,
      chipOptions,
      chips,
      className,
      editConfig,
      handleEditChip,
      handleIsEdit,
      handleRemoveChip,
      handleShowElements,
      isEditMode,
      setChipsSizes,
      setEditConfig
    },
    ref
  ) => {
    const [isTop, setIsTop] = useState(false)
    const [isRight, setIsRight] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [windowHalfWidth, setWindowHalfWidth] = useState(
      window.innerWidth / 2
    )

    const hiddenRef = useRef()

    const offset = 28

    const hiddenChipsBlockClassNames = classnames(
      'chip-block-hidden',
        isTop ? 'chip-block-hidden_top' : 'chip-block-hidden_bottom',
      isRight ? 'chip-block-hidden_right' : 'chip-block-hidden_left',
      isVisible && 'chip-block-hidden_visible'
    )

    const handleResize = useCallback(() => {
      if (hiddenRef?.current) {
        setWindowHalfWidth(parseInt(window.innerWidth / 2))
      }
    }, [hiddenRef])

    const generateChipData = chip => {
      return `${chip.key}${chip.delimiter ? chip.delimiter : ':'} ${chip.value}`
    }

    useEffect(() => {
      handleResize()
    }, [handleResize])

    useEffect(() => {
      if (hiddenRef?.current) {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
      }
    }, [handleResize, hiddenRef])

    useEffect(() => {
      if (hiddenRef?.current) {
        const scrollableParent = getFirstScrollableParent(
          hiddenRef.current.offsetParent
        )
        const { height, top } = hiddenRef.current.getBoundingClientRect()
        const { right } = ref.current.getBoundingClientRect()

        if (
          hiddenRef.current.offsetParent.getBoundingClientRect().top -
          hiddenRef.current.offsetParent.clientHeight -
          height -
          offset <
          0 ||
          scrollableParent.getBoundingClientRect().top > top
        ) {
          setIsTop(true)
        }

        setIsRight(right <= windowHalfWidth)
        setIsVisible(true)
      }
    }, [hiddenRef, isRight, offset, ref, windowHalfWidth])

    useEffect(() => {
      if (chips.length === 0) {
        handleShowElements()
      }
    })

    return (
      <div ref={hiddenRef} className={hiddenChipsBlockClassNames}>
        {chips?.map((element, index) => {
          return (
            <Tooltip
              key={element.value}
              template={
                <TextTooltipTemplate
                  text={
                    element.delimiter ? (
                      <span className="chip__content">
                        {element.key}
                        <span className="chip__delimiter">
                          {element.delimiter}
                        </span>
                        {element.value}
                      </span>
                    ) : (
                      generateChipData(element)
                    )
                  }
                />
              }
            >
              <FormChip
                chip={element}
                chipClassNames={chipClassNames}
                chipIndex={index + chipIndex}
                chipOptions={chipOptions}
                className={className}
                editConfig={editConfig}
                handleEditChip={handleEditChip}
                handleIsEdit={handleIsEdit}
                handleRemoveChip={handleRemoveChip}
                hiddenChips
                isEditMode={isEditMode}
                ref={hiddenRef}
                setChipsSizes={setChipsSizes}
                setEditConfig={setEditConfig}
                showChips={true}
                textOverflowEllipsis
              />
            </Tooltip>
          )
        })}
      </div>
    )
  }
)

FormHiddenChipsBlock.defaultProps = {
  chips: [],
  chipIndex: 0,
  editConfig: {},
  isEditMode: false,
}

FormHiddenChipsBlock.propTypes = {
  chipClassNames: PropTypes.string.isRequired,
  chipIndex: PropTypes.number,
  chipOptions: CHIP_OPTIONS.isRequired,
  chips: PropTypes.array.isRequired,
  className: PropTypes.string,
  editConfig: PropTypes.shape({}),
  handleEditChip: PropTypes.func.isRequired,
  handleIsEdit: PropTypes.func.isRequired,
  handleRemoveChip: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  setEditConfig: PropTypes.func.isRequired,
  setChipsSizes: PropTypes.func.isRequired
}

export default FormHiddenChipsBlock
