import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Prism from 'prismjs'

import DetailsResults from '../DetailsResults/DetailsResults'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import PreviewError from './PreviewError/PreviewError'

import { ARTIFACT_PREVIEW_TABLE_ROW_LIMIT } from '../../constants'

import './artifactsPreview.scss'

const ArtifactsPreviewView = ({
  className,
  preview,
  setShowErrorBody,
  showErrorBody
}) => {
  const content = useMemo(
    () =>
      preview.data && preview.data.content
        ? preview.data.content.slice(0, ARTIFACT_PREVIEW_TABLE_ROW_LIMIT)
        : [],
    [preview.data]
  )

  return (
    <div className={className}>
      {preview.header && (
        <h2 className="artifact-preview__header">{preview.header}</h2>
      )}
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
              <DetailsResults job={preview} />
            </div>
          )}
          {preview?.type === 'table' && (
            <div className="artifact-preview__table">
              <div className="artifact-preview__table-row artifact-preview__table-header">
                {preview.data.headers.map((header, index) => {
                  return (
                    <div
                      key={`${header}${index}`}
                      className="artifact-preview__table-content"
                    >
                      <Tooltip template={<TextTooltipTemplate text={header} />}>
                        {header}
                      </Tooltip>
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
            <iframe
              srcDoc={preview?.data.content}
              frameBorder="0"
              title="Preview"
            />
          )}
          {preview?.type === 'json' && (
            <div className="json">
              <pre className="json-content">
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      preview?.data.content,
                      Prism.languages.json,
                      'json'
                    )
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
                    __html: Prism.highlight(
                      preview?.data.content,
                      Prism.languages.yaml,
                      'yaml'
                    )
                  }}
                />
              </pre>
            </div>
          )}
          {preview?.type === 'image' && (
            <img
              className="artifact-preview__image"
              src={preview?.data?.content}
              alt="preview"
            />
          )}
          {preview?.type === 'unknown' && <div>No preview</div>}
        </>
      )}
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
