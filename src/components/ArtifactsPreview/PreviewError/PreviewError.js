/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
