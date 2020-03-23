import React, { useState } from 'react'
import PropTypes from 'prop-types'

import './artifactfilterlabels.scss'

const ArtifactFilterLabels = ({ onChange }) => {
  const [labels, setLabels] = useState('')
  return (
    <div className="artifact_filter_labels_container">
      <div className="label">Labels:</div>
      <input
        type="text"
        placeholder="key1=value1,…"
        value={labels}
        onChange={event => setLabels(event.target.value)}
        onKeyDown={event => {
          if (event.keyCode === 13) {
            onChange(labels)
          }
        }}
      />
    </div>
  )
}

ArtifactFilterLabels.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default ArtifactFilterLabels
