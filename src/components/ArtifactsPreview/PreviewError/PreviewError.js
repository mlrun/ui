import React from 'react'
import { isEmpty } from 'lodash'
import Prism from 'prismjs'
import PropTypes from 'prop-types'

const PreviewError = ({ error, setShowError, showError }) => {
  return (
    <div className="error_container">
      {!isEmpty(error.body) && <h1>Failed with HTTP error:</h1>}
      <h3>{error.text}</h3>
      {!isEmpty(error.body) && (
        <button
          className="error-details btn"
          onClick={() => setShowError(state => !state)}
        >
          {showError ? 'Hide details' : 'View details'}
        </button>
      )}
      {showError && (
        <pre className="json-content">
          <code
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(error.body, Prism.languages.json, 'json')
            }}
          />
        </pre>
      )}
    </div>
  )
}

PreviewError.propTypes = {
  error: PropTypes.shape({
    body: PropTypes.string,
    text: PropTypes.string
  }).isRequired,
  setShowError: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired
}

export default PreviewError
