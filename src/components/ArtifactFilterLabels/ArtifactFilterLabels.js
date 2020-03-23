import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

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
      <div className="label">Labels:</div>
      <input
        type="text"
        placeholder="key1=value1,…"
        value={labels}
        onChange={event => setLabels(event.target.value)}
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
