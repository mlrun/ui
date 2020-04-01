import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import Input from '../../common/Input/Input'

import './artifactfilterlabels.scss'

const ArtifactFilterLabels = ({ match, onChange, page }) => {
  const [labels, setLabels] = useState('')

  const history = useHistory()

  const handleSearch = event => {
    if (event.keyCode === 13) {
      if (match.params.jobId || match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}`
        )
      }
      onChange(labels)
    }
  }

  return (
    <div className="artifact_filter_labels_container">
      <Input
        type="text"
        label="Labels:"
        onChange={setLabels}
        value={labels}
        placeholder="key1=value1,…"
        onKeyDown={e => handleSearch(e)}
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
