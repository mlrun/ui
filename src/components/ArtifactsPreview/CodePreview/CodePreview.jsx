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
import PropTypes from 'prop-types'

import Editor from '../../../common/Editor/Editor'
import { CopyToClipboard } from 'igz-controls/components'
import { getEditorLanguage } from '../../../common/Editor/editor.util'

import './codePreview.scss'

const CodePreview = ({ preview, popupButton = null }) => {
  const { content, fileFormat } = preview?.data || {}
  const { artifact } = preview || {}
  const code_type = artifact?.code_type || artifact?.spec?.code_type
  const requirements = artifact?.requirements || artifact?.spec?.requirements
  const language = artifact?.language || artifact?.spec?.language
  const artifactName =
    preview?.header || artifact?.name || artifact?.db_key || preview?.artifactName

  const renderRequirements = requirements => {
    if (!requirements) return null

    const reqArray = Array.isArray(requirements) ? requirements : [requirements]

    return reqArray.map((req, idx) => (
      <span key={idx} className="code-preview__requirement-chip">
        {req}
      </span>
    ))
  }

  return (
    <div className="code-preview">
      {artifact.kind && (
        <div className="code-preview__header">
          <div className="code-preview__header-title">
            <div className="code-preview__header-title-container">
              {artifactName && <span className="code-preview__name">{artifactName}</span>}
              {code_type && <span className="code-preview__kind-chip">{code_type}</span>}
            </div>
            {popupButton}
          </div>
          {(language || requirements) && (
            <div className="code-preview__header-details">
              {language && (
                <span className="code-preview__language">
                  Language: <span className="code-preview__language-value">{language}</span>
                </span>
              )}
              {language && requirements && <span className="code-preview__separator"> | </span>}
              {requirements && (
                <span className="code-preview__requirements">
                  Requirements: {renderRequirements(requirements)}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      <div className="code-preview__body">
        <div className="code-preview__editor-container">
          <Editor value={content} language={getEditorLanguage(fileFormat, language)} />
        </div>
        <div className="code-preview__actions">
          <CopyToClipboard textToCopy={content} tooltipText="Copy" />
        </div>
      </div>
    </div>
  )
}

CodePreview.propTypes = {
  preview: PropTypes.shape({
    header: PropTypes.string,
    artifact: PropTypes.shape({
      name: PropTypes.string,
      db_key: PropTypes.string,
      kind: PropTypes.string,
      language: PropTypes.string,
      spec: PropTypes.shape({
        language: PropTypes.string,
        requirements: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
      })
    }),
    data: PropTypes.shape({
      content: PropTypes.string,
      fileFormat: PropTypes.string
    }),
    artifactName: PropTypes.string
  }).isRequired,
  popupButton: PropTypes.element
}

export default CodePreview
