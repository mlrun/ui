import PropTypes from 'prop-types'

export const COMBOBOX_MATCHES = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    customDelimiter: PropTypes.bool
  })
)
