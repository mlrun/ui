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
              <table className="table artifact-preview__table">
                <thead className="table-header">
                  <tr className="table-row">
                    {preview.data.headers.map((header, index) => {
                      return (
                        <th key={`${header}${index}`} className="table-header__cell">
                          <Tooltip template={<TextTooltipTemplate text={header} />}>
                            {header}
                          </Tooltip>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody className="table-body">
                  {content.map((contentItem, contentItemIndex) => (
                    <tr key={contentItemIndex} className="table-row">
                      {Array.isArray(contentItem) ? (
                        contentItem.map((contentItemValue, contentItemValueIndex) => (
                          <td key={contentItemValueIndex} className="table-body__cell">
                            <Tooltip
                              key={`${contentItemValue}${Math.random()}`}
                              template={<TextTooltipTemplate text={`${contentItemValue}`} />}
                            >
                              {typeof contentItemValue === 'object' && contentItemValue !== null
                                ? JSON.stringify(contentItemValue)
                                : String(contentItemValue)}
                            </Tooltip>
                          </td>
                        ))
                      ) : (
                        <td className="table-body__cell">
                          <Tooltip template={<TextTooltipTemplate text={contentItem} />}>
                            {contentItem}
                          </Tooltip>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {preview?.type === 'text' && (
              <div className="artifact-preview__text">{preview?.data.content}</div>
            )}
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

ArtifactsPreviewView.propTypes = {
  className: PropTypes.string.isRequired,
  preview: PropTypes.shape({}).isRequired,
  setShowErrorBody: PropTypes.func.isRequired,
  showErrorBody: PropTypes.bool.isRequired
}

export default ArtifactsPreviewView
