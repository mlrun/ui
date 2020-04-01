import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import './textField.scss'

const ArtifactFilterLabels = ({
  label,
  placeholder,
  match,
  onChange,
  page
}) => {
  const [value, setValue] = useState('')

  const history = useHistory()

  const handleSearch = event => {
    if (event.keyCode === 13) {
      if (match.params.jobId || match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}`
        )
      }
      onChange({ [label]: value })
    }
  }

  return (
    <div className="text_field_container">
      <div className="label">{label}:</div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={event => setValue(event.target.value)}
        onKeyDown={event => {
          handleSearch(event)
        }}
      />
    </div>
  )
}

ArtifactFilterLabels.propTypes = {
  match: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired
}

export default ArtifactFilterLabels
