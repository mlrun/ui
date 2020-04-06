import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import Input from '../../common/Input/Input'

import './textField.scss'

const TextField = ({ label, placeholder, match, onChange, page }) => {
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
      <Input
        type="text"
        label={`${label}:`}
        onChange={setValue}
        value={value}
        placeholder={placeholder}
        onKeyDown={e => handleSearch(e)}
      />
    </div>
  )
}

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired
}

export default TextField
