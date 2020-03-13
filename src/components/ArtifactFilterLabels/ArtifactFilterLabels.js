import React, { useState } from 'react'

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
          if (event.keyCode === 13 && event.target.value.length !== 0) {
            onChange(labels)
          }
        }}
      />
    </div>
  )
}

export default ArtifactFilterLabels
