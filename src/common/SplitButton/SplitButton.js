import React from 'react'
import PropTypes from 'prop-types'
import './splitButton.scss'
// import Select from '../../../common/Select/Select'
import { Primary } from '../Button/Button.stories.js'

export const SplitButton = ({
  type,
  addClass,
  disabled,
  options,
  mainEvent,
  Tag,
  ...props
}) => {
  return (
    <div>
      <p>text</p>
      <Primary />
    </div>
  )
}
/*  let dropdownIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 15L6.80385 9.75L17.1962 9.75L12 15Z" fill="#7F7989" />
    </svg>
  )
  const [isOpen, setOpen] = useState(false)

  const toggleOpen = () => setOpen(!isOpen)*/

/*    <div
      className={[
        'select',
        `select-${type}`,
        disabled && 'disabled',
        addClass
      ].join(' ')}
      {...props}
    >
      <div
        className="select-body"
        onClick={() => {
          mainEvent.handler()
          setOpen()
        }}
      >
        {mainEvent.text}
      </div>
      <div className="select-arrow" onClick={() => toggleOpen()}>
        {dropdownIcon}
      </div>
      {isOpen && (
        <>
          <div className="select-list_body">
            {options.map(option => {
              return (
                <div
                  className="select-list_options"
                  onClick={() => {
                    option.handler && option.handler()
                    setOpen()
                  }}
                  key={option.id}
                >
                  {option.text}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>*/

SplitButton.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  addClass: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array,
  mainEvent: PropTypes.object.isRequired
}

SplitButton.defaultProps = {
  type: 'primary',
  label: 'Button',
  onClick: undefined,
  addClass: '',
  disabled: false,
  options: []
}
