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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Prism from 'prismjs'

import DetailsResults from '../DetailsResults/DetailsResults'
import PreviewError from './PreviewError/PreviewError'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ARTIFACT_PREVIEW_TABLE_ROW_LIMIT } from '../../constants'

import './artifactsPreview.scss'

const ArtifactsPreviewView = ({ className, preview, setShowErrorBody, showErrorBody }) => {
  const content = useMemo(
    () =>
      preview.data && preview.data.content
        ? preview.data.content.slice(0, ARTIFACT_PREVIEW_TABLE_ROW_LIMIT)
        : [],
    [preview.data]
  )

  return preview?.hidden ? (
    <div className="artifact-preview__no-data">No preview</div>
  ) : (
    <div className="artifact-preview__wrapper">
      {preview.header && (
        <div className="artifact-preview__header">
          <h5 className="artifact-preview__header-title">{preview.header}</h5>
        </div>
      )}
      <div className={className}>
        {preview?.type === 'error' ? (
          <PreviewError
            error={preview.error}
            setShowErrorBody={setShowErrorBody}
            showErrorBody={showErrorBody}
          />
        ) : (
          <>
            {preview?.type === 'table-results' && (
              <div className="artifact-preview__table">
                <DetailsResults job={preview} excludeSortBy="state" defaultDirection="desc" />
              </div>
            )}
            {preview?.type === 'table' && (
              <div className="artifact-preview__table">
                <div className="artifact-preview__table-row artifact-preview__table-header">
                  {preview.data.headers.map((header, index) => {
                    return (
                      <div key={`${header}${index}`} className="artifact-preview__table-content">
                        <Tooltip template={<TextTooltipTemplate text={header} />}>{header}</Tooltip>
                      </div>
                    )
                  })}
                </div>
                <div className="artifact-preview__table-body">
                  {content.map((contentItem, index) => (
                    <div key={index} className="artifact-preview__table-row">
                      {Array.isArray(contentItem) ? (
                        contentItem.map(value => (
                          <Tooltip
                            className="artifact-preview__table-content"
                            key={`${value}${Math.random()}`}
                            template={<TextTooltipTemplate text={`${value}`} />}
                          >
                            {typeof value === 'object' && value !== null
                              ? JSON.stringify(value)
                              : String(value)}
                          </Tooltip>
                        ))
                      ) : (
                        <Tooltip
                          className="artifact-preview__table-content"
                          template={<TextTooltipTemplate text={contentItem} />}
                        >
                          {contentItem}
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {preview?.type === 'text' && <div>{preview?.data.content}</div>}
            {preview?.type === 'html' && (
              <iframe srcDoc={preview?.data.content} frameBorder="0" title="Preview" />
            )}
            {preview?.type === 'json' && (
              <div className="json">
                <pre className="json-content">
                  <code
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(preview?.data.content, Prism.languages.json, 'json')
                    }}
                  />
                </pre>
              </div>
            )}
            {preview?.type === 'yaml' && (
              <div className="json">
                <pre className="json-content">
                  <code
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(preview?.data.content, Prism.languages.yaml, 'yaml')
                    }}
                  />
                </pre>
              </div>
            )}
            {preview?.type === 'image' && (
              <img className="artifact-preview__image" src={preview?.data?.content} alt="preview" />
            )}
            {preview?.type === 'unknown' && (
              <div className="artifact-preview__no-data">
                {preview?.data?.content ? preview?.data.content : 'No preview'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

ArtifactsPreviewView.defaultProps = {
  showAccordion: false
}

ArtifactsPreviewView.propTypes = {
  className: PropTypes.string.isRequired,
  preview: PropTypes.shape({}).isRequired,
  setShowErrorBody: PropTypes.func.isRequired,
  showAccordion: PropTypes.bool,
  showErrorBody: PropTypes.bool.isRequired
}

export default ArtifactsPreviewView
