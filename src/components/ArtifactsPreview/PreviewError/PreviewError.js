import React from 'react'
import { isEmpty } from 'lodash'
import Prism from 'prismjs'
import PropTypes from 'prop-types'

const PreviewError = ({ error, setShowErrorBody, showErrorBody }) => {
  return (
    <div className="artifact-preview__error error-container">
      {!isEmpty(error.body) && <h1>Failed with HTTP error:</h1>}
      <h3>{error.text}</h3>
      {!isEmpty(error.body) && (
        <button
          className="error-details btn"
          onClick={() => setShowErrorBody(state => !state)}
        >
          {showErrorBody ? 'Hide details' : 'View details'}
        </button>
      )}
      {showErrorBody && (
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
  setShowErrorBody: PropTypes.func.isRequired,
  showErrorBody: PropTypes.bool.isRequired
}

export default PreviewError
