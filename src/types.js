import PropTypes from 'prop-types'

export const COMBOBOX_MATCHES = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    customDelimiter: PropTypes.string
  })
)

export const CHIP_OPTIONS = PropTypes.shape({
  background: PropTypes.oneOf([
    'none',
    'orange',
    'green',
    'purple',
    'grey',
    'sorbus',
    'java',
    'amethyst'
  ]),
  boldValue: PropTypes.bool,
  borderColor: PropTypes.oneOf([
    'transparent',
    'orange',
    'green',
    'purple',
    'grey'
  ]),
  density: PropTypes.oneOf(['dense', 'normal', 'medium']),
  font: PropTypes.oneOf(['primary', 'white', 'green', 'purple', 'orange']),
  borderRadius: PropTypes.oneOf(['primary', 'secondary'])
})
